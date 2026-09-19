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
 * Resolves API requests to local mock database with matching backend signatures.
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
        const { newBlock } = addStoredBatch(newBatch);
        return {
          success: true,
          id: newId,
          batchId: newId,
          blockIndex: newBlock.block_index,
          hash: newBlock.current_hash,
          message: 'Batch successfully created and recorded to blockchain',
        };
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
    const { newBlock } = updateStoredBatchStatus(
      batchId,
      'Quality Checked',
      'QUALITY_CHECK',
      body.inspector_name || 'FSSAI Lab Inspector',
      `Moisture ${body.moisture_pct || 17.2}%, Purity ${body.purity_pct || 99.8}% — ${body.quality_grade || 'Grade A+'} Certified`
    );
    return {
      success: true,
      batchId,
      blockIndex: newBlock.block_index,
      hash: newBlock.current_hash,
      message: `Quality inspection recorded for ${batchId}`,
    };
  }

  const processMatch = pathname.match(/^\/api\/batches\/([^/]+)\/process$/);
  if (processMatch && method === 'POST') {
    const batchId = processMatch[1];
    let body: any = {};
    try { body = JSON.parse((options?.body as string) || '{}'); } catch {}
    const { newBlock } = updateStoredBatchStatus(
      batchId,
      'Processed',
      'PROCESSING',
      body.processor_name || 'Deccan Honey Processing Facility',
      `Thermal filtered at ${body.heating_temp_c || 40}°C, Micro-mesh filtered, Packed in jars`
    );
    return {
      success: true,
      batchId,
      blockIndex: newBlock.block_index,
      hash: newBlock.current_hash,
      message: `Processing stage recorded for ${batchId}`,
    };
  }

  const distributeMatch = pathname.match(/^\/api\/batches\/([^/]+)\/distribute$/);
  if (distributeMatch && method === 'POST') {
    const batchId = distributeMatch[1];
    let body: any = {};
    try { body = JSON.parse((options?.body as string) || '{}'); } catch {}
    const { newBlock } = updateStoredBatchStatus(
      batchId,
      'Distributed',
      'DISTRIBUTION',
      body.distributor_name || 'Green Logistics India',
      `Dispatched to ${body.destination || 'Metro Retail Outlets'} via Cold-Chain transport`
    );
    return {
      success: true,
      batchId,
      blockIndex: newBlock.block_index,
      hash: newBlock.current_hash,
      message: `Distribution logistics recorded for ${batchId}`,
    };
  }

  // Single Batch GET
  const singleBatchMatch = pathname.match(/^\/api\/batches\/([^/]+)$/);
  if (singleBatchMatch) {
    const batchId = singleBatchMatch[1];
    const found = getStoredBatches().find(b => b.id.toLowerCase() === batchId.toLowerCase());
    return found || getStoredBatches()[0];
  }

  // 4. Consumer Passport Verification & Traceability
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

const SUPABASE_REST_URL = 'https://ypywpedlduwpyzzrxova.supabase.co/rest/v1';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlweXdwZWRsZHV3cHl6enJ4b3ZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODk1NTkwMzYsImV4cCI6MjEwNTEzNTAzNn0.4xGD8sPjzM39psPDOMW0om1fVK_J3slBquNjgmmz_TI';

/**
 * Drop-in replacement for standard `fetch()`.
 * On localhost: calls backend API; if backend is unavailable or returns HTML, falls back to mock.
 * On Vercel: fetches live IoT beehive sensor telemetry directly from Supabase Cloud!
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

  const [pathname] = url.split('?');

  // Live Cloud Sync on Vercel: Query Supabase for real-time IoT telemetry from physical hardware
  if (/^\/api\/hives/.test(pathname) || /^\/api\/dashboard/.test(pathname)) {
    try {
      const supaRes = await fetch(`${SUPABASE_REST_URL}/beehives?select=*`, {
        cache: 'no-store',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      if (supaRes.ok) {
        const liveHives = await supaRes.json();
        if (Array.isArray(liveHives)) {
          const nowTime = new Date().toISOString().replace('T', ' ').slice(0, 19);

          const primaryLive = liveHives.find((h: any) => h.hive_id === 'HIVE-001') || 
                              liveHives.find((h: any) => h.hive_id === 'HIVE-007') || 
                              liveHives[0];
          const liveTemp = primaryLive && primaryLive.temperature_c !== undefined ? Number(primaryLive.temperature_c) : null;
          const liveHum = primaryLive && primaryLive.humidity_pct !== undefined ? Number(primaryLive.humidity_pct) : null;
          const liveWt = primaryLive && primaryLive.weight_kg !== undefined ? Number(primaryLive.weight_kg) : 19.4;

          MOCK_HIVES.forEach((existing) => {
            const match = liveHives.find((lh: any) => lh.hive_id === existing.hive_id);
            const targetTemp = match && match.temperature_c !== undefined && match.temperature_c !== null
              ? Number(match.temperature_c)
              : liveTemp;
            const targetHum = match && match.humidity_pct !== undefined && match.humidity_pct !== null
              ? Number(match.humidity_pct)
              : liveHum;
            const targetWt = match && match.weight_kg !== undefined && match.weight_kg !== null
              ? Number(match.weight_kg)
              : liveWt;

            if (targetTemp !== null && !isNaN(targetTemp)) {
              existing.temperature_c = Math.round(targetTemp * 10) / 10;
            }
            if (targetHum !== null && !isNaN(targetHum)) {
              existing.humidity_pct = Math.round(targetHum);
            }
            if (targetWt !== null && !isNaN(targetWt)) {
              existing.weight_kg = Math.round(targetWt * 10) / 10;
            }
            existing.updated_at = nowTime;

            // Dynamically recompute AI metrics based on live sensor telemetry
            if (existing.ai) {
              const t = existing.temperature_c;
              const h = existing.humidity_pct;


                let health = 94;
                let stress = 6;
                const reasons: string[] = ['Live IoT Hardware Active (DHT22 on COM7)'];

                if (t > 36.5) {
                  stress += Math.min(45, Math.round((t - 36.5) * 12));
                  health -= Math.min(40, Math.round((t - 36.5) * 10));
                  reasons.push(`High brood temperature: ${t.toFixed(1)}°C (Ventilation alert)`);
                } else if (t < 30.0) {
                  stress += Math.min(40, Math.round((30.0 - t) * 8));
                  health -= Math.min(30, Math.round((30.0 - t) * 6));
                  reasons.push(`Low ambient temperature: ${t.toFixed(1)}°C (Cluster warming active)`);
                } else {
                  reasons.push(`Optimal brood temperature: ${t.toFixed(1)}°C`);
                }

                if (h > 75) {
                  stress += Math.min(30, Math.round((h - 75) * 2));
                  reasons.push(`Elevated humidity: ${h}% (Condensation risk)`);
                } else if (h < 45) {
                  stress += Math.min(25, Math.round((45 - h) * 1.5));
                  reasons.push(`Low humidity: ${h}%`);
                } else {
                  reasons.push(`Balanced hive humidity: ${h}%`);
                }

                health = Math.max(20, Math.min(99, health));
                stress = Math.max(1, Math.min(95, stress));

                existing.ai.colonyHealth = health;
                existing.ai.stressRisk = stress;
                existing.ai.whyThisResult = reasons;

                if (t > 37.0 || h > 80) {
                  existing.ai.recommendation = `Alert: High heat/moisture detected (${t.toFixed(1)}°C, ${h}%). Inspect ventilation immediately.`;
                  existing.ai.label = 'Warning — Hive Stress Alert';
                } else if (t < 28.0) {
                  existing.ai.recommendation = `Ambient temperature is ${t.toFixed(1)}°C. Bees clustering for warmth. Maintain insulation.`;
                  existing.ai.label = 'Caution — Thermal Conservation';
                } else {
                  existing.ai.recommendation = `Optimal environmental conditions. Colony is operating at peak metabolic efficiency.`;
                  existing.ai.label = 'Healthy — Live Telemetry Active';
                }
              }
          });
        }
      }
    } catch (sErr) {
      console.warn('Live Supabase IoT sync notice:', sErr);
    }
  }

  // On Vercel (or when local backend is down / returned HTML), serve mock data directly
  const data = resolveMockRoute(url, options);
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
