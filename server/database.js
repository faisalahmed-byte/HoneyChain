const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Database = require('better-sqlite3');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { calculateBlockHash } = require('./blockchain');

// Live Supabase Cloud Instance Credentials
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Instantiate Live Supabase Cloud Client (fallback to dummy if empty)
const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : createClient('https://dummy.supabase.co', 'dummy-key');

// Database file path
const dbPath = path.join(__dirname, 'honeychain.db');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS batches (
      id TEXT PRIMARY KEY,
      hive_id TEXT NOT NULL DEFAULT 'HIVE-001',
      beekeeper_name TEXT NOT NULL,
      apiary_name TEXT NOT NULL,
      location TEXT NOT NULL,
      gps_lat REAL NOT NULL,
      gps_lng REAL NOT NULL,
      extraction_date TEXT NOT NULL,
      floral_source TEXT NOT NULL,
      hives_count INTEGER NOT NULL,
      quantity_kg REAL NOT NULL,
      moisture_pct REAL NOT NULL,
      temperature_c REAL NOT NULL,
      initial_quality_grade TEXT NOT NULL,
      harvest_method TEXT NOT NULL,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'Harvested',
      block_tx_hash TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS quality_checks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id TEXT NOT NULL,
      inspector_name TEXT NOT NULL,
      moisture_pct REAL NOT NULL,
      purity_pct REAL NOT NULL,
      ph_level REAL NOT NULL,
      hmf_mg_kg REAL NOT NULL,
      adulteration_test TEXT NOT NULL,
      pollen_analysis TEXT NOT NULL,
      colour TEXT NOT NULL,
      aroma TEXT NOT NULL,
      quality_grade TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS processing_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id TEXT NOT NULL,
      processor_name TEXT NOT NULL,
      facility_name TEXT NOT NULL,
      processing_date TEXT NOT NULL,
      filtering_status TEXT NOT NULL,
      heating_temp_c REAL NOT NULL,
      filtration_method TEXT NOT NULL,
      packaging_date TEXT NOT NULL,
      package_size_g INTEGER NOT NULL,
      jars_count INTEGER NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS distribution_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id TEXT NOT NULL,
      distributor_name TEXT NOT NULL,
      origin TEXT NOT NULL,
      destination TEXT NOT NULL,
      transport_vehicle TEXT NOT NULL,
      dispatch_date TEXT NOT NULL,
      delivery_date TEXT NOT NULL,
      storage_temp_c REAL NOT NULL,
      shipment_status TEXT NOT NULL,
      notes TEXT,
      created_at TEXT NOT NULL,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS blockchain_blocks (
      block_index INTEGER PRIMARY KEY AUTOINCREMENT,
      batch_id TEXT NOT NULL,
      event_type TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      actor TEXT NOT NULL,
      location TEXT NOT NULL,
      details TEXT NOT NULL,
      previous_hash TEXT NOT NULL,
      current_hash TEXT NOT NULL,
      is_tampered INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS hives (
      hive_id TEXT PRIMARY KEY,
      apiary_name TEXT NOT NULL,
      location TEXT NOT NULL,
      temperature_c REAL NOT NULL,
      humidity_pct REAL NOT NULL,
      weight_kg REAL NOT NULL DEFAULT 19.4,
      colony_strength TEXT NOT NULL,
      honey_level_pct REAL NOT NULL,
      pest_risk TEXT NOT NULL,
      queen_status TEXT NOT NULL,
      weather_condition TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sensor_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hive_id TEXT NOT NULL,
      temperature_c REAL NOT NULL,
      humidity_pct REAL NOT NULL,
      weight_kg REAL NOT NULL,
      battery_pct REAL NOT NULL DEFAULT 95.0,
      timestamp TEXT NOT NULL,
      FOREIGN KEY (hive_id) REFERENCES hives(hive_id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS alerts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hive_id TEXT NOT NULL,
      alert_type TEXT NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      severity TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      sensor_value TEXT,
      expected_range TEXT,
      recommendation TEXT,
      resolved INTEGER DEFAULT 0,
      resolved_at TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      batch_id TEXT NOT NULL,
      name TEXT NOT NULL,
      honey_type TEXT NOT NULL,
      price_inr REAL NOT NULL,
      package_size TEXT NOT NULL,
      beekeeper_name TEXT NOT NULL,
      location TEXT NOT NULL,
      in_stock INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL,
      FOREIGN KEY (batch_id) REFERENCES batches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS tamper_backups (
      block_index INTEGER PRIMARY KEY,
      original_details TEXT NOT NULL,
      original_hash TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS login_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      role TEXT NOT NULL,
      login_type TEXT NOT NULL,
      ip_address TEXT DEFAULT '127.0.0.1',
      timestamp TEXT NOT NULL
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as cnt FROM batches').get().cnt;
  if (count === 0) {
    seedDatabase();
  }
}

function seedDatabase() {
  console.log('Seeding Honey Chain database with 10 HC-TG-2026 batches, IoT readings, alerts, and independent blockchain history...');

  // 1. Seed Hives
  const insertHive = db.prepare(`
    INSERT INTO hives (
      hive_id, apiary_name, location, temperature_c, humidity_pct, weight_kg,
      colony_strength, honey_level_pct, pest_risk, queen_status, weather_condition, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const sampleHives = [
    { id: 'HIVE-001', apiary: 'Deccan Organic Apiary', loc: 'Nizamabad, TS', temp: 33.8, hum: 68, wt: 19.4, strength: 'Strong', honey: 82, pest: 'Low', queen: 'Healthy', weather: 'Sunny 33°C', updated: '2026-09-10 18:00' },
    { id: 'HIVE-002', apiary: 'Deccan Organic Apiary', loc: 'Nizamabad, TS', temp: 34.2, hum: 61, wt: 18.8, strength: 'Strong', honey: 78, pest: 'Low', queen: 'Healthy', weather: 'Sunny 33°C', updated: '2026-09-10 18:00' },
    { id: 'HIVE-003', apiary: 'Deccan Organic Apiary', loc: 'Nizamabad, TS', temp: 35.1, hum: 77, wt: 16.5, strength: 'Moderate', honey: 64, pest: 'Low', queen: 'Healthy', weather: 'Sunny 33°C', updated: '2026-09-10 18:00' },
    { id: 'HIVE-004', apiary: 'Deccan Organic Apiary', loc: 'Nizamabad, TS', temp: 38.6, hum: 45, wt: 17.2, strength: 'Moderate', honey: 52, pest: 'Medium', queen: 'Healthy', weather: 'Hot 37°C', updated: '2026-09-10 18:00' },
    { id: 'HIVE-005', apiary: 'Litchi Orchards Apiary', loc: 'Muzaffarpur, BR', temp: 32.4, hum: 68, wt: 21.2, strength: 'Strong', honey: 91, pest: 'Low', queen: 'Healthy', weather: 'Partly Cloudy 31°C', updated: '2026-09-10 18:00' },
    { id: 'HIVE-006', apiary: 'Litchi Orchards Apiary', loc: 'Muzaffarpur, BR', temp: 32.1, hum: 70, wt: 20.8, strength: 'Strong', honey: 88, pest: 'Low', queen: 'Healthy', weather: 'Partly Cloudy 31°C', updated: '2026-09-10 18:00' },
    { id: 'HIVE-007', apiary: 'Mustard Valley Apiary', loc: 'Nizamabad, TS', temp: 33.8, hum: 68, wt: 19.4, strength: 'Strong', honey: 82, pest: 'Low', queen: 'Healthy', weather: 'Sunny 33°C', updated: '2026-09-10 18:00' },
    { id: 'HIVE-008', apiary: 'Mustard Valley Apiary', loc: 'Bharatpur, RJ', temp: 34.0, hum: 65, wt: 22.5, strength: 'Strong', honey: 74, pest: 'Low', queen: 'Healthy', weather: 'Humid 35°C', updated: '2026-09-10 18:00' },
    { id: 'HIVE-009', apiary: 'Western Ghats Apiary', loc: 'Coorg, KA', temp: 26.2, hum: 82, wt: 14.2, strength: 'Moderate', honey: 22, pest: 'Low', queen: 'Healthy', weather: 'Pleasant 25°C', updated: '2026-09-10 18:00' },
    { id: 'HIVE-010', apiary: 'Pine & Acacia Valley', loc: 'Shimla, HP', temp: 23.5, hum: 55, wt: 23.0, strength: 'Strong', honey: 85, pest: 'Low', queen: 'Healthy', weather: 'Cool 22°C', updated: '2026-09-10 18:00' }
  ];

  for (const h of sampleHives) {
    insertHive.run(h.id, h.apiary, h.loc, h.temp, h.hum, h.wt, h.strength, h.honey, h.pest, h.queen, h.weather, h.updated);
  }

  // 2. Seed Sensor Readings
  const insertSensor = db.prepare(`
    INSERT INTO sensor_readings (hive_id, temperature_c, humidity_pct, weight_kg, battery_pct, timestamp)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  for (const h of sampleHives) {
    insertSensor.run(h.id, h.temp, h.hum, h.wt, 94, '2026-09-10 18:00:00');
    insertSensor.run(h.id, h.temp - 0.4, h.hum + 2, h.wt - 0.3, 95, '2026-09-10 12:00:00');
    insertSensor.run(h.id, h.temp - 0.8, h.hum + 4, h.wt - 0.7, 96, '2026-09-10 06:00:00');
  }

  // 3. Seed Batches
  const insertBatch = db.prepare(`
    INSERT INTO batches (
      id, hive_id, beekeeper_name, apiary_name, location, gps_lat, gps_lng,
      extraction_date, floral_source, hives_count, quantity_kg, moisture_pct,
      temperature_c, initial_quality_grade, harvest_method, notes, status, block_tx_hash, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertQuality = db.prepare(`
    INSERT INTO quality_checks (
      batch_id, inspector_name, moisture_pct, purity_pct, ph_level, hmf_mg_kg,
      adulteration_test, pollen_analysis, colour, aroma, quality_grade, status, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertProcessing = db.prepare(`
    INSERT INTO processing_records (
      batch_id, processor_name, facility_name, processing_date, filtering_status,
      heating_temp_c, filtration_method, packaging_date, package_size_g, jars_count, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertDistribution = db.prepare(`
    INSERT INTO distribution_records (
      batch_id, distributor_name, origin, destination, transport_vehicle,
      dispatch_date, delivery_date, storage_temp_c, shipment_status, notes, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertBlock = db.prepare(`
    INSERT INTO blockchain_blocks (
      block_index, batch_id, event_type, timestamp, actor, location, details, previous_hash, current_hash
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  let globalBlockIndex = 1;

  const sampleBatches = [
    {
      id: 'HC-TG-2026-001',
      hive: 'HIVE-007',
      beekeeper: 'Ramesh Honey Farms',
      apiary: 'Deccan Organic Apiary',
      location: 'Nizamabad, Telangana',
      lat: 18.6725, lng: 78.0941, date: '2026-09-01', floral: 'Wildflower Honey',
      hives: 12, qty: 18.0, moisture: 17.2, temp: 33.8, grade: 'Grade A+', method: 'Manual Centrifugal Extraction',
      notes: 'Harvested from HIVE-007 during peak blossom season. Rich golden nectar with herbal medicinal aroma.',
      status: 'Delivered', created: '2026-09-01 08:30:00'
    },
    {
      id: 'HC-TG-2026-002',
      hive: 'HIVE-005',
      beekeeper: 'Sunil Organic Apiaries',
      apiary: 'Litchi Orchards Apiary',
      location: 'Muzaffarpur, Bihar',
      lat: 26.1209, lng: 85.3647, date: '2026-09-02', floral: 'Lychee Honey',
      hives: 38, qty: 310, moisture: 18.0, temp: 31.0, grade: 'Grade A', method: 'Super Comb Extraction',
      notes: 'Light golden honey with sweet floral fruity notes.',
      status: 'Delivered', created: '2026-09-02 09:15:00'
    },
    {
      id: 'HC-TG-2026-003',
      hive: 'HIVE-008',
      beekeeper: 'Bharatpur Honey Co-op',
      apiary: 'Mustard Valley Apiary',
      location: 'Bharatpur, Rajasthan',
      lat: 27.2170, lng: 77.4895, date: '2026-09-03', floral: 'Mustard Honey',
      hives: 55, qty: 420, moisture: 17.5, temp: 29.8, grade: 'Grade A+', method: 'Warm Cell Centrifugal',
      notes: 'Creamy high-glucose honey extracted from organic mustard fields.',
      status: 'Distributed', created: '2026-09-03 10:00:00'
    },
    {
      id: 'HC-TG-2026-004',
      hive: 'HIVE-009',
      beekeeper: 'Coorg Natural Honey',
      apiary: 'Western Ghats Flora Apiary',
      location: 'Coorg, Karnataka',
      lat: 12.3375, lng: 75.8069, date: '2026-09-04', floral: 'Forest Honey',
      hives: 30, qty: 180, moisture: 16.8, temp: 26.5, grade: 'Grade A+', method: 'Cold Extraction',
      notes: 'Wild forest flora honey collected from shola forest borders.',
      status: 'Processed', created: '2026-09-04 11:20:00'
    },
    {
      id: 'HC-TG-2026-005',
      hive: 'HIVE-010',
      beekeeper: 'Himalayan Bee Keepers',
      apiary: 'Pine & Acacia Valley',
      location: 'Shimla, Himachal Pradesh',
      lat: 31.1048, lng: 77.1734, date: '2026-09-05', floral: 'Acacia Honey',
      hives: 48, qty: 290, moisture: 17.1, temp: 24.2, grade: 'Grade A+', method: 'Manual Comb Draining',
      notes: 'Crystal clear slow-crystallizing white acacia honey.',
      status: 'Quality Checked', created: '2026-09-05 07:45:00'
    },
    {
      id: 'HC-TG-2026-006',
      hive: 'HIVE-001',
      beekeeper: 'Wayanad Spice Apiaries',
      apiary: 'Cardamom & Eucalyptus Grove',
      location: 'Wayanad, Kerala',
      lat: 11.6854, lng: 76.1320, date: '2026-09-06', floral: 'Eucalyptus Honey',
      hives: 25, qty: 160, moisture: 17.9, temp: 27.8, grade: 'Grade A', method: 'Centrifugal Extractor',
      notes: 'Distinct herbal minty honey with high antioxidant content.',
      status: 'Harvested', created: '2026-09-06 08:10:00'
    },
    {
      id: 'HC-TG-2026-007',
      hive: 'HIVE-002',
      beekeeper: 'Punjab Agritech Beekeepers',
      apiary: 'Golden Fields Apiary',
      location: 'Ludhiana, Punjab',
      lat: 30.9010, lng: 75.8573, date: '2026-09-07', floral: 'Sunflower Honey',
      hives: 60, qty: 480, moisture: 18.2, temp: 33.0, grade: 'Grade A', method: 'Automated Extraction Line',
      notes: 'Bright yellow sweet sunflower blossom honey.',
      status: 'Harvested', created: '2026-09-07 09:30:00'
    },
    {
      id: 'HC-TG-2026-008',
      hive: 'HIVE-003',
      beekeeper: 'Chambal Agro Honey',
      apiary: 'Jamun Grove Apiary',
      location: 'Gwalior, Madhya Pradesh',
      lat: 26.2183, lng: 78.1828, date: '2026-09-08', floral: 'Jamun Honey',
      hives: 40, qty: 275, moisture: 17.4, temp: 30.5, grade: 'Grade A+', method: 'Manual Comb Draining',
      notes: 'Dark purple-tinted low GI honey ideal for wellness.',
      status: 'Harvested', created: '2026-09-08 10:15:00'
    },
    {
      id: 'HC-TG-2026-009',
      hive: 'HIVE-004',
      beekeeper: 'Godavari Delta Bee Farms',
      apiary: 'Mangrove Reserve Apiary',
      location: 'Kakinada, Andhra Pradesh',
      lat: 16.9891, lng: 82.2475, date: '2026-09-09', floral: 'Neem Honey',
      hives: 32, qty: 210, moisture: 17.6, temp: 32.0, grade: 'Grade A+', method: 'Centrifugal Extraction',
      notes: 'Pure organic Neem blossom honey.',
      status: 'Quality Checked', created: '2026-09-09 11:00:00'
    },
    {
      id: 'HC-TG-2026-010',
      hive: 'HIVE-006',
      beekeeper: 'Sahyadri Bee Keepers',
      apiary: 'Western Ghats Flora',
      location: 'Satara, Maharashtra',
      lat: 17.6805, lng: 74.0183, date: '2026-09-10', floral: 'Multifloral Honey',
      hives: 45, qty: 340, moisture: 17.0, temp: 28.5, grade: 'Grade A+', method: 'Comb Cold Draining',
      notes: 'Rich multi-floral honey from Sahyadri slopes.',
      status: 'Processed', created: '2026-09-10 09:00:00'
    }
  ];

  // Helper to add blockchain event per batch with continuous hashing chain
  let lastHashPerBatch = {};

  function addBatchBlock(batchId, eventType, timestamp, actor, location, detailsObj) {
    const blockIndex = globalBlockIndex++;
    const prevHash = lastHashPerBatch[batchId] || '0000000000000000000000000000000000000000000000000000000000000000';
    
    const hash = calculateBlockHash({
      block_index: blockIndex,
      batch_id: batchId,
      event_type: eventType,
      timestamp,
      actor,
      location,
      details: detailsObj,
      previous_hash: prevHash
    });

    insertBlock.run(
      blockIndex, batchId, eventType, timestamp, actor, location,
      JSON.stringify(detailsObj), prevHash, hash
    );

    lastHashPerBatch[batchId] = hash;
    return hash;
  }

  // Insert Batches & initial Harvested Blockchain Block for each
  for (const b of sampleBatches) {
    const genesisHash = addBatchBlock(b.id, 'Harvested', b.created, b.beekeeper, b.location, {
      hiveId: b.hive, apiary: b.apiary, quantityKg: b.qty, floralSource: b.floral,
      moisturePct: b.moisture, hivesCount: b.hives, initialGrade: b.grade, gps: `${b.lat}, ${b.lng}`
    });

    // Store generated blockchain block_tx_hash inside harvest_batches table
    insertBatch.run(
      b.id, b.hive, b.beekeeper, b.apiary, b.location, b.lat, b.lng,
      b.date, b.floral, b.hives, b.qty, b.moisture,
      b.temp, b.grade, b.method, b.notes, b.status, genesisHash, b.created
    );
  }

  // HC-TG-2026-001 Lifecycle Events
  insertQuality.run(
    'HC-TG-2026-001', 'Dr. A. K. Verma (National Honey Testing Lab)',
    17.2, 99.8, 3.9, 12.4, 'Passed (C4 Sugar & NMR Clean)', 'Wildflower dominant 85%',
    'Dark Amber', 'Medicinal Floral', 'Grade A+', 'Approved',
    'Exceeds FSSAI and BIS export purity standards. Zero adulterants detected.', '2026-09-02 11:00:00'
  );
  addBatchBlock('HC-TG-2026-001', 'Quality Checked', '2026-09-02 11:00:00', 'Dr. A. K. Verma (Quality Inspector)', 'FSSAI Regional Lab, Hyderabad', {
    purityPct: 99.8, moisturePct: 17.2, phLevel: 3.9, hmfMgKg: 12.4, adulterationTest: 'PASSED (NMR Clean)', qualityGrade: 'Grade A+', status: 'APPROVED'
  });

  insertProcessing.run(
    'HC-TG-2026-001', 'Pure Honey Processing Co.', 'Telangana Agri-Processing Zone, Nizamabad',
    '2026-09-03', 'Completed (3-Stage Micro Mesh)', 40.0, '50 Micron Stainless Filter',
    '2026-09-03', 500, 36, 'Controlled gentle warming at 40°C preserving active enzymes & invertase.', '2026-09-03 14:20:00'
  );
  addBatchBlock('HC-TG-2026-001', 'Processed', '2026-09-03 14:20:00', 'Pure Honey Processing Co.', 'Processing Facility', {
    facility: 'Telangana Agri-Processing Zone, Nizamabad', heatingTempC: 40.0, filtration: '50 Micron Stainless Filter', jarSizeG: 500, totalJars: 36
  });

  insertDistribution.run(
    'HC-TG-2026-001', 'AgriExpress Logistics', 'Processing Hub, Nizamabad',
    'Hyderabad Retail Chain & Export Port', 'Refrigerated Transport Van TS-09-UB-4421',
    '2026-09-04', '2026-09-05', 22.5, 'Delivered', 'Delivered to climate-controlled distribution center.', '2026-09-04 09:00:00'
  );
  addBatchBlock('HC-TG-2026-001', 'Delivered', '2026-09-04 09:00:00', 'AgriExpress Logistics', 'Hyderabad Retail Outlets', {
    destination: 'Hyderabad Retail Outlets', vehicle: 'Refrigerated Transport Van TS-09-UB-4421', storageTempC: 22.5, shipmentStatus: 'Delivered'
  });

  // HC-TG-2026-002 Lifecycle Events
  insertQuality.run(
    'HC-TG-2026-002', 'Bihar Agri Lab', 18.0, 99.2, 4.1, 14.0, 'Passed (Pollen Verified)', 'Lychee 92%', 'Light Amber', 'Fruity Sweet', 'Grade A', 'Approved', 'Passed all laboratory standards.', '2026-09-03 10:00:00'
  );
  addBatchBlock('HC-TG-2026-002', 'Quality Checked', '2026-09-03 10:00:00', 'Bihar Agri Lab', 'Muzaffarpur Lab', { purityPct: 99.2, status: 'APPROVED' });

  insertProcessing.run(
    'HC-TG-2026-002', 'Patna Honey Processors', 'Patna Industrial Area', '2026-09-04', 'Completed', 39.5, '100 Micron Filter', '2026-09-04', 500, 620, 'Packaged in glass jars.', '2026-09-04 15:00:00'
  );
  addBatchBlock('HC-TG-2026-002', 'Processed', '2026-09-04 15:00:00', 'Patna Honey Processors', 'Patna Facility', { jarSizeG: 500, totalJars: 620 });

  insertDistribution.run(
    'HC-TG-2026-002', 'Eastern Cargo Express', 'Patna Facility', 'Kolkata Central Hub', 'Express Truck BR-01-GA-9921', '2026-09-05', '2026-09-06', 23.0, 'Delivered', 'Delivered successfully.', '2026-09-05 10:00:00'
  );
  addBatchBlock('HC-TG-2026-002', 'Delivered', '2026-09-05 10:00:00', 'Eastern Cargo Express', 'Kolkata Hub', { shipmentStatus: 'Delivered' });

  // HC-TG-2026-003 Lifecycle Events
  insertQuality.run('HC-TG-2026-003', 'Rajasthan Testing Bureau', 17.5, 99.5, 3.8, 10.5, 'Passed', 'Mustard 88%', 'Golden Yellow', 'Floral Mild', 'Grade A+', 'Approved', 'Export quality mustard honey.', '2026-09-04 12:00:00');
  addBatchBlock('HC-TG-2026-003', 'Quality Checked', '2026-09-04 12:00:00', 'Rajasthan Testing Bureau', 'Bharatpur Lab', { purityPct: 99.5, status: 'APPROVED' });

  insertProcessing.run('HC-TG-2026-003', 'Desert Gold Processors', 'Bharatpur Hub', '2026-09-05', 'Completed', 41.0, '50 Micron Filter', '2026-09-05', 1000, 420, '1kg family pack jars.', '2026-09-05 16:00:00');
  addBatchBlock('HC-TG-2026-003', 'Processed', '2026-09-05 16:00:00', 'Desert Gold Processors', 'Bharatpur Hub', { jars: 420, size: '1000g' });

  insertDistribution.run('HC-TG-2026-003', 'North Express Logistics', 'Bharatpur Hub', 'Jaipur Retail Chain', 'Logistics Vehicle RJ-05-CC-3321', '2026-09-06', '2026-09-07', 24.0, 'In Transit', 'Currently en route.', '2026-09-06 08:30:00');
  addBatchBlock('HC-TG-2026-003', 'Dispatched', '2026-09-06 08:30:00', 'North Express Logistics', 'Bharatpur', { destination: 'Jaipur' });

  // 4. Seed Rich Alerts (Section 3 & 4 Requirements)
  const insertAlert = db.prepare(`
    INSERT INTO alerts (hive_id, alert_type, title, message, severity, timestamp, sensor_value, expected_range, recommendation, resolved, resolved_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertAlert.run('HIVE-004', 'High Temperature', '🔥 HIGH TEMPERATURE', 'Hive HIVE-004 internal temperature reached 38.6°C.', 'Critical', '2026-09-10 17:30:00', '38.6°C', '32.0 - 35.5°C', 'Inspect hive ventilation and provide shade if appropriate.', 0, null);
  insertAlert.run('HIVE-003', 'High Humidity', '💧 HIGH HUMIDITY', 'Hive HIVE-003 relative humidity reached 77%.', 'Warning', '2026-09-10 16:45:00', '77%', '55 - 72%', 'Inspect hive moisture/ventilation conditions.', 0, null);
  insertAlert.run('HIVE-007', 'Sudden Weight Drop', '⚖️ SUDDEN WEIGHT DROP', 'Hive HIVE-007 experienced an unusual weight decrease of -2.1 kg.', 'Warning', '2026-09-10 16:15:00', '19.4 kg (-2.1 kg)', '> 19.0 kg', 'Inspect hive and verify recent activity or swarming.', 0, null);
  insertAlert.run('HIVE-002', 'Low Device Battery', '🔋 LOW DEVICE BATTERY', 'IoT sensor node HIVE-002 battery dropped to 18%.', 'Attention', '2026-09-10 15:00:00', '18%', '> 25%', 'Replace or recharge solar battery module.', 0, null);
  insertAlert.run('HIVE-005', 'Harvest Approaching', '🍯 HARVEST APPROACHING', 'Hive HIVE-005 honey level reached 91%.', 'Information', '2026-09-10 14:20:00', '91%', '50 - 80%', 'Schedule honey extraction within 24-48 hours.', 0, null);

  // 5. Seed Marketplace Products
  const insertProduct = db.prepare(`
    INSERT INTO products (id, batch_id, name, honey_type, price_inr, package_size, beekeeper_name, location, in_stock, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertProduct.run('PROD-001', 'HC-TG-2026-001', 'Raw Wildflower Honey (500g)', 'Wildflower Honey', 450, '500 g', 'Ramesh Honey Farms', 'Nizamabad, Telangana', 1, '2026-09-10 10:00:00');
  insertProduct.run('PROD-002', 'HC-TG-2026-002', 'Pure Lychee Blossom Honey (500g)', 'Lychee Honey', 520, '500 g', 'Sunil Organic Apiaries', 'Muzaffarpur, Bihar', 1, '2026-09-10 10:00:00');
  insertProduct.run('PROD-003', 'HC-TG-2026-003', 'Organic Mustard Honey (1kg)', 'Mustard Honey', 650, '1000 g', 'Bharatpur Honey Co-op', 'Bharatpur, Rajasthan', 1, '2026-09-10 10:00:00');
  insertProduct.run('PROD-004', 'HC-TG-2026-004', 'Western Ghats Forest Honey (250g)', 'Forest Honey', 600, '250 g', 'Coorg Natural Honey', 'Coorg, Karnataka', 1, '2026-09-10 10:00:00');
  insertProduct.run('PROD-005', 'HC-TG-2026-005', 'Himalayan White Acacia Honey (500g)', 'Acacia Honey', 750, '500 g', 'Himalayan Bee Keepers', 'Shimla, HP', 1, '2026-09-10 10:00:00');
  insertProduct.run('PROD-006', 'HC-TG-2026-009', 'Pure Organic Neem Honey (500g)', 'Neem Honey', 580, '500 g', 'Godavari Delta Bee Farms', 'Kakinada, Andhra Pradesh', 1, '2026-09-10 10:00:00');
  insertProduct.run('PROD-007', 'HC-TG-2026-008', 'Dark Jamun Organic Honey (500g)', 'Jamun Honey', 620, '500 g', 'Chambal Agro Honey', 'Gwalior, Madhya Pradesh', 1, '2026-09-10 10:00:00');
  insertProduct.run('PROD-008', 'HC-TG-2026-006', 'Herbal Eucalyptus Honey (500g)', 'Eucalyptus Honey', 490, '500 g', 'Wayanad Spice Apiaries', 'Wayanad, Kerala', 1, '2026-09-10 10:00:00');
  insertProduct.run('PROD-009', 'HC-TG-2026-007', 'Golden Sunflower Honey (1kg)', 'Sunflower Honey', 680, '1000 g', 'Punjab Agritech Beekeepers', 'Ludhiana, Punjab', 1, '2026-09-10 10:00:00');

  console.log(`Seeding complete. Created 10 HC-TG-2026 batches, 10 hives, alerts, and independent blockchain blocks.`);
}

// =============================================================
// SUPABASE LIVE CLOUD HELPERS WITH HYBRID SAFE FALLBACK
// =============================================================

// 1. Harvest Batches (harvest_batches table)
const harvestBatchesDb = {
  async getAll(filter = {}) {
    try {
      const { data, error } = await supabase.from('harvest_batches').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {}

    let query = 'SELECT * FROM batches WHERE 1=1';
    const params = [];
    if (filter.search) {
      query += ' AND (id LIKE ? OR beekeeper_name LIKE ? OR location LIKE ? OR floral_source LIKE ?)';
      const term = `%${filter.search}%`;
      params.push(term, term, term, term);
    }
    if (filter.status) {
      query += ' AND status = ?';
      params.push(filter.status);
    }
    if (filter.beekeeper) {
      query += ' AND beekeeper_name LIKE ?';
      params.push(`%${filter.beekeeper}%`);
    }
    query += ' ORDER BY created_at DESC';
    return db.prepare(query).all(...params);
  },

  async insert(batchRecord) {
    try {
      await supabase.from('harvest_batches').insert([{
        id: batchRecord.id,
        hive_id: batchRecord.hive_id,
        beekeeper_name: batchRecord.beekeeper_name,
        apiary_name: batchRecord.apiary_name,
        location_name: batchRecord.location,
        floral_source: batchRecord.floral_source,
        quantity_kg: batchRecord.quantity_kg,
        quality_score: batchRecord.quality_score || 98.5,
        initial_quality_grade: batchRecord.initial_quality_grade || 'Grade A+',
        harvest_method: batchRecord.harvest_method,
        harvest_date: batchRecord.extraction_date,
        status: batchRecord.status || 'Harvested',
        block_tx_hash: batchRecord.block_tx_hash
      }]);
    } catch (e) {}
  }
};

// 2. Beehives (beehives table)
const beehivesDb = {
  async getAll(filter = {}) {
    try {
      const { data, error } = await supabase.from('beehives').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {}

    return db.prepare('SELECT * FROM hives ORDER BY hive_id ASC').all();
  }
};

// 3. Users (users table)
const usersDb = {
  async getAll() {
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (!error && Array.isArray(data) && data.length > 0) {
        return data;
      }
    } catch (e) {}

    return [
      { id: 'BK-001', name: 'Ramesh Kumar', role: 'Beekeeper', apiary_name: 'Deccan Apiary', location_name: 'Nizamabad, Telangana' },
      { id: 'BK-002', name: 'Suresh Patel', role: 'Beekeeper', apiary_name: 'Amul Delta Apiaries', location_name: 'Anand, Gujarat' },
      { id: 'BK-003', name: 'Anita Devi', role: 'Beekeeper', apiary_name: 'Mithila Lychee Farms', location_name: 'Muzaffarpur, Bihar' }
    ];
  }
};

// 4. Supply Chain Logs (supply_chain_logs table)
const supplyChainLogsDb = {
  async insert(logRecord) {
    try {
      await supabase.from('supply_chain_logs').insert([{
        batch_id: logRecord.batch_id,
        stage: logRecord.stage,
        actor: logRecord.actor,
        location_name: logRecord.location_name,
        details: logRecord.details,
        block_tx_hash: logRecord.block_tx_hash
      }]);
    } catch (e) {}
  }
};

// 5. Login Sessions (login_sessions table)
const loginSessionsDb = {
  async getAll() {
    try {
      const rows = db.prepare('SELECT * FROM login_sessions ORDER BY timestamp DESC').all();
      if (rows && rows.length > 0) return rows;
    } catch (e) {}

    return [
      { id: 1, user_id: 'ADMIN-001', user_name: 'System Administrator', role: 'Admin', login_type: 'ADMIN_PORTAL', ip_address: '127.0.0.1', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) },
      { id: 2, user_id: 'BK-001', user_name: 'Ramesh Kumar', role: 'Beekeeper', login_type: 'USER_PORTAL', ip_address: '127.0.0.1', timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) }
    ];
  },

  async insert(sessionRecord) {
    try {
      db.prepare(`
        INSERT INTO login_sessions (user_id, user_name, role, login_type, ip_address, timestamp)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        sessionRecord.user_id,
        sessionRecord.user_name,
        sessionRecord.role,
        sessionRecord.login_type,
        sessionRecord.ip_address || '127.0.0.1',
        sessionRecord.timestamp
      );
    } catch (e) {}

    try {
      await supabase.from('supply_chain_logs').insert([{
        batch_id: 'SYSTEM_AUTH',
        stage: 'LOGIN',
        actor: sessionRecord.user_name,
        location_name: sessionRecord.login_type,
        details: { role: sessionRecord.role, userId: sessionRecord.user_id, type: sessionRecord.login_type },
        block_tx_hash: 'AUTH_SESSION_' + Date.now(),
        timestamp: sessionRecord.timestamp
      }]);
    } catch (e) {}
  }
};

module.exports = {
  db,
  supabase,
  initDatabase,
  seedDatabase,
  harvestBatchesDb,
  beehivesDb,
  usersDb,
  supplyChainLogsDb,
  loginSessionsDb
};
