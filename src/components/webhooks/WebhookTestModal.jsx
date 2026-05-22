import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, XCircle, Loader2, Send, X } from 'lucide-react';

const ALL_EVENTS = [
  'api.request', 'api.error',
  'billing.payment_succeeded', 'billing.payment_failed',
  'subscription.upgraded', 'subscription.cancelled',
];

export default function WebhookTestModal({ webhook, onClose }) {
  const [selectedEvent, setSelectedEvent] = useState(webhook.events?.[0] || ALL_EVENTS[0]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    const res = await base44.functions.invoke('testWebhook', {
      webhookId: webhook.id,
      eventType: selectedEvent,
    });
    setResult(res.data);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-sm font-bold text-[#0A2540]">Test Webhook</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-[280px]">{webhook.url}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#425466] mb-2">Event Type</label>
            <select
              value={selectedEvent}
              onChange={e => setSelectedEvent(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-mono text-[#0A2540] focus:outline-none focus:border-[#635BFF]"
            >
              {ALL_EVENTS.map(evt => (
                <option key={evt} value={evt}>{evt}</option>
              ))}
            </select>
          </div>

          <Button
            onClick={runTest}
            disabled={loading}
            className="w-full bg-[#635BFF] hover:bg-[#5751e8] text-white flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {loading ? 'Sending…' : 'Send Test Event'}
          </Button>

          {result && (
            <div className={`rounded-xl border p-4 ${
              result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {result.success
                  ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                  : <XCircle className="w-4 h-4 text-red-500" />
                }
                <span className={`text-sm font-bold ${result.success ? 'text-green-700' : 'text-red-600'}`}>
                  {result.success ? 'Delivered successfully' : 'Delivery failed'}
                </span>
              </div>
              <div className="space-y-1 text-xs">
                {result.statusCode && (
                  <div className="flex justify-between text-gray-500">
                    <span>Status code</span>
                    <span className="font-mono font-semibold text-[#0A2540]">{result.statusCode}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-500">
                  <span>Latency</span>
                  <span className="font-mono font-semibold text-[#0A2540]">{result.latency_ms}ms</span>
                </div>
                {result.error && (
                  <div className="mt-2 p-2 bg-red-100 rounded-lg font-mono text-red-700 break-all">{result.error}</div>
                )}
                {result.responseBody && (
                  <div className="mt-2">
                    <p className="text-gray-400 mb-1">Response body</p>
                    <pre className="p-2 bg-gray-100 rounded-lg text-[#425466] overflow-auto max-h-20 text-[10px]">{result.responseBody}</pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}