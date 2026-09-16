// Mock data for static deployment (Vercel) where no backend server is available.
// When API calls fail, components fall back to this data.

import type { Batch, Hive, HiveAlert, BlockchainBlock, SmartRecommendation, DashboardData } from './types';

// ── Batches ──
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

// ── Hives ──
export const MOCK_HIVES: Hive[] = [
  { hive_id: 'HIVE-001', apiary_name: 'Cardamom & Eucalyptus Grove', location: 'Wayanad, Kerala', temperature_c: 34.2, humidity_pct: 68, weight_kg: 32.5, colony_strength: 'Strong', honey_level_pct: 72, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Partly Cloudy', updated_at: '2026-09-16 10:30:00', latitude: 11.6854, longitude: 76.132, ai: { colonyHealth: 92, stressRisk: 8, productivity: 'High', harvestReadiness: 'APPROACHING', harvestPrediction: { expectedDays: 12, expectedYieldKg: 8.5, confidencePct: 87, trend: 'Steady increase in honey stores' }, recommendation: 'Continue current management. Approaching harvest threshold.', whyThisResult: ['Strong colony population', 'Optimal temperature range', 'Good nectar flow'], label: 'Healthy — Approaching Harvest', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-002', apiary_name: 'Golden Fields Apiary', location: 'Ludhiana, Punjab', temperature_c: 35.8, humidity_pct: 55, weight_kg: 38.2, colony_strength: 'Very Strong', honey_level_pct: 88, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Sunny', updated_at: '2026-09-16 10:30:00', latitude: 30.901, longitude: 75.8573, ai: { colonyHealth: 96, stressRisk: 4, productivity: 'Very High', harvestReadiness: 'READY', harvestPrediction: { expectedDays: 3, expectedYieldKg: 14.2, confidencePct: 94, trend: 'Peak production reached' }, recommendation: 'Harvest immediately for optimal yield and quality.', whyThisResult: ['Honey level at 88%', 'Peak sunflower bloom season', 'Very strong colony'], label: 'Excellent — Ready for Harvest', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-003', apiary_name: 'Jamun Grove Apiary', location: 'Gwalior, Madhya Pradesh', temperature_c: 36.5, humidity_pct: 72, weight_kg: 28.1, colony_strength: 'Moderate', honey_level_pct: 45, pest_risk: 'Medium', queen_status: 'Active', weather_condition: 'Humid', updated_at: '2026-09-16 10:30:00', latitude: 26.2183, longitude: 78.1828, ai: { colonyHealth: 74, stressRisk: 26, productivity: 'Moderate', harvestReadiness: 'NOT READY', harvestPrediction: { expectedDays: 28, expectedYieldKg: 6.0, confidencePct: 68, trend: 'Slow buildup due to humidity' }, recommendation: 'Monitor pest risk closely. Consider ventilation improvements.', whyThisResult: ['Medium pest risk detected', 'Temperature slightly elevated', 'Moderate colony strength'], label: 'Attention Needed — Monitor Closely', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-004', apiary_name: 'Mangrove Reserve Apiary', location: 'Kakinada, Andhra Pradesh', temperature_c: 33.5, humidity_pct: 65, weight_kg: 35.0, colony_strength: 'Strong', honey_level_pct: 68, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Clear', updated_at: '2026-09-16 10:30:00', latitude: 16.9891, longitude: 82.2475, ai: { colonyHealth: 88, stressRisk: 12, productivity: 'High', harvestReadiness: 'APPROACHING', harvestPrediction: { expectedDays: 15, expectedYieldKg: 10.5, confidencePct: 82, trend: 'Steady nectar flow' }, recommendation: 'Good progress. Maintain current feeding schedule.', whyThisResult: ['Good nectar sources nearby', 'Low pest risk', 'Strong colony health'], label: 'Healthy — Good Progress', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-005', apiary_name: 'Litchi Orchards Apiary', location: 'Muzaffarpur, Bihar', temperature_c: 34.8, humidity_pct: 70, weight_kg: 30.4, colony_strength: 'Strong', honey_level_pct: 55, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Partly Cloudy', updated_at: '2026-09-16 10:30:00', latitude: 26.1209, longitude: 85.3647, ai: { colonyHealth: 85, stressRisk: 15, productivity: 'Moderate', harvestReadiness: 'NOT READY', harvestPrediction: { expectedDays: 22, expectedYieldKg: 7.8, confidencePct: 75, trend: 'Building up stores' }, recommendation: 'On track. Monitor humidity levels.', whyThisResult: ['Litchi bloom ending soon', 'Colony building stores', 'Good queen activity'], label: 'Healthy — Building Stores', dataNotice: 'AI-powered analysis based on hive sensor data' } },
  { hive_id: 'HIVE-007', apiary_name: 'Deccan Organic Apiary', location: 'Nizamabad, Telangana', temperature_c: 33.8, humidity_pct: 62, weight_kg: 34.2, colony_strength: 'Strong', honey_level_pct: 82, pest_risk: 'Low', queen_status: 'Active', weather_condition: 'Clear', updated_at: '2026-09-16 10:30:00', latitude: 18.6725, longitude: 78.0941, ai: { colonyHealth: 94, stressRisk: 6, productivity: 'Very High', harvestReadiness: 'READY', harvestPrediction: { expectedDays: 5, expectedYieldKg: 12.0, confidencePct: 91, trend: 'Near peak production' }, recommendation: 'Ready for harvest. Schedule extraction within the week.', whyThisResult: ['Honey level at 82%', 'Wildflower season peak', 'Excellent colony health'], label: 'Excellent — Harvest Ready', dataNotice: 'AI-powered analysis based on hive sensor data' } },
];

// ── Alerts ──
export const MOCK_ALERTS: HiveAlert[] = [
  { id: 1, hive_id: 'HIVE-003', alert_type: 'TEMPERATURE', title: 'High Temperature Alert', message: 'Hive temperature exceeded 36°C threshold', severity: 'warning', timestamp: '2026-09-16 09:45:00', sensor_value: '36.5°C', expected_range: '32-35°C', recommendation: 'Check ventilation and provide shade cover', resolved: 0 },
  { id: 2, hive_id: 'HIVE-003', alert_type: 'PEST_RISK', title: 'Medium Pest Risk Detected', message: 'Varroa mite indicators elevated in HIVE-003', severity: 'warning', timestamp: '2026-09-16 08:20:00', sensor_value: 'Medium', expected_range: 'Low', recommendation: 'Apply organic mite treatment within 48 hours', resolved: 0 },
  { id: 3, hive_id: 'HIVE-002', alert_type: 'HARVEST', title: 'Harvest Ready', message: 'HIVE-002 honey level at 88% — ready for harvest', severity: 'info', timestamp: '2026-09-16 07:00:00', sensor_value: '88%', expected_range: '> 80%', recommendation: 'Schedule harvest within 3 days for optimal quality', resolved: 0 },
  { id: 4, hive_id: 'HIVE-007', alert_type: 'HARVEST', title: 'Harvest Ready', message: 'HIVE-007 honey level at 82% — ready for harvest', severity: 'info', timestamp: '2026-09-15 18:30:00', sensor_value: '82%', expected_range: '> 80%', recommendation: 'Schedule extraction this week', resolved: 0 },
  { id: 5, hive_id: 'HIVE-001', alert_type: 'HUMIDITY', title: 'Humidity Rising', message: 'Humidity at 68% — monitor for increase', severity: 'info', timestamp: '2026-09-15 14:00:00', sensor_value: '68%', expected_range: '50-65%', recommendation: 'Ensure adequate ventilation', resolved: 1, resolved_at: '2026-09-15 16:00:00' },
];

// ── Blockchain Blocks ──
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

// ── Dashboard ──
export const MOCK_DASHBOARD: DashboardData = {
  summary: {
    totalBatches: 11,
    verifiedBatches: 9,
    activeBatches: 6,
    totalQuantityKg: 2701.5,
    qualityPassed: 8,
    qualityFailed: 0,
    totalEvents: 24,
    blockchainVerified: true,
  },
  activeAlerts: MOCK_ALERTS.filter(a => a.resolved === 0),
  productionByMonth: [
    { month: 'Apr', quantityKg: 320 },
    { month: 'May', quantityKg: 480 },
    { month: 'Jun', quantityKg: 390 },
    { month: 'Jul', quantityKg: 520 },
    { month: 'Aug', quantityKg: 610 },
    { month: 'Sep', quantityKg: 381.5 },
  ],
  statusCounts: [
    { status: 'Harvested', count: 3 },
    { status: 'Quality Checked', count: 3 },
    { status: 'Processed', count: 2 },
    { status: 'Distributed', count: 1 },
    { status: 'Delivered', count: 2 },
  ],
  qualityDistribution: [
    { name: 'Grade A+', value: 8, color: '#10B981' },
    { name: 'Grade A', value: 3, color: '#F59E0B' },
  ],
  regionalProduction: [
    { location: 'Nizamabad, Telangana', totalKg: 18, batchCount: 1 },
    { location: 'Muzaffarpur, Bihar', totalKg: 310, batchCount: 1 },
    { location: 'Bharatpur, Rajasthan', totalKg: 420, batchCount: 1 },
    { location: 'Coorg, Karnataka', totalKg: 180, batchCount: 1 },
    { location: 'Shimla, Himachal Pradesh', totalKg: 290, batchCount: 1 },
    { location: 'Ludhiana, Punjab', totalKg: 480, batchCount: 1 },
    { location: 'Satara, Maharashtra', totalKg: 340, batchCount: 1 },
  ],
  integrity: {
    valid: true,
    message: 'Blockchain integrity verified — all 24 blocks are valid and untampered.',
  },
};

// ── Verify Batch (Consumer Passport) ──
export function getMockVerifyData(batchId: string) {
  const batch = MOCK_BATCHES.find(b => b.id === batchId) || MOCK_BATCHES[MOCK_BATCHES.length - 1];
  const blocks = MOCK_BLOCKS.filter(b => b.batch_id === batch.id);

  return {
    batch,
    qualityCheck: {
      id: 1, batch_id: batch.id, inspector_name: 'FSSAI Lab Inspector',
      moisture_pct: batch.moisture_pct, purity_pct: 99.1, ph_level: 3.8,
      hmf_mg_kg: 12.4, adulteration_test: 'Passed', pollen_analysis: 'Authentic',
      colour: 'Golden Amber', aroma: 'Floral', quality_grade: batch.initial_quality_grade,
      status: 'Passed', notes: 'All parameters within FSSAI limits.', created_at: batch.created_at,
    },
    processing: {
      id: 1, batch_id: batch.id, processor_name: 'Deccan Honey Processing Unit',
      facility_name: 'FSSAI Certified Unit', processing_date: batch.extraction_date,
      filtering_status: 'Completed', heating_temp_c: 40, filtration_method: 'Micro-mesh',
      packaging_date: batch.extraction_date, package_size_g: 500, jars_count: Math.ceil(batch.quantity_kg * 2),
      notes: 'Processed under controlled conditions.', created_at: batch.created_at,
    },
    distribution: {
      id: 1, batch_id: batch.id, distributor_name: 'Green Logistics India',
      origin: batch.location, destination: 'Metro Retail Outlets',
      transport_vehicle: 'Refrigerated Truck', dispatch_date: batch.extraction_date,
      delivery_date: batch.extraction_date, storage_temp_c: 22,
      shipment_status: 'Delivered', notes: 'Cold chain maintained throughout.', created_at: batch.created_at,
    },
    blockchain: blocks.length > 0 ? blocks : [MOCK_BLOCKS[0]],
    verification: { valid: true, message: `Blockchain integrity verified for ${batch.id}` },
    ai: {
      authenticityScore: 97,
      label: '✅ AUTHENTIC — BLOCKCHAIN VERIFIED',
      whyThisResult: [
        'SHA-256 cryptographic hashes match across all supply chain blocks',
        'Quality parameters within FSSAI-approved limits',
        'GPS coordinates verified against registered apiary',
        'No tampering detected in blockchain ledger',
      ],
      recommendation: 'This honey is verified authentic and safe for consumption.',
      dataNotice: 'AI-powered authenticity analysis based on blockchain and quality data',
    },
  };
}

// ── Marketplace ──
export const MOCK_MARKETPLACE = MOCK_BATCHES.filter(b => ['Processed', 'Quality Checked', 'Distributed'].includes(b.status)).map(b => ({
  ...b,
  price_per_kg: Math.round(350 + Math.random() * 250),
  seller: b.beekeeper_name,
  verified: true,
}));

// ── Database Output (Admin) ──
export const MOCK_DATABASE_OUTPUT = {
  batches: MOCK_BATCHES,
  hives: MOCK_HIVES,
  alerts: MOCK_ALERTS,
  blockchain: MOCK_BLOCKS,
  stats: { totalBatches: 11, totalHives: 6, totalBlocks: 6, totalAlerts: 5 },
};

// ── Blockchain Verify ──
export const MOCK_BLOCKCHAIN_VERIFY = {
  valid: true,
  totalBlocks: MOCK_BLOCKS.length,
  message: `All ${MOCK_BLOCKS.length} blocks verified — blockchain integrity is INTACT.`,
};

// ── Tamper Demo ──
export const MOCK_TAMPER_DEMO = {
  success: true,
  message: 'Demo tamper applied to block #3 — hash mismatch injected.',
  tamperedBlock: 3,
};

export const MOCK_TAMPER_RESTORE = {
  success: true,
  message: 'All blocks restored to original state. Blockchain integrity verified.',
};

// ── Auth Login (mock) ──
export function getMockLoginResponse(body: any) {
  if (body.loginType === 'ADMIN') {
    return {
      success: true, loginType: 'ADMIN', role: 'Admin',
      user: { id: 'ADMIN-001', name: body.username || 'System Administrator', role: 'Admin' },
      message: 'Admin Portal Authenticated Successfully',
    };
  }
  return {
    success: true, loginType: 'USER', role: body.role || 'Beekeeper',
    user: { id: body.userId || 'BK-001', name: body.username || 'Ramesh Kumar', role: body.role || 'Beekeeper' },
    message: 'Authenticated Successfully',
  };
}
