import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

const SAMPLE_PAYLOADS = {
  'api.request':               { endpoint: '/v1/payments', method: 'POST', status: 200, latency_ms: 43, user_email: 'user@example.com' },
  'api.error':                 { endpoint: '/v1/subscriptions', method: 'GET', status: 500, error: 'Internal Server Error', user_email: 'user@example.com' },
  'billing.payment_succeeded': { amount: 4900, currency: 'usd', plan: 'pro', user_email: 'user@example.com' },
  'billing.payment_failed':    { amount: 4900, currency: 'usd', plan: 'pro', reason: 'card_declined', user_email: 'user@example.com' },
  'subscription.upgraded':     { from_plan: 'starter', to_plan: 'pro', user_email: 'user@example.com' },
  'subscription.cancelled':    { plan: 'pro', reason: 'too_expensive', user_email: 'user@example.com' },
};

async function hmacSign(secret, body) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw', encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

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

    const timestamp = new Date().toISOString();
    const payload = {
      event: eventType,
      timestamp,
      data: SAMPLE_PAYLOADS[eventType] || { message: 'Test event from FlutterStack' },
    };

    const body = JSON.stringify(payload);
    const startTime = Date.now();

    let statusCode = null;
    let responseBody = null;
    let deliveryError = null;
    let deliveryStatus = 'failed';

    try {
      const signature = webhook.secret ? await hmacSign(webhook.secret, body) : null;
      const headers = {
        'Content-Type': 'application/json',
        'User-Agent': 'FlutterStack-Webhooks/1.0',
        'X-FlutterStack-Event': eventType,
        'X-FlutterStack-Timestamp': timestamp,
      };
      if (signature) headers['X-FlutterStack-Signature'] = `sha256=${signature}`;

      const res = await fetch(webhook.url, {
        method: 'POST', headers, body,
        signal: AbortSignal.timeout(10000),
      });
      statusCode = res.status;
      responseBody = (await res.text().catch(() => null))?.slice(0, 500) || null;
      deliveryStatus = statusCode >= 200 && statusCode < 300 ? 'success' : 'failed';
    } catch (err) {
      deliveryError = err.message;
      deliveryStatus = err.name === 'TimeoutError' ? 'timeout' : 'failed';
      console.error('Webhook delivery error:', err.message);
    }

    const latency = Date.now() - startTime;

    // Log the test delivery
    await base44.entities.WebhookDeliveryLog.create({
      webhook_id: webhookId,
      event_type: eventType,
      status: deliveryStatus,
      http_status_code: statusCode,
      latency_ms: latency,
      error_message: deliveryError,
      response_body: responseBody,
      is_test: true,
    });

    // Update webhook last-triggered metadata
    await base44.entities.Webhook.update(webhookId, {
      last_triggered_at: new Date().toISOString(),
      last_status_code: statusCode,
      status: deliveryStatus === 'success' ? 'active' : 'failing',
    });

    return Response.json({
      success: deliveryStatus === 'success',
      statusCode,
      latency_ms: latency,
      error: deliveryError,
      responseBody,
    });
  } catch (error) {
    console.error('testWebhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});