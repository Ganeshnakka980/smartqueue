import { supabase } from './supabase'

// ==========================================================
// MOCK DATA FALLBACKS (If database is not migrated yet)
// ==========================================================

export const MOCK_CATEGORIES = [
  { id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Healthcare', icon: '🏥' },
  { id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Banking', icon: '🏦' },
  { id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Government Services', icon: '🏢' },
  { id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: 'Education', icon: '🎓' },
  { id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Salons & Beauty', icon: '💇' },
  { id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Restaurants & Food', icon: '🍽️' },
  { id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Retail & Stores', icon: '🛒' },
  { id: 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', name: 'Customer Support', icon: '🎧' },
  { id: 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', name: 'Automotive', icon: '🚗' },
  { id: 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', name: 'Real Estate', icon: '🏠' },
  { id: 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', name: 'Fitness & Gym', icon: '💪' },
  { id: 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', name: 'Travel & Transport', icon: '✈️' }
]

export const MOCK_BRANCHES = [
  // Healthcare (10 branches)
  { id: 'h1111111-1111-1111-1111-111111111111', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'City General Hospital', address: '415 1st Ave, New York, NY 10010', latitude: 40.7384, longitude: -73.9785, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+1 212-555-0101', status: 'active' },
  { id: 'h2222222-2222-2222-2222-222222222222', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Apollo Health Center', address: '125 W 72nd St, New York, NY 10023', latitude: 40.7785, longitude: -73.9812, opening_time: '08:00:00', closing_time: '20:00:00', contact_number: '+1 212-555-0102', status: 'active' },
  { id: 'h3333333-3333-3333-3333-333333333333', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Medicare Clinic', address: '542 E 12th St, New York, NY 10009', latitude: 40.7291, longitude: -73.9818, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+1 212-555-0103', status: 'active' },
  { id: 'h4444444-4444-4444-4444-444444444444', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Sunrise Hospital', address: '1000 10th Ave, New York, NY 10019', latitude: 40.7698, longitude: -73.9892, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+1 212-555-0104', status: 'active' },
  { id: 'h5555555-5555-5555-5555-555555555555', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Hope Medical Center', address: '225 E 64th St, New York, NY 10021', latitude: 40.7635, longitude: -73.9632, opening_time: '08:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0105', status: 'active' },
  { id: 'h6666666-6666-6666-6666-666666666666', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Bellevue Hospital Center', address: '462 1st Ave, New York, NY 10016', latitude: 40.7390, longitude: -73.9760, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+1 212-555-0106', status: 'active' },
  { id: 'h7777777-7777-7777-7777-777777777777', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Mount Sinai Hospital', address: '1468 Madison Ave, New York, NY 10029', latitude: 40.7899, longitude: -73.9525, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+1 212-555-0107', status: 'active' },
  { id: 'h8888888-8888-8888-8888-888888888888', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'NewYork-Presbyterian Hospital', address: '525 E 68th St, New York, NY 10065', latitude: 40.7644, longitude: -73.9542, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+1 212-555-0108', status: 'active' },
  { id: 'h9999999-9999-9999-9999-999999999999', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Lenox Hill Hospital', address: '100 E 77th St, New York, NY 10075', latitude: 40.7735, longitude: -73.9599, opening_time: '07:30:00', closing_time: '21:00:00', contact_number: '+1 212-555-0109', status: 'active' },
  { id: 'haaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'NYU Langone Health', address: '550 1st Ave, New York, NY 10016', latitude: 40.7425, longitude: -73.9740, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+1 212-555-0110', status: 'active' },

  // Banking (8 branches)
  { id: 'b1111111-1111-1111-1111-111111111111', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'SBI Main Branch', address: '11 Wall St, New York, NY 10005', latitude: 40.7069, longitude: -74.0112, opening_time: '09:30:00', closing_time: '16:00:00', contact_number: '+1 212-555-0201', status: 'active' },
  { id: 'b2222222-2222-2222-2222-222222222222', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'HDFC Downtown Branch', address: '420 Lexington Ave, New York, NY 10170', latitude: 40.7518, longitude: -73.9754, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0202', status: 'active' },
  { id: 'b3333333-3333-3333-3333-333333333333', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'ICICI Central Branch', address: '350 5th Ave, New York, NY 10118', latitude: 40.7484, longitude: -73.9857, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0203', status: 'active' },
  { id: 'b4444444-4444-4444-4444-444444444444', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Axis Bank City Branch', address: '1568 Broadway, New York, NY 10036', latitude: 40.7590, longitude: -73.9844, opening_time: '09:00:00', closing_time: '16:30:00', contact_number: '+1 212-555-0204', status: 'active' },
  { id: 'b5555555-5555-5555-5555-555555555555', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Chase Bank Wall St', address: '26 Wall St, New York, NY 10005', latitude: 40.7073, longitude: -74.0105, opening_time: '08:30:00', closing_time: '17:00:00', contact_number: '+1 212-555-0205', status: 'active' },
  { id: 'b6666666-6666-6666-6666-666666666666', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Bank of America Times Square', address: '1133 Avenue of the Americas, NY 10036', latitude: 40.7565, longitude: -73.9829, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+1 212-555-0206', status: 'active' },
  { id: 'b7777777-7777-7777-7777-777777777777', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Citibank Union Square', address: '14 Union Square S, New York, NY 10003', latitude: 40.7342, longitude: -73.9902, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0207', status: 'active' },
  { id: 'b8888888-8888-8888-8888-888888888888', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Wells Fargo Grand Central', address: '60 E 42nd St, New York, NY 10165', latitude: 40.7523, longitude: -73.9782, opening_time: '08:30:00', closing_time: '17:00:00', contact_number: '+1 212-555-0208', status: 'active' },

  // Government Services (6 branches)
  { id: 'g1111111-1111-1111-1111-111111111111', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Passport Office', address: '376 Hudson St, New York, NY 10014', latitude: 40.7289, longitude: -74.0069, opening_time: '08:00:00', closing_time: '15:30:00', contact_number: '+1 212-555-0301', status: 'active' },
  { id: 'g2222222-2222-2222-2222-222222222222', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'RTO Office', address: '145 Hester St, New York, NY 10002', latitude: 40.7171, longitude: -73.9959, opening_time: '08:30:00', closing_time: '16:00:00', contact_number: '+1 212-555-0302', status: 'active' },
  { id: 'g3333333-3333-3333-3333-333333333333', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Aadhaar Center', address: '109 W 125th St, New York, NY 10027', latitude: 40.8089, longitude: -73.9482, opening_time: '09:00:00', closing_time: '17:30:00', contact_number: '+1 212-555-0303', status: 'active' },
  { id: 'g4444444-4444-4444-4444-444444444444', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Municipal Service Center', address: '1 Centre St, New York, NY 10007', latitude: 40.7126, longitude: -74.0031, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0304', status: 'active' },
  { id: 'g5555555-5555-5555-5555-555555555555', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Social Security Administration', address: '123 William St, New York, NY 10038', latitude: 40.7090, longitude: -74.0070, opening_time: '09:00:00', closing_time: '16:00:00', contact_number: '+1 212-555-0305', status: 'active' },
  { id: 'g6666666-6666-6666-6666-666666666666', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'DMV Express Manhattan', address: '145 W 30th St, New York, NY 10001', latitude: 40.7483, longitude: -73.9908, opening_time: '08:00:00', closing_time: '16:30:00', contact_number: '+1 212-555-0306', status: 'active' },

  // Education (4 branches)
  { id: 'e1111111-1111-1111-1111-111111111111', category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: 'Columbia Admissions Office', address: '210 Kent Hall, New York, NY 10027', latitude: 40.8066, longitude: -73.9622, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0401', status: 'active' },
  { id: 'e2222222-2222-2222-2222-222222222222', category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: 'NYU Student Services Center', address: '383 Lafayette St, New York, NY 10003', latitude: 40.7295, longitude: -73.9928, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0402', status: 'active' },
  { id: 'e3333333-3333-3333-3333-333333333333', category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: 'Fordham Admissions Center', address: '113 W 60th St, New York, NY 10023', latitude: 40.7695, longitude: -73.9840, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0403', status: 'active' },
  { id: 'e4444444-4444-4444-4444-444444444444', category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: 'CUNY Welcome Center', address: '217 E 42nd St, New York, NY 10017', latitude: 40.7505, longitude: -73.9745, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0404', status: 'active' },

  // Salons & Beauty (5 branches)
  { id: 's1111111-1111-1111-1111-111111111111', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Looks Salon', address: '347 Fifth Ave, New York, NY 10016', latitude: 40.7482, longitude: -73.9842, opening_time: '10:00:00', closing_time: '20:00:00', contact_number: '+1 212-555-0501', status: 'active' },
  { id: 's2222222-2222-2222-2222-222222222222', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Naturals Salon', address: '85 Mercer St, New York, NY 10012', latitude: 40.7224, longitude: -74.0002, opening_time: '10:00:00', closing_time: '20:30:00', contact_number: '+1 212-555-0502', status: 'active' },
  { id: 's3333333-3333-3333-3333-333333333333', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Green Trends', address: '224 W 4th St, New York, NY 10014', latitude: 40.7341, longitude: -74.0026, opening_time: '09:30:00', closing_time: '20:00:00', contact_number: '+1 212-555-0503', status: 'active' },
  { id: 's4444444-4444-4444-4444-444444444444', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Urban Beauty Studio', address: '118 E 57th St, New York, NY 10022', latitude: 40.7612, longitude: -73.9702, opening_time: '10:00:00', closing_time: '19:00:00', contact_number: '+1 212-555-0504', status: 'active' },
  { id: 's5555555-5555-5555-5555-555555555555', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Drybar Flatiron', address: '22 W 21st St, New York, NY 10010', latitude: 40.7412, longitude: -73.9915, opening_time: '08:00:00', closing_time: '21:00:00', contact_number: '+1 212-555-0505', status: 'active' },

  // Restaurants & Food (6 branches)
  { id: 'r1111111-1111-1111-1111-111111111111', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Pizza Hub', address: '360 W 42nd St, New York, NY 10036', latitude: 40.7578, longitude: -73.9904, opening_time: '11:00:00', closing_time: '23:00:00', contact_number: '+1 212-555-0601', status: 'active' },
  { id: 'r2222222-2222-2222-2222-222222222222', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Spice Garden', address: '110 Lexington Ave, New York, NY 10016', latitude: 40.7419, longitude: -73.9806, opening_time: '11:30:00', closing_time: '22:30:00', contact_number: '+1 212-555-0602', status: 'active' },
  { id: 'r3333333-3333-3333-3333-333333333333', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Food Junction', address: '143 8th Ave, New York, NY 10011', latitude: 40.7410, longitude: -74.0012, opening_time: '10:00:00', closing_time: '22:00:00', contact_number: '+1 212-555-0603', status: 'active' },
  { id: 'r4444444-4444-4444-4444-444444444444', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Family Restaurant', address: '302 Columbus Ave, New York, NY 10023', latitude: 40.7792, longitude: -73.9781, opening_time: '08:00:00', closing_time: '22:00:00', contact_number: '+1 212-555-0604', status: 'active' },
  { id: 'r5555555-5555-5555-5555-555555555555', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Shake Shack Madison Square', address: 'Madison Square Park, New York, NY 10010', latitude: 40.7415, longitude: -73.9880, opening_time: '11:00:00', closing_time: '22:00:00', contact_number: '+1 212-555-0605', status: 'active' },
  { id: 'r6666666-6666-6666-6666-666666666666', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Katz\'s Delicatessen', address: '205 E Houston St, New York, NY 10002', latitude: 40.7222, longitude: -73.9875, opening_time: '08:00:00', closing_time: '23:00:00', contact_number: '+1 212-555-0606', status: 'active' },

  // Retail & Stores (5 branches)
  { id: 'rt111111-1111-1111-1111-111111111111', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Mega Mart Superstore', address: '400 W 37th St, New York, NY 10018', latitude: 40.7554, longitude: -73.9942, opening_time: '08:00:00', closing_time: '22:00:00', contact_number: '+1 212-555-0701', status: 'active' },
  { id: 'rt222222-2222-2222-2222-222222222222', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Urban Fashion Store', address: '510 Broadway, New York, NY 10012', latitude: 40.7246, longitude: -73.9982, opening_time: '10:00:00', closing_time: '21:00:00', contact_number: '+1 212-555-0702', status: 'active' },
  { id: 'rt333333-3333-3333-3333-333333333333', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Apple Store Fifth Avenue', address: '767 Fifth Ave, New York, NY 10153', latitude: 40.7638, longitude: -73.9729, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+1 212-555-0703', status: 'active' },
  { id: 'rt444444-4444-4444-4444-444444444444', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Macy\'s Herald Square', address: '151 W 34th St, New York, NY 10001', latitude: 40.7508, longitude: -73.9890, opening_time: '10:00:00', closing_time: '21:30:00', contact_number: '+1 212-555-0704', status: 'active' },
  { id: 'rt555555-5555-5555-5555-555555555555', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Best Buy Union Square', address: '529 5th Ave, New York, NY 10003', latitude: 40.7345, longitude: -73.9910, opening_time: '10:00:00', closing_time: '20:00:00', contact_number: '+1 212-555-0705', status: 'active' },

  // Customer Support (3 branches)
  { id: 'cs111111-1111-1111-1111-111111111111', category_id: 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', name: 'Telecom Care Center', address: '83 Maiden Ln, New York, NY 10038', latitude: 40.7076, longitude: -74.0076, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+1 212-555-0801', status: 'active' },
  { id: 'cs222222-2222-2222-2222-222222222222', category_id: 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', name: 'Tech Support Hub', address: '530 5th Ave, New York, NY 10036', latitude: 40.7550, longitude: -73.9805, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+1 212-555-0802', status: 'active' },
  { id: 'cs333333-3333-3333-3333-333333333333', category_id: 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', name: 'Verizon Experience Store', address: '125 W 34th St, New York, NY 10001', latitude: 40.7498, longitude: -73.9882, opening_time: '09:00:00', closing_time: '19:00:00', contact_number: '+1 212-555-0803', status: 'active' },

  // Automotive (3 branches)
  { id: 'a1111111-1111-1111-1111-111111111111', category_id: 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', name: 'City Auto Service', address: '515 W 57th St, New York, NY 10019', latitude: 40.7712, longitude: -73.9920, opening_time: '08:00:00', closing_time: '18:00:00', contact_number: '+1 212-555-0901', status: 'active' },
  { id: 'a2222222-2222-2222-2222-222222222222', category_id: 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', name: 'Tesla Chelsea Service', address: '511 W 25th St, New York, NY 10001', latitude: 40.7495, longitude: -74.0042, opening_time: '08:00:00', closing_time: '17:00:00', contact_number: '+1 212-555-0902', status: 'active' },
  { id: 'a3333333-3333-3333-3333-333333333333', category_id: 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', name: 'Toyota Manhattan Service', address: '640 W 57th St, New York, NY 10019', latitude: 40.7710, longitude: -73.9930, opening_time: '07:30:00', closing_time: '18:00:00', contact_number: '+1 212-555-0903', status: 'active' },

  // Real Estate (3 branches)
  { id: 're111111-1111-1111-1111-111111111111', category_id: 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', name: 'Prime Realty Center', address: '450 Park Ave, New York, NY 10022', latitude: 40.7618, longitude: -73.9718, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+1 212-555-1001', status: 'active' },
  { id: 're222222-2222-2222-2222-222222222222', category_id: 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', name: 'Compass Real Estate Chelsea', address: '90 5th Ave, New York, NY 10011', latitude: 40.7368, longitude: -73.9938, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+1 212-555-1002', status: 'active' },
  { id: 're333333-3333-3333-3333-333333333333', category_id: 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', name: 'Douglas Elliman Flatiron', address: '936 Broadway, New York, NY 10010', latitude: 40.7401, longitude: -73.9897, opening_time: '09:00:00', closing_time: '18:05:00', contact_number: '+1 212-555-1003', status: 'active' },

  // Fitness & Gym (3 branches)
  { id: 'f1111111-1111-1111-1111-111111111111', category_id: 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', name: 'Elite Fitness Hub', address: '10 Union Sq East, New York, NY 10003', latitude: 40.7348, longitude: -73.9898, opening_time: '06:00:00', closing_time: '22:00:00', contact_number: '+1 212-555-1101', status: 'active' },
  { id: 'f2222222-2222-2222-2222-222222222222', category_id: 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', name: 'Equinox Flatiron', address: '97 5th Ave, New York, NY 10003', latitude: 40.7375, longitude: -73.9922, opening_time: '05:30:00', closing_time: '23:00:00', contact_number: '+1 212-555-1102', status: 'active' },
  { id: 'f3333333-3333-3333-3333-333333333333', category_id: 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', name: 'Crunch Fitness Chelsea', address: '220 W 19th St, New York, NY 10011', latitude: 40.7418, longitude: -73.9985, opening_time: '05:00:00', closing_time: '22:00:00', contact_number: '+1 212-555-1103', status: 'active' },

  // Travel & Transport (3 branches)
  { id: 't1111111-1111-1111-1111-111111111111', category_id: 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', name: 'Grand Central Transit Desk', address: '89 E 42nd St, New York, NY 10017', latitude: 40.7527, longitude: -73.9772, opening_time: '06:00:00', closing_time: '23:00:00', contact_number: '+1 212-555-1201', status: 'active' },
  { id: 't2222222-2222-2222-2222-222222222222', category_id: 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', name: 'Penn Station Customer Desk', address: '351 W 31st St, New York, NY 10001', latitude: 40.7501, longitude: -73.9925, opening_time: '06:00:00', closing_time: '23:59:59', contact_number: '+1 212-555-1202', status: 'active' },
  { id: 't3333333-3333-3333-3333-333333333333', category_id: 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', name: 'Port Authority Transit Desk', address: '625 8th Ave, New York, NY 10018', latitude: 40.7568, longitude: -73.9912, opening_time: '06:00:00', closing_time: '22:30:00', contact_number: '+1 212-555-1203', status: 'active' }
]

export const MOCK_SERVICES = {
  'Healthcare': [
    { id: 's-h-1', name: 'Emergency Care', prefix: 'ER', avg_service_time: 12 },
    { id: 's-h-2', name: 'Outpatient Consultation', prefix: 'OP', avg_service_time: 20 },
    { id: 's-h-3', name: 'Laboratory & Scans', prefix: 'LB', avg_service_time: 15 }
  ],
  'Banking': [
    { id: 's-b-1', name: 'Cashier & Deposits', prefix: 'CS', avg_service_time: 8 },
    { id: 's-b-2', name: 'Loans & Accounts', prefix: 'LN', avg_service_time: 25 },
    { id: 's-b-3', name: 'Cards & Online Banking', prefix: 'CB', avg_service_time: 10 }
  ],
  'Government Services': [
    { id: 's-g-1', name: 'New Applications', prefix: 'NA', avg_service_time: 30 },
    { id: 's-g-2', name: 'Document Renewal', prefix: 'RN', avg_service_time: 15 },
    { id: 's-g-3', name: 'General Inquiries', prefix: 'GI', avg_service_time: 12 }
  ],
  'Salons & Beauty': [
    { id: 's-s-1', name: 'Haircut & Styling', prefix: 'HC', avg_service_time: 25 },
    { id: 's-s-2', name: 'Spa Services', prefix: 'SP', avg_service_time: 45 },
    { id: 's-s-3', name: 'Nails & Make-up', prefix: 'NM', avg_service_time: 30 }
  ],
  'Restaurants & Food': [
    { id: 's-r-1', name: 'Dine-In Queue', prefix: 'DI', avg_service_time: 15 },
    { id: 's-r-2', name: 'Takeaway Queue', prefix: 'TA', avg_service_time: 8 }
  ],
  'Default': [
    { id: 's-d-1', name: 'General Consultation', prefix: 'G', avg_service_time: 15 },
    { id: 's-d-2', name: 'Express Service', prefix: 'E', avg_service_time: 8 }
  ]
}

export const queueService = {
  // ==========================================================
  // CATEGORY, BRANCH & SERVICE APIS
  // ==========================================================

  async getBusinessCategories() {
    try {
      const { data, error } = await supabase
        .from('business_categories')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      if (!data || data.length === 0) return MOCK_CATEGORIES
      return data
    } catch (e) {
      console.warn('Using fallback mock categories:', e.message)
      return MOCK_CATEGORIES
    }
  },

  async getBranches(categoryId = null) {
    try {
      let query = supabase.from('branches').select('*').eq('status', 'active')
      const { data, error } = await query
      if (error) throw error

      if (!data || data.length === 0 || data[0].latitude === undefined) {
        let filtered = MOCK_BRANCHES
        if (categoryId) {
          filtered = filtered.filter(b => b.category_id === categoryId)
        }
        return filtered
      }

      let filteredData = data
      if (categoryId) {
        filteredData = data.filter(b => b.category_id === categoryId)
      }
      return filteredData
    } catch (e) {
      console.warn('Using fallback mock branches:', e.message)
      let filtered = MOCK_BRANCHES
      if (categoryId) {
        filtered = filtered.filter(b => b.category_id === categoryId)
      }
      return filtered
    }
  },

  async getServices(branchId) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('branch_id', branchId)
        .eq('status', 'active')
        .order('name', { ascending: true })
      if (error) throw error

      if (!data || data.length === 0) {
        return this.getMockServicesForBranch(branchId)
      }
      return data
    } catch (e) {
      console.warn('Using fallback mock services:', e.message)
      return this.getMockServicesForBranch(branchId)
    }
  },

  getMockServicesForBranch(branchId) {
    const branch = MOCK_BRANCHES.find(b => b.id === branchId)
    if (!branch) return MOCK_SERVICES['Default']

    const category = MOCK_CATEGORIES.find(c => c.id === branch.category_id)
    if (!category) return MOCK_SERVICES['Default']

    return MOCK_SERVICES[category.name] || MOCK_SERVICES['Default']
  },

  // ==========================================================
  // CUSTOMER APIS
  // ==========================================================

  async joinQueue(branchId, serviceId, userId, priority = 'normal') {
    try {
      const { data, error } = await supabase.rpc('generate_next_token', {
        p_branch_id: branchId,
        p_service_id: serviceId,
        p_priority: priority,
        p_user_id: userId,
      })
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Database joinQueue failed, generating client-side mock token:', error.message)
      
      const mockTokenId = 'mock-' + Math.random().toString(36).substr(2, 9)
      
      const branchObj = MOCK_BRANCHES.find(b => b.id === branchId)
      const branchName = branchObj ? branchObj.name : 'Branch'
      
      const servicesList = this.getMockServicesForBranch(branchId)
      const serviceObj = servicesList.find(s => s.id === serviceId)
      const serviceName = serviceObj ? serviceObj.name : 'Service'
      const prefix = serviceObj ? serviceObj.prefix : 'Q'

      const seq = Math.floor(Math.random() * 20) + 101
      const mockToken = {
        id: mockTokenId,
        branch_id: branchId,
        service_id: serviceId,
        user_id: userId,
        token_number: `${prefix}-${seq}`,
        sequence_number: seq,
        status: 'waiting',
        priority: priority,
        created_at: new Date().toISOString(),
        services: { name: serviceName },
        counters: { name: 'Counter 1', number: 1 }
      }

      localStorage.setItem(`mock_active_token_${userId}`, JSON.stringify(mockToken))
      return mockToken
    }
  },

  async getActiveToken(userId) {
    const localTokenStr = localStorage.getItem(`mock_active_token_${userId}`)
    if (localTokenStr) {
      try {
        return JSON.parse(localTokenStr)
      } catch (e) {
        localStorage.removeItem(`mock_active_token_${userId}`)
      }
    }

    try {
      const { data, error } = await supabase
        .from('queues')
        .select('*, services(name), counters!queues_counter_id_fkey(name, number)')
        .eq('user_id', userId)
        .in('status', ['waiting', 'serving'])
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Active token fetch from DB failed:', error.message)
      return null
    }
  },

  async getTokenHistory(userId) {
    try {
      const { data, error } = await supabase
        .from('queues')
        .select('*, services(name), counters!queues_counter_id_fkey(name, number)')
        .eq('user_id', userId)
        .in('status', ['completed', 'skipped', 'cancelled'])
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    } catch (error) {
      console.warn('Queue history fetch from DB failed:', error.message)
      const mockHistoryStr = localStorage.getItem(`mock_history_${userId}`)
      return mockHistoryStr ? JSON.parse(mockHistoryStr) : []
    }
  },

  async getQueuePosition(tokenId) {
    if (tokenId && tokenId.startsWith('mock-')) {
      return 3
    }
    try {
      const { data, error } = await supabase.rpc('get_queue_position', {
        p_token_id: tokenId,
      })
      if (error) throw error
      return data
    } catch (e) {
      return 3
    }
  },

  async submitFeedback(queueId, userId, rating, comments) {
    if (queueId && queueId.startsWith('mock-')) {
      const mockHistoryStr = localStorage.getItem(`mock_history_${userId}`) || '[]'
      const history = JSON.parse(mockHistoryStr)
      const tokenIndex = history.findIndex(t => t.id === queueId)
      if (tokenIndex > -1) {
        history[tokenIndex].rated = true
        localStorage.setItem(`mock_history_${userId}`, JSON.stringify(history))
      }
      return { id: 'feedback-mock', rating, comments }
    }

    const { data, error } = await supabase
      .from('feedback')
      .insert({
        queue_id: queueId,
        user_id: userId,
        rating,
        comments,
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ==========================================================
  // STAFF APIS
  // ==========================================================

  async getCounters(branchId) {
    const { data, error } = await supabase
      .from('counters')
      .select('*, profiles(full_name)')
      .eq('branch_id', branchId)
      .order('number', { ascending: true })
    if (error) throw error
    return data
  },

  async getStaffCounter(staffId) {
    const { data, error } = await supabase
      .from('counters')
      .select('*')
      .eq('staff_id', staffId)
      .maybeSingle()
    if (error) throw error
    return data
  },

  async assignStaffToCounter(counterId, staffId) {
    const { data, error } = await supabase
      .from('counters')
      .update({
        staff_id: staffId,
        status: 'open',
        updated_at: new Date().toISOString(),
      })
      .eq('id', counterId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async closeCounter(counterId) {
    const { data, error } = await supabase
      .from('counters')
      .update({
        staff_id: null,
        status: 'closed',
        current_token_id: null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', counterId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  async callNextToken(counterId, staffId) {
    const { data, error } = await supabase.rpc('call_next_token', {
      p_counter_id: counterId,
      p_staff_id: staffId,
    })
    if (error) throw error
    return data
  },

  async completeCurrentToken(counterId) {
    const { data, error } = await supabase.rpc('complete_current_token', {
      p_counter_id: counterId,
    })
    if (error) throw error
    return data
  },

  async skipCurrentToken(counterId) {
    const { data, error } = await supabase.rpc('skip_current_token', {
      p_counter_id: counterId,
    })
    if (error) throw error
    return data
  },

  async transferToken(tokenId, targetServiceId) {
    const { data, error } = await supabase.rpc('transfer_token', {
      p_token_id: tokenId,
      p_target_service_id: targetServiceId,
    })
    if (error) throw error
    return data
  },

  async getDailyStats(branchId) {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayStr = today.toISOString()

    try {
      const { data: tokens, error } = await supabase
        .from('queues')
        .select('status, called_at, completed_at, created_at')
        .eq('branch_id', branchId)
        .gte('created_at', todayStr)

      if (error) throw error

      let waiting = 0
      let serving = 0
      let completed = 0
      let skipped = 0
      let totalServiceTime = 0
      let completedCount = 0

      tokens.forEach((t) => {
        if (t.status === 'waiting') waiting++
        else if (t.status === 'serving') serving++
        else if (t.status === 'completed') {
          completed++
          if (t.called_at && t.completed_at) {
            const serviceTime = (new Date(t.completed_at) - new Date(t.called_at)) / 1000 / 60
            totalServiceTime += serviceTime
            completedCount++
          }
        } else if (t.status === 'skipped') skipped++
      })

      const avgServiceTime = completedCount > 0 ? Math.round(totalServiceTime / completedCount) : 0

      return {
        total: tokens.length,
        waiting,
        serving,
        completed,
        skipped,
        avgServiceTime
      }
    } catch (e) {
      return { total: 0, waiting: 0, serving: 0, completed: 0, skipped: 0, avgServiceTime: 0 }
    }
  },

  // ==========================================================
  // APPOINTMENT APIS
  // ==========================================================

  async bookAppointment(userId, branchId, serviceId, appointmentTime) {
    const { data, error } = await supabase
      .from('appointments')
      .insert({
        user_id: userId,
        branch_id: branchId,
        service_id: serviceId,
        appointment_time: appointmentTime,
        status: 'pending',
      })
      .select()
      .single()
    if (error) throw error
    return data
  },

  async getUserAppointments(userId) {
    const { data, error } = await supabase
      .from('appointments')
      .select('*, branches(name), services(name)')
      .eq('user_id', userId)
      .order('appointment_time', { ascending: true })
    if (error) throw error
    return data
  },

  async cancelAppointment(appointmentId) {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status: 'cancelled' })
      .eq('id', appointmentId)
      .select()
      .single()
    if (error) throw error
    return data
  },

  // ==========================================================
  // NOTIFICATION APIS
  // ==========================================================

  async getNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    } catch (e) {
      return []
    }
  },

  async markNotificationRead(notificationId) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId)
      .select()
      .single()
    if (error) throw error
    return data
  },
}

export default queueService
