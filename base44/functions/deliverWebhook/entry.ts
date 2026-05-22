import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Delivers an event payload to all active webhooks that subscribe to the event type.
 * Signs each payload with HMAC-SHA256 using the webhook's secret.
 * Logs every delivery attempt to the WebhookDeliveryLog entity.
 *
 * Body params:
 *   eventType  {string}  - e.g. "api.request"
 *   data       {object}  - event-specific payload data
 */

async function hmacSign(secret, body) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function deliverToWebhook(base44, webhook, eventType, payload, isTest = false) {
  const body = JSON.stringify(payload);
  const timestamp = payload.timestamp;
  const startTime = Date.now();

  let httpStatusCode = null;
  let responseBody = null;
  let errorMessage = null;
  let status = 'failed';

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
      method: 'POST',
      headers,
      body,
      signal: AbortSignal.timeout(10000),
    });

    httpStatusCode = res.status;
    responseBody = (await res.text().catch(() => null))?.slice(0, 500) || null;
    status = httpStatusCode >= 200 && httpStatusCode < 300 ? 'success' : 'failed';
  } catch (err) {
    errorMessage = err.message;
    status = err.name === 'TimeoutError' ? 'timeout' : 'failed';
    console.error(`Webhook delivery to ${webhook.url} failed:`, err.message);
  }

  const latency = Date.now() - startTime;

  // Log the delivery
  await base44.asServiceRole.entities.WebhookDeliveryLog.create({
    webhook_id: webhook.id,
    event_type: eventType,
    status,
    http_status_code: httpStatusCode,
    latency_ms: latency,
    error_message: errorMessage,
    response_body: responseBody,
    is_test: isTest,
  });

  // Update the webhook's last-triggered metadata
  const newWebhookStatus = status === 'success' ? 'active' : 'failing';
  await base44.asServiceRole.entities.Webhook.update(webhook.id, {
    last_triggered_at: new Date().toISOString(),
    last_status_code: httpStatusCode,
    failure_count: status === 'success' ? 0 : (webhook.failure_count || 0) + 1,
    ...(newWebhookStatus !== 'inactive' && { status: newWebhookStatus }),
  });

  return { status, httpStatusCode, latency, errorMessage };
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { eventType, data } = await req.json();
    if (!eventType) return Response.json({ error: 'eventType is required' }, { status: 400 });

    // Find all active webhooks owned by this user that subscribe to this event
    const allWebhooks = await base44.entities.Webhook.list('-created_date', 100);
    const targets = allWebhooks.filter(w =>
      w.status === 'active' &&
      Array.isArray(w.events) &&
      (w.events.includes(eventType) || w.events.includes('*'))
    );

    if (targets.length === 0) {
      return Response.json({ delivered: 0, message: 'No matching active webhooks' });
    }

    const payload = {
      event: eventType,
      timestamp: new Date().toISOString(),
      data: data || {},
    };

    const results = await Promise.all(
      targets.map(w => deliverToWebhook(base44, w, eventType, payload, false))
    );

    const succeeded = results.filter(r => r.status === 'success').length;
    return Response.json({ delivered: targets.length, succeeded, results });
  } catch (error) {
    console.error('deliverWebhook error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});