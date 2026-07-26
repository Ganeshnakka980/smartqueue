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

-- 4. Seed 50+ Branches with realistic coords in Mumbai (Center: 19.0760, 72.8777)
insert into public.branches (id, category_id, name, address, latitude, longitude, opening_time, closing_time, contact_number, status) values
-- Healthcare (10 branches)
('11111111-1111-1111-1111-111111111111', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Kokilaben Dhirubhai Ambani Hospital', 'Rao Saheb, Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, 400053', 19.1312, 72.8252, '00:00:00', '23:59:59', '+91 22 4269 6969', 'active'),
('12222222-2222-2222-2222-222222222222', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Lilavati Hospital & Research Centre', 'A-791, Bandra Reclamation Rd, KC Marg, Bandra West, Mumbai, 400050', 19.0514, 72.8285, '00:00:00', '23:59:59', '+91 22 2675 1000', 'active'),
('13333333-3333-3333-3333-333333333333', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Nanavati Max Super Speciality Hospital', 'Swami Vivekananda Rd, LIC Colony, Suresh Colony, Vile Parle West, Mumbai, 400056', 19.0963, 72.8378, '00:00:00', '23:59:59', '+91 22 2626 7500', 'active'),
('14444444-4444-4444-4444-444444444444', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Hinduja Hospital', 'Veer Savarkar Marg, Mahim West, Mahim, Mumbai, 400016', 19.0328, 72.8375, '08:00:00', '20:00:00', '+91 22 2445 1771', 'active'),
('15555555-5555-5555-5555-555555555555', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Tata Memorial Hospital', 'Dr. E, Dr Ernest Borges Rd, Parel, Mumbai, 400012', 19.0049, 72.8427, '09:00:00', '18:00:00', '+91 22 2417 7000', 'active'),
('16666666-6666-6666-6666-666666666666', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'SevenHills Hospital', 'Marol Maroshi Rd, Shivaji Nagar, Andheri East, Mumbai, 400059', 19.1215, 72.8790, '00:00:00', '23:59:59', '+91 22 6767 6767', 'active'),
('17777777-7777-7777-7777-177777777777', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Fortis Hospital Mulund', 'Mulund Goregaon Link Rd, Industrial Area, Bhandup West, Mumbai, 400078', 19.1672, 72.9553, '00:00:00', '23:59:59', '+91 22 4365 4365', 'active'),
('18888888-8888-8888-8888-188888888888', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Jaslok Hospital', '15, Dr Deshmukh Marg, Pedder Rd, Cumballa Hill, Mumbai, 400026', 18.9723, 72.8095, '00:00:00', '23:59:59', '+91 22 6657 3333', 'active'),
('19999999-9999-9999-9999-199999999999', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Breach Candy Hospital', '60 A, Bhulabhai Desai Marg, Breach Candy, Cumballa Hill, Mumbai, 400026', 18.9739, 72.8048, '00:00:00', '23:59:59', '+91 22 2366 7788', 'active'),
('1aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', 'Reliance Foundation Hospital', 'Raja Rammohan Roy Rd, Prarthana Samaj, Girgaon, Mumbai, 400004', 18.9592, 72.8202, '00:00:00', '23:59:59', '+91 22 3547 5757', 'active'),

-- Banking (8 branches)
('b1111111-1111-1111-1111-111111111111', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'SBI Bandra Branch', 'Turner Road, Near Bandra Station, Bandra West, Mumbai, 400050', 19.0585, 72.8302, '10:00:00', '16:00:00', '+91 22 2640 1234', 'active'),
('b2222222-2222-2222-2222-222222222222', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'HDFC Bank Andheri Branch', 'SV Road, Opposite Andheri Station, Andheri West, Mumbai, 400058', 19.1158, 72.8402, '09:30:00', '16:30:00', '+91 22 6160 6161', 'active'),
('b3333333-3333-3333-3333-333333333333', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'ICICI Bank CST Branch', 'Dr. D.N. Road, Near CST Station, Fort, Mumbai, 400001', 18.9412, 72.8345, '09:30:00', '16:00:00', '+91 22 4000 1200', 'active'),
('b4444444-4444-4444-4444-444444444444', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Axis Bank Powai Branch', 'Central Avenue, Hiranandani Gardens, Powai, Mumbai, 400076', 19.1165, 72.9080, '09:30:00', '16:00:00', '+91 22 6600 8800', 'active'),
('b5555555-5555-5555-5555-555555555555', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Bank of Baroda Dadar Branch', 'NC Kelkar Road, Plaza Cinema Junction, Dadar West, Mumbai, 400028', 19.0182, 72.8465, '10:00:00', '16:00:00', '+91 22 2422 3344', 'active'),
('b6666666-6666-6666-6666-666666666666', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'Kotak Mahindra Bank Juhu Branch', 'Juhu Tara Road, Near Juhu Beach, Juhu, Mumbai, 400049', 19.1030, 72.8262, '09:30:00', '16:30:00', '+91 22 6605 5500', 'active'),
('b7777777-7777-7777-7777-777777777777', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'SBI Colaba Branch', 'Colaba Causeway, Near Regal Cinema, Colaba, Mumbai, 400001', 18.9150, 72.8270, '10:00:00', '16:00:00', '+91 22 2282 1201', 'active'),
('b8888888-8888-8888-8888-888888888888', 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', 'HDFC Bank Worli Branch', 'Dr. Annie Besant Road, Worli, Mumbai, 400018', 19.0020, 72.8180, '09:30:00', '16:30:00', '+91 22 6652 1000', 'active'),

-- Government Services (6 branches)
('31111111-1111-1111-1111-111111111111', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Passport Seva Kendra Andheri', 'Raheja Point, Near Andheri Railway Station, Andheri East, Mumbai, 400069', 19.1170, 72.8680, '09:00:00', '17:00:00', '+91 22 2548 1000', 'active'),
('32222222-2222-2222-2222-222222222222', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'RTO Andheri', 'D-Nagar, SV Road, Near Andheri Sports Complex, Andheri West, Mumbai, 400053', 19.1352, 72.8315, '09:30:00', '17:30:00', '+91 22 2636 6982', 'active'),
('33333333-3333-3333-3333-333333333333', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Wadala RTO Office', 'Truck Terminal Rd, Wadala East, Mumbai, 400037', 19.0225, 72.8590, '09:30:00', '17:30:00', '+91 22 2403 6445', 'active'),
('34444444-4444-4444-4444-344444444444', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Municipal Ward Office K-West', 'Paliram Road, Near Andheri Railway Station, Andheri West, Mumbai, 400058', 19.1152, 72.8425, '09:30:00', '18:00:00', '+91 22 2623 9499', 'active'),
('35555555-5555-5555-5555-355555555555', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Municipal Ward Office H-West', 'St. Martin Road, Bandra West, Mumbai, 400050', 19.0550, 72.8350, '09:30:00', '18:00:00', '+91 22 2642 2311', 'active'),
('36666666-6666-6666-6666-366666666666', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Mumbai GPO Fort', 'Opposite CST Station, Fort, Mumbai, 400001', 18.9398, 72.8365, '09:00:00', '19:00:00', '+91 22 2262 0956', 'active'),

-- Education (4 branches)
('e1111111-1111-1111-1111-111111111111', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'IIT Bombay Academic Section', 'IIT Bombay Campus, Powai, Mumbai, 400076', 19.1334, 72.9156, '09:30:00', '17:30:00', '+91 22 2576 7011', 'active'),
('e2222222-2222-2222-2222-222222222222', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'St. Xavier''s College Office', '5, Mahapalika Marg, Dhobi Talao, Chhatrapati Shivaji Terminus Area, Fort, Mumbai, 400001', 18.9438, 72.8322, '09:00:00', '17:00:00', '+91 22 2262 0661', 'active'),
('e3333333-3333-3333-3333-333333333333', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'NMIMS Student Center', 'V.L. Mehta Road, JVPD Scheme, Vile Parle West, Mumbai, 400056', 19.1035, 72.8370, '09:00:00', '18:00:00', '+91 22 4235 5555', 'active'),
('e4444444-4444-4444-4444-444444444444', 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', 'Mithibai College Administration', 'Bhaktivedanta Swami Marg, JVPD Scheme, Vile Parle West, Mumbai, 400056', 19.1028, 72.8362, '09:00:00', '17:00:00', '+91 22 4233 9000', 'active'),

-- Salons & Beauty (5 branches)
('51111111-1111-1111-1111-111111111111', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'BBlunt Salon Bandra West', 'Waterfield Road, Bandra West, Mumbai, 400050', 19.0605, 72.8258, '10:00:00', '21:00:00', '+91 22 2640 0122', 'active'),
('52222222-2222-2222-2222-522222222222', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'Enrich Salon Andheri West', 'SV Road, Near Andheri Station, Andheri West, Mumbai, 400058', 19.1180, 72.8350, '09:30:00', '20:30:00', '+91 22 2623 3333', 'active'),
('53333333-3333-3333-3333-533333333333', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'Lakme Salon Dadar West', 'NC Kelkar Road, Dadar West, Mumbai, 400028', 19.0195, 72.8440, '10:00:00', '20:00:00', '+91 22 2430 4040', 'active'),
('54444444-4444-4444-4444-544444444444', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'Truefitt & Hill Colaba', 'Regal Cinema Building, Colaba, Mumbai, 400001', 18.9220, 72.8310, '09:00:00', '21:00:00', '+91 22 2282 3333', 'active'),
('55555555-5555-5555-5555-555555555555', 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'BBlunt Juhu', 'Juhu Tara Road, Near Juhu Beach, Juhu, Mumbai, 400049', 19.1012, 72.8250, '10:00:00', '21:00:00', '+91 22 2611 1222', 'active'),

-- Restaurants & Food (6 branches)
('61111111-1111-1111-1111-611111111111', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Cafe Mondegar Colaba', 'Regal Circle, Colaba Causeway, Mumbai, 400001', 18.9230, 72.8315, '08:00:00', '23:30:00', '+91 22 2202 0591', 'active'),
('62222222-2222-2222-2222-622222222222', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Leopold Cafe Colaba', 'Colaba Causeway, Near Police Station, Colaba, Mumbai, 400001', 18.9225, 72.8320, '08:00:00', '23:30:00', '+91 22 2282 8185', 'active'),
('63333333-3333-3333-3333-633333333333', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Britannia & Co. Restaurant', 'Wakefield House, 11 Sprott Rd, Ballard Estate, Fort, Mumbai, 400001', 18.9352, 72.8398, '11:30:00', '16:00:00', '+91 22 2261 5264', 'active'),
('64444444-4444-4444-4444-644444444444', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Bademiya Colaba', 'Tulloch Road, Behind Taj Mahal Palace, Colaba, Mumbai, 400001', 18.9228, 72.8328, '17:00:00', '23:59:59', '+91 22 2284 2915', 'active'),
('65555555-5555-5555-5555-655555555555', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Gajalee Restaurant Vile Parle', 'Hanuman Road, Vile Parle East, Mumbai, 400057', 19.1065, 72.8480, '11:30:00', '23:00:00', '+91 22 2616 6666', 'active'),
('66666666-6666-6666-6666-666666666666', 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', 'Mahesh Lunch Home Juhu', 'Juhu Tara Road, Next to JW Marriott, Juhu, Mumbai, 400049', 19.1015, 72.8285, '11:30:00', '23:30:00', '+91 22 2618 3263', 'active'),

-- Retail & Stores (5 branches)
('70111111-1111-1111-1111-701111111111', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Phoenix Marketcity Kurla', 'LBS Road, Kamani, Kurla West, Mumbai, 400070', 19.0880, 72.8890, '11:00:00', '22:00:00', '+91 22 6180 1100', 'active'),
('70222222-2222-2222-2222-702222222222', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'High Street Phoenix', 'Senapati Bapat Marg, Lower Parel, Mumbai, 400013', 18.9940, 72.8260, '11:00:00', '22:00:00', '+91 22 4333 9999', 'active'),
('70333333-3333-3333-3333-703333333333', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Reliance Smart CST', 'Dr. D.N. Road, Near CST Station, Fort, Mumbai, 400001', 18.9405, 72.8335, '08:00:00', '22:00:00', '+91 22 2261 4455', 'active'),
('70444444-4444-4444-4444-704444444444', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Croma Andheri West', 'Link Road, Near Laxmi Industrial Estate, Andheri West, Mumbai, 400053', 19.1235, 72.8355, '10:00:00', '21:30:00', '+91 22 6761 3000', 'active'),
('70555555-5555-5555-5555-705555555555', 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', 'Nature''s Basket Bandra West', 'Hill Road, Near Elco Market, Bandra West, Mumbai, 400050', 19.0620, 72.8280, '08:00:00', '22:00:00', '+91 22 2642 1200', 'active'),

-- Customer Support (3 branches)
('80111111-1111-1111-1111-801111111111', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'Apple Service Center Bandra', 'Linking Road, Bandra West, Mumbai, 400050', 19.0590, 72.8310, '09:00:00', '18:00:00', '+91 22 6700 9000', 'active'),
('80222222-2222-2222-2222-802222222222', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'Jio Care Center Andheri East', 'Mathuradas Vasanji Road, Andheri East, Mumbai, 400069', 19.1145, 72.8690, '09:00:00', '18:00:00', '+91 1800 889 9999', 'active'),
('80333333-3333-3333-3333-803333333333', 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', 'Airtel Service Hub Dadar', 'Gokhale Road, Dadar West, Mumbai, 400028', 19.0210, 72.8450, '09:30:00', '18:30:00', '+91 98920 12345', 'active'),

-- Automotive (3 branches)
('a1111111-1111-1111-1111-111111111111', 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', 'Linkway Honda Service Andheri', 'Saki Vihar Road, Near Saki Naka, Andheri East, Mumbai, 400072', 19.1210, 72.8550, '08:30:00', '18:30:00', '+91 22 6677 8899', 'active'),
('a2222222-2222-2222-2222-222222222222', 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', 'Tata Motors Service Worli', 'Senapati Bapat Marg, Worli, Mumbai, 400018', 19.0130, 72.8200, '08:00:00', '18:00:00', '+91 22 6656 1234', 'active'),
('a3333333-3333-3333-3333-333333333333', 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', 'Maruti Suzuki Service Chembur', 'Sion Trombay Road, Chembur, Mumbai, 400071', 19.0610, 72.8990, '08:00:00', '19:00:00', '+91 22 2520 9000', 'active'),

-- Real Estate (3 branches)
('ae111111-1111-1111-1111-ae1111111111', 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', 'Lodha Group Office Kanjurmarg', 'LBS Road, Near Kanjurmarg Station, Kanjurmarg West, Mumbai, 400078', 19.1265, 72.9370, '09:00:00', '18:00:00', '+91 22 6133 5000', 'active'),
('ae222222-2222-2222-2222-ae2222222222', 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', 'Rustomjee Sales Center Bandra', 'Bandra Kurla Complex, G Block, Bandra East, Mumbai, 400051', 19.0545, 72.8325, '09:30:00', '18:30:00', '+91 22 6111 6111', 'active'),
('ae333333-3333-3333-3333-ae3333333333', 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', 'Godrej Properties Chembur', 'Eastern Express Highway, Chembur East, Mumbai, 400071', 19.0580, 72.9020, '09:00:00', '18:00:00', '+91 22 6147 6200', 'active'),

-- Fitness & Gym (3 branches)
('f1111111-1111-1111-1111-111111111111', 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', 'Gold''s Gym Bandra West', 'Linking Road, Above KFC, Bandra West, Mumbai, 400050', 19.0615, 72.8290, '06:00:00', '22:00:00', '+91 22 6699 9999', 'active'),
('f2222222-2222-2222-2222-222222222222', 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', 'Nitrro Wellness Breach Candy', 'Bhulabhai Desai Road, Breach Candy, Mumbai, 400026', 19.0745, 72.8050, '05:30:00', '23:00:00', '+91 22 2368 4444', 'active'),
('f3333333-3333-3333-3333-333333333333', 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', 'Talwalkars Gym Andheri', 'SV Road, Next to Railway Station, Andheri West, Mumbai, 400058', 19.1175, 72.8385, '06:00:00', '22:00:00', '+91 22 2623 4455', 'active'),

-- Travel & Transport (3 branches)
('d1111111-1111-1111-1111-d11111111111', 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', 'CSM Airport T2 Info Desk', 'Sahar Road, Near International Terminal, Andheri East, Mumbai, 400099', 19.0896, 72.8656, '00:00:00', '23:59:59', '+91 22 6685 1010', 'active'),
('d2222222-2222-2222-2222-d22222222222', 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', 'Bandra Terminus Enquiry', 'Bandra East Railway Colony, Bandra East, Mumbai, 400051', 19.0625, 72.8445, '00:00:00', '23:59:59', '+91 22 2644 5566', 'active'),
('d3333333-3333-3333-3333-d33333333333', 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', 'Mumbai Central Enquiry', 'Mumbai Central Railway Station, Mumbai Central, Mumbai, 400008', 18.9695, 72.8194, '00:00:00', '23:59:59', '+91 22 2307 3566', 'active')
on conflict (id) do update set
  category_id = excluded.category_id,
  address = excluded.address,
  latitude = excluded.latitude,
  longitude = excluded.longitude,
  opening_time = excluded.opening_time,
  closing_time = excluded.closing_time,
  contact_number = excluded.contact_number,
  status = excluded.status;

-- 5. Seed Services for new branches to keep it functional (Hex-valid UUIDs)
insert into public.services (id, branch_id, name, prefix, avg_service_time, status) values
('10000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'Emergency Care', 'ER', 12, 'active'),
('10000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Outpatient Consultation', 'OP', 20, 'active'),
('10000000-0000-0000-0000-000000000003', '12222222-2222-2222-2222-222222222222', 'General Consultation', 'GC', 15, 'active'),
('10000000-0000-0000-0000-000000000004', '13333333-3333-3333-3333-333333333333', 'Quick Checkup', 'QC', 10, 'active'),
('10000000-0000-0000-0000-000000000005', 'b1111111-1111-1111-1111-111111111111', 'Cashier & Deposits', 'CS', 8, 'active'),
('10000000-0000-0000-0000-000000000006', 'b1111111-1111-1111-1111-111111111111', 'Loans & Accounts', 'LN', 25, 'active'),
('10000000-0000-0000-0000-000000000007', 'b2222222-2222-2222-2222-222222222222', 'General Enquiry', 'GE', 10, 'active'),
('10000000-0000-0000-0000-000000000008', '31111111-1111-1111-1111-111111111111', 'New Applications', 'NA', 30, 'active'),
('10000000-0000-0000-0000-000000000009', '31111111-1111-1111-1111-111111111111', 'Passport Renewal', 'RN', 15, 'active'),
('10000000-0000-0000-0000-000000000010', '32222222-2222-2222-2222-222222222222', 'License Registration', 'LR', 20, 'active'),
('10000000-0000-0000-0000-000000000011', '51111111-1111-1111-1111-111111111111', 'Haircut & Styling', 'HC', 25, 'active'),
('10000000-0000-0000-0000-000000000012', '52222222-2222-2222-2222-522222222222', 'Spa Services', 'SP', 45, 'active'),
('10000000-0000-0000-0000-000000000013', '61111111-1111-1111-1111-611111111111', 'Dine-In Queue', 'DI', 15, 'active'),
('10000000-0000-0000-0000-000000000014', '61111111-1111-1111-1111-611111111111', 'Takeaway Queue', 'TA', 8, 'active')
on conflict (id) do update set
  name = excluded.name,
  prefix = excluded.prefix,
  avg_service_time = excluded.avg_service_time,
  status = excluded.status;

-- 6. Add Counters for new branches (Hex-valid UUIDs)
insert into public.counters (id, branch_id, name, number, status) values
('20000000-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'ER Counter 1', 1, 'open'),
('20000000-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'OP Counter 2', 2, 'open'),
('20000000-0000-0000-0000-000000000003', 'b1111111-1111-1111-1111-111111111111', 'Teller Counter 1', 1, 'open'),
('20000000-0000-0000-0000-000000000004', '31111111-1111-1111-1111-111111111111', 'Desk 1', 1, 'open'),
('20000000-0000-0000-0000-000000000005', '51111111-1111-1111-1111-111111111111', 'Stylist Chair 1', 1, 'open'),
('20000000-0000-0000-0000-000000000006', '61111111-1111-1111-1111-611111111111', 'Reception Desk 1', 1, 'open')
on conflict (id) do update set
  status = excluded.status,
  name = excluded.name;
