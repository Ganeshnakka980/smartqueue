-- Enable pgcrypto (in case it's not enabled)
create extension if not exists pgcrypto;

-- 1. Create Seed Users in auth.users
-- Note: The trigger on_auth_user_created will automatically create the matching rows in public.profiles.

-- Admin User: admin@smartqueue.com (Password123)
INSERT INTO auth.users (
    id, 
    instance_id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    aud, 
    role, 
    created_at, 
    updated_at
)
VALUES (
    'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    '00000000-0000-0000-0000-000000000000',
    'admin@smartqueue.com',
    -- Use crypt with gen_salt if extensions.crypt is not available, or vice versa. In Supabase, crypt is available.
    crypt('Password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "System Admin", "role": "admin"}',
    'authenticated',
    'authenticated',
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

-- Staff User: staff@smartqueue.com (Password123)
INSERT INTO auth.users (
    id, 
    instance_id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    aud, 
    role, 
    created_at, 
    updated_at
)
VALUES (
    'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
    '00000000-0000-0000-0000-000000000000',
    'staff@smartqueue.com',
    crypt('Password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Counter Staff 1", "role": "staff"}',
    'authenticated',
    'authenticated',
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

-- Customer User: customer@smartqueue.com (Password123)
INSERT INTO auth.users (
    id, 
    instance_id, 
    email, 
    encrypted_password, 
    email_confirmed_at, 
    raw_app_meta_data, 
    raw_user_meta_data, 
    aud, 
    role, 
    created_at, 
    updated_at
)
VALUES (
    'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
    '00000000-0000-0000-0000-000000000000',
    'customer@smartqueue.com',
    crypt('Password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "John Doe", "role": "customer"}',
    'authenticated',
    'authenticated',
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;


-- 2. Seed Branches
INSERT INTO public.branches (id, name, address, status) VALUES
('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Downtown Branch', '123 Main Street, City Center', 'active'),
('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Westside Mall Branch', '456 West Avenue, Shopping District', 'active')
ON CONFLICT (id) DO NOTHING;


-- 3. Seed Services
INSERT INTO public.services (id, branch_id, name, prefix, avg_service_time, status) VALUES
-- Downtown Services
('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'General Inquiry', 'G', 10, 'active'),
('07070707-0707-0707-0707-070707070707', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Account Services', 'A', 20, 'active'),
('08080808-0808-0808-0808-080808080808', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Cashier & Deposits', 'C', 8, 'active'),
-- Westside Services
('09090909-0909-0909-0909-090909090909', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Customer Support', 'S', 15, 'active'),
('10101010-1010-1010-1010-101010101010', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Loan & Mortgage', 'L', 30, 'active')
ON CONFLICT (id) DO NOTHING;


-- 4. Seed Counters
INSERT INTO public.counters (id, branch_id, name, number, staff_id, status) VALUES
-- Downtown Counters
('11111111-1111-1111-1111-111111111111', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Counter 1', 1, 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'open'),
('22222222-2222-2222-2222-222222222222', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Counter 2', 2, NULL, 'closed'),
-- Westside Counters
('33333333-3333-3333-3333-333333333333', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Counter 1', 1, NULL, 'closed')
ON CONFLICT (id) DO NOTHING;


-- 5. Seed Historical Queue Data (For AI Waiting Time Prediction testing)
-- We will insert some completed tickets from yesterday to train/test the prediction logic.
INSERT INTO public.queues (
    id, branch_id, service_id, counter_id, user_id, token_number, sequence_number, 
    status, priority, called_at, completed_at, created_at
) VALUES
-- Downtown General Inquiry tickets (average service time should be ~10 mins)
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', '11111111-1111-1111-1111-111111111111', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'G-101', 1, 'completed', 'normal', now() - interval '1 hour 10 minutes', now() - interval '1 hour', now() - interval '1 hour 20 minutes'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', '11111111-1111-1111-1111-111111111111', NULL, 'G-102', 2, 'completed', 'normal', now() - interval '50 minutes', now() - interval '42 minutes', now() - interval '55 minutes'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', '11111111-1111-1111-1111-111111111111', NULL, 'G-103', 3, 'completed', 'senior', now() - interval '30 minutes', now() - interval '18 minutes', now() - interval '35 minutes'),

-- Downtown Account Services tickets (average service time should be ~20 mins)
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', '07070707-0707-0707-0707-070707070707', '11111111-1111-1111-1111-111111111111', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'A-101', 1, 'completed', 'normal', now() - interval '2 hours', now() - interval '1 hour 40 minutes', now() - interval '2 hours 15 minutes'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', '07070707-0707-0707-0707-070707070707', '11111111-1111-1111-1111-111111111111', NULL, 'A-102', 2, 'completed', 'vip', now() - interval '1 hour 40 minutes', now() - interval '1 hour 15 minutes', now() - interval '1 hour 45 minutes')
ON CONFLICT (id) DO NOTHING;
