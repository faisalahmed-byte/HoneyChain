// Smart fetch wrapper: tries the real API first, falls back to mock data on failure.
// This allows the app to work on both localhost (with backend) and Vercel (static only).

import {
  MOCK_BATCHES, MOCK_HIVES, MOCK_ALERTS, MOCK_BLOCKS,
  MOCK_DASHBOARD, MOCK_MARKETPLACE, MOCK_DATABASE_OUTPUT,
  MOCK_BLOCKCHAIN_VERIFY, MOCK_TAMPER_DEMO, MOCK_TAMPER_RESTORE,
  MOCK_RECOMMENDATIONS,
  getMockVerifyData, getMockLoginResponse,
} from './mockData';

type MockResolver = (url: string, options?: RequestInit) => any;

// Map URL patterns to mock data resolvers
const MOCK_ROUTES: Array<{ pattern: RegExp; resolve: MockResolver }> = [
  // Dashboard
  { pattern: /^\/api\/dashboard/, resolve: () => MOCK_DASHBOARD },

  // Batches
  { pattern: /^\/api\/batches$/, resolve: (_url, options) => {
    if (options?.method === 'POST') {
      // Simulate batch creation
      return { success: true, id: `HC-TG-2026-${String(MOCK_BATCHES.length + 1).padStart(3, '0')}`, message: 'Batch created (demo mode)' };
    }
    return MOCK_BATCHES;
  }},

  // Batch quality/process/distribute actions
  { pattern: /^\/api\/batches\/(.+)\/quality$/, resolve: () => ({ success: true, message: 'Quality check recorded (demo mode)' }) },
  { pattern: /^\/api\/batches\/(.+)\/process$/, resolve: () => ({ success: true, message: 'Processing recorded (demo mode)' }) },
  { pattern: /^\/api\/batches\/(.+)\/distribute$/, resolve: () => ({ success: true, message: 'Distribution recorded (demo mode)' }) },

  // Verify (Consumer Passport)
  { pattern: /^\/api\/verify\/(.+)/, resolve: (url) => {
    const match = url.match(/\/api\/verify\/(.+)/);
    const batchId = match ? match[1] : 'HC-TG-2026-001';
    return getMockVerifyData(batchId);
  }},

  // Hives
  { pattern: /^\/api\/hives/, resolve: () => ({
    hives: MOCK_HIVES,
    alerts: MOCK_ALERTS.filter(a => a.resolved === 0),
    recommendations: MOCK_RECOMMENDATIONS,
  })},

  // Alerts
  { pattern: /^\/api\/alerts\/(\d+)\/resolve$/, resolve: () => ({ success: true, message: 'Alert resolved (demo mode)' }) },
  { pattern: /^\/api\/alerts/, resolve: () => MOCK_ALERTS },

  // Blockchain
  { pattern: /^\/api\/blockchain\/tamper-demo$/, resolve: () => MOCK_TAMPER_DEMO },
  { pattern: /^\/api\/blockchain\/restore$/, resolve: () => MOCK_TAMPER_RESTORE },
  { pattern: /^\/api\/blockchain\/verify$/, resolve: () => MOCK_BLOCKCHAIN_VERIFY },
  { pattern: /^\/api\/blockchain/, resolve: () => ({
    blocks: MOCK_BLOCKS,
    verification: MOCK_BLOCKCHAIN_VERIFY,
  })},

  // Marketplace
  { pattern: /^\/api\/marketplace/, resolve: () => MOCK_MARKETPLACE },

  // Database Output (Admin)
  { pattern: /^\/api\/database\/output/, resolve: () => MOCK_DATABASE_OUTPUT },

  // Auth Login
  { pattern: /^\/api\/auth\/login/, resolve: (_url, options) => {
    try {
      const body = JSON.parse(options?.body as string || '{}');
      return getMockLoginResponse(body);
    } catch {
      return { success: true, loginType: 'USER', role: 'Beekeeper', user: { id: 'BK-001', name: 'Ramesh Kumar', role: 'Beekeeper' } };
    }
  }},
];

function findMockData(url: string, options?: RequestInit): any | null {
  // Extract pathname from full URL or relative path
  const pathname = url.startsWith('http') ? new URL(url).pathname : url.split('?')[0];
  
  for (const route of MOCK_ROUTES) {
    if (route.pattern.test(pathname)) {
      return route.resolve(pathname, options);
    }
  }
  return null;
}

/**
 * Drop-in replacement for `fetch` that tries the real API first,
 * and falls back to mock data if the request fails (e.g., on Vercel).
 */
export async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  try {
    const res = await fetch(url, options);
    if (res.ok) return res;
    // If server returned an error, try mock data
    throw new Error(`HTTP ${res.status}`);
  } catch (_err) {
    // API unavailable — serve mock data
    const mockData = findMockData(url, options);
    if (mockData !== null) {
      return new Response(JSON.stringify(mockData), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // No mock found, return an empty JSON response
    return new Response(JSON.stringify({}), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
