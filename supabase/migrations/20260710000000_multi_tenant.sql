-- 1. Create Organizations Table
create table if not exists public.organizations (
    id uuid default gen_random_uuid() primary key,
    name text not null unique,
    category_id uuid references public.business_categories(id) on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on organizations
alter table public.organizations enable row level security;

-- Create policy for public read access to organizations
create policy "Allow public read access to organizations"
    on public.organizations for select
    to authenticated, anon
    using (true);

-- 2. Alter Branches to support organization_id
alter table public.branches add column if not exists organization_id uuid references public.organizations(id) on delete cascade;

-- 3. Alter Profiles to support organization_id and branch_id for staff
alter table public.profiles add column if not exists organization_id uuid references public.organizations(id) on delete set null;
alter table public.profiles add column if not exists branch_id uuid references public.branches(id) on delete set null;

-- 4. Alter Queues to link with organization_id
alter table public.queues add column if not exists organization_id uuid references public.organizations(id) on delete cascade;

-- 5. Seed default organizations matching our Mumbai seed brands (Hex-valid UUIDs starting with 0)
insert into public.organizations (id, name, category_id) values
('01111111-1111-1111-1111-111111111111', 'Kokilaben Dhirubhai Ambani Hospital', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('02222222-2222-2222-2222-222222222222', 'Lilavati Hospital & Research Centre', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('03333333-3333-3333-3333-333333333333', 'Nanavati Max Super Speciality Hospital', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('04444444-4444-4444-4444-444444444444', 'Hinduja Hospital', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('05555555-5555-5555-5555-555555555555', 'Tata Memorial Hospital', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('06666666-6666-6666-6666-666666666666', 'SevenHills Hospital', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1'),
('07777777-7777-7777-7777-777777777777', 'State Bank of India', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('08888888-8888-8888-8888-888888888888', 'HDFC Bank', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('09999999-9999-9999-9999-999999999999', 'ICICI Bank', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('0aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Axis Bank', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2'),
('0bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Passport Seva Kendra', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'),
('0ccccccc-cccc-cccc-cccc-cccccccccccc', 'Regional Transport Office (RTO)', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'),
('0ddddddd-dddd-dddd-dddd-dddddddddddd', 'Municipal Corporation (BMC)', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3'),
('0eeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'IIT Bombay', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4'),
('0fffffff-ffff-ffff-ffff-ffffffffffff', 'St. Xavier''s College', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4'),
('01010101-1010-1010-1010-101010101010', 'BBlunt Salon', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5'),
('01212121-2121-2121-2121-212121212121', 'Enrich Salon', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5'),
('01313131-3131-3131-3131-313131313131', 'Cafe Mondegar', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6'),
('01414141-1414-1414-1414-141414141414', 'Leopold Cafe', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6'),
('01515151-1515-1515-1515-151515151515', 'Phoenix Marketcity', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7'),
('01616161-1616-1616-1616-161616161616', 'Reliance Retail', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7'),
('01717171-1717-1717-1717-171717171717', 'Apple India Support', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8'),
('01818181-1818-1818-1818-181818181818', 'Reliance Jio Support', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8'),
('01919191-1919-1919-1919-191919191919', 'Honda Service Centre', 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9'),
('02020202-2020-2020-2020-202020202020', 'Tata Motors Service', 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9'),
('02121212-2121-2121-2121-212121212121', 'Lodha Developers', 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1'),
('02222222-2222-2222-2222-222222222223', 'Godrej Properties', 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1'),
('02323232-2323-2323-2323-232323232323', 'Gold''s Gym', 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1'),
('02424242-2424-2424-2424-242424242424', 'Mumbai International Airport (Adani)', 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1'),
('02525252-2525-2525-2525-252525252525', 'Indian Railways', 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1')
on conflict (name) do nothing;

-- 6. Link seeded branches to their respective organizations
update public.branches set organization_id = '01111111-1111-1111-1111-111111111111' where name like '%Kokilaben%';
update public.branches set organization_id = '02222222-2222-2222-2222-222222222222' where name like '%Lilavati%';
update public.branches set organization_id = '03333333-3333-3333-3333-333333333333' where name like '%Nanavati%';
update public.branches set organization_id = '04444444-4444-4444-4444-444444444444' where name like '%Hinduja%';
update public.branches set organization_id = '05555555-5555-5555-5555-555555555555' where name like '%Tata Memorial%';
update public.branches set organization_id = '06666666-6666-6666-6666-666666666666' where name like '%SevenHills%';
update public.branches set organization_id = '07777777-7777-7777-7777-777777777777' where name like '%SBI%';
update public.branches set organization_id = '08888888-8888-8888-8888-888888888888' where name like '%HDFC%';
update public.branches set organization_id = '09999999-9999-9999-9999-999999999999' where name like '%ICICI%';
update public.branches set organization_id = '0aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa' where name like '%Axis%';
update public.branches set organization_id = '0bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb' where name like '%Passport%';
update public.branches set organization_id = '0ccccccc-cccc-cccc-cccc-cccccccccccc' where name like '%RTO%';
update public.branches set organization_id = '0ddddddd-dddd-dddd-dddd-dddddddddddd' where name like '%Municipal%';
update public.branches set organization_id = '0eeeeeee-eeee-eeee-eeee-eeeeeeeeeeee' where name like '%IIT%';
update public.branches set organization_id = '0fffffff-ffff-ffff-ffff-ffffffffffff' where name like '%Xavier%';
update public.branches set organization_id = '01010101-1010-1010-1010-101010101010' where name like '%BBlunt%';
update public.branches set organization_id = '01212121-2121-2121-2121-212121212121' where name like '%Enrich%';
update public.branches set organization_id = '01313131-3131-3131-3131-313131313131' where name like '%Mondegar%';
update public.branches set organization_id = '01414141-1414-1414-1414-141414141414' where name like '%Leopold%';
update public.branches set organization_id = '01515151-1515-1515-1515-151515151515' where name like '%Phoenix%';
update public.branches set organization_id = '01616161-1616-1616-1616-161616161616' where name like '%Reliance%';
update public.branches set organization_id = '01717171-1717-1717-1717-171717171717' where name like '%Apple%';
update public.branches set organization_id = '01818181-1818-1818-1818-181818181818' where name like '%Jio%';
update public.branches set organization_id = '01919191-1919-1919-1919-191919191919' where name like '%Honda%';
update public.branches set organization_id = '02020202-2020-2020-2020-202020202020' where name like '%Tata Motors%';
update public.branches set organization_id = '02121212-2121-2121-2121-212121212121' where name like '%Lodha%';
update public.branches set organization_id = '02222222-2222-2222-2222-222222222223' where name like '%Godrej%';
update public.branches set organization_id = '02323232-2323-2323-2323-232323232323' where name like '%Gold%';
update public.branches set organization_id = '02424242-2424-2424-2424-242424242424' where name like '%Airport%';
update public.branches set organization_id = '02525252-2525-2525-2525-252525252525' where name like '%Railways%' or name like '%Central%';

-- Fill remaining branches with default fallback organization if any
insert into public.organizations (id, name) values ('00000000-0000-0000-0000-000000000000', 'General Queuing Org') on conflict (name) do nothing;
update public.branches set organization_id = '00000000-0000-0000-0000-000000000000' where organization_id is null;

-- 7. Update public.handle_new_user() trigger to save organization_id and branch_id
create or replace function public.handle_new_user()
returns trigger as $$
declare
    default_role text := 'customer';
begin
    if new.raw_user_meta_data ? 'role' then
        default_role := new.raw_user_meta_data->>'role';
    end if;

    insert into public.profiles (id, full_name, email, role, avatar_url, organization_id, branch_id)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        new.email,
        default_role,
        new.raw_user_meta_data->>'avatar_url',
        case when (new.raw_user_meta_data->>'organization_id') is not null then (new.raw_user_meta_data->>'organization_id')::uuid else null end,
        case when (new.raw_user_meta_data->>'branch_id') is not null then (new.raw_user_meta_data->>'branch_id')::uuid else null end
    );
    return new;
end;
$$ language plpgsql security definer;

-- 8. Row Level Security Policies for Multi-Tenancy

-- Re-enable RLS on queues
alter table public.queues enable row level security;

-- Drop old read/write policies on queues to avoid conflicts
drop policy if exists "Allow staff to read queues" on public.queues;
drop policy if exists "Allow staff to update queues" on public.queues;
drop policy if exists "Allow public read access to queues" on public.queues;
drop policy if exists "Allow authenticated users to read queues" on public.queues;
drop policy if exists "Allow customer to insert queue" on public.queues;
drop policy if exists "Allow customer to update queue" on public.queues;
drop policy if exists "Allow customers to select any queue" on public.queues;
drop policy if exists "Allow customers to insert queue" on public.queues;
drop policy if exists "Allow customers to update their own queue" on public.queues;
drop policy if exists "Allow staff to select queues of their branch" on public.queues;
drop policy if exists "Allow staff to update queues of their branch" on public.queues;

-- Create Multi-Tenant Policies:
-- 8a. Customers can read their own queues OR any queue (for public live waiting details)
create policy "Allow customers to select any queue"
    on public.queues for select
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() 
              and role = 'customer'
        )
    );

-- 8b. Customers can join a queue (insert)
create policy "Allow customers to insert queue"
    on public.queues for insert
    to authenticated
    with check (auth.uid() = user_id);

-- 8c. Customers can cancel/update their own queue entries
create policy "Allow customers to update their own queue"
    on public.queues for update
    to authenticated
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

-- 8d. Staff can read and write/update queues ONLY for their own organization and branch
create policy "Allow staff to select queues of their branch"
    on public.queues for select
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() 
              and role in ('staff', 'admin')
              and organization_id = queues.organization_id
              and branch_id = queues.branch_id
        )
    );

create policy "Allow staff to update queues of their branch"
    on public.queues for update
    to authenticated
    using (
        exists (
            select 1 from public.profiles
            where id = auth.uid() 
              and role in ('staff', 'admin')
              and organization_id = queues.organization_id
              and branch_id = queues.branch_id
        )
    )
    with check (
        exists (
            select 1 from public.profiles
            where id = auth.uid() 
              and role in ('staff', 'admin')
              and organization_id = queues.organization_id
              and branch_id = queues.branch_id
        )
    );

-- 9. Trigger to auto-set organization_id on queue insert based on branch_id
create or replace function public.set_queue_organization_id()
returns trigger as $$
begin
    if new.organization_id is null then
        select organization_id into new.organization_id
        from public.branches
        where id = new.branch_id;
    end if;
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_queue_inserted
    before insert on public.queues
    for each row execute procedure public.set_queue_organization_id();
