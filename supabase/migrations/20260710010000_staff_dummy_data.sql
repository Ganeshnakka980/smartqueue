-- 1. Seed Staff Users in auth.users
-- Hospital Staff: staff_hospital@smartqueue.com (Password123)
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
    'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b4b4',
    '00000000-0000-0000-0000-000000000000',
    'staff_hospital@smartqueue.com',
    crypt('Password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Hospital staff", "role": "staff", "organization_id": "01111111-1111-1111-1111-111111111111", "branch_id": "11111111-1111-1111-1111-111111111111"}',
    'authenticated',
    'authenticated',
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

-- SBI Staff: staff_sbi@smartqueue.com (Password123)
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
    'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b5b5',
    '00000000-0000-0000-0000-000000000000',
    'staff_sbi@smartqueue.com',
    crypt('Password123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "SBI Teller staff", "role": "staff", "organization_id": "07777777-7777-7777-7777-777777777777", "branch_id": "b1111111-1111-1111-1111-111111111111"}',
    'authenticated',
    'authenticated',
    now(),
    now()
) ON CONFLICT (id) DO NOTHING;

-- 2. Explicitly update profiles table to ensure organization_id and branch_id are set correctly
UPDATE public.profiles
SET organization_id = '01111111-1111-1111-1111-111111111111',
    branch_id = '11111111-1111-1111-1111-111111111111'
WHERE id = 'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b4b4';

UPDATE public.profiles
SET organization_id = '07777777-7777-7777-7777-777777777777',
    branch_id = 'b1111111-1111-1111-1111-111111111111'
WHERE id = 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b5b5';

UPDATE public.profiles
SET organization_id = '00000000-0000-0000-0000-000000000000',
    branch_id = 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4'
WHERE id = 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2';

-- 3. Associate staff users with the respective counters
UPDATE public.counters
SET staff_id = 'b4b4b4b4-b4b4-b4b4-b4b4-b4b4b4b4b4b4',
    status = 'open'
WHERE id = '20000000-0000-0000-0000-000000000001'; -- ER Counter 1

UPDATE public.counters
SET staff_id = 'b5b5b5b5-b5b5-b5b5-b5b5-b5b5b5b5b5b5',
    status = 'open'
WHERE id = '20000000-0000-0000-0000-000000000003'; -- Teller Counter 1

-- 4. Seed Queue tickets for today for Downtown Branch (d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4)
-- Today Completed
INSERT INTO public.queues (
    id, branch_id, service_id, counter_id, token_number, sequence_number, 
    status, priority, called_at, completed_at, created_at, organization_id
) VALUES
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', '11111111-1111-1111-1111-111111111111', 'G-101', 1, 'completed', 'normal', now() - interval '3 hours', now() - interval '2 hours 50 minutes', now() - interval '3 hours 5 minutes', '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', '11111111-1111-1111-1111-111111111111', 'G-102', 2, 'completed', 'senior', now() - interval '2 hours', now() - interval '1 hour 45 minutes', now() - interval '2 hours 10 minutes', '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', '08080808-0808-0808-0808-080808080808', '11111111-1111-1111-1111-111111111111', 'C-101', 1, 'completed', 'normal', now() - interval '1 hour', now() - interval '52 minutes', now() - interval '1 hour 5 minutes', '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', '08080808-0808-0808-0808-080808080808', '11111111-1111-1111-1111-111111111111', 'C-102', 2, 'completed', 'vip', now() - interval '45 minutes', now() - interval '38 minutes', now() - interval '48 minutes', '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', '11111111-1111-1111-1111-111111111111', 'G-103', 3, 'skipped', 'normal', now() - interval '30 minutes', NULL, now() - interval '35 minutes', '00000000-0000-0000-0000-000000000000');

-- Today Waiting
INSERT INTO public.queues (
    id, branch_id, service_id, counter_id, token_number, sequence_number, 
    status, priority, created_at, organization_id
) VALUES
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', NULL, 'G-104', 4, 'waiting', 'normal', now() - interval '15 minutes', '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', NULL, 'G-105', 5, 'waiting', 'emergency', now() - interval '10 minutes', '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', '08080808-0808-0808-0808-080808080808', NULL, 'C-103', 3, 'waiting', 'vip', now() - interval '8 minutes', '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', NULL, 'G-106', 6, 'waiting', 'senior', now() - interval '5 minutes', '00000000-0000-0000-0000-000000000000'),
(gen_random_uuid(), 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', '08080808-0808-0808-0808-080808080808', NULL, 'C-104', 4, 'waiting', 'normal', now() - interval '2 minutes', '00000000-0000-0000-0000-000000000000');


-- 5. Seed Queue tickets for today for Kokilaben Hospital (11111111-1111-1111-1111-111111111111)
-- Today Completed
INSERT INTO public.queues (
    id, branch_id, service_id, counter_id, token_number, sequence_number, 
    status, priority, called_at, completed_at, created_at, organization_id
) VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'ER-101', 1, 'completed', 'emergency', now() - interval '2 hours', now() - interval '1 hour 45 minutes', now() - interval '2 hours 2 minutes', '01111111-1111-1111-1111-111111111111'),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'OP-101', 1, 'completed', 'normal', now() - interval '1 hour 30 minutes', now() - interval '1 hour 10 minutes', now() - interval '1 hour 40 minutes', '01111111-1111-1111-1111-111111111111'),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000002', 'OP-102', 2, 'completed', 'senior', now() - interval '1 hour', now() - interval '42 minutes', now() - interval '1 hour 8 minutes', '01111111-1111-1111-1111-111111111111'),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001', 'ER-102', 2, 'skipped', 'emergency', now() - interval '30 minutes', NULL, now() - interval '32 minutes', '01111111-1111-1111-1111-111111111111');

-- Today Waiting
INSERT INTO public.queues (
    id, branch_id, service_id, counter_id, token_number, sequence_number, 
    status, priority, created_at, organization_id
) VALUES
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000001', NULL, 'ER-103', 3, 'waiting', 'emergency', now() - interval '20 minutes', '01111111-1111-1111-1111-111111111111'),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000002', NULL, 'OP-103', 3, 'waiting', 'normal', now() - interval '18 minutes', '01111111-1111-1111-1111-111111111111'),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000002', NULL, 'OP-104', 4, 'waiting', 'vip', now() - interval '12 minutes', '01111111-1111-1111-1111-111111111111'),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000002', NULL, 'OP-105', 5, 'waiting', 'senior', now() - interval '5 minutes', '01111111-1111-1111-1111-111111111111');


-- 6. Seed Queue tickets for today for SBI Bandra Branch (b1111111-1111-1111-1111-111111111111)
-- Today Completed
INSERT INTO public.queues (
    id, branch_id, service_id, counter_id, token_number, sequence_number, 
    status, priority, called_at, completed_at, created_at, organization_id
) VALUES
(gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 'CS-101', 1, 'completed', 'normal', now() - interval '1 hour 40 minutes', now() - interval '1 hour 30 minutes', now() - interval '1 hour 50 minutes', '07777777-7777-7777-7777-777777777777'),
(gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000006', '20000000-0000-0000-0000-000000000003', 'LN-101', 1, 'completed', 'vip', now() - interval '1 hour 20 minutes', now() - interval '55 minutes', now() - interval '1 hour 30 minutes', '07777777-7777-7777-7777-777777777777'),
(gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000003', 'CS-102', 2, 'completed', 'normal', now() - interval '40 minutes', now() - interval '32 minutes', now() - interval '45 minutes', '07777777-7777-7777-7777-777777777777');

-- Today Waiting
INSERT INTO public.queues (
    id, branch_id, service_id, counter_id, token_number, sequence_number, 
    status, priority, created_at, organization_id
) VALUES
(gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000005', NULL, 'CS-103', 3, 'waiting', 'normal', now() - interval '15 minutes', '07777777-7777-7777-7777-777777777777'),
(gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000006', NULL, 'LN-102', 2, 'waiting', 'vip', now() - interval '10 minutes', '07777777-7777-7777-7777-777777777777'),
(gen_random_uuid(), 'b1111111-1111-1111-1111-111111111111', '10000000-0000-0000-0000-000000000005', NULL, 'CS-104', 4, 'waiting', 'senior', now() - interval '5 minutes', '07777777-7777-7777-7777-777777777777');
