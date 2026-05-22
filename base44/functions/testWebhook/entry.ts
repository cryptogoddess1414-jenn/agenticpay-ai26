import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SAMPLE_PAYLOADS = {
  'api.request': {
    event: 'api.request',
    timestamp: new Date().toISOString(),
    data: { endpoint: '/v1/payments', method: 'POST', status: 200, latency_ms: 43, user_email: 'user@example.com' }
  },
  'api.error': {
    event: 'api.error',
    timestamp: new Date().toISOString(),
    data: { endpoint: '/v1/subscriptions', method: 'GET', status: 500, error: 'Internal Server Error', user_email: 'user@example.com' }
  },
  'billing.payment_succeeded': {
    event: 'billing.payment_succeeded',
    timestamp: new Date().toISOString(),
    data: { amount: 4900, currency: 'usd', plan: 'pro', user_email: 'user@example.com' }
  },
  'billing.payment_failed': {
    event: 'billing.payment_failed',
    timestamp: new Date().toISOString(),
    data: { amount: 4900, currency: 'usd', plan: 'pro', reason: 'card_declined', user_email: 'user@example.com' }
  },
  'subscription.upgraded': {
    event: 'subscription.upgraded',
    timestamp: new Date().toISOString(),
    data: { from_plan: 'starter', to_plan: 'pro', user_email: 'user@example.com' }
  },
  'subscription.cancelled': {
    event: 'subscription.cancelled',
    timestamp: new Date().toISOString(),
    data: { plan: 'pro', reason: 'too_expensive', user_email: 'user@example.com' }
  },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { webhookId, eventType } = await req.json();
    if (!webhookId || !eventType) {
      return Response.json({ error: 'webhookId and eventType are required' }, { status: 400 });
    }

    const webhooks = await base44.entities.Webhook.filter({ id: webhookId });
    const webhook = webhooks[0];
    if (!webhook) return Response.json({ error: 'Webhook not found' }, { status: 404 });

    const payload = SAMPLE_PAYLOADS[eventType] || {
      event: eventType,
      timestamp: new Date().toISOString(),
      data: { message: 'Test event from FlutterStack' }
    };

    const body = JSON.stringify(payload);
    const startTime = Date.now();

    let statusCode = null;
    let responseBody = null;
    let deliveryError = null;

    try {
      const res = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'FlutterStack-Webhooks/1.0',
          'X-FlutterStack-Event': eventType,
          'X-FlutterStack-Timestamp': payload.timestamp,
        },
        body,
        signal: AbortSignal.timeout(10000),
      });
      statusCode = res.status;
      responseBody = await res.text().catch(() => null);
    } catch (err) {
      deliveryError = err.message;
      console.error('Webhook delivery error:', err.message);
    }

    const latency = Date.now() - startTime;

    // Update webhook record with last test result
    await base44.entities.Webhook.update(webhookId, {
      last_triggered_at: new Date().toISOString(),
      last_status_code: statusCode,
      status: statusCode && statusCode >= 200 && statusCode < 300 ? 'active' : 'failing',
    });

    return Response.json({
      success: statusCode >= 200 && statusCode < 300,
      statusCode,
      latency_ms: latency,
      error: deliveryError,
      responseBody: responseBody?.slice(0, 500),
    });
  } catch (error) {
    console.error('testWebhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});