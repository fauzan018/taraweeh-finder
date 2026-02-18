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
  sweet_type TEXT,
  distribution_time TEXT,
  crowd_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE
);

-- Table: taraweeh_sessions
CREATE TABLE IF NOT EXISTS taraweeh_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_id uuid NOT NULL,
  taraweeh_end_date DATE NOT NULL,
  session_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (mosque_id) REFERENCES approved_mosques(id) ON DELETE CASCADE
);

-- Table: pending_taraweeh_sessions
CREATE TABLE IF NOT EXISTS pending_taraweeh_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  mosque_id uuid NOT NULL,
  taraweeh_end_date DATE NOT NULL,
  session_number INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  FOREIGN KEY (mosque_id) REFERENCES pending_mosques(id) ON DELETE CASCADE
);

-- Demo seed data for major Indian cities
INSERT INTO approved_mosques (name, address, state, city, latitude, longitude, sweet_type, distribution_time, crowd_level, upvotes, views)
VALUES
  ('Jama Masjid', 'Jama Masjid Rd, Chandni Chowk', 'Delhi', 'Delhi', 28.6507, 77.2334, 'Laddu', 'After Isha', 'High', 12, 150),
  ('Haji Ali Dargah', 'Dargah Rd, Mahalaxmi', 'Maharashtra', 'Mumbai', 18.9828, 72.8094, 'Barfi', 'After Isha', 'Medium', 8, 90),
  ('Mecca Masjid', 'Charminar Rd, Ghansi Bazaar', 'Telangana', 'Hyderabad', 17.3616, 78.4747, 'Jalebi', 'After Isha', 'High', 15, 200),
  ('Aishbagh Eidgah', 'Aishbagh Rd, Aishbagh', 'Uttar Pradesh', 'Lucknow', 26.8345, 80.9021, 'Rasgulla', 'After Isha', 'Low', 5, 60),
  ('Jamia Masjid', 'Nowhatta, Downtown', 'Jammu and Kashmir', 'Srinagar', 34.0837, 74.7973, 'Phirni', 'After Isha', 'Medium', 7, 80);

-- Insert taraweeh sessions for demo data
INSERT INTO taraweeh_sessions (mosque_id, taraweeh_end_date, session_number)
SELECT id, '2026-03-20', 1 FROM approved_mosques WHERE name = 'Jama Masjid'
UNION ALL
SELECT id, '2026-03-21', 1 FROM approved_mosques WHERE name = 'Haji Ali Dargah'
UNION ALL
SELECT id, '2026-03-22', 1 FROM approved_mosques WHERE name = 'Mecca Masjid'
UNION ALL
SELECT id, '2026-03-23', 1 FROM approved_mosques WHERE name = 'Aishbagh Eidgah'
UNION ALL
SELECT id, '2026-03-24', 1 FROM approved_mosques WHERE name = 'Jamia Masjid';
