-- 1. Create Business Categories Table
create table if not exists public.business_categories (
    id uuid default gen_random_uuid() primary key,
    name text not null unique,
    icon text not null, -- emoji or SVG name
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on business_categories
alter table public.business_categories enable row level security;

-- Create public read policy on categories
create policy "Allow public read access to categories"
    on public.business_categories for select
    to authenticated, anon
    using (true);

-- 2. Update Branches Table
alter table public.branches add column if not exists category_id uuid references public.business_categories(id) on delete set null;
alter table public.branches add column if not exists latitude numeric;
alter table public.branches add column if not exists longitude numeric;
alter table public.branches add column if not exists opening_time time default '09:00:00';
alter table public.branches add column if not exists closing_time time default '18:00:00';
alter table public.branches add column if not exists contact_number text;

-- 3. Seed Default Categories
insert into public.business_categories (id, name, icon) values
('c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Healthcare', '🏥'),
('c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Banking', '🏦'),
('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Government Services', '🏢'),
('c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'Education', '🎓'),
('c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'Salons & Beauty', '💇'),
('c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Restaurants & Food', '🍽️'),
('c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Retail & Stores', '🛒'),
('c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'Customer Support', '🎧'),
('c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', 'Automotive', '🚗'),
('c10c10c1-0c10-c10c-10c1-0c10c10c10c1', 'Real Estate', '🏠'),
('c11c11c1-1c11-c11c-11c1-1c11c11c11c1', 'Fitness & Gym', '💪'),
('c12c12c1-2c12-c12c-12c1-2c12c12c12c1', 'Travel & Transport', '✈️')
on conflict (name) do update set icon = excluded.icon;

-- 4. Seed 50+ Branches with realistic coords (NYC Manhattan center: 40.7128, -74.0060)
insert into public.branches (id, category_id, name, address, latitude, longitude, opening_time, closing_time, contact_number, status) values
-- Healthcare (10 branches)
('h1111111-1111-1111-1111-111111111111', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'City General Hospital', '415 1st Ave, New York, NY 10010', 40.7384, -73.9785, '00:00:00', '23:59:59', '+1 212-555-0101', 'active'),
('h2222222-2222-2222-2222-222222222222', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Apollo Health Center', '125 W 72nd St, New York, NY 10023', 40.7785, -73.9812, '08:00:00', '20:00:00', '+1 212-555-0102', 'active'),
('h3333333-3333-3333-3333-333333333333', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Medicare Clinic', '542 E 12th St, New York, NY 10009', 40.7291, -73.9818, '09:00:00', '18:00:00', '+1 212-555-0103', 'active'),
('h4444444-4444-4444-4444-444444444444', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Sunrise Hospital', '1000 10th Ave, New York, NY 10019', 40.7698, -73.9892, '00:00:00', '23:59:59', '+1 212-555-0104', 'active'),
('h5555555-5555-5555-5555-555555555555', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Hope Medical Center', '225 E 64th St, New York, NY 10021', 40.7635, -73.9632, '08:00:00', '17:00:00', '+1 212-555-0105', 'active'),
('h6666666-6666-6666-6666-666666666666', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Bellevue Hospital Center', '462 1st Ave, New York, NY 10016', 40.7390, -73.9760, '00:00:00', '23:59:59', '+1 212-555-0106', 'active'),
('h7777777-7777-7777-7777-777777777777', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Mount Sinai Hospital', '1468 Madison Ave, New York, NY 10029', 40.7899, -73.9525, '00:00:00', '23:59:59', '+1 212-555-0107', 'active'),
('h8888888-8888-8888-8888-888888888888', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'NewYork-Presbyterian Hospital', '525 E 68th St, New York, NY 10065', 40.7644, -73.9542, '00:00:00', '23:59:59', '+1 212-555-0108', 'active'),
('h9999999-9999-9999-9999-999999999999', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Lenox Hill Hospital', '100 E 77th St, New York, NY 10075', 40.7735, -73.9599, '07:30:00', '21:00:00', '+1 212-555-0109', 'active'),
('haaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'NYU Langone Health', '550 1st Ave, New York, NY 10016', 40.7425, -73.9740, '00:00:00', '23:59:59', '+1 212-555-0110', 'active'),

-- Banking (8 branches)
('b1111111-1111-1111-1111-111111111111', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'SBI Main Branch', '11 Wall St, New York, NY 10005', 40.7069, -74.0112, '09:30:00', '16:00:00', '+1 212-555-0201', 'active'),
('b2222222-2222-2222-2222-222222222222', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'HDFC Downtown Branch', '420 Lexington Ave, New York, NY 10170', 40.7518, -73.9754, '09:00:00', '17:00:00', '+1 212-555-0202', 'active'),
('b3333333-3333-3333-3333-333333333333', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'ICICI Central Branch', '350 5th Ave, New York, NY 10118', 40.7484, -73.9857, '09:00:00', '17:00:00', '+1 212-555-0203', 'active'),
('b4444444-4444-4444-4444-444444444444', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Axis Bank City Branch', '1568 Broadway, New York, NY 10036', 40.7590, -73.9844, '09:00:00', '16:30:00', '+1 212-555-0204', 'active'),
('b5555555-5555-5555-5555-555555555555', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Chase Bank Wall St', '26 Wall St, New York, NY 10005', 40.7073, -74.0105, '08:30:00', '17:00:00', '+1 212-555-0205', 'active'),
('b6666666-6666-6666-6666-666666666666', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Bank of America Times Square', '1133 Avenue of the Americas, NY 10036', 40.7565, -73.9829, '09:00:00', '18:00:00', '+1 212-555-0206', 'active'),
('b7777777-7777-7777-7777-777777777777', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Citibank Union Square', '14 Union Square S, New York, NY 10003', 40.7342, -73.9902, '09:00:00', '17:00:00', '+1 212-555-0207', 'active'),
('b8888888-8888-8888-8888-888888888888', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Wells Fargo Grand Central', '60 E 42nd St, New York, NY 10165', 40.7523, -73.9782, '08:30:00', '17:00:00', '+1 212-555-0208', 'active'),

-- Government Services (6 branches)
('g1111111-1111-1111-1111-111111111111', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Passport Office', '376 Hudson St, New York, NY 10014', 40.7289, -74.0069, '08:00:00', '15:30:00', '+1 212-555-0301', 'active'),
('g2222222-2222-2222-2222-222222222222', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'RTO Office', '145 Hester St, New York, NY 10002', 40.7171, -73.9959, '08:30:00', '16:00:00', '+1 212-555-0302', 'active'),
('g3333333-3333-3333-3333-333333333333', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Aadhaar Center', '109 W 125th St, New York, NY 10027', 40.8089, -73.9482, '09:00:00', '17:30:00', '+1 212-555-0303', 'active'),
('g4444444-4444-4444-4444-444444444444', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Municipal Service Center', '1 Centre St, New York, NY 10007', 40.7126, -74.0031, '09:00:00', '17:00:00', '+1 212-555-0304', 'active'),
('g5555555-5555-5555-5555-555555555555', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Social Security Administration', '123 William St, New York, NY 10038', 40.7090, -74.0070, '09:00:00', '16:00:00', '+1 212-555-0305', 'active'),
('g6666666-6666-6666-6666-666666666666', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'DMV Express Manhattan', '145 W 30th St, New York, NY 10001', 40.7483, -73.9908, '08:00:00', '16:30:00', '+1 212-555-0306', 'active'),

-- Education (4 branches)
('e1111111-1111-1111-1111-111111111111', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'Columbia Admissions Office', '210 Kent Hall, New York, NY 10027', 40.8066, -73.9622, '09:00:00', '17:00:00', '+1 212-555-0401', 'active'),
('e2222222-2222-2222-2222-222222222222', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'NYU Student Services Center', '383 Lafayette St, New York, NY 10003', 40.7295, -73.9928, '09:00:00', '17:00:00', '+1 212-555-0402', 'active'),
('e3333333-3333-3333-3333-333333333333', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'Fordham Admissions Center', '113 W 60th St, New York, NY 10023', 40.7695, -73.9840, '09:00:00', '17:00:00', '+1 212-555-0403', 'active'),
('e4444444-4444-4444-4444-444444444444', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'CUNY Welcome Center', '217 E 42nd St, New York, NY 10017', 40.7505, -73.9745, '09:00:00', '17:00:00', '+1 212-555-0404', 'active'),

-- Salons & Beauty (5 branches)
('s1111111-1111-1111-1111-111111111111', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'Looks Salon', '347 Fifth Ave, New York, NY 10016', 40.7482, -73.9842, '10:00:00', '20:00:00', '+1 212-555-0501', 'active'),
('s2222222-2222-2222-2222-222222222222', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'Naturals Salon', '85 Mercer St, New York, NY 10012', 40.7224, -74.0002, '10:00:00', '20:30:00', '+1 212-555-0502', 'active'),
('s3333333-3333-3333-3333-333333333333', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'Green Trends', '224 W 4th St, New York, NY 10014', 40.7341, -74.0026, '09:30:00', '20:00:00', '+1 212-555-0503', 'active'),
('s4444444-4444-4444-4444-444444444444', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'Urban Beauty Studio', '118 E 57th St, New York, NY 10022', 40.7612, -73.9702, '10:00:00', '19:00:00', '+1 212-555-0504', 'active'),
('s5555555-5555-5555-5555-555555555555', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'Drybar Flatiron', '22 W 21st St, New York, NY 10010', 40.7412, -73.9915, '08:00:00', '21:00:00', '+1 212-555-0505', 'active'),

-- Restaurants & Food (6 branches)
('r1111111-1111-1111-1111-111111111111', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Pizza Hub', '360 W 42nd St, New York, NY 10036', 40.7578, -73.9904, '11:00:00', '23:00:00', '+1 212-555-0601', 'active'),
('r2222222-2222-2222-2222-222222222222', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Spice Garden', '110 Lexington Ave, New York, NY 10016', 40.7419, -73.9806, '11:30:00', '22:30:00', '+1 212-555-0602', 'active'),
('r3333333-3333-3333-3333-333333333333', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Food Junction', '143 8th Ave, New York, NY 10011', 40.7410, -74.0012, '10:00:00', '22:00:00', '+1 212-555-0603', 'active'),
('r4444444-4444-4444-4444-444444444444', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Family Restaurant', '302 Columbus Ave, New York, NY 10023', 40.7792, -73.9781, '08:00:00', '22:00:00', '+1 212-555-0604', 'active'),
('r5555555-5555-5555-5555-555555555555', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Shake Shack Madison Square', 'Madison Square Park, New York, NY 10010', 40.7415, -73.9880, '11:00:00', '22:00:00', '+1 212-555-0605', 'active'),
('r6666666-6666-6666-6666-666666666666', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Katz\'s Delicatessen', '205 E Houston St, New York, NY 10002', 40.7222, -73.9875, '08:00:00', '23:00:00', '+1 212-555-0606', 'active'),

-- Retail & Stores (5 branches)
('rt111111-1111-1111-1111-111111111111', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Mega Mart Superstore', '400 W 37th St, New York, NY 10018', 40.7554, -73.9942, '08:00:00', '22:00:00', '+1 212-555-0701', 'active'),
('rt222222-2222-2222-2222-222222222222', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Urban Fashion Store', '510 Broadway, New York, NY 10012', 40.7246, -73.9982, '10:00:00', '21:00:00', '+1 212-555-0702', 'active'),
('rt333333-3333-3333-3333-333333333333', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Apple Store Fifth Avenue', '767 Fifth Ave, New York, NY 10153', 40.7638, -73.9729, '00:00:00', '23:59:59', '+1 212-555-0703', 'active'),
('rt444444-4444-4444-4444-444444444444', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Macy\'s Herald Square', '151 W 34th St, New York, NY 10001', 40.7508, -73.9890, '10:00:00', '21:30:00', '+1 212-555-0704', 'active'),
('rt555555-5555-5555-5555-555555555555', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Best Buy Union Square', '529 5th Ave, New York, NY 10003', 40.7345, -73.9910, '10:00:00', '20:00:00', '+1 212-555-0705', 'active'),

-- Customer Support (3 branches)
('cs111111-1111-1111-1111-111111111111', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'Telecom Care Center', '83 Maiden Ln, New York, NY 10038', 40.7076, -74.0076, '09:00:00', '18:00:00', '+1 212-555-0801', 'active'),
('cs222222-2222-2222-2222-222222222222', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'Tech Support Hub', '530 5th Ave, New York, NY 10036', 40.7550, -73.9805, '09:00:00', '18:00:00', '+1 212-555-0802', 'active'),
('cs333333-3333-3333-3333-333333333333', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'Verizon Experience Store', '125 W 34th St, New York, NY 10001', 40.7498, -73.9882, '09:00:00', '19:00:00', '+1 212-555-0803', 'active'),

-- Automotive (3 branches)
('a1111111-1111-1111-1111-111111111111', 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', 'City Auto Service', '515 W 57th St, New York, NY 10019', 40.7712, -73.9920, '08:00:00', '18:00:00', '+1 212-555-0901', 'active'),
('a2222222-2222-2222-2222-222222222222', 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', 'Tesla Chelsea Service', '511 W 25th St, New York, NY 10001', 40.7495, -74.0042, '08:00:00', '17:00:00', '+1 212-555-0902', 'active'),
('a3333333-3333-3333-3333-333333333333', 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', 'Toyota Manhattan Service', '640 W 57th St, New York, NY 10019', 40.7710, -73.9930, '07:30:00', '18:00:00', '+1 212-555-0903', 'active'),

-- Real Estate (3 branches)
('re111111-1111-1111-1111-111111111111', 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', 'Prime Realty Center', '450 Park Ave, New York, NY 10022', 40.7618, -73.9718, '09:00:00', '18:00:00', '+1 212-555-1001', 'active'),
('re222222-2222-2222-2222-222222222222', 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', 'Compass Real Estate Chelsea', '90 5th Ave, New York, NY 10011', 40.7368, -73.9938, '09:00:00', '18:00:00', '+1 212-555-1002', 'active'),
('re333333-3333-3333-3333-333333333333', 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', 'Douglas Elliman Flatiron', '936 Broadway, New York, NY 10010', 40.7401, -73.9897, '09:00:00', '18:05:00', '+1 212-555-1003', 'active'),

-- Fitness & Gym (3 branches)
('f1111111-1111-1111-1111-111111111111', 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', 'Elite Fitness Hub', '10 Union Sq East, New York, NY 10003', 40.7348, -73.9898, '06:00:00', '22:00:00', '+1 212-555-1101', 'active'),
('f2222222-2222-2222-2222-222222222222', 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', 'Equinox Flatiron', '97 5th Ave, New York, NY 10003', 40.7375, -73.9922, '05:30:00', '23:00:00', '+1 212-555-1102', 'active'),
('f3333333-3333-3333-3333-333333333333', 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', 'Crunch Fitness Chelsea', '220 W 19th St, New York, NY 10011', 40.7418, -73.9985, '05:00:00', '22:00:00', '+1 212-555-1103', 'active'),

-- Travel & Transport (3 branches)
('t1111111-1111-1111-1111-111111111111', 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', 'Grand Central Transit Desk', '89 E 42nd St, New York, NY 10017', 40.7527, -73.9772, '06:00:00', '23:00:00', '+1 212-555-1201', 'active'),
('t2222222-2222-2222-2222-222222222222', 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', 'Penn Station Customer Desk', '351 W 31st St, New York, NY 10001', 40.7501, -73.9925, '06:00:00', '23:59:59', '+1 212-555-1202', 'active'),
('t3333333-3333-3333-3333-333333333333', 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', 'Port Authority Transit Desk', '625 8th Ave, New York, NY 10018', 40.7568, -73.9912, '06:00:00', '22:30:00', '+1 212-555-1203', 'active')
on conflict (id) do update set
  category_id = excluded.category_id,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  opening_time = excluded.opening_time,
  closing_time = excluded.closing_time,
  contact_number = excluded.contact_number,
  status = excluded.status;

-- 5. Seed Services for new branches to keep it functional
insert into public.services (id, branch_id, name, prefix, avg_service_time, status) values
('s-h1-1', 'h1111111-1111-1111-1111-111111111111', 'Emergency Care', 'ER', 12, 'active'),
('s-h1-2', 'h1111111-1111-1111-1111-111111111111', 'Outpatient Consultation', 'OP', 20, 'active'),
('s-h2-1', 'h2222222-2222-2222-2222-222222222222', 'General Consultation', 'GC', 15, 'active'),
('s-h3-1', 'h3333333-3333-3333-3333-333333333333', 'Quick Checkup', 'QC', 10, 'active'),
('s-b1-1', 'b1111111-1111-1111-1111-111111111111', 'Cashier & Deposits', 'CS', 8, 'active'),
('s-b1-2', 'b1111111-1111-1111-1111-111111111111', 'Loans & Accounts', 'LN', 25, 'active'),
('s-b2-1', 'b2222222-2222-2222-2222-222222222222', 'General Enquiry', 'GE', 10, 'active'),
('s-g1-1', 'g1111111-1111-1111-1111-111111111111', 'New Applications', 'NA', 30, 'active'),
('s-g1-2', 'g1111111-1111-1111-1111-111111111111', 'Passport Renewal', 'RN', 15, 'active'),
('s-g2-1', 'g2222222-2222-2222-2222-222222222222', 'License Registration', 'LR', 20, 'active'),
('s-s1-1', 's1111111-1111-1111-1111-111111111111', 'Haircut & Styling', 'HC', 25, 'active'),
('s-s2-1', 's2222222-2222-2222-2222-222222222222', 'Spa Services', 'SP', 45, 'active'),
('s-r1-1', 'r1111111-1111-1111-1111-111111111111', 'Dine-In Queue', 'DI', 15, 'active'),
('s-r1-2', 'r1111111-1111-1111-1111-111111111111', 'Takeaway Queue', 'TA', 8, 'active')
on conflict (id) do update set
  name = excluded.name,
  prefix = excluded.prefix,
  avg_service_time = excluded.avg_service_time,
  status = excluded.status;

-- 6. Add Counters for new branches
insert into public.counters (id, branch_id, name, number, status) values
('c-h1-1', 'h1111111-1111-1111-1111-111111111111', 'ER Counter 1', 1, 'open'),
('c-h1-2', 'h1111111-1111-1111-1111-111111111111', 'OP Counter 2', 2, 'open'),
('c-b1-1', 'b1111111-1111-1111-1111-111111111111', 'Teller Counter 1', 1, 'open'),
('c-g1-1', 'g1111111-1111-1111-1111-111111111111', 'Desk 1', 1, 'open'),
('c-s1-1', 's1111111-1111-1111-1111-111111111111', 'Stylist Chair 1', 1, 'open'),
('c-r1-1', 'r1111111-1111-1111-1111-111111111111', 'Reception Desk 1', 1, 'open')
on conflict (id) do update set
  status = excluded.status,
  name = excluded.name;
