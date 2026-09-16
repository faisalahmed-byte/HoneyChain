-- ============================================================
-- HONEY CHAIN SUPABASE CLOUD DATABASE SCHEMA & SEED DATA
-- Run this script directly in your Supabase SQL Editor
-- (https://supabase.com/dashboard/project/_/sql)
-- ============================================================

-- 1. Enable PostGIS Extension (For Geographic GPS Tracking)
CREATE EXTENSION IF NOT EXISTS postgis;

-- 2. Create `users` Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  apiary_name TEXT,
  location_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create `beehives` Table
CREATE TABLE IF NOT EXISTS public.beehives (
  hive_id TEXT PRIMARY KEY,
  apiary_name TEXT NOT NULL,
  location_name TEXT NOT NULL,
  temperature_c NUMERIC NOT NULL,
  humidity_pct NUMERIC NOT NULL,
  weight_kg NUMERIC NOT NULL DEFAULT 19.4,
  status TEXT NOT NULL DEFAULT 'Strong',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create `harvest_batches` Table
CREATE TABLE IF NOT EXISTS public.harvest_batches (
  id TEXT PRIMARY KEY,
  hive_id TEXT NOT NULL REFERENCES public.beehives(hive_id) ON DELETE CASCADE,
  beekeeper_name TEXT NOT NULL,
  apiary_name TEXT NOT NULL,
  location_name TEXT NOT NULL,
  floral_source TEXT NOT NULL,
  quantity_kg NUMERIC NOT NULL,
  quality_score NUMERIC DEFAULT 99.5,
  initial_quality_grade TEXT DEFAULT 'Grade A+',
  harvest_method TEXT NOT NULL,
  harvest_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Harvested',
  block_tx_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create `supply_chain_logs` Table
CREATE TABLE IF NOT EXISTS public.supply_chain_logs (
  id BIGSERIAL PRIMARY KEY,
  batch_id TEXT NOT NULL REFERENCES public.harvest_batches(id) ON DELETE CASCADE,
  stage TEXT NOT NULL,
  actor TEXT NOT NULL,
  location_name TEXT NOT NULL,
  details JSONB,
  block_tx_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Disable Row Level Security (RLS) for Backend API Read/Write Access
ALTER TABLE IF EXISTS public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.beehives DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.harvest_batches DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.supply_chain_logs DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- SEED DATA INSERTS
-- ============================================================

-- Seed Users
INSERT INTO public.users (id, name, role, apiary_name, location_name) VALUES
('BK-001', 'Ramesh Kumar', 'Beekeeper', 'Deccan Apiary', 'Nizamabad, Telangana'),
('BK-002', 'Suresh Patel', 'Beekeeper', 'Amul Delta Apiaries', 'Anand, Gujarat'),
('BK-003', 'Anita Devi', 'Beekeeper', 'Mithila Lychee Farms', 'Muzaffarpur, Bihar'),
('PRO-001', 'Dr. A. K. Verma', 'Quality Inspector', 'FSSAI Regional Testing Lab', 'Hyderabad, Telangana'),
('DIS-001', 'AgriExpress Logistics', 'Logistics Manager', 'AgriExpress Central Depot', 'Nizamabad Hub')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  apiary_name = EXCLUDED.apiary_name,
  location_name = EXCLUDED.location_name;

-- Seed Beehives
INSERT INTO public.beehives (hive_id, apiary_name, location_name, temperature_c, humidity_pct, weight_kg, status) VALUES
('HIVE-001', 'Deccan Organic Apiary', 'Nizamabad, TS', 33.8, 68, 19.4, 'Strong'),
('HIVE-002', 'Deccan Organic Apiary', 'Nizamabad, TS', 34.2, 61, 18.8, 'Strong'),
('HIVE-003', 'Deccan Organic Apiary', 'Nizamabad, TS', 35.1, 77, 16.5, 'Moderate'),
('HIVE-004', 'Deccan Organic Apiary', 'Nizamabad, TS', 38.6, 45, 17.2, 'Moderate'),
('HIVE-005', 'Litchi Orchards Apiary', 'Muzaffarpur, BR', 32.4, 68, 21.2, 'Strong'),
('HIVE-006', 'Litchi Orchards Apiary', 'Muzaffarpur, BR', 32.1, 70, 20.8, 'Strong'),
('HIVE-007', 'Mustard Valley Apiary', 'Nizamabad, TS', 33.8, 68, 19.4, 'Strong'),
('HIVE-008', 'Mustard Valley Apiary', 'Bharatpur, RJ', 34.0, 65, 22.5, 'Strong'),
('HIVE-009', 'Western Ghats Apiary', 'Coorg, KA', 26.2, 82, 14.2, 'Moderate'),
('HIVE-010', 'Pine & Acacia Valley', 'Shimla, HP', 23.5, 55, 23.0, 'Strong')
ON CONFLICT (hive_id) DO UPDATE SET
  apiary_name = EXCLUDED.apiary_name,
  temperature_c = EXCLUDED.temperature_c,
  humidity_pct = EXCLUDED.humidity_pct,
  weight_kg = EXCLUDED.weight_kg;

-- Seed Harvest Batches
INSERT INTO public.harvest_batches (id, hive_id, beekeeper_name, apiary_name, location_name, floral_source, quantity_kg, quality_score, initial_quality_grade, harvest_method, harvest_date, status, block_tx_hash) VALUES
('HC-TG-2026-001', 'HIVE-007', 'Ramesh Honey Farms', 'Deccan Organic Apiary', 'Nizamabad, Telangana', 'Wildflower Honey', 18.0, 99.8, 'Grade A+', 'Manual Centrifugal Extraction', '2026-09-01', 'Delivered', '0x8f3a91e2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9'),
('HC-TG-2026-002', 'HIVE-005', 'Sunil Organic Apiaries', 'Litchi Orchards Apiary', 'Muzaffarpur, Bihar', 'Lychee Honey', 310.0, 99.2, 'Grade A', 'Super Comb Extraction', '2026-09-02', 'Delivered', '0x7b2c44a1d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1'),
('HC-TG-2026-003', 'HIVE-008', 'Bharatpur Honey Co-op', 'Mustard Valley Apiary', 'Bharatpur, Rajasthan', 'Mustard Honey', 420.0, 99.5, 'Grade A+', 'Warm Cell Centrifugal', '2026-09-03', 'Distributed', '0x4d1e88f3a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4'),
('HC-TG-2026-004', 'HIVE-009', 'Coorg Natural Honey', 'Western Ghats Flora Apiary', 'Coorg, Karnataka', 'Forest Honey', 180.0, 98.9, 'Grade A+', 'Cold Extraction', '2026-09-04', 'Processed', '0x1a9b77c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8'),
('HC-TG-2026-005', 'HIVE-010', 'Himalayan Bee Keepers', 'Pine & Acacia Valley', 'Shimla, Himachal Pradesh', 'Acacia Honey', 290.0, 99.7, 'Grade A+', 'Manual Comb Draining', '2026-09-05', 'Quality Checked', '0x9e8d33b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7'),
('HC-TG-2026-006', 'HIVE-001', 'Wayanad Spice Apiaries', 'Cardamom & Eucalyptus Grove', 'Wayanad, Kerala', 'Eucalyptus Honey', 160.0, 98.4, 'Grade A', 'Centrifugal Extractor', '2026-09-06', 'Harvested', '0x5c4b22a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5'),
('HC-TG-2026-007', 'HIVE-002', 'Punjab Agritech Beekeepers', 'Golden Fields Apiary', 'Ludhiana, Punjab', 'Sunflower Honey', 480.0, 98.1, 'Grade A', 'Automated Extraction Line', '2026-09-07', 'Harvested', '0x3d2a11f8e9d0c1b2a3f4e5d6c7b8a9f0e1d2c3b4'),
('HC-TG-2026-008', 'HIVE-003', 'Chambal Agro Honey', 'Jamun Grove Apiary', 'Gwalior, Madhya Pradesh', 'Jamun Honey', 275.0, 99.4, 'Grade A+', 'Manual Comb Draining', '2026-09-08', 'Harvested', '0x2b1c99e8d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2'),
('HC-TG-2026-009', 'HIVE-004', 'Godavari Delta Bee Farms', 'Mangrove Reserve Apiary', 'Kakinada, Andhra Pradesh', 'Neem Honey', 210.0, 99.1, 'Grade A+', 'Centrifugal Extraction', '2026-09-09', 'Quality Checked', '0x1f9e88d7c6b5a4f3e2d1c0b9a8f7e6d5c4b3a2b1'),
('HC-TG-2026-010', 'HIVE-006', 'Sahyadri Bee Keepers', 'Western Ghats Flora', 'Satara, Maharashtra', 'Multifloral Honey', 340.0, 98.8, 'Grade A+', 'Comb Cold Draining', '2026-09-10', 'Processed', '0x0d9c77b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0')
ON CONFLICT (id) DO UPDATE SET
  status = EXCLUDED.status,
  quality_score = EXCLUDED.quality_score;

-- Seed Supply Chain Logs
INSERT INTO public.supply_chain_logs (batch_id, stage, actor, location_name, details, block_tx_hash) VALUES
('HC-TG-2026-001', 'Harvested', 'Ramesh Honey Farms', 'Nizamabad, TS', 'Extracted 18.0 kg Wildflower Honey', '0x8f3a91e2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9'),
('HC-TG-2026-001', 'Quality Checked', 'Dr. A. K. Verma', 'FSSAI Regional Lab, Hyderabad', 'Passed (NMR Clean, 99.8% Purity)', '0x8f3a91e2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8ea'),
('HC-TG-2026-001', 'Processed', 'Pure Honey Processing Co.', 'Telangana Agri-Processing Zone', 'Processed 36 jars (500g each)', '0x8f3a91e2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8eb'),
('HC-TG-2026-001', 'Delivered', 'AgriExpress Logistics', 'Hyderabad Retail Outlets', 'Delivered to climate-controlled hub', '0x8f3a91e2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8ec');
