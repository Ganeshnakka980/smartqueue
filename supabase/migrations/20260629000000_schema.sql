-- Enable pgcrypto for password hashing in seed scripts if needed
create extension if not exists pgcrypto;

-- 1. PROFILES (extends auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    email text,
    role text check (role in ('customer', 'staff', 'admin')) default 'customer' not null,
    avatar_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- 2. BRANCHES
create table public.branches (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    address text not null,
    status text check (status in ('active', 'inactive')) default 'active' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.branches enable row level security;

-- 3. SERVICES
create table public.services (
    id uuid default gen_random_uuid() primary key,
    branch_id uuid references public.branches(id) on delete cascade not null,
    name text not null,
    prefix text not null, -- e.g. 'A', 'B'
    avg_service_time integer default 15 not null, -- in minutes
    status text check (status in ('active', 'inactive')) default 'active' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.services enable row level security;

-- 4. COUNTERS
create table public.counters (
    id uuid default gen_random_uuid() primary key,
    branch_id uuid references public.branches(id) on delete cascade not null,
    name text not null, -- e.g. 'Counter 1'
    number integer not null,
    staff_id uuid references public.profiles(id) on delete set null,
    status text check (status in ('open', 'closed')) default 'closed' not null,
    current_token_id uuid, -- circular ref, resolved after queues table
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique (branch_id, number)
);

alter table public.counters enable row level security;

-- 5. QUEUES
create table public.queues (
    id uuid default gen_random_uuid() primary key,
    branch_id uuid references public.branches(id) on delete cascade not null,
    service_id uuid references public.services(id) on delete cascade not null,
    counter_id uuid references public.counters(id) on delete set null,
    user_id uuid references public.profiles(id) on delete set null,
    token_number text not null, -- e.g. 'A-101'
    sequence_number integer not null,
    status text check (status in ('waiting', 'serving', 'completed', 'skipped', 'cancelled')) default 'waiting' not null,
    priority text check (priority in ('normal', 'senior', 'emergency', 'vip')) default 'normal' not null,
    called_at timestamp with time zone,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.queues enable row level security;

-- Resolve circular reference on counters
alter table public.counters 
    add constraint fk_counters_current_token 
    foreign key (current_token_id) 
    references public.queues(id) 
    on delete set null;

-- 6. APPOINTMENTS
create table public.appointments (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    branch_id uuid references public.branches(id) on delete cascade not null,
    service_id uuid references public.services(id) on delete cascade not null,
    appointment_time timestamp with time zone not null,
    status text check (status in ('pending', 'confirmed', 'checked_in', 'cancelled')) default 'pending' not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.appointments enable row level security;

-- 7. NOTIFICATIONS
create table public.notifications (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    title text not null,
    message text not null,
    type text check (type in ('queue', 'appointment', 'system')) default 'system' not null,
    read boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.notifications enable row level security;

-- 8. FEEDBACK
create table public.feedback (
    id uuid default gen_random_uuid() primary key,
    queue_id uuid references public.queues(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    rating integer check (rating >= 1 and rating <= 5) not null,
    comments text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.feedback enable row level security;


-- ==========================================================
-- HELPER FUNCTIONS & TRIGGERS
-- ==========================================================

-- Trigger to sync auth.users with public.profiles
create or replace function public.handle_new_user()
returns trigger as $$
declare
    default_role text := 'customer';
begin
    -- Extract role from raw_user_meta_data if present, otherwise default to customer
    if new.raw_user_meta_data ? 'role' then
        default_role := new.raw_user_meta_data->>'role';
    end if;

    insert into public.profiles (id, full_name, email, role, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        default_role,
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();


-- Helper functions to check roles
create or replace function public.is_admin(user_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 from public.profiles
        where id = user_id and role = 'admin'
    );
end;
$$ language plpgsql security definer;

create or replace function public.is_staff(user_id uuid)
returns boolean as $$
begin
    return exists (
        select 1 from public.profiles
        where id = user_id and role in ('staff', 'admin')
    );
end;
$$ language plpgsql security definer;


-- ==========================================================
-- TRANSACTIONAL QUEUE MANAGEMENT FUNCTIONS
-- ==========================================================

-- 1. Join Queue Function
create or replace function public.generate_next_token(
    p_branch_id uuid, 
    p_service_id uuid, 
    p_priority text, 
    p_user_id uuid
)
returns json as $$
declare
    v_prefix text;
    v_seq_num integer;
    v_token_num text;
    v_queue_record public.queues;
begin
    -- Get prefix
    select prefix into v_prefix from public.services where id = p_service_id;
    if v_prefix is null then
        raise exception 'Service not found or missing prefix';
    end if;
    
    -- Get sequence number for today
    select coalesce(max(sequence_number), 0) + 1 into v_seq_num
    from public.queues
    where service_id = p_service_id
      and created_at >= date_trunc('day', now());
    
    -- Start from 101 for a cleaner look
    if v_seq_num = 1 then
        v_seq_num := 101;
    end if;
    
    v_token_num := v_prefix || '-' || v_seq_num;
    
    -- Insert new queue record
    insert into public.queues (branch_id, service_id, user_id, token_number, sequence_number, status, priority)
    values (p_branch_id, p_service_id, p_user_id, v_token_num, v_seq_num, 'waiting', p_priority)
    returning * into v_queue_record;
    
    -- Create a notification if user_id is provided
    if p_user_id is not null then
        insert into public.notifications (user_id, title, message, type)
        values (
            p_user_id,
            'Joined Queue',
            'Your token is ' || v_token_num || '. Your position will update live.',
            'queue'
        );
    end if;
    
    return row_to_json(v_queue_record);
end;
$$ language plpgsql security definer;


-- 2. Call Next Token Function
create or replace function public.call_next_token(
    p_counter_id uuid, 
    p_staff_id uuid
)
returns json as $$
declare
    v_branch_id uuid;
    v_next_token_id uuid;
    v_queue_record public.queues;
begin
    -- Get the branch of the counter
    select branch_id into v_branch_id from public.counters where id = p_counter_id;
    if v_branch_id is null then
        raise exception 'Counter not found';
    end if;

    -- Verify staff is assigned to this counter (or update it)
    update public.counters 
    set staff_id = p_staff_id, status = 'open' 
    where id = p_counter_id;

    -- Find the next waiting token in this branch
    -- Order by: emergency (1), vip (2), senior (3), normal (4), then FIFO
    select id into v_next_token_id
    from public.queues
    where branch_id = v_branch_id
      and status = 'waiting'
    order by 
      case priority
        when 'emergency' then 1
        when 'vip' then 2
        when 'senior' then 3
        when 'normal' then 4
        else 5
      end,
      created_at asc
    limit 1
    for update skip locked;

    -- If no token is waiting, return null
    if v_next_token_id is null then
        return null;
    end if;

    -- Update the token
    update public.queues
    set status = 'serving',
        counter_id = p_counter_id,
        called_at = now()
    where id = v_next_token_id
    returning * into v_queue_record;

    -- Set the counter's current token
    update public.counters
    set current_token_id = v_next_token_id
    where id = p_counter_id;

    -- Send notification to the customer if linked
    if v_queue_record.user_id is not null then
        insert into public.notifications (user_id, title, message, type)
        values (
            v_queue_record.user_id,
            'Your Turn!',
            'Token ' || v_queue_record.token_number || ' please proceed to ' || (select name from public.counters where id = p_counter_id),
            'queue'
        );
    end if;

    return row_to_json(v_queue_record);
end;
$$ language plpgsql security definer;


-- 3. Complete Current Token Function
create or replace function public.complete_current_token(
    p_counter_id uuid
)
returns json as $$
declare
    v_token_id uuid;
    v_queue_record public.queues;
begin
    -- Get the current token on this counter
    select current_token_id into v_token_id from public.counters where id = p_counter_id;
    if v_token_id is null then
        return null;
    end if;

    -- Update the token
    update public.queues
    set status = 'completed',
        completed_at = now()
    where id = v_token_id
    returning * into v_queue_record;

    -- Clear current token from the counter
    update public.counters
    set current_token_id = null
    where id = p_counter_id;

    return row_to_json(v_queue_record);
end;
$$ language plpgsql security definer;


-- 4. Skip Current Token Function
create or replace function public.skip_current_token(
    p_counter_id uuid
)
returns json as $$
declare
    v_token_id uuid;
    v_queue_record public.queues;
begin
    -- Get the current token on this counter
    select current_token_id into v_token_id from public.counters where id = p_counter_id;
    if v_token_id is null then
        return null;
    end if;

    -- Update the token
    update public.queues
    set status = 'skipped',
        completed_at = now()
    where id = v_token_id
    returning * into v_queue_record;

    -- Clear current token from the counter
    update public.counters
    set current_token_id = null
    where id = p_counter_id;

    -- Notify user
    if v_queue_record.user_id is not null then
        insert into public.notifications (user_id, title, message, type)
        values (
            v_queue_record.user_id,
            'Token Skipped',
            'Your token ' || v_queue_record.token_number || ' was skipped because you were not present.',
            'queue'
        );
    end if;

    return row_to_json(v_queue_record);
end;
$$ language plpgsql security definer;


-- 5. Transfer Token Function
create or replace function public.transfer_token(
    p_token_id uuid,
    p_target_service_id uuid
)
returns json as $$
declare
    v_queue_record public.queues;
    v_prefix text;
    v_seq_num integer;
    v_token_num text;
begin
    -- Get target service prefix
    select prefix into v_prefix from public.services where id = p_target_service_id;
    if v_prefix is null then
        raise exception 'Target service not found';
    end if;

    -- Get new sequence number for today
    select coalesce(max(sequence_number), 0) + 1 into v_seq_num
    from public.queues
    where service_id = p_target_service_id
      and created_at >= date_trunc('day', now());

    if v_seq_num = 1 then
        v_seq_num := 101;
    end if;

    v_token_num := v_prefix || '-' || v_seq_num;

    -- Update the token to put it back in waiting status for the new service
    update public.queues
    set service_id = p_target_service_id,
        status = 'waiting',
        counter_id = null,
        called_at = null,
        token_number = v_token_num,
        sequence_number = v_seq_num
    where id = p_token_id
    returning * into v_queue_record;

    -- Notify user
    if v_queue_record.user_id is not null then
        insert into public.notifications (user_id, title, message, type)
        values (
            v_queue_record.user_id,
            'Token Transferred',
            'Your token has been transferred to another service. Your new token is ' || v_token_num,
            'queue'
        );
    end if;

    return row_to_json(v_queue_record);
end;
$$ language plpgsql security definer;


-- 6. Get Queue Position Function
create or replace function public.get_queue_position(p_token_id uuid)
returns integer as $$
declare
    v_branch_id uuid;
    v_service_id uuid;
    v_created_at timestamp with time zone;
    v_priority text;
    v_position integer;
begin
    -- Get token details
    select branch_id, service_id, created_at, priority 
    into v_branch_id, v_service_id, v_created_at, v_priority
    from public.queues
    where id = p_token_id;
    
    if v_branch_id is null then
        return 0;
    end if;
    
    -- Count tickets ahead
    -- A ticket is ahead if:
    -- 1. It is 'waiting' in the same branch and service
    -- 2. It has higher priority, OR (same priority and created_at < our created_at)
    select count(*) into v_position
    from public.queues
    where branch_id = v_branch_id
      and service_id = v_service_id
      and status = 'waiting'
      and (
        -- Higher priority
        case priority
          when 'emergency' then 1
          when 'vip' then 2
          when 'senior' then 3
          when 'normal' then 4
          else 5
        end < 
        case v_priority
          when 'emergency' then 1
          when 'vip' then 2
          when 'senior' then 3
          when 'normal' then 4
          else 5
        end
        or
        -- Same priority but created earlier
        (priority = v_priority and created_at < v_created_at)
      );
    
    return v_position + 1; -- Position 1 means next in line
end;
$$ language plpgsql security definer;


-- ==========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================

-- Profiles policies
create policy "Allow public read access to profiles"
    on public.profiles for select
    to authenticated
    using (true);

create policy "Allow users to update their own profile"
    on public.profiles for update
    to authenticated
    using (auth.uid() = id);

-- Branches policies
create policy "Allow public read access to active branches"
    on public.branches for select
    using (status = 'active');

create policy "Allow admins to manage branches"
    on public.branches for all
    to authenticated
    using (public.is_admin(auth.uid()));

-- Services policies
create policy "Allow public read access to active services"
    on public.services for select
    using (status = 'active');

create policy "Allow admins to manage services"
    on public.services for all
    to authenticated
    using (public.is_admin(auth.uid()));

-- Counters policies
create policy "Allow public read access to counters"
    on public.counters for select
    using (true);

create policy "Allow staff and admins to manage counters"
    on public.counters for all
    to authenticated
    using (public.is_staff(auth.uid()));

-- Queues policies
create policy "Allow users to view their own queue tokens"
    on public.queues for select
    to authenticated
    using (auth.uid() = user_id or public.is_staff(auth.uid()));

create policy "Allow users to create their own queue tokens"
    on public.queues for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Allow staff and admins to update queue tokens"
    on public.queues for update
    to authenticated
    using (public.is_staff(auth.uid()));

-- Appointments policies
create policy "Allow users to view their own appointments"
    on public.appointments for select
    to authenticated
    using (auth.uid() = user_id or public.is_staff(auth.uid()));

create policy "Allow users to create their own appointments"
    on public.appointments for insert
    to authenticated
    with check (auth.uid() = user_id);

create policy "Allow users to update their own appointments"
    on public.appointments for update
    to authenticated
    using (auth.uid() = user_id or public.is_staff(auth.uid()));

-- Notifications policies
create policy "Allow users to view their own notifications"
    on public.notifications for select
    to authenticated
    using (auth.uid() = user_id);

create policy "Allow users to update their own notifications"
    on public.notifications for update
    to authenticated
    using (auth.uid() = user_id);

create policy "Allow staff and admins to insert notifications"
    on public.notifications for insert
    to authenticated
    with check (public.is_staff(auth.uid()));

-- Feedback policies
create policy "Allow users to view their own feedback"
    on public.feedback for select
    to authenticated
    using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "Allow users to submit feedback"
    on public.feedback for insert
    to authenticated
    with check (auth.uid() = user_id);


-- ==========================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ==========================================================
create index idx_queues_user_id on public.queues(user_id);
create index idx_queues_branch_id_status on public.queues(branch_id, status);
create index idx_queues_created_at on public.queues(created_at desc);
create index idx_counters_branch_id on public.counters(branch_id);
create index idx_services_branch_id on public.services(branch_id);
create index idx_appointments_user_id on public.appointments(user_id);
create index idx_notifications_user_id_read on public.notifications(user_id, read);
