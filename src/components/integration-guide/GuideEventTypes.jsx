import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Zap, Copy, CheckCircle2 } from 'lucide-react';

const EVENT_CATALOG = [
  {
    group: 'API',
    color: 'bg-blue-50 border-blue-200',
    labelColor: 'text-blue-700 bg-blue-100 border-blue-200',
    events: [
      {
        type: 'api.request',
        description: 'Fired on every successful API request made using one of your keys.',
        payload: {
          event: 'api.request',
          timestamp: '2026-05-22T14:30:00.000Z',
          data: { endpoint: '/v1/payments', method: 'POST', status: 200, latency_ms: 43, api_key_prefix: 'sk_live_ab', user_email: 'user@example.com' }
        }
      },
      {
        type: 'api.error',
        description: 'Fired when an API request returns a 4xx or 5xx status code.',
        payload: {
          event: 'api.error',
          timestamp: '2026-05-22T14:31:00.000Z',
          data: { endpoint: '/v1/subscriptions', method: 'GET', status: 500, error: 'Internal Server Error', api_key_prefix: 'sk_live_ab', user_email: 'user@example.com' }
        }
      },
    ]
  },
  {
    group: 'Billing',
    color: 'bg-green-50 border-green-200',
    labelColor: 'text-green-700 bg-green-100 border-green-200',
    events: [
      {
        type: 'billing.payment_succeeded',
        description: 'Fires when a payment is successfully collected for a subscription or one-time charge.',
        payload: {
          event: 'billing.payment_succeeded',
          timestamp: '2026-05-22T14:32:00.000Z',
          data: { amount: 4900, currency: 'usd', plan: 'pro', invoice_id: 'inv_xxxxx', user_email: 'user@example.com' }
        }
      },
      {
        type: 'billing.payment_failed',
        description: 'Fires when a payment attempt fails (e.g. card decline, insufficient funds).',
        payload: {
          event: 'billing.payment_failed',
          timestamp: '2026-05-22T14:33:00.000Z',
          data: { amount: 4900, currency: 'usd', plan: 'pro', reason: 'card_declined', user_email: 'user@example.com' }
        }
      },
    ]
  },
  {
    group: 'Subscriptions',
    color: 'bg-purple-50 border-purple-200',
    labelColor: 'text-purple-700 bg-purple-100 border-purple-200',
    events: [
      {
        type: 'subscription.upgraded',
        description: 'Fires when a user upgrades from a lower to a higher plan.',
        payload: {
          event: 'subscription.upgraded',
          timestamp: '2026-05-22T14:34:00.000Z',
          data: { from_plan: 'starter', to_plan: 'pro', user_email: 'user@example.com' }
        }
      },
      {
        type: 'subscription.cancelled',
        description: 'Fires when a user cancels their active subscription.',
        payload: {
          event: 'subscription.cancelled',
          timestamp: '2026-05-22T14:35:00.000Z',
          data: { plan: 'pro', reason: 'too_expensive', cancelled_at: '2026-05-22T14:35:00.000Z', user_email: 'user@example.com' }
        }
      },
    ]
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1 rounded hover:bg-white/50 text-gray-400 hover:text-[#635BFF] transition-colors">
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function EventRow({ event, groupColor, labelColor }) {
  const [open, setOpen] = useState(false);
  const payloadStr = JSON.stringify(event.payload, null, 2);

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${open ? groupColor : 'bg-white border-gray-100'}`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left"
      >
        <Zap className="w-3.5 h-3.5 text-[#635BFF] flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${labelColor}`}>
              {event.type}
            </span>
          </div>
          <p className="text-xs text-[#8898AA] mt-1">{event.description}</p>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>

      {open && (
        <div className="px-5 pb-5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Example Payload</p>
            <CopyButton text={payloadStr} />
          </div>
          <pre className="bg-[#0A2540] text-green-300 rounded-xl p-4 text-[11px] font-mono overflow-x-auto whitespace-pre leading-relaxed">
            {payloadStr}
          </pre>

          <div className="mt-4 bg-white/70 border border-gray-200 rounded-lg px-4 py-3">
            <p className="text-[10px] font-bold text-[#425466] uppercase tracking-wider mb-2">Verification</p>
            <p className="text-xs text-[#8898AA]">
              Each delivery includes a{' '}
              <code className="font-mono font-semibold text-[#635BFF]">X-FlutterStack-Signature</code>{' '}
              header. Verify it using HMAC-SHA256 with your webhook's signing secret to ensure the payload was not tampered with.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function GuideEventTypes() {
  const totalEvents = EVENT_CATALOG.reduce((s, g) => s + g.events.length, 0);

  return (
    <div className="space-y-8">
      {/* Header stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-lg font-extrabold text-[#0A2540]">{totalEvents}</p>
          <p className="text-xs text-[#8898AA]">Event Types</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
          <p className="text-lg font-extrabold text-[#0A2540]">{EVENT_CATALOG.length}</p>
          <p className="text-xs text-[#8898AA]">Categories</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm col-span-2 sm:col-span-1">
          <p className="text-lg font-extrabold text-[#0A2540]">HMAC-SHA256</p>
          <p className="text-xs text-[#8898AA]">Signing Method</p>
        </div>
      </div>

      {/* How it works callout */}
      <div className="bg-[#635BFF]/5 border border-[#635BFF]/20 rounded-xl px-5 py-4 space-y-1">
        <p className="text-xs font-bold text-[#0A2540]">How webhook delivery works</p>
        <p className="text-xs text-[#425466] leading-relaxed">
          Register an endpoint on the <strong>Webhooks</strong> page and subscribe to any of the events below.
          When the event fires, FlutterStack POSTs a signed JSON payload to your URL within milliseconds.
          Use the <code className="font-mono font-semibold text-[#635BFF]">deliverWebhook</code> function to dispatch custom events programmatically.
        </p>
      </div>

      {/* Event groups */}
      {EVENT_CATALOG.map(group => (
        <div key={group.group}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-extrabold text-[#0A2540]">{group.group}</h2>
            <span className="text-xs text-gray-400">{group.events.length} events</span>
          </div>
          <div className="space-y-2">
            {group.events.map(event => (
              <EventRow key={event.type} event={event} groupColor={group.color} labelColor={group.labelColor} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}