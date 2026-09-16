// Smart API fetch layer:
// 1. On localhost with live Node/SQLite backend: proxies to real API server.
// 2. On Vercel (or when offline / backend unavailable): serves rich, persistent client-side data
//    allowing all 15 views, charts, passport, QR codes, and blockchain verification to run 100% smoothly.

import {
  MOCK_HIVES,
  MOCK_RECOMMENDATIONS,
  MOCK_MARKETPLACE,
  getStoredBatches,
  addStoredBatch,
  updateStoredBatchStatus,
  getStoredAlerts,
  resolveStoredAlert,
  getStoredBlocks,
  tamperStoredBlock,
  restoreStoredBlocks,
  getMockDashboard,
  getMockVerifyData,
  getMockDatabaseOutput,
  getMockBlockchainVerify,
  getMockLoginResponse,
} from './mockData';

// Determine if running on localhost with a live Node server
const isLocalhost = typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' ||
   window.location.hostname === '127.0.0.1' ||
   window.location.hostname.endsWith('.local'));

/**
 * Resolves API requests to local mock database.
 */
function resolveMockRoute(url: string, options?: RequestInit): any {
  const [pathname, queryString] = url.split('?');
  const method = (options?.method || 'GET').toUpperCase();

  // 1. Dashboard
  if (/^\/api\/dashboard/.test(pathname)) {
    return getMockDashboard(queryString);
  }

  // 2. Batches
  if (pathname === '/api/batches') {
    if (method === 'POST') {
      try {
        const body = JSON.parse((options?.body as string) || '{}');
        const count = getStoredBatches().length + 1;
        const newId = `HC-TG-2026-${String(count).padStart(3, '0')}`;
        const newBatch = {
          id: newId,
          hive_id: body.hive_id || 'HIVE-007',
          beekeeper_name: body.beekeeper_name || 'Ramesh Honey Farms',
          apiary_name: body.apiary_name || 'Deccan Organic Apiary',
          location: body.location || 'Nizamabad, Telangana',
          gps_lat: Number(body.gps_lat) || 18.6725,
          gps_lng: Number(body.gps_lng) || 78.0941,
          extraction_date: body.extraction_date || new Date().toISOString().split('T')[0],
          floral_source: body.floral_source || 'Raw Mustard Honey',
          hives_count: Number(body.hives_count) || 12,
          quantity_kg: Number(body.quantity_kg) || 45,
          moisture_pct: Number(body.moisture_pct) || 17.5,
          temperature_c: Number(body.hive_temp_at_harvest) || 34.0,
          initial_quality_grade: 'Grade A+',
          harvest_method: 'Manual Centrifugal Extraction',
          notes: 'Harvested from verified organic apiary during peak blossom season.',
          status: 'Harvested' as const,
          created_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
        };
        addStoredBatch(newBatch);
        return { success: true, id: newId, message: 'Batch successfully created and recorded to blockchain' };
      } catch (e: any) {
        return { success: false, error: e.message };
      }
    }

    // GET /api/batches
    let batches = getStoredBatches();
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const beekeeper = params.get('beekeeper');
      if (beekeeper) {
        batches = batches.filter(b => b.beekeeper_name.toLowerCase().includes(beekeeper.toLowerCase()));
      }
    }
    return batches;
  }

  // 3. Batch Actions (Quality, Process, Distribute)
  const qualityMatch = pathname.match(/^\/api\/batches\/([^/]+)\/quality$/);
  if (qualityMatch && method === 'POST') {
    const batchId = qualityMatch[1];
    let body: any = {};
    try { body = JSON.parse((options?.body as string) || '{}'); } catch {}
    updateStoredBatchStatus(
      batchId,
      'Quality Checked',
      'QUALITY_CHECK',
      body.inspector_name || 'FSSAI Lab Inspector',
      `Moisture ${body.moisture_pct || 17.2}%, Purity ${body.purity_pct || 99.8}% — ${body.quality_grade || 'Grade A+'} Certified`
    );
    return { success: true, message: `Quality inspection recorded for ${batchId}` };
  }

  const processMatch = pathname.match(/^\/api\/batches\/([^/]+)\/process$/);
  if (processMatch && method === 'POST') {
    const batchId = processMatch[1];
    let body: any = {};
    try { body = JSON.parse((options?.body as string) || '{}'); } catch {}
    updateStoredBatchStatus(
      batchId,
      'Processed',
      'PROCESSING',
      body.processor_name || 'Deccan Honey Processing Facility',
      `Thermal filtered at ${body.heating_temp_c || 40}°C, Micro-mesh filtered, Packed in jars`
    );
    return { success: true, message: `Processing stage recorded for ${batchId}` };
  }

  const distributeMatch = pathname.match(/^\/api\/batches\/([^/]+)\/distribute$/);
  if (distributeMatch && method === 'POST') {
    const batchId = distributeMatch[1];
    let body: any = {};
    try { body = JSON.parse((options?.body as string) || '{}'); } catch {}
    updateStoredBatchStatus(
      batchId,
      'Distributed',
      'DISTRIBUTION',
      body.distributor_name || 'Green Logistics India',
      `Dispatched to ${body.destination || 'Metro Retail Outlets'} via Cold-Chain transport`
    );
    return { success: true, message: `Distribution logistics recorded for ${batchId}` };
  }

  // Single Batch GET
  const singleBatchMatch = pathname.match(/^\/api\/batches\/([^/]+)$/);
  if (singleBatchMatch) {
    const batchId = singleBatchMatch[1];
    const found = getStoredBatches().find(b => b.id.toLowerCase() === batchId.toLowerCase());
    return found || getStoredBatches()[0];
  }

  // 4. Consumer Passport Verification
  const verifyMatch = pathname.match(/^\/api\/verify\/([^/]+)/);
  if (verifyMatch) {
    const batchId = verifyMatch[1];
    return getMockVerifyData(batchId);
  }

  // 5. Hives & Telemetry
  if (/^\/api\/hives/.test(pathname)) {
    return {
      hives: MOCK_HIVES,
      alerts: getStoredAlerts().filter(a => a.resolved === 0),
      recommendations: MOCK_RECOMMENDATIONS,
    };
  }

  // 6. Alerts
  const resolveAlertMatch = pathname.match(/^\/api\/alerts\/(\d+)\/resolve$/);
  if (resolveAlertMatch && method === 'POST') {
    const alertId = Number(resolveAlertMatch[1]);
    resolveStoredAlert(alertId);
    return { success: true, message: 'Alert marked as resolved' };
  }

  if (/^\/api\/alerts/.test(pathname)) {
    const allAlerts = getStoredAlerts();
    if (queryString) {
      const params = new URLSearchParams(queryString);
      const status = params.get('status');
      if (status === 'active') return allAlerts.filter(a => a.resolved === 0);
      if (status === 'resolved') return allAlerts.filter(a => a.resolved === 1);
    }
    return allAlerts;
  }

  // 7. Blockchain
  if (pathname === '/api/blockchain/verify' && method === 'POST') {
    return getMockBlockchainVerify();
  }

  if (pathname === '/api/blockchain/tamper-demo' && method === 'POST') {
    tamperStoredBlock(3);
    return {
      success: true,
      message: 'Tamper demo executed: Block #3 altered with invalid hash.',
      tamperedBlock: 3,
    };
  }

  if (pathname === '/api/blockchain/restore' && method === 'POST') {
    restoreStoredBlocks();
    return {
      success: true,
      message: 'Blockchain restored: all cryptographic SHA-256 hashes verified.',
    };
  }

  if (/^\/api\/blockchain/.test(pathname)) {
    return {
      blocks: getStoredBlocks(),
      verification: getMockBlockchainVerify(),
    };
  }

  // 8. Marketplace
  if (/^\/api\/marketplace/.test(pathname)) {
    return MOCK_MARKETPLACE;
  }

  // 9. Database Output (Admin)
  if (/^\/api\/database\/output/.test(pathname)) {
    return getMockDatabaseOutput();
  }

  // 10. Auth Login
  if (/^\/api\/auth\/login/.test(pathname)) {
    try {
      const body = JSON.parse((options?.body as string) || '{}');
      return getMockLoginResponse(body);
    } catch {
      return getMockLoginResponse({ role: 'Beekeeper' });
    }
  }

  // Fallback default
  return {};
}

/**
 * Drop-in replacement for standard `fetch()`.
 * On localhost: calls backend API; if backend is unavailable or returns HTML, falls back to mock.
 * On Vercel: immediately serves rich mock data without hitting static HTML catch-all.
 */
export async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  // If running locally, attempt real backend proxy first
  if (isLocalhost) {
    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get('content-type') || '';
      // Only treat it as successful if HTTP status is 2xx AND content-type is JSON!
      // If it returned HTML or 404/500, fallback to mock data!
      if (res.ok && contentType.includes('application/json')) {
        return res;
      }
    } catch (_err) {
      // Local backend offline or connection refused, fallback to mock data
    }
  }

  // On Vercel (or when local backend is down / returned HTML), serve mock data directly
  const data = resolveMockRoute(url, options);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
