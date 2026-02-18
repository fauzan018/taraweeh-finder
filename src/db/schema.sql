-- Taraweeh Finder Database Schema

-- Table: approved_mosques
CREATE TABLE IF NOT EXISTS approved_mosques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  taraweeh_end_date DATE NOT NULL,
  sweet_type TEXT,
  distribution_time TEXT,
  crowd_level TEXT,
  upvotes INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table: pending_mosques
CREATE TABLE IF NOT EXISTS pending_mosques (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  state TEXT NOT NULL,
  city TEXT NOT NULL,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  taraweeh_end_date DATE NOT NULL,
  sweet_type TEXT,
  distribution_time TEXT,
  crowd_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Demo seed data for major Indian cities
INSERT INTO approved_mosques (name, address, state, city, latitude, longitude, taraweeh_end_date, sweet_type, distribution_time, crowd_level, upvotes, views)
VALUES
  ('Jama Masjid', 'Jama Masjid Rd, Chandni Chowk', 'Delhi', 'Delhi', 28.6507, 77.2334, '2026-03-20', 'Laddu', 'After Isha', 'High', 12, 150),
  ('Haji Ali Dargah', 'Dargah Rd, Mahalaxmi', 'Maharashtra', 'Mumbai', 18.9828, 72.8094, '2026-03-21', 'Barfi', 'After Isha', 'Medium', 8, 90),
  ('Mecca Masjid', 'Charminar Rd, Ghansi Bazaar', 'Telangana', 'Hyderabad', 17.3616, 78.4747, '2026-03-22', 'Jalebi', 'After Isha', 'High', 15, 200),
  ('Aishbagh Eidgah', 'Aishbagh Rd, Aishbagh', 'Uttar Pradesh', 'Lucknow', 26.8345, 80.9021, '2026-03-23', 'Rasgulla', 'After Isha', 'Low', 5, 60),
  ('Jamia Masjid', 'Nowhatta, Downtown', 'Jammu and Kashmir', 'Srinagar', 34.0837, 74.7973, '2026-03-24', 'Phirni', 'After Isha', 'Medium', 7, 80);
