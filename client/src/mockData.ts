// Mock data and client-side database for static deployment (Vercel)
// When running without a backend, all features (CRUD, blockchain verification, telemetry, passport)
// run seamlessly in-browser with localStorage persistence.

import type { Batch, Hive, HiveAlert, BlockchainBlock, SmartRecommendation, DashboardData } from './types';

// ── Initial Seed Batches ──
export const MOCK_BATCHES: Batch[] = [
  { id: 'HC-TG-2026-011', hive_id: 'HIVE-007', beekeeper_name: 'Priya Sharma', apiary_name: 'Coorg Natural Honey Estate', location: 'Coorg, KA', gps_lat: 18.6725, gps_lng: 78.0941, extraction_date: '2026-09-15', floral_source: 'Wild Shola Forest Nectar Honey', hives_count: 12, quantity_kg: 18.5, moisture_pct: 17.2, temperature_c: 33.8, initial_quality_grade: 'Grade A+', harvest_method: 'Manual Centrifugal Extraction', notes: 'Harvested from verified organic apiary during peak blossom season.', status: 'Processed', created_at: '2026-09-15 20:33:51' },
  { id: 'HC-TG-2026-010', hive_id: 'HIVE-006', beekeeper_name: 'Sahyadri Bee Keepers', apiary_name: 'Western Ghats Flora', location: 'Satara, Maharashtra', gps_lat: 17.6805, gps_lng: 74.0183, extraction_date: '2026-09-10', floral_source: 'Multifloral Honey', hives_count: 45, quantity_kg: 340, moisture_pct: 17, temperature_c: 28.5, initial_quality_grade: 'Grade A+', harvest_method: 'Comb Cold Draining', notes: 'Rich multi-floral honey from Sahyadri slopes.', status: 'Quality Checked', created_at: '2026-09-10 09:00:00' },
  { id: 'HC-TG-2026-009', hive_id: 'HIVE-004', beekeeper_name: 'Godavari Delta Bee Farms', apiary_name: 'Mangrove Reserve Apiary', location: 'Kakinada, Andhra Pradesh', gps_lat: 16.9891, gps_lng: 82.2475, extraction_date: '2026-09-09', floral_source: 'Neem Honey', hives_count: 32, quantity_kg: 210, moisture_pct: 17.6, temperature_c: 32, initial_quality_grade: 'Grade A+', harvest_method: 'Centrifugal Extraction', notes: 'Pure organic Neem blossom honey.', status: 'Quality Checked', created_at: '2026-09-09 11:00:00' },
  { id: 'HC-TG-2026-008', hive_id: 'HIVE-003', beekeeper_name: 'Chambal Agro Honey', apiary_name: 'Jamun Grove Apiary', location: 'Gwalior, Madhya Pradesh', gps_lat: 26.2183, gps_lng: 78.1828, extraction_date: '2026-09-08', floral_source: 'Jamun Honey', hives_count: 40, quantity_kg: 275, moisture_pct: 17.4, temperature_c: 30.5, initial_quality_grade: 'Grade A+', harvest_method: 'Manual Comb Draining', notes: 'Dark purple-tinted low GI honey ideal for wellness.', status: 'Harvested', created_at: '2026-09-08 10:15:00' },
  { id: 'HC-TG-2026-007', hive_id: 'HIVE-002', beekeeper_name: 'Punjab Agritech Beekeepers', apiary_name: 'Golden Fields Apiary', location: 'Ludhiana, Punjab', gps_lat: 30.901, gps_lng: 75.8573, extraction_date: '2026-09-07', floral_source: 'Sunflower Honey', hives_count: 60, quantity_kg: 480, moisture_pct: 18.2, temperature_c: 33, initial_quality_grade: 'Grade A', harvest_method: 'Automated Extraction Line', notes: 'Bright yellow sweet sunflower blossom honey.', status: 'Harvested', created_at: '2026-09-07 09:30:00' },
  { id: 'HC-TG-2026-006', hive_id: 'HIVE-001', beekeeper_name: 'Wayanad Spice Apiaries', apiary_name: 'Cardamom & Eucalyptus Grove', location: 'Wayanad, Kerala', gps_lat: 11.6854, gps_lng: 76.132, extraction_date: '2026-09-06', floral_source: 'Eucalyptus Honey', hives_count: 25, quantity_kg: 160, moisture_pct: 17.9, temperature_c: 27.8, initial_quality_grade: 'Grade A', harvest_method: 'Centrifugal Extractor', notes: 'Distinct herbal minty honey with high antioxidant content.', status: 'Harvested', created_at: '2026-09-06 08:10:00' },
  { id: 'HC-TG-2026-005', hive_id: 'HIVE-010', beekeeper_name: 'Himalayan Bee Keepers', apiary_name: 'Pine & Acacia Valley', location: 'Shimla, Himachal Pradesh', gps_lat: 31.1048, gps_lng: 77.1734, extraction_date: '2026-09-05', floral_source: 'Acacia Honey', hives_count: 48, quantity_kg: 290, moisture_pct: 17.1, temperature_c: 24.2, initial_quality_grade: 'Grade A+', harvest_method: 'Manual Comb Draining', notes: 'Crystal clear slow-crystallizing white acacia honey.', status: 'Quality Checked', created_at: '2026-09-05 07:45:00' },
  { id: 'HC-TG-2026-004', hive_id: 'HIVE-009', beekeeper_name: 'Coorg Natural Honey', apiary_name: 'Western Ghats Flora Apiary', location: 'Coorg, Karnataka', gps_lat: 12.3375, gps_lng: 75.8069, extraction_date: '2026-09-04', floral_source: 'Forest Honey', hives_count: 30, quantity_kg: 180, moisture_pct: 16.8, temperature_c: 26.5, initial_quality_grade: 'Grade A+', harvest_method: 'Cold Extraction', notes: 'Wild forest flora honey collected from shola forest borders.', status: 'Processed', created_at: '2026-09-04 11:20:00' },
  { id: 'HC-TG-2026-003', hive_id: 'HIVE-008', beekeeper_name: 'Bharatpur Honey Co-op', apiary_name: 'Mustard Valley Apiary', location: 'Bharatpur, Rajasthan', gps_lat: 27.217, gps_lng: 77.4895, extraction_date: '2026-09-03', floral_source: 'Mustard Honey', hives_count: 55, quantity_kg: 420, moisture_pct: 17.5, temperature_c: 29.8, initial_quality_grade: 'Grade A+', harvest_method: 'Warm Cell Centrifugal', notes: 'Creamy high-glucose honey extracted from organic mustard fields.', status: 'Distributed', created_at: '2026-09-03 10:00:00' },
  { id: 'HC-TG-2026-002', hive_id: 'HIVE-005', beekeeper_name: 'Sunil Organic Apiaries', apiary_name: 'Litchi Orchards Apiary', location: 'Muzaffarpur, Bihar', gps_lat: 26.1209, gps_lng: 85.3647, extraction_date: '2026-09-02', floral_source: 'Lychee Honey', hives_count: 38, quantity_kg: 310, moisture_pct: 18, temperature_c: 31, initial_quality_grade: 'Grade A', harvest_method: 'Super Comb Extraction', notes: 'Light golden honey with sweet floral fruity notes.', status: 'Delivered', created_at: '2026-09-02 09:15:00' },
  { id: 'HC-TG-2026-001', hive_id: 'HIVE-007', beekeeper_name: 'Ramesh Honey Farms', apiary_name: 'Deccan Organic Apiary', location: 'Nizamabad, Telangana', gps_lat: 18.6725, gps_lng: 78.0941, extraction_date: '2026-09-01', floral_source: 'Wildflower Honey', hives_count: 12, quantity_kg: 18, moisture_pct: 17.2, temperature_c: 33.8, initial_quality_grade: 'Grade A+', harvest_method: 'Manual Centrifugal Extraction', notes: 'Harvested from HIVE-007 during peak blossom season. Rich golden nectar with herbal medicinal aroma.', status: 'Delivered', created_at: '2026-09-01 08:30:00' },
];

// ── Initial Seed Hives ──
export const MOCK_HIVES: Hive[] = [
  { hive_id: 'HIVE-001', apiary_name: 'Cardamom & Eucalyptus Grove', location: 'Wayanad, Kerala', temperature_c: 34.2, humidity_pct: 68, weight_kg: 32.5, colony_strength: 'Strong', honey_level_pct: 72, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Partly Cloudy', updated_at: '2026-09-16 10:30:00', latitude: 11.6854, longitude: 76.132, ai: { colonyHealth: 92, stressRisk: 8, productivity: 'High', harvestReadiness: 'APPROACHING', harvestPrediction: { expectedDays: 12, expectedYieldKg: 8.5, confidencePct: 87, trend: 'Steady increase in honey stores' }, recommendation: 'Continue current management. Approaching harvest threshold.', whyThisResult: ['Strong colony population', 'Optimal temperature range', 'Good nectar flow'], label: 'Healthy — Approaching Harvest', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-002', apiary_name: 'Golden Fields Apiary', location: 'Ludhiana, Punjab', temperature_c: 35.8, humidity_pct: 55, weight_kg: 38.2, colony_strength: 'Very Strong', honey_level_pct: 88, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Sunny', updated_at: '2026-09-16 10:30:00', latitude: 30.901, longitude: 75.8573, ai: { colonyHealth: 96, stressRisk: 4, productivity: 'Very High', harvestReadiness: 'READY', harvestPrediction: { expectedDays: 3, expectedYieldKg: 14.2, confidencePct: 94, trend: 'Peak production reached' }, recommendation: 'Harvest immediately for optimal yield and quality.', whyThisResult: ['Honey level at 88%', 'Peak sunflower bloom season', 'Very strong colony'], label: 'Excellent — Ready for Harvest', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-003', apiary_name: 'Jamun Grove Apiary', location: 'Gwalior, Madhya Pradesh', temperature_c: 36.5, humidity_pct: 72, weight_kg: 28.1, colony_strength: 'Moderate', honey_level_pct: 45, pest_risk: 'Medium', queen_status: 'Active', weather_condition: 'Humid', updated_at: '2026-09-16 10:30:00', latitude: 26.2183, longitude: 78.1828, ai: { colonyHealth: 74, stressRisk: 26, productivity: 'Moderate', harvestReadiness: 'NOT READY', harvestPrediction: { expectedDays: 28, expectedYieldKg: 6.0, confidencePct: 68, trend: 'Slow buildup due to humidity' }, recommendation: 'Monitor pest risk closely. Consider ventilation improvements.', whyThisResult: ['Medium pest risk detected', 'Temperature slightly elevated', 'Moderate colony strength'], label: 'Attention Needed — Monitor Closely', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-004', apiary_name: 'Mangrove Reserve Apiary', location: 'Kakinada, Andhra Pradesh', temperature_c: 33.5, humidity_pct: 65, weight_kg: 35.0, colony_strength: 'Strong', honey_level_pct: 68, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Clear', updated_at: '2026-09-16 10:30:00', latitude: 16.9891, longitude: 82.2475, ai: { colonyHealth: 88, stressRisk: 12, productivity: 'High', harvestReadiness: 'APPROACHING', harvestPrediction: { expectedDays: 15, expectedYieldKg: 10.5, confidencePct: 82, trend: 'Steady nectar flow' }, recommendation: 'Good progress. Maintain current feeding schedule.', whyThisResult: ['Good nectar sources nearby', 'Low pest risk', 'Strong colony health'], label: 'Healthy — Good Progress', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-005', apiary_name: 'Litchi Orchards Apiary', location: 'Muzaffarpur, Bihar', temperature_c: 34.8, humidity_pct: 70, weight_kg: 30.4, colony_strength: 'Strong', honey_level_pct: 55, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Partly Cloudy', updated_at: '2026-09-16 10:30:00', latitude: 26.1209, longitude: 85.3647, ai: { colonyHealth: 85, stressRisk: 15, productivity: 'Moderate', harvestReadiness: 'NOT READY', harvestPrediction: { expectedDays: 22, expectedYieldKg: 7.8, confidencePct: 75, trend: 'Building up stores' }, recommendation: 'On track. Monitor humidity levels.', whyThisResult: ['Litchi bloom ending soon', 'Colony building stores', 'Good queen activity'], label: 'Healthy — Building Stores', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-007', apiary_name: 'Deccan Organic Apiary', location: 'Nizamabad, Telangana', temperature_c: 33.8, humidity_pct: 62, weight_kg: 34.2, colony_strength: 'Strong', honey_level_pct: 82, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Clear', updated_at: '2026-09-16 10:30:00', latitude: 18.6725, longitude: 78.0941, ai: { colonyHealth: 94, stressRisk: 6, productivity: 'Very High', harvestReadiness: 'READY', harvestPrediction: { expectedDays: 5, expectedYieldKg: 12.0, confidencePct: 91, trend: 'Near peak production' }, recommendation: 'Ready for harvest. Schedule extraction within the week.', whyThisResult: ['Honey level at 82%', 'Wildflower season peak', 'Excellent colony health'], label: 'Excellent — Harvest Ready', dataNotice: 'AI-powered analysis based on hive sensor data' } },
];

// ── Initial Seed Alerts ──
export const MOCK_ALERTS: HiveAlert[] = [
  { id: 1, hive_id: 'HIVE-003', alert_type: 'TEMPERATURE', title: 'High Temperature Alert', message: 'Hive temperature exceeded 36°C threshold', severity: 'warning', timestamp: '2026-09-16 09:45:00', sensor_value: '36.5°C', expected_range: '32-35°C', recommendation: 'Check ventilation and provide shade cover', resolved: 0 },
  { id: 2, hive_id: 'HIVE-003', alert_type: 'PEST_RISK', title: 'Medium Pest Risk Detected', message: 'Varroa mite indicators elevated in HIVE-003', severity: 'warning', timestamp: '2026-09-16 08:20:00', sensor_value: 'Medium', expected_range: 'Low', recommendation: 'Apply organic mite treatment within 48 hours', resolved: 0 },
  { id: 3, hive_id: 'HIVE-002', alert_type: 'HARVEST', title: 'Harvest Ready', message: 'HIVE-002 honey level at 88% — ready for harvest', severity: 'info', timestamp: '2026-09-16 07:00:00', sensor_value: '88%', expected_range: '> 80%', recommendation: 'Schedule harvest within 3 days for optimal quality', resolved: 0 },
  { id: 4, hive_id: 'HIVE-007', alert_type: 'HARVEST', title: 'Harvest Ready', message: 'HIVE-007 honey level at 82% — ready for harvest', severity: 'info', timestamp: '2026-09-15 18:30:00', sensor_value: '82%', expected_range: '> 80%', recommendation: 'Schedule extraction this week', resolved: 0 },
  { id: 5, hive_id: 'HIVE-001', alert_type: 'HUMIDITY', title: 'Humidity Rising', message: 'Humidity at 68% — monitor for increase', severity: 'info', timestamp: '2026-09-15 14:00:00', sensor_value: '68%', expected_range: '50-65%', recommendation: 'Ensure adequate ventilation', resolved: 1, resolved_at: '2026-09-15 16:00:00' },
];

// ── Initial Seed Blockchain Blocks ──
export const MOCK_BLOCKS: BlockchainBlock[] = [
  { block_index: 1, batch_id: 'HC-TG-2026-001', event_type: 'HARVEST', timestamp: '2026-09-01 08:30:00', actor: 'Ramesh Honey Farms', location: 'Nizamabad, Telangana', details: 'Manual Centrifugal Extraction — 18 kg Wildflower Honey from HIVE-007', previous_hash: '0000000000000000000000000000000000000000000000000000000000000000', current_hash: '96c4c2e70235ced6543473a5a2ae86f22b864a6a8f57ce6a86e2f454e3c786c6', is_tampered: 0 },
  { block_index: 2, batch_id: 'HC-TG-2026-001', event_type: 'QUALITY_CHECK', timestamp: '2026-09-01 14:00:00', actor: 'FSSAI Lab Inspector', location: 'Hyderabad Lab', details: 'Moisture 17.2%, Purity 99.1%, pH 3.8 — Grade A+ Certified', previous_hash: '96c4c2e70235ced6543473a5a2ae86f22b864a6a8f57ce6a86e2f454e3c786c6', current_hash: 'a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01', is_tampered: 0 },
  { block_index: 3, batch_id: 'HC-TG-2026-001', event_type: 'PROCESSING', timestamp: '2026-09-02 10:00:00', actor: 'Deccan Honey Processing Unit', location: 'Nizamabad', details: 'Filtered at 40°C, Micro-mesh filtration, Packed in 500g jars x 36', previous_hash: 'a1b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef01', current_hash: 'b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef0123', is_tampered: 0 },
  { block_index: 4, batch_id: 'HC-TG-2026-001', event_type: 'DISTRIBUTION', timestamp: '2026-09-03 06:00:00', actor: 'Green Logistics India', location: 'Nizamabad → Hyderabad', details: 'Refrigerated transport at 22°C, Delivered to Organic Mart outlets', previous_hash: 'b2c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef0123', current_hash: 'c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef012345', is_tampered: 0 },
  { block_index: 5, batch_id: 'HC-TG-2026-002', event_type: 'HARVEST', timestamp: '2026-09-02 09:15:00', actor: 'Sunil Organic Apiaries', location: 'Muzaffarpur, Bihar', details: 'Super Comb Extraction — 310 kg Lychee Honey from HIVE-005', previous_hash: 'c3d4e5f6789012345678abcdef0123456789abcdef0123456789abcdef012345', current_hash: 'b82a62f8fc9bad6f897ac0fa80ab417a50a37b4833d6a1ef25b26ac90080e2b5', is_tampered: 0 },
  { block_index: 6, batch_id: 'HC-TG-2026-003', event_type: 'HARVEST', timestamp: '2026-09-03 10:00:00', actor: 'Bharatpur Honey Co-op', location: 'Bharatpur, Rajasthan', details: 'Warm Cell Centrifugal — 420 kg Mustard Honey from HIVE-008', previous_hash: 'b82a62f8fc9bad6f897ac0fa80ab417a50a37b4833d6a1ef25b26ac90080e2b5', current_hash: 'dc061e5cc6eaba0018a39b42fa32b1efbedf33f3bbe018347b7230dd99b9d7b8', is_tampered: 0 },
];

// ── Recommendations ──
export const MOCK_RECOMMENDATIONS: SmartRecommendation[] = [
  { hive_id: 'HIVE-002', type: 'harvest', category: 'Harvest', recommendation: 'Honey level at 88%. Harvest immediately for peak quality.' },
  { hive_id: 'HIVE-007', type: 'harvest', category: 'Harvest', recommendation: 'Honey level at 82%. Schedule harvest this week.' },
  { hive_id: 'HIVE-003', type: 'pest', category: 'Pest Management', recommendation: 'Medium pest risk. Apply organic varroa treatment.' },
  { hive_id: 'HIVE-001', type: 'monitoring', category: 'Monitoring', recommendation: 'Humidity rising. Improve ventilation in hive area.' },
];

// ── Initial Seed Marketplace ──
export const MOCK_MARKETPLACE = [
  { id: 'PROD-001', batch_id: 'HC-TG-2026-001', name: 'Raw Wildflower Honey (500g)', honey_type: 'Wildflower Honey', price_inr: 450, package_size: '500 g', beekeeper_name: 'Ramesh Honey Farms', location: 'Nizamabad, Telangana', in_stock: 1 },
  { id: 'PROD-002', batch_id: 'HC-TG-2026-002', name: 'Pure Lychee Blossom Honey (500g)', honey_type: 'Lychee Honey', price_inr: 520, package_size: '500 g', beekeeper_name: 'Sunil Organic Apiaries', location: 'Muzaffarpur, Bihar', in_stock: 1 },
  { id: 'PROD-003', batch_id: 'HC-TG-2026-003', name: 'Organic Mustard Honey (1kg)', honey_type: 'Mustard Honey', price_inr: 650, package_size: '1000 g', beekeeper_name: 'Bharatpur Honey Co-op', location: 'Bharatpur, Rajasthan', in_stock: 1 },
  { id: 'PROD-004', batch_id: 'HC-TG-2026-004', name: 'Western Ghats Forest Honey (250g)', honey_type: 'Forest Honey', price_inr: 600, package_size: '250 g', beekeeper_name: 'Coorg Natural Honey', location: 'Coorg, Karnataka', in_stock: 1 },
  { id: 'PROD-005', batch_id: 'HC-TG-2026-005', name: 'Himalayan White Acacia Honey (500g)', honey_type: 'Acacia Honey', price_inr: 750, package_size: '500 g', beekeeper_name: 'Himalayan Bee Keepers', location: 'Shimla, HP', in_stock: 1 },
  { id: 'PROD-006', batch_id: 'HC-TG-2026-009', name: 'Pure Organic Neem Honey (500g)', honey_type: 'Neem Honey', price_inr: 580, package_size: '500 g', beekeeper_name: 'Godavari Delta Bee Farms', location: 'Kakinada, Andhra Pradesh', in_stock: 1 },
  { id: 'PROD-007', batch_id: 'HC-TG-2026-008', name: 'Dark Jamun Organic Honey (500g)', honey_type: 'Jamun Honey', price_inr: 620, package_size: '500 g', beekeeper_name: 'Chambal Agro Honey', location: 'Gwalior, Madhya Pradesh', in_stock: 1 },
  { id: 'PROD-008', batch_id: 'HC-TG-2026-006', name: 'Herbal Eucalyptus Honey (500g)', honey_type: 'Eucalyptus Honey', price_inr: 490, package_size: '500 g', beekeeper_name: 'Wayanad Spice Apiaries', location: 'Wayanad, Kerala', in_stock: 1 },
  { id: 'PROD-009', batch_id: 'HC-TG-2026-007', name: 'Golden Sunflower Honey (1kg)', honey_type: 'Sunflower Honey', price_inr: 680, package_size: '1000 g', beekeeper_name: 'Punjab Agritech Beekeepers', location: 'Ludhiana, Punjab', in_stock: 1 },
];

// ── Initial Seed Users ──
export const MOCK_USERS = [
  { id: 'ADMIN-001', name: 'System Administrator', email: 'admin@honeychain.gov.in', role: 'Admin', organization: 'National Bee Board & FSSAI', created_at: '2026-01-01 00:00:00' },
  { id: 'BK-001', name: 'Ramesh Kumar', email: 'ramesh@deccanapiary.com', role: 'Beekeeper', organization: 'Ramesh Honey Farms', created_at: '2026-01-15 08:30:00' },
  { id: 'PROC-001', name: 'Dr. A. K. Verma', email: 'verma@testinglab.gov.in', role: 'Processor', organization: 'FSSAI Testing Laboratory', created_at: '2026-02-01 09:00:00' },
  { id: 'DIST-001', name: 'Green Logistics Dispatcher', email: 'dispatch@greenlogistics.in', role: 'Distributor', organization: 'Green Logistics India', created_at: '2026-02-10 11:00:00' },
  { id: 'CONS-001', name: 'Verified Consumer', email: 'consumer@honeychain.io', role: 'Consumer', organization: 'Retail Consumer Portal', created_at: '2026-03-01 12:00:00' },
];

// ── Initial Seed Sessions ──
export const MOCK_SESSIONS = [
  { id: 'SESS-2026-089', user_name: 'System Administrator', user_id: 'ADMIN-001', role: 'Admin', portal_type: 'ADMIN', ip_address: '103.45.12.8', created_at: '2026-09-16 10:15:22' },
  { id: 'SESS-2026-088', user_name: 'Ramesh Kumar', user_id: 'BK-001', role: 'Beekeeper', portal_type: 'USER', ip_address: '182.74.88.19', created_at: '2026-09-16 09:40:11' },
  { id: 'SESS-2026-087', user_name: 'Dr. A. K. Verma', user_id: 'PROC-001', role: 'Processor', portal_type: 'USER', ip_address: '49.36.192.44', created_at: '2026-09-16 08:12:00' },
  { id: 'SESS-2026-086', user_name: 'Green Logistics Dispatcher', user_id: 'DIST-001', role: 'Distributor', portal_type: 'USER', ip_address: '115.112.5.70', created_at: '2026-09-15 17:22:45' },
];

// ── In-Memory / LocalStorage State Store ──
function getStorageItem<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function setStorageItem<T>(key: string, val: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // Ignore quota errors
  }
}

// Batches Store
export function getStoredBatches(): Batch[] {
  return getStorageItem<Batch[]>('HC_STORE_BATCHES', MOCK_BATCHES);
}

export function addStoredBatch(newBatch: Batch): { newBatch: Batch; newBlock: BlockchainBlock } {
  const batches = getStoredBatches();
  batches.unshift(newBatch);
  setStorageItem('HC_STORE_BATCHES', batches);

  // Also append a new block to blockchain
  const blocks = getStoredBlocks();
  const lastBlock = blocks[blocks.length - 1];
  const newBlock: BlockchainBlock = {
    block_index: blocks.length + 1,
    batch_id: newBatch.id,
    event_type: 'HARVEST',
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    actor: newBatch.beekeeper_name,
    location: newBatch.location,
    details: `${newBatch.harvest_method || 'Centrifugal Extraction'} — ${newBatch.quantity_kg} kg ${newBatch.floral_source} from ${newBatch.hive_id}`,
    previous_hash: lastBlock ? lastBlock.current_hash : '0000000000000000000000000000000000000000000000000000000000000000',
    current_hash: generateMockHash(),
    is_tampered: 0,
  };
  blocks.push(newBlock);
  setStorageItem('HC_STORE_BLOCKS', blocks);
  return { newBatch, newBlock };
}

export function updateStoredBatchStatus(id: string, status: Batch['status'], eventType: string, actor: string, details: string): { newBlock: BlockchainBlock } {
  const batches = getStoredBatches();
  const batch = batches.find(b => b.id.toLowerCase() === id.toLowerCase());
  if (batch) {
    batch.status = status;
    setStorageItem('HC_STORE_BATCHES', batches);
  }

  const blocks = getStoredBlocks();
  const lastBlock = blocks[blocks.length - 1];
  const newBlock: BlockchainBlock = {
    block_index: blocks.length + 1,
    batch_id: id,
    event_type: eventType,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    actor,
    location: batch ? batch.location : 'Processing Facility',
    details,
    previous_hash: lastBlock ? lastBlock.current_hash : '0000000000000000000000000000000000000000000000000000000000000000',
    current_hash: generateMockHash(),
    is_tampered: 0,
  };
  blocks.push(newBlock);
  setStorageItem('HC_STORE_BLOCKS', blocks);
  return { newBlock };
}

// Alerts Store
export function getStoredAlerts(): HiveAlert[] {
  return getStorageItem<HiveAlert[]>('HC_STORE_ALERTS', MOCK_ALERTS);
}
export function resolveStoredAlert(id: number): void {
  const alerts = getStoredAlerts();
  const alert = alerts.find(a => a.id === id);
  if (alert) {
    alert.resolved = 1;
    alert.resolved_at = new Date().toISOString().replace('T', ' ').slice(0, 19);
    setStorageItem('HC_STORE_ALERTS', alerts);
  }
}

// Blocks Store
export function getStoredBlocks(): BlockchainBlock[] {
  return getStorageItem<BlockchainBlock[]>('HC_STORE_BLOCKS', MOCK_BLOCKS);
}
export function tamperStoredBlock(blockIndex: number = 3): void {
  const blocks = getStoredBlocks();
  const block = blocks.find(b => b.block_index === blockIndex);
  if (block) {
    block.is_tampered = 1;
    block.details = '[TAMPERED] Unauthorized payload modification detected in ledger';
    block.current_hash = 'TAMPERED_INVALID_HASH_883a0091bfec9102';
    setStorageItem('HC_STORE_BLOCKS', blocks);
  }
}
export function restoreStoredBlocks(): void {
  setStorageItem('HC_STORE_BLOCKS', MOCK_BLOCKS);
}

// Sessions Store
export function getStoredSessions(): typeof MOCK_SESSIONS {
  return getStorageItem('HC_STORE_SESSIONS', MOCK_SESSIONS);
}
export function addStoredSession(session: any): void {
  const sessions = getStoredSessions();
  sessions.unshift(session);
  setStorageItem('HC_STORE_SESSIONS', sessions);
}

function generateMockHash(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// ── Dynamic Dashboard Generator ──
export function getMockDashboard(query?: string): DashboardData {
  let batches = getStoredBatches();
  let alerts = getStoredAlerts();

  if (query) {
    const params = new URLSearchParams(query);
    const beekeeper = params.get('beekeeper');
    if (beekeeper) {
      batches = batches.filter(b => b.beekeeper_name.toLowerCase().includes(beekeeper.toLowerCase()));
    }
  }

  const totalQuantityKg = batches.reduce((acc, b) => acc + (b.quantity_kg || 0), 0);
  const activeAlerts = alerts.filter(a => a.resolved === 0);
  const blocks = getStoredBlocks();
  const isTampered = blocks.some(b => b.is_tampered === 1);

  // Status breakdown
  const statusMap: Record<string, number> = {};
  batches.forEach(b => {
    statusMap[b.status] = (statusMap[b.status] || 0) + 1;
  });
  const statusCounts = Object.entries(statusMap).map(([status, count]) => ({ status, count }));

  // Regional breakdown
  const regionMap: Record<string, { totalKg: number; count: number }> = {};
  batches.forEach(b => {
    const loc = b.location || 'Unknown';
    if (!regionMap[loc]) regionMap[loc] = { totalKg: 0, count: 0 };
    regionMap[loc].totalKg += b.quantity_kg || 0;
    regionMap[loc].count += 1;
  });
  const regionalProduction = Object.entries(regionMap).map(([location, val]) => ({
    location,
    totalKg: Math.round(val.totalKg * 10) / 10,
    batchCount: val.count,
  }));

  return {
    summary: {
      totalBatches: batches.length,
      verifiedBatches: batches.filter(b => b.status !== 'Harvested').length,
      activeBatches: batches.filter(b => ['Harvested', 'Quality Checked', 'Processed', 'Distributed'].includes(b.status)).length,
      totalQuantityKg: Math.round(totalQuantityKg * 10) / 10,
      qualityPassed: batches.filter(b => b.status !== 'Harvested').length,
      qualityFailed: 0,
      totalEvents: blocks.length,
      blockchainVerified: !isTampered,
    },
    activeAlerts,
    productionByMonth: [
      { month: 'Apr', quantityKg: 320 },
      { month: 'May', quantityKg: 480 },
      { month: 'Jun', quantityKg: 390 },
      { month: 'Jul', quantityKg: 520 },
      { month: 'Aug', quantityKg: 610 },
      { month: 'Sep', quantityKg: Math.round(totalQuantityKg * 10) / 10 },
    ],
    statusCounts: statusCounts.length > 0 ? statusCounts : [
      { status: 'Harvested', count: 3 },
      { status: 'Quality Checked', count: 3 },
      { status: 'Processed', count: 2 },
      { status: 'Distributed', count: 1 },
      { status: 'Delivered', count: 2 },
    ],
    qualityDistribution: [
      { name: 'Grade A+', value: Math.max(1, batches.filter(b => b.initial_quality_grade === 'Grade A+').length), color: '#10B981' },
      { name: 'Grade A', value: Math.max(1, batches.filter(b => b.initial_quality_grade === 'Grade A').length), color: '#F59E0B' },
    ],
    regionalProduction: regionalProduction.length > 0 ? regionalProduction : [
      { location: 'Nizamabad, Telangana', totalKg: 18, batchCount: 1 },
      { location: 'Muzaffarpur, Bihar', totalKg: 310, batchCount: 1 },
      { location: 'Bharatpur, Rajasthan', totalKg: 420, batchCount: 1 },
    ],
    integrity: {
      valid: !isTampered,
      message: isTampered
        ? 'ALERT: Blockchain integrity violation detected — block hash mismatch!'
        : `Blockchain integrity verified — all ${blocks.length} blocks are cryptographically valid and untampered.`,
    },
  };
}

// ── Verify Batch (Consumer Passport & Journey) ──
export function getMockVerifyData(batchId: string) {
  const batches = getStoredBatches();
  const batch = batches.find(b => b.id.toLowerCase() === batchId.toLowerCase()) || batches[0];
  const allBlocks = getStoredBlocks();
  const blocks = allBlocks.filter(b => b.batch_id.toLowerCase() === batch.id.toLowerCase());
  const isTampered = blocks.some(b => b.is_tampered === 1);
  const matchedHive = MOCK_HIVES.find(h => h.hive_id === batch.hive_id) || MOCK_HIVES[0];

  const qualityData = {
    id: 1,
    batch_id: batch.id,
    inspector_name: 'Dr. A. K. Verma (National Honey Testing Lab)',
    moisture_pct: batch.moisture_pct || 17.2,
    purity_pct: 99.8,
    ph_level: 3.85,
    hmf_mg_kg: 12.4,
    adulteration_test: 'Passed (C4 Sugar & NMR Clean)',
    pollen_analysis: 'Dominant Floral Nectar Pollen (> 75%)',
    colour: 'Golden Amber',
    aroma: 'Rich Floral Medicinal',
    quality_grade: batch.initial_quality_grade || 'Grade A+',
    status: 'Passed',
    notes: 'Exceeds FSSAI and BIS export purity standards. Zero adulterants detected.',
    created_at: batch.created_at,
  };

  const processingData = {
    id: 1,
    batch_id: batch.id,
    processor_name: 'Deccan Honey Processing Facility',
    facility_name: 'FSSAI Certified Unit #TS-NZB-04',
    processing_date: batch.extraction_date,
    filtering_status: 'Completed',
    heating_temp_c: 40,
    filtration_method: 'Cold Micro-mesh (Raw Unpasteurized)',
    packaging_date: batch.extraction_date,
    package_size_g: 500,
    jars_count: Math.ceil((batch.quantity_kg || 20) * 2),
    notes: 'Low-temperature processing preserving natural enzymes and diastase activity.',
    created_at: batch.created_at,
  };

  const distributionData = {
    id: 1,
    batch_id: batch.id,
    distributor_name: 'Green Logistics India',
    origin: batch.location,
    destination: 'Metro Retail Outlets & Organic Stores',
    transport_vehicle: 'Refrigerated Cold-Chain Fleet #TS-09-GL',
    dispatch_date: batch.extraction_date,
    delivery_date: batch.extraction_date,
    storage_temp_c: 22,
    shipment_status: 'Delivered',
    notes: 'Cold chain temperature strictly logged between 18-24°C throughout transit.',
    created_at: batch.created_at,
  };

  const timeline = [
    {
      stage: 'HARVESTED',
      icon: '🐝',
      title: 'Harvested at Apiary',
      actor: batch.beekeeper_name,
      location: batch.location,
      date: batch.extraction_date,
      details: `Floral Source: ${batch.floral_source} | Hive: ${batch.hive_id} | Quantity: ${batch.quantity_kg} kg | Moisture: ${batch.moisture_pct}%`,
      completed: true,
      block: blocks[0] || allBlocks[0],
    },
    {
      stage: 'COLLECTED',
      icon: '🧺',
      title: 'Collected & Aggregated',
      actor: `${batch.apiary_name} Hub`,
      location: batch.location,
      date: batch.extraction_date,
      details: 'Sealed in food-grade stainless transport cans with tamper seals',
      completed: true,
      block: blocks[0] || allBlocks[0],
    },
    {
      stage: 'QUALITY CHECK',
      icon: '🧪',
      title: 'Quality Tested & Verified',
      actor: qualityData.inspector_name,
      location: 'Regional Testing Lab',
      date: batch.extraction_date,
      details: `Purity: ${qualityData.purity_pct}% | Grade: ${qualityData.quality_grade} | Test: ${qualityData.adulteration_test}`,
      completed: batch.status !== 'Harvested',
      block: blocks[1] || blocks[0],
    },
    {
      stage: 'PROCESSED',
      icon: '🏭',
      title: 'Filtered & Gently Warmed',
      actor: processingData.processor_name,
      location: processingData.facility_name,
      date: processingData.processing_date,
      details: `Heating: ${processingData.heating_temp_c}°C | Filtration: ${processingData.filtration_method}`,
      completed: ['Processed', 'Distributed', 'Delivered'].includes(batch.status),
      block: blocks[2] || blocks[0],
    },
    {
      stage: 'PACKAGED',
      icon: '📦',
      title: 'Packaged & Sealed',
      actor: processingData.facility_name,
      location: batch.location,
      date: processingData.packaging_date,
      details: `Bottled into ${processingData.jars_count} x ${processingData.package_size_g}g glass jars with QR integrity seals`,
      completed: ['Processed', 'Distributed', 'Delivered'].includes(batch.status),
      block: blocks[2] || blocks[0],
    },
    {
      stage: 'DISTRIBUTED',
      icon: '🚚',
      title: 'Distributed via Cold-Chain',
      actor: distributionData.distributor_name,
      location: `${distributionData.origin} → ${distributionData.destination}`,
      date: distributionData.dispatch_date,
      details: `Vehicle: ${distributionData.transport_vehicle} | Storage Temp: ${distributionData.storage_temp_c}°C`,
      completed: ['Distributed', 'Delivered'].includes(batch.status),
      block: blocks[3] || blocks[0],
    },
    {
      stage: 'CONSUMER',
      icon: '🏠',
      title: 'Ready for Consumer',
      actor: 'End Consumer',
      location: 'Retail / Home',
      date: 'Verified Today',
      details: 'QR code scanned and authenticity verified via Honey Chain blockchain',
      completed: true,
    },
  ];

  return {
    authentic: !isTampered,
    verificationMessage: !isTampered ? 'VERIFIED AUTHENTIC HONEY' : 'VERIFICATION FAILED',
    batchId: batch.id,
    batch,
    hive: matchedHive,
    quality: qualityData,
    qualityCheck: qualityData,
    processing: processingData,
    distribution: distributionData,
    timeline,
    blockchain: blocks.length > 0 ? blocks : [allBlocks[0]],
    batchBlocks: blocks.length > 0 ? blocks : [allBlocks[0]],
    verification: {
      valid: !isTampered,
      message: isTampered
        ? `TAMPER WARNING: Cryptographic block hash mismatch detected for ${batch.id}`
        : `Blockchain integrity cryptographically verified for ${batch.id}`,
    },
    ai: {
      authenticityScore: isTampered ? 28 : 98,
      label: isTampered ? '❌ TAMPERED LEDGER DETECTED' : '✅ 100% AUTHENTIC & VERIFIED',
      whyThisResult: isTampered
        ? ['Block hash mismatch detected in cryptographic chain', 'Data modification attempt detected', 'Integrity flag raised']
        : [
            'SHA-256 cryptographic hashes verified across all supply chain blocks',
            'Quality parameters fully comply with FSSAI & BIS limits (Moisture < 20%, HMF < 40mg/kg)',
            'Geo-tagged harvest GPS coordinates matched against registered Deccan Apiary',
            'Zero adulterants detected via C4/C3 Sugar testing',
          ],
      recommendation: isTampered
        ? 'DO NOT CONSUME — Cryptographic ledger indicates batch data tampering.'
        : 'This honey is verified 100% authentic, pure, and safe for consumption.',
      dataNotice: 'AI-powered authenticity verification validated via SHA-256 cryptographic blockchain audit.',
    },
    aiInsights: {
      colonyHealth: 94,
      stressRisk: 6,
      productivity: 'High',
      harvestReadiness: 'READY',
      harvestPrediction: { expectedDays: 5, expectedYieldKg: 12.0, confidencePct: 91, trend: 'Near peak production' }
    }
  };
}

// ── Database Output (Admin View) ──
export function getMockDatabaseOutput() {
  return {
    loginSessions: getStoredSessions(),
    batches: getStoredBatches(),
    hives: MOCK_HIVES,
    users: MOCK_USERS,
    blocks: getStoredBlocks(),
    alerts: getStoredAlerts(),
    products: MOCK_MARKETPLACE,
    timestamp: new Date().toISOString(),
  };
}

// ── Blockchain Verify ──
export function getMockBlockchainVerify() {
  const blocks = getStoredBlocks();
  const tamperedBlock = blocks.find(b => b.is_tampered === 1);
  if (tamperedBlock) {
    return {
      valid: false,
      tamperedBlock: tamperedBlock.block_index,
      message: `CRITICAL: Hash mismatch detected at Block #${tamperedBlock.block_index}! Tampering detected.`,
    };
  }
  return {
    valid: true,
    totalBlocks: blocks.length,
    message: `All ${blocks.length} blocks verified — blockchain integrity is INTACT.`,
  };
}

// ── Auth Login ──
export function getMockLoginResponse(body: any) {
  const sessionId = `SESS-2026-${String(Math.floor(100 + Math.random() * 900))}`;
  const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

  if (body.loginType === 'ADMIN') {
    const adminUser = { id: 'ADMIN-001', name: body.username || 'System Administrator', role: 'Admin' };
    addStoredSession({
      id: sessionId,
      user_name: adminUser.name,
      user_id: adminUser.id,
      role: 'Admin',
      portal_type: 'ADMIN',
      ip_address: '127.0.0.1 (Demo Mode)',
      created_at: now,
    });
    return {
      success: true,
      loginType: 'ADMIN',
      role: 'Admin',
      user: adminUser,
      message: 'Admin Portal Authenticated Successfully',
    };
  }

  const role = body.role || 'Beekeeper';
  const user = {
    id: body.userId || (role === 'Beekeeper' ? 'BK-001' : `${role.toUpperCase()}-001`),
    name: body.username || (role === 'Beekeeper' ? 'Ramesh Kumar' : `${role} User`),
    role,
  };

  addStoredSession({
    id: sessionId,
    user_name: user.name,
    user_id: user.id,
    role,
    portal_type: 'USER',
    ip_address: '127.0.0.1 (Demo Mode)',
    created_at: now,
  });

  return {
    success: true,
    loginType: 'USER',
    role,
    user,
    message: 'Authenticated Successfully',
  };
}
