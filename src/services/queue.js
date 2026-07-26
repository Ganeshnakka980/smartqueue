import { supabase } from './supabase.js'

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
  { id: '11111111-1111-1111-1111-111111111111', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Kokilaben Dhirubhai Ambani Hospital', address: 'Rao Saheb, Achutrao Patwardhan Marg, Four Bungalows, Andheri West, Mumbai, 400053', latitude: 19.1312, longitude: 72.8252, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 4269 6969', status: 'active' },
  { id: '12222222-2222-2222-2222-222222222222', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Lilavati Hospital & Research Centre', address: 'A-791, Bandra Reclamation Rd, KC Marg, Bandra West, Mumbai, 400050', latitude: 19.0514, longitude: 72.8285, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 2675 1000', status: 'active' },
  { id: '13333333-3333-3333-3333-333333333333', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Nanavati Max Super Speciality Hospital', address: 'Swami Vivekananda Rd, LIC Colony, Suresh Colony, Vile Parle West, Mumbai, 400056', latitude: 19.0963, longitude: 72.8378, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 2626 7500', status: 'active' },
  { id: '14444444-4444-4444-4444-444444444444', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Hinduja Hospital', address: 'Veer Savarkar Marg, Mahim West, Mahim, Mumbai, 400016', latitude: 19.0328, longitude: 72.8375, opening_time: '08:00:00', closing_time: '20:00:00', contact_number: '+91 22 2445 1771', status: 'active' },
  { id: '15555555-5555-5555-5555-555555555555', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Tata Memorial Hospital', address: 'Dr. E, Dr Ernest Borges Rd, Parel, Mumbai, 400012', latitude: 19.0049, longitude: 72.8427, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+91 22 2417 7000', status: 'active' },
  { id: '16666666-6666-6666-6666-666666666666', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'SevenHills Hospital', address: 'Marol Maroshi Rd, Shivaji Nagar, Andheri East, Mumbai, 400059', latitude: 19.1215, longitude: 72.8790, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 6767 6767', status: 'active' },
  { id: '17777777-7777-7777-7777-177777777777', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Fortis Hospital Mulund', address: 'Mulund Goregaon Link Rd, Industrial Area, Bhandup West, Mumbai, 400078', latitude: 19.1672, longitude: 72.9553, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 4365 4365', status: 'active' },
  { id: '18888888-8888-8888-8888-188888888888', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Jaslok Hospital', address: '15, Dr Deshmukh Marg, Pedder Rd, Cumballa Hill, Mumbai, 400026', latitude: 18.9723, longitude: 72.8095, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 6657 3333', status: 'active' },
  { id: '19999999-9999-9999-9999-199999999999', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Breach Candy Hospital', address: '60 A, Bhulabhai Desai Marg, Breach Candy, Cumballa Hill, Mumbai, 400026', latitude: 18.9739, longitude: 72.8048, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 2366 7788', status: 'active' },
  { id: '1aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1', name: 'Reliance Foundation Hospital', address: 'Raja Rammohan Roy Rd, Prarthana Samaj, Girgaon, Mumbai, 400004', latitude: 18.9592, longitude: 72.8202, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 3547 5757', status: 'active' },

  // Banking (8 branches)
  { id: 'b1111111-1111-1111-1111-111111111111', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'SBI Bandra Branch', address: 'Turner Road, Near Bandra Station, Bandra West, Mumbai, 400050', latitude: 19.0585, longitude: 72.8302, opening_time: '10:00:00', closing_time: '16:00:00', contact_number: '+91 22 2640 1234', status: 'active' },
  { id: 'b2222222-2222-2222-2222-222222222222', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'HDFC Bank Andheri Branch', address: 'SV Road, Opposite Andheri Station, Andheri West, Mumbai, 400058', latitude: 19.1158, longitude: 72.8402, opening_time: '09:30:00', closing_time: '16:30:00', contact_number: '+91 22 6160 6161', status: 'active' },
  { id: 'b3333333-3333-3333-3333-333333333333', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'ICICI Bank CST Branch', address: 'Dr. D.N. Road, Near CST Station, Fort, Mumbai, 400001', latitude: 18.9412, longitude: 72.8345, opening_time: '09:30:00', closing_time: '16:00:00', contact_number: '+91 22 4000 1200', status: 'active' },
  { id: 'b4444444-4444-4444-4444-444444444444', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Axis Bank Powai Branch', address: 'Central Avenue, Hiranandani Gardens, Powai, Mumbai, 400076', latitude: 19.1165, longitude: 72.9080, opening_time: '09:30:00', closing_time: '16:00:00', contact_number: '+91 22 6600 8800', status: 'active' },
  { id: 'b5555555-5555-5555-5555-555555555555', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Bank of Baroda Dadar Branch', address: 'NC Kelkar Road, Plaza Cinema Junction, Dadar West, Mumbai, 400028', latitude: 19.0182, longitude: 72.8465, opening_time: '10:00:00', closing_time: '16:00:00', contact_number: '+91 22 2422 3344', status: 'active' },
  { id: 'b6666666-6666-6666-6666-666666666666', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'Kotak Mahindra Bank Juhu Branch', address: 'Juhu Tara Road, Near Juhu Beach, Juhu, Mumbai, 400049', latitude: 19.1030, longitude: 72.8262, opening_time: '09:30:00', closing_time: '16:30:00', contact_number: '+91 22 6605 5500', status: 'active' },
  { id: 'b7777777-7777-7777-7777-777777777777', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'SBI Colaba Branch', address: 'Colaba Causeway, Near Regal Cinema, Colaba, Mumbai, 400001', latitude: 18.9150, longitude: 72.8270, opening_time: '10:00:00', closing_time: '16:00:00', contact_number: '+91 22 2282 1201', status: 'active' },
  { id: 'b8888888-8888-8888-8888-888888888888', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2', name: 'HDFC Bank Worli Branch', address: 'Dr. Annie Besant Road, Worli, Mumbai, 400018', latitude: 19.0020, longitude: 72.8180, opening_time: '09:30:00', closing_time: '16:30:00', contact_number: '+91 22 6652 1000', status: 'active' },

  // Government Services (6 branches)
  { id: '31111111-1111-1111-1111-111111111111', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Passport Seva Kendra Andheri', address: 'Raheja Point, Near Andheri Railway Station, Andheri East, Mumbai, 400069', latitude: 19.1170, longitude: 72.8680, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+91 22 2548 1000', status: 'active' },
  { id: '32222222-2222-2222-2222-222222222222', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'RTO Andheri', address: 'D-Nagar, SV Road, Near Andheri Sports Complex, Andheri West, Mumbai, 400053', latitude: 19.1352, longitude: 72.8315, opening_time: '09:30:00', closing_time: '17:30:00', contact_number: '+91 22 2636 6982', status: 'active' },
  { id: '33333333-3333-3333-3333-333333333333', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Wadala RTO Office', address: 'Truck Terminal Rd, Wadala East, Mumbai, 400037', latitude: 19.0225, longitude: 72.8590, opening_time: '09:30:00', closing_time: '17:30:00', contact_number: '+91 22 2403 6445', status: 'active' },
  { id: '34444444-4444-4444-4444-344444444444', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Municipal Ward Office K-West', address: 'Paliram Road, Near Andheri Railway Station, Andheri West, Mumbai, 400058', latitude: 19.1152, longitude: 72.8425, opening_time: '09:30:00', closing_time: '18:00:00', contact_number: '+91 22 2623 9499', status: 'active' },
  { id: '35555555-5555-5555-5555-355555555555', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Municipal Ward Office H-West', address: 'St. Martin Road, Bandra West, Mumbai, 400050', latitude: 19.0550, longitude: 72.8350, opening_time: '09:30:00', closing_time: '18:00:00', contact_number: '+91 22 2642 2311', status: 'active' },
  { id: '36666666-6666-6666-6666-366666666666', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', name: 'Mumbai GPO Fort', address: 'Opposite CST Station, Fort, Mumbai, 400001', latitude: 18.9398, longitude: 72.8365, opening_time: '09:00:00', closing_time: '19:00:00', contact_number: '+91 22 2262 0956', status: 'active' },

  // Education (4 branches)
  { id: 'e1111111-1111-1111-1111-111111111111', category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: 'IIT Bombay Academic Section', address: 'IIT Bombay Campus, Powai, Mumbai, 400076', latitude: 19.1334, longitude: 72.9156, opening_time: '09:30:00', closing_time: '17:30:00', contact_number: '+91 22 2576 7011', status: 'active' },
  { id: 'e2222222-2222-2222-2222-222222222222', category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: "St. Xavier's College Office", address: '5, Mahapalika Marg, Dhobi Talao, Chhatrapati Shivaji Terminus Area, Fort, Mumbai, 400001', latitude: 18.9438, longitude: 72.8322, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+91 22 2262 0661', status: 'active' },
  { id: 'e3333333-3333-3333-3333-333333333333', category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: 'NMIMS Student Center', address: 'V.L. Mehta Road, JVPD Scheme, Vile Parle West, Mumbai, 400056', latitude: 19.1035, longitude: 72.8370, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+91 22 4235 5555', status: 'active' },
  { id: 'e4444444-4444-4444-4444-444444444444', category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4', name: 'Mithibai College Administration', address: 'Bhaktivedanta Swami Marg, JVPD Scheme, Vile Parle West, Mumbai, 400056', latitude: 19.1028, longitude: 72.8362, opening_time: '09:00:00', closing_time: '17:00:00', contact_number: '+91 22 4233 9000', status: 'active' },

  // Salons & Beauty (5 branches)
  { id: '51111111-1111-1111-1111-111111111111', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'BBlunt Salon Bandra West', address: 'Waterfield Road, Bandra West, Mumbai, 400050', latitude: 19.0605, longitude: 72.8258, opening_time: '10:00:00', closing_time: '21:00:00', contact_number: '+91 22 2640 0122', status: 'active' },
  { id: '52222222-2222-2222-2222-522222222222', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Enrich Salon Andheri West', address: 'SV Road, Near Andheri Station, Andheri West, Mumbai, 400058', latitude: 19.1180, longitude: 72.8350, opening_time: '09:30:00', closing_time: '20:30:00', contact_number: '+91 22 2623 3333', status: 'active' },
  { id: '53333333-3333-3333-3333-533333333333', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Lakme Salon Dadar West', address: 'NC Kelkar Road, Dadar West, Mumbai, 400028', latitude: 19.0195, longitude: 72.8440, opening_time: '10:00:00', closing_time: '20:00:00', contact_number: '+91 22 2430 4040', status: 'active' },
  { id: '54444444-4444-4444-4444-544444444444', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'Truefitt & Hill Colaba', address: 'Regal Cinema Building, Colaba, Mumbai, 400001', latitude: 18.9220, longitude: 72.8310, opening_time: '09:00:00', closing_time: '21:00:00', contact_number: '+91 22 2282 3333', status: 'active' },
  { id: '55555555-5555-5555-5555-555555555555', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', name: 'BBlunt Juhu', address: 'Juhu Tara Road, Near Juhu Beach, Juhu, Mumbai, 400049', latitude: 19.1012, longitude: 72.8250, opening_time: '10:00:00', closing_time: '21:00:00', contact_number: '+91 22 2611 1222', status: 'active' },

  // Restaurants & Food (6 branches)
  { id: '61111111-1111-1111-1111-611111111111', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Cafe Mondegar Colaba', address: 'Regal Circle, Colaba Causeway, Mumbai, 400001', latitude: 18.9230, longitude: 72.8315, opening_time: '08:00:00', closing_time: '23:30:00', contact_number: '+91 22 2202 0591', status: 'active' },
  { id: '62222222-2222-2222-2222-622222222222', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Leopold Cafe Colaba', address: 'Colaba Causeway, Near Police Station, Colaba, Mumbai, 400001', latitude: 18.9225, longitude: 72.8320, opening_time: '08:00:00', closing_time: '23:30:00', contact_number: '+91 22 2282 8185', status: 'active' },
  { id: '63333333-3333-3333-3333-633333333333', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Britannia & Co. Restaurant', address: 'Wakefield House, 11 Sprott Rd, Ballard Estate, Fort, Mumbai, 400001', latitude: 18.9352, longitude: 72.8398, opening_time: '11:30:00', closing_time: '16:00:00', contact_number: '+91 22 2261 5264', status: 'active' },
  { id: '64444444-4444-4444-4444-644444444444', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Bademiya Colaba', address: 'Tulloch Road, Behind Taj Mahal Palace, Colaba, Mumbai, 400001', latitude: 18.9228, longitude: 72.8328, opening_time: '17:00:00', closing_time: '23:59:59', contact_number: '+91 22 2284 2915', status: 'active' },
  { id: '65555555-5555-5555-5555-655555555555', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Gajalee Restaurant Vile Parle', address: 'Hanuman Road, Vile Parle East, Mumbai, 400057', latitude: 19.1065, longitude: 72.8480, opening_time: '11:30:00', closing_time: '23:00:00', contact_number: '+91 22 2616 6666', status: 'active' },
  { id: '66666666-6666-6666-6666-666666666666', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6', name: 'Mahesh Lunch Home Juhu', address: 'Juhu Tara Road, Next to JW Marriott, Juhu, Mumbai, 400049', latitude: 19.1015, longitude: 72.8285, opening_time: '11:30:00', closing_time: '23:30:00', contact_number: '+91 22 2618 3263', status: 'active' },

  // Retail & Stores (5 branches)
  { id: '70111111-1111-1111-1111-701111111111', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Phoenix Marketcity Kurla', address: 'LBS Road, Kamani, Kurla West, Mumbai, 400070', latitude: 19.0880, longitude: 72.8890, opening_time: '11:00:00', closing_time: '22:00:00', contact_number: '+91 22 6180 1100', status: 'active' },
  { id: '70222222-2222-2222-2222-702222222222', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'High Street Phoenix', address: 'Senapati Bapat Marg, Lower Parel, Mumbai, 400013', latitude: 18.9940, longitude: 72.8260, opening_time: '11:00:00', closing_time: '22:00:00', contact_number: '+91 22 4333 9999', status: 'active' },
  { id: '70333333-3333-3333-3333-703333333333', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Reliance Smart CST', address: 'Dr. D.N. Road, Near CST Station, Fort, Mumbai, 400001', latitude: 18.9405, longitude: 72.8335, opening_time: '08:00:00', closing_time: '22:00:00', contact_number: '+91 22 2261 4455', status: 'active' },
  { id: '70444444-4444-4444-4444-704444444444', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: 'Croma Andheri West', address: 'Link Road, Near Laxmi Industrial Estate, Andheri West, Mumbai, 400053', latitude: 19.1235, longitude: 72.8355, opening_time: '10:00:00', closing_time: '21:30:00', contact_number: '+91 22 6761 3000', status: 'active' },
  { id: '70555555-5555-5555-5555-705555555555', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7', name: "Nature's Basket Bandra West", address: 'Hill Road, Near Elco Market, Bandra West, Mumbai, 400050', latitude: 19.0620, longitude: 72.8280, opening_time: '08:00:00', closing_time: '22:00:00', contact_number: '+91 22 2642 1200', status: 'active' },

  // Customer Support (3 branches)
  { id: '80111111-1111-1111-1111-801111111111', category_id: 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', name: 'Apple Service Center Bandra', address: 'Linking Road, Bandra West, Mumbai, 400050', latitude: 19.0590, longitude: 72.8310, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+91 22 6700 9000', status: 'active' },
  { id: '80222222-2222-2222-2222-802222222222', category_id: 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', name: 'Jio Care Center Andheri East', address: 'Mathuradas Vasanji Road, Andheri East, Mumbai, 400069', latitude: 19.1145, longitude: 72.8690, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+91 1800 889 9999', status: 'active' },
  { id: '80333333-3333-3333-3333-803333333333', category_id: 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8', name: 'Airtel Service Hub Dadar', address: 'Gokhale Road, Dadar West, Mumbai, 400028', latitude: 19.0210, longitude: 72.8450, opening_time: '09:30:00', closing_time: '18:30:00', contact_number: '+91 98920 12345', status: 'active' },

  // Automotive (3 branches)
  { id: 'a1111111-1111-1111-1111-111111111111', category_id: 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', name: 'Linkway Honda Service Andheri', address: 'Saki Vihar Road, Near Saki Naka, Andheri East, Mumbai, 400072', latitude: 19.1210, longitude: 72.8550, opening_time: '08:30:00', closing_time: '18:30:00', contact_number: '+91 22 6677 8899', status: 'active' },
  { id: 'a2222222-2222-2222-2222-222222222222', category_id: 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', name: 'Tata Motors Service Worli', address: 'Senapati Bapat Marg, Worli, Mumbai, 400018', latitude: 19.0130, longitude: 72.8200, opening_time: '08:00:00', closing_time: '18:00:00', contact_number: '+91 22 6656 1234', status: 'active' },
  { id: 'a3333333-3333-3333-3333-333333333333', category_id: 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9', name: 'Maruti Suzuki Service Chembur', address: 'Sion Trombay Road, Chembur, Mumbai, 400071', latitude: 19.0610, longitude: 72.8990, opening_time: '08:00:00', closing_time: '19:00:00', contact_number: '+91 22 2520 9000', status: 'active' },

  // Real Estate (3 branches)
  { id: 'ae111111-1111-1111-1111-ae1111111111', category_id: 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', name: 'Lodha Group Office Kanjurmarg', address: 'LBS Road, Near Kanjurmarg Station, Kanjurmarg West, Mumbai, 400078', latitude: 19.1265, longitude: 72.9370, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+91 22 6133 5000', status: 'active' },
  { id: 'ae222222-2222-2222-2222-ae2222222222', category_id: 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', name: 'Rustomjee Sales Center Bandra', address: 'Bandra Kurla Complex, G Block, Bandra East, Mumbai, 400051', latitude: 19.0545, longitude: 72.8325, opening_time: '09:30:00', closing_time: '18:30:00', contact_number: '+91 22 6111 6111', status: 'active' },
  { id: 'ae333333-3333-3333-3333-ae3333333333', category_id: 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1', name: 'Godrej Properties Chembur', address: 'Eastern Express Highway, Chembur East, Mumbai, 400071', latitude: 19.0580, longitude: 72.9020, opening_time: '09:00:00', closing_time: '18:00:00', contact_number: '+91 22 6147 6200', status: 'active' },

  // Fitness & Gym (3 branches)
  { id: 'f1111111-1111-1111-1111-111111111111', category_id: 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', name: "Gold's Gym Bandra West", address: 'Linking Road, Above KFC, Bandra West, Mumbai, 400050', latitude: 19.0615, longitude: 72.8290, opening_time: '06:00:00', closing_time: '22:00:00', contact_number: '+91 22 6699 9999', status: 'active' },
  { id: 'f2222222-2222-2222-2222-222222222222', category_id: 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', name: 'Nitrro Wellness Breach Candy', address: 'Bhulabhai Desai Road, Breach Candy, Mumbai, 400026', latitude: 19.0745, longitude: 72.050, opening_time: '05:30:00', closing_time: '23:00:00', contact_number: '+91 22 2368 4444', status: 'active' },
  { id: 'f3333333-3333-3333-3333-333333333333', category_id: 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1', name: 'Talwalkars Gym Andheri', address: 'SV Road, Next to Railway Station, Andheri West, Mumbai, 400058', latitude: 19.1175, longitude: 72.8385, opening_time: '06:00:00', closing_time: '22:00:00', contact_number: '+91 22 2623 4455', status: 'active' },

  // Travel & Transport (3 branches)
  { id: 'd1111111-1111-1111-1111-d111111111111', category_id: 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', name: 'CSM Airport T2 Info Desk', address: 'Sahar Road, Near International Terminal, Andheri East, Mumbai, 400099', latitude: 19.0896, longitude: 72.8656, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 6685 1010', status: 'active' },
  { id: 'd2222222-2222-2222-2222-d22222222222', category_id: 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', name: 'Bandra Terminus Enquiry', address: 'Bandra East Railway Colony, Bandra East, Mumbai, 400051', latitude: 19.0625, longitude: 72.8445, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 2644 5566', status: 'active' },
  { id: 'd3333333-3333-3333-3333-d33333333333', category_id: 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1', name: 'Mumbai Central Enquiry', address: 'Mumbai Central Railway Station, Mumbai Central, Mumbai, 400008', latitude: 18.9695, longitude: 72.8194, opening_time: '00:00:00', closing_time: '23:59:59', contact_number: '+91 22 2307 3566', status: 'active' }
]

export const MOCK_SERVICES = {
  'Healthcare': [
    { id: '10000000-0000-0000-0000-000000000001', name: 'Emergency Care', prefix: 'ER', avg_service_time: 12 },
    { id: '10000000-0000-0000-0000-000000000002', name: 'Outpatient Consultation', prefix: 'OP', avg_service_time: 20 },
    { id: '10000000-0000-0000-0000-000000000003', name: 'Laboratory & Scans', prefix: 'LB', avg_service_time: 15 }
  ],
  'Banking': [
    { id: '10000000-0000-0000-0000-000000000005', name: 'Cashier & Deposits', prefix: 'CS', avg_service_time: 8 },
    { id: '10000000-0000-0000-0000-000000000006', name: 'Loans & Accounts', prefix: 'LN', avg_service_time: 25 },
    { id: '10000000-0000-0000-0000-000000000007', name: 'Cards & Online Banking', prefix: 'CB', avg_service_time: 10 }
  ],
  'Government Services': [
    { id: '10000000-0000-0000-0000-000000000008', name: 'New Applications', prefix: 'NA', avg_service_time: 30 },
    { id: '10000000-0000-0000-0000-000000000009', name: 'Document Renewal', prefix: 'RN', avg_service_time: 15 },
    { id: '10000000-0000-0000-0000-000000000022', name: 'General Inquiries', prefix: 'GI', avg_service_time: 12 }
  ],
  'Salons & Beauty': [
    { id: '10000000-0000-0000-0000-000000000011', name: 'Haircut & Styling', prefix: 'HC', avg_service_time: 25 },
    { id: '10000000-0000-0000-0000-000000000012', name: 'Spa Services', prefix: 'SP', avg_service_time: 45 },
    { id: '10000000-0000-0000-0000-000000000023', name: 'Nails & Make-up', prefix: 'NM', avg_service_time: 30 }
  ],
  'Restaurants & Food': [
    { id: '10000000-0000-0000-0000-000000000013', name: 'Dine-In Queue', prefix: 'DI', avg_service_time: 15 },
    { id: '10000000-0000-0000-0000-000000000014', name: 'Takeaway Queue', prefix: 'TA', avg_service_time: 8 }
  ],
  'Default': [
    { id: '10000000-0000-0000-0000-000000000024', name: 'General Consultation', prefix: 'G', avg_service_time: 15 },
    { id: '10000000-0000-0000-0000-000000000025', name: 'Express Service', prefix: 'E', avg_service_time: 8 }
  ]
}

export const MOCK_ORGANIZATIONS = [
  { id: '01111111-1111-1111-1111-111111111111', name: 'Kokilaben Dhirubhai Ambani Hospital', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1' },
  { id: '02222222-2222-2222-2222-222222222222', name: 'Lilavati Hospital & Research Centre', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1' },
  { id: '03333333-3333-3333-3333-333333333333', name: 'Nanavati Max Super Speciality Hospital', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1' },
  { id: '04444444-4444-4444-4444-444444444444', name: 'Hinduja Hospital', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1' },
  { id: '05555555-5555-5555-5555-555555555555', name: 'Tata Memorial Hospital', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1' },
  { id: '06666666-6666-6666-6666-666666666666', name: 'SevenHills Hospital', category_id: 'c1c1c1c1-c1c1-c1c1-c1c1-c1c1c1c1c1c1' },
  { id: '07777777-7777-7777-7777-777777777777', name: 'State Bank of India', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2' },
  { id: '08888888-8888-8888-8888-888888888888', name: 'HDFC Bank', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2' },
  { id: '09999999-9999-9999-9999-999999999999', name: 'ICICI Bank', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2' },
  { id: '0aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', name: 'Axis Bank', category_id: 'c2c2c2c2-c2c2-c2c2-c2c2-c2c2c2c2c2c2' },
  { id: '0bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', name: 'Passport Seva Kendra', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3' },
  { id: '0ccccccc-cccc-cccc-cccc-cccccccccccc', name: 'Regional Transport Office (RTO)', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3' },
  { id: '0ddddddd-dddd-dddd-dddd-dddddddddddd', name: 'Municipal Corporation (BMC)', category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3' },
  { id: '0eeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', name: 'IIT Bombay', category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4' },
  { id: '0fffffff-ffff-ffff-ffff-ffffffffffff', name: "St. Xavier's College", category_id: 'c4c4c4c4-c4c4-c4c4-c4c4-c4c4c4c4c4c4' },
  { id: '01010101-1010-1010-1010-101010101010', name: 'BBlunt Salon', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5' },
  { id: '01212121-2121-2121-2121-212121212121', name: 'Enrich Salon', category_id: 'c5c5c5c5-c5c5-c5c5-c5c5-c5c5c5c5c5c5' },
  { id: '01313131-3131-3131-3131-313131313131', name: 'Cafe Mondegar', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6' },
  { id: '01414141-1414-1414-1414-141414141414', name: 'Leopold Cafe', category_id: 'c6c6c6c6-c6c6-c6c6-c6c6-c6c6c6c6c6c6' },
  { id: '01515151-1515-1515-1515-151515151515', name: 'Phoenix Marketcity', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7' },
  { id: '01616161-1616-1616-1616-161616161616', name: 'Reliance Retail', category_id: 'c7c7c7c7-c7c7-c7c7-c7c7-c7c7c7c7c7c7' },
  { id: '01717171-1717-1717-1717-171717171717', name: 'Apple India Support', category_id: 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8' },
  { id: '01818181-1818-1818-1818-181818181818', name: 'Reliance Jio Support', category_id: 'c8c8c8c8-c8c8-c8c8-c8c8-c8c8c8c8c8c8' },
  { id: '01919191-1919-1919-1919-191919191919', name: 'Honda Service Centre', category_id: 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9' },
  { id: '02020202-2020-2020-2020-202020202020', name: 'Tata Motors Service', category_id: 'c9c9c9c9-c9c9-c9c9-c9c9-c9c9c9c9c9c9' },
  { id: '02121212-2121-2121-2121-212121212121', name: 'Lodha Developers', category_id: 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1' },
  { id: '02222222-2222-2222-2222-222222222223', name: 'Godrej Properties', category_id: 'c10c10c1-0c10-c10c-10c1-0c10c10c10c1' },
  { id: '02323232-2323-2323-2323-232323232323', name: "Gold's Gym", category_id: 'c11c11c1-1c11-c11c-11c1-1c11c11c11c1' },
  { id: '02424242-2424-2424-2424-242424242424', name: 'Mumbai International Airport (Adani)', category_id: 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1' },
  { id: '02525252-2525-2525-2525-252525252525', name: 'Indian Railways', category_id: 'c12c12c1-2c12-c12c-12c1-2c12c12c12c1' }
]

export const queueService = {
  // ==========================================================
  // CATEGORY, BRANCH & SERVICE APIS
  // ==========================================================

  getMockOrganizationId(branch) {
    if (!branch || !branch.name) return '00000000-0000-0000-0000-000000000000'
    if (branch.name.includes('Kokilaben')) return '01111111-1111-1111-1111-111111111111'
    if (branch.name.includes('Lilavati')) return '02222222-2222-2222-2222-222222222222'
    if (branch.name.includes('Nanavati')) return '03333333-3333-3333-3333-333333333333'
    if (branch.name.includes('Hinduja')) return '04444444-4444-4444-4444-444444444444'
    if (branch.name.includes('Tata Memorial')) return '05555555-5555-5555-5555-555555555555'
    if (branch.name.includes('SevenHills')) return '06666666-6666-6666-6666-666666666666'
    if (branch.name.includes('SBI')) return '07777777-7777-7777-7777-777777777777'
    if (branch.name.includes('HDFC')) return '08888888-8888-8888-8888-888888888888'
    if (branch.name.includes('ICICI')) return '09999999-9999-9999-9999-999999999999'
    if (branch.name.includes('Axis')) return '0aaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
    if (branch.name.includes('Passport')) return '0bbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
    if (branch.name.includes('RTO')) return '0ccccccc-cccc-cccc-cccc-cccccccccccc'
    if (branch.name.includes('Municipal')) return '0ddddddd-dddd-dddd-dddd-dddddddddddd'
    if (branch.name.includes('IIT')) return '0eeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
    if (branch.name.includes('Xavier')) return '0fffffff-ffff-ffff-ffff-ffffffffffff'
    if (branch.name.includes('BBlunt')) return '01010101-1010-1010-1010-101010101010'
    if (branch.name.includes('Enrich')) return '01212121-2121-2121-2121-212121212121'
    if (branch.name.includes('Mondegar')) return '01313131-3131-3131-3131-313131313131'
    if (branch.name.includes('Leopold')) return '01414141-1414-1414-1414-141414141414'
    if (branch.name.includes('Phoenix')) return '01515151-1515-1515-1515-151515151515'
    if (branch.name.includes('Reliance')) return '01616161-1616-1616-1616-161616161616'
    if (branch.name.includes('Apple')) return '01717171-1717-1717-1717-171717171717'
    if (branch.name.includes('Jio')) return '01818181-1818-1818-1818-181818181818'
    if (branch.name.includes('Honda')) return '01919191-1919-1919-1919-191919191919'
    if (branch.name.includes('Tata Motors')) return '02020202-2020-2020-2020-202020202020'
    if (branch.name.includes('Lodha')) return '02121212-2121-2121-2121-212121212121'
    if (branch.name.includes('Godrej')) return '02222222-2222-2222-2222-222222222223'
    if (branch.name.includes('Gold')) return '02323232-2323-2323-2323-232323232323'
    if (branch.name.includes('Airport')) return '02424242-2424-2424-2424-242424242424'
    if (branch.name.includes('Railways') || branch.name.includes('Central')) return '02525252-2525-2525-2525-252525252525'
    return '00000000-0000-0000-0000-000000000000'
  },

  async getOrganizations() {
    try {
      const { data, error } = await supabase
        .from('organizations')
        .select('*')
        .order('name', { ascending: true })
      if (error) throw error
      if (!data || data.length === 0) return MOCK_ORGANIZATIONS
      return data
    } catch (e) {
      console.warn('Using fallback mock organizations:', e.message)
      return MOCK_ORGANIZATIONS
    }
  },

  async getBranchesByOrganization(orgId) {
    try {
      const { data, error } = await supabase
        .from('branches')
        .select('*')
        .eq('organization_id', orgId)
        .eq('status', 'active')
      if (error) throw error
      if (!data || data.length === 0) {
        const mapped = MOCK_BRANCHES.map(b => ({ ...b, organization_id: this.getMockOrganizationId(b) }))
        return mapped.filter(b => b.organization_id === orgId)
      }
      return data
    } catch (e) {
      console.warn('Using fallback mock branches by org:', e.message)
      const mapped = MOCK_BRANCHES.map(b => ({ ...b, organization_id: this.getMockOrganizationId(b) }))
      return mapped.filter(b => b.organization_id === orgId)
    }
  },

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
      if (error) {
        console.error('[SUPABASE QUERY ERROR] Failed to fetch branches:', error)
        throw error
      }

      const totalCount = data ? data.length : 0
      console.log(`[BRANCHES] Total fetched from Supabase: ${totalCount}`)
      
      if (data && data.length > 0) {
        data.forEach(b => {
          console.log(`[BRANCH DATA] ID: ${b.id} | Name: "${b.name}" | Lat: ${b.latitude} | Lng: ${b.longitude} | Address: "${b.address}"`)
        })
      }

      if (!data || data.length === 0) {
        console.warn('[SUPABASE QUERY] No active branches in DB, fallback to mock branches.')
        const mapped = MOCK_BRANCHES.map(b => ({ ...b, organization_id: this.getMockOrganizationId(b) }))
        let filtered = mapped
        if (categoryId && categoryId !== 'all') {
          filtered = filtered.filter(b => b.category_id === categoryId)
        }
        return filtered
      }

      let filteredData = data
      if (categoryId && categoryId !== 'all') {
        filteredData = data.filter(b => b.category_id === categoryId)
        console.log(`[BRANCHES] Filtered for categoryId "${categoryId}": ${filteredData.length} branches remaining.`)
      }
      return filteredData
    } catch (e) {
      console.warn('[SUPABASE QUERY] Fallback to mock branches:', e.message)
      const mapped = MOCK_BRANCHES.map(b => ({ ...b, organization_id: this.getMockOrganizationId(b) }))
      let filtered = mapped
      if (categoryId && categoryId !== 'all') {
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

  async joinQueue(branchId, serviceId, userId, priority = 'normal', organizationId = null) {
    console.log({
      selectedBranchId: branchId,
      selectedServiceId: serviceId,
      selectedOrganizationId: organizationId
    })
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
    if (!userId) return null
    try {
      const { data, error } = await supabase
        .from('queues')
        .select('*, services(name), counters!queues_counter_id_fkey(name, number)')
        .eq('user_id', userId)
        .in('status', ['waiting', 'serving', 'approved'])
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
    if (!userId) return []
    try {
      const { data, error } = await supabase
        .from('queues')
        .select('*, services(name), counters!queues_counter_id_fkey(name, number)')
        .eq('user_id', userId)
        .in('status', ['completed', 'skipped', 'cancelled', 'rejected'])
        .order('created_at', { ascending: false })
      if (error) throw error
      return data || []
    } catch (error) {
      console.warn('Queue history fetch from DB failed:', error.message)
      return []
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

  async completeCurrentToken(counterId, tokenId = null) {
    try {
      let targetTokenId = tokenId
      if (!targetTokenId) {
        const { data: counter, error: cErr } = await supabase
          .from('counters')
          .select('current_token_id')
          .eq('id', counterId)
          .maybeSingle()

        if (cErr) throw cErr
        targetTokenId = counter?.current_token_id
      }

      if (!targetTokenId) {
        console.warn('[STAFF DB] No active token found to complete for counter:', counterId)
        throw new Error('No active token is currently assigned to this counter.')
      }

      console.log('[STAFF DB] Updating queue token status to completed for token:', targetTokenId)

      const { data: queueRecord, error: qErr } = await supabase
        .from('queues')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', targetTokenId)
        .select('*, services(name), branches(name)')
        .single()

      if (qErr) {
        console.error('[STAFF DB] Error updating queue status to completed:', qErr)
        throw qErr
      }

      const { error: cntErr } = await supabase
        .from('counters')
        .update({
          current_token_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', counterId)

      if (cntErr) {
        console.warn('[STAFF DB] Error clearing counter current_token_id:', cntErr)
      }

      console.log('[STAFF DB] Complete Service Success:', queueRecord)
      return queueRecord
    } catch (e) {
      console.error('[STAFF DB] completeCurrentToken exception:', e)
      throw e
    }
  },

  async skipCurrentToken(counterId, tokenId = null) {
    try {
      let targetTokenId = tokenId
      if (!targetTokenId) {
        const { data: counter, error: cErr } = await supabase
          .from('counters')
          .select('current_token_id')
          .eq('id', counterId)
          .maybeSingle()

        if (cErr) throw cErr
        targetTokenId = counter?.current_token_id
      }

      if (!targetTokenId) {
        throw new Error('No active token is currently assigned to this counter.')
      }

      console.log('[STAFF DB] Updating queue token status to skipped for token:', targetTokenId)

      const { data: queueRecord, error: qErr } = await supabase
        .from('queues')
        .update({
          status: 'skipped',
          completed_at: new Date().toISOString()
        })
        .eq('id', targetTokenId)
        .select('*, services(name)')
        .single()

      if (qErr) throw qErr

      await supabase
        .from('counters')
        .update({
          current_token_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', counterId)

      console.log('[STAFF DB] Skip Service Success:', queueRecord)
      return queueRecord
    } catch (e) {
      console.error('[STAFF DB] skipCurrentToken exception:', e)
      throw e
    }
  },

  async transferToken(tokenId, targetServiceId) {
    try {
      console.log('[STAFF DB] Transferring token:', tokenId, 'to service:', targetServiceId)

      const { data: queueRecord, error: qErr } = await supabase
        .from('queues')
        .update({
          service_id: targetServiceId,
          counter_id: null,
          status: 'waiting',
          called_at: null
        })
        .eq('id', tokenId)
        .select()
        .single()

      if (qErr) throw qErr
      console.log('[STAFF DB] Transfer Token Success:', queueRecord)
      return queueRecord
    } catch (e) {
      console.error('[STAFF DB] transferToken exception:', e)
      throw e
    }
  },

  async approveToken(tokenId) {
    try {
      const { data, error } = await supabase
        .from('queues')
        .select('*, profiles(id, full_name, email)')
        .eq('id', tokenId)
        .single()
      
      if (error) throw error

      if (data && data.user_id) {
        await supabase.from('notifications').insert({
          user_id: data.user_id,
          title: 'Queue Token Approved',
          message: `Your token ${data.token_number} has been approved by staff.`,
          type: 'queue'
        })
      }
      return data
    } catch (e) {
      console.error('approveToken error:', e)
      throw e
    }
  },

  async rejectToken(tokenId) {
    try {
      const { data, error } = await supabase
        .from('queues')
        .update({ status: 'cancelled' })
        .eq('id', tokenId)
        .select()
        .single()
      
      if (error) throw error

      if (data && data.user_id) {
        await supabase.from('notifications').insert({
          user_id: data.user_id,
          title: 'Queue Ticket Declined',
          message: `Your token ${data.token_number} request was declined.`,
          type: 'queue'
        })
      }
      return data
    } catch (e) {
      console.error('rejectToken error:', e)
      throw e
    }
  },

  async getBranchQueues(branchId) {
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const { data, error } = await supabase
        .from('queues')
        .select('*, services(name, prefix), profiles(full_name, email)')
        .eq('branch_id', branchId)
        .in('status', ['waiting', 'serving'])
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    } catch (e) {
      console.warn('getBranchQueues error:', e)
      return []
    }
  },

  async callNextToken(counterId, staffId) {
    const { data, error } = await supabase.rpc('call_next_token', {
      p_counter_id: counterId,
      p_staff_id: staffId,
    })
    if (error) throw error
    return data
  },

  async callSpecificToken(tokenId, counterId, staffId) {
    try {
      const { data: counterData, error: cErr } = await supabase
        .from('counters')
        .update({
          staff_id: staffId,
          status: 'open',
          current_token_id: tokenId,
          updated_at: new Date().toISOString()
        })
        .eq('id', counterId)
        .select()
        .single()
      
      if (cErr) throw cErr

      const { data: queueData, error: qErr } = await supabase
        .from('queues')
        .update({
          status: 'serving',
          counter_id: counterId,
          called_at: new Date().toISOString()
        })
        .eq('id', tokenId)
        .select('*, services(name)')
        .single()

      if (qErr) throw qErr

      if (queueData && queueData.user_id) {
        await supabase.from('notifications').insert({
          user_id: queueData.user_id,
          title: 'Your Turn!',
          message: `Token ${queueData.token_number} please proceed to ${counterData.name || 'Counter'}`,
          type: 'queue'
        })
      }

      return queueData
    } catch (e) {
      console.error('callSpecificToken error:', e)
      throw e
    }
  },

  async startService(tokenId, counterId) {
    console.log('[STAFF] Starting service for token:', tokenId)
    try {
      const { data: queueData, error: qErr } = await supabase
        .from('queues')
        .update({
          status: 'serving',
          counter_id: counterId
        })
        .eq('id', tokenId)
        .select('*, services(name), branches(name)')
        .single()

      if (qErr) throw qErr
      console.log('[STAFF] Queue status changed to serving')

      if (queueData && queueData.user_id) {
        await supabase.from('notifications').insert({
          user_id: queueData.user_id,
          title: 'Service In Progress',
          message: `Service for Token ${queueData.token_number} has started.`,
          type: 'queue'
        })
      }

      return queueData
    } catch (e) {
      console.error('[STAFF] startService error:', e)
      throw e
    }
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
      console.warn('Database stats failed, returning offline mock stats:', e.message)
      return { total: 15, waiting: 5, serving: 1, completed: 8, skipped: 1, avgServiceTime: 12 }
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
