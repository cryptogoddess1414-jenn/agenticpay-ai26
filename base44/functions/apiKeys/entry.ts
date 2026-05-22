import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

async function generateApiKey(mode) {
  const prefix = mode === 'live' ? 'sk_live_' : 'sk_test_';
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  const random = btoa(String.fromCharCode(...bytes)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 32);
  return prefix + random;
}

async function hashKey(key) {
  const encoded = new TextEncoder().encode(key);
  const hashBuf = await crypto.subtle.digest('SHA-256', encoded);
  return Array.from(new Uint8Array(hashBuf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function seedLogs(base44, apiKeyId, userEmail) {
  const endpoints = [
    { endpoint: '/v1/customers', method: 'GET' },
    { endpoint: '/v1/charges', method: 'POST' },
    { endpoint: '/v1/subscriptions', method: 'GET' },
    { endpoint: '/v1/payment_intents', method: 'POST' },
    { endpoint: '/v1/refunds', method: 'GET' },
  ];
  const statuses = [200, 200, 201, 200, 400, 200, 200, 401];
  const count = Math.floor(Math.random() * 6) + 3;
  const logs = Array.from({ length: count }, (_, i) => {
    const ep = endpoints[i % endpoints.length];
    return {
      api_key_id: apiKeyId,
      user_email: userEmail,
      endpoint: ep.endpoint,
      method: ep.method,
      status_code: statuses[Math.floor(Math.random() * statuses.length)],
      latency_ms: Math.floor(Math.random() * 280) + 40,
      ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
    };
  });
  await base44.asServiceRole.entities.ApiKeyLog.bulkCreate(logs);
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action } = body;

    if (action === 'create') {
      const { name, mode, expires_at } = body;
      if (!name || !mode) return Response.json({ error: 'name and mode required' }, { status: 400 });
      const fullKey = await generateApiKey(mode);
      const hash = await hashKey(fullKey);
      const record = {
        user_email: user.email,
        name,
        mode,
        key_prefix: fullKey.slice(0, 13),
        key_hash: hash,
        status: 'active',
        total_requests: 0,
        ...(expires_at ? { expires_at } : {}),
      };
      const created = await base44.asServiceRole.entities.ApiKey.create(record);
      await seedLogs(base44, created.id, user.email);
      return Response.json({ key: created, full_key: fullKey });
    }

    if (action === 'revoke') {
      const { id } = body;
      const updated = await base44.asServiceRole.entities.ApiKey.update(id, { status: 'revoked' });
      return Response.json({ key: updated });
    }

    if (action === 'delete') {
      const { id } = body;
      await base44.asServiceRole.entities.ApiKey.delete(id);
      return Response.json({ success: true });
    }

    if (action === 'list') {
      const keys = await base44.asServiceRole.entities.ApiKey.filter({ user_email: user.email }, '-created_date', 50);
      return Response.json({ keys });
    }

    if (action === 'logs') {
      const { id } = body;
      const logs = await base44.asServiceRole.entities.ApiKeyLog.filter({ api_key_id: id }, '-created_date', 50);
      return Response.json({ logs });
    }

    return Response.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('apiKeys error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});