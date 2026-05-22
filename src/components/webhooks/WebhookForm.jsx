import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Globe, Lock, ChevronDown, ChevronUp } from 'lucide-react';

const ALL_EVENTS = [
  { group: 'API', events: ['api.request', 'api.error'] },
  { group: 'Billing', events: ['billing.payment_succeeded', 'billing.payment_failed'] },
  { group: 'Subscriptions', events: ['subscription.upgraded', 'subscription.cancelled'] },
];

function generateSecret() {
  const arr = new Uint8Array(24);
  crypto.getRandomValues(arr);
  return Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
}

export default function WebhookForm({ webhook, onSave, onCancel, loading }) {
  const [name, setName] = useState(webhook?.name || '');
  const [url, setUrl] = useState(webhook?.url || '');
  const [secret, setSecret] = useState(webhook?.secret || generateSecret());
  const [selectedEvents, setSelectedEvents] = useState(webhook?.events || []);
  const [showSecret, setShowSecret] = useState(false);

  const toggleEvent = (evt) => {
    setSelectedEvents(prev =>
      prev.includes(evt) ? prev.filter(e => e !== evt) : [...prev, evt]
    );
  };

  const toggleGroup = (groupEvents) => {
    const allSelected = groupEvents.every(e => selectedEvents.includes(e));
    if (allSelected) {
      setSelectedEvents(prev => prev.filter(e => !groupEvents.includes(e)));
    } else {
      setSelectedEvents(prev => [...new Set([...prev, ...groupEvents])]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    onSave({ name: name.trim(), url: url.trim(), secret, events: selectedEvents, status: webhook?.status || 'active' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold text-[#425466] mb-1.5">Endpoint Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Production Webhook"
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#425466] mb-1.5 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" /> Endpoint URL
        </label>
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="https://your-server.com/webhooks"
          required
          type="url"
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10 font-mono"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#425466] mb-1.5 flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5" /> Signing Secret
        </label>
        <div className="flex gap-2">
          <input
            value={showSecret ? secret : secret.replace(/./g, '•')}
            readOnly
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-[#0A2540] font-mono bg-gray-50 focus:outline-none"
          />
          <button type="button" onClick={() => setShowSecret(v => !v)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-[#425466]">
            {showSecret ? 'Hide' : 'Show'}
          </button>
          <button type="button" onClick={() => setSecret(generateSecret())}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-[#425466]">
            Rotate
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5">Use this to verify incoming webhook payloads via HMAC-SHA256.</p>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#425466] mb-2">Subscribe to Events</label>
        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {ALL_EVENTS.map(({ group, events }) => {
            const allSelected = events.every(e => selectedEvents.includes(e));
            const someSelected = events.some(e => selectedEvents.includes(e));
            return (
              <div key={group}>
                <button
                  type="button"
                  onClick={() => toggleGroup(events)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xs font-bold text-[#0A2540] uppercase tracking-wide">{group}</span>
                  <div className="flex items-center gap-2">
                    {someSelected && (
                      <span className="text-xs text-[#635BFF] font-medium">
                        {events.filter(e => selectedEvents.includes(e)).length}/{events.length}
                      </span>
                    )}
                    <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
                      allSelected ? 'bg-[#635BFF] border-[#635BFF]' : someSelected ? 'border-[#635BFF]' : 'border-gray-300'
                    }`}>
                      {allSelected && <div className="w-2 h-2 bg-white rounded-sm" />}
                      {someSelected && !allSelected && <div className="w-2 h-0.5 bg-[#635BFF]" />}
                    </div>
                  </div>
                </button>
                <div className="divide-y divide-gray-50">
                  {events.map(evt => (
                    <label key={evt} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(evt)}
                        onChange={() => toggleEvent(evt)}
                        className="accent-[#635BFF] w-3.5 h-3.5"
                      />
                      <span className="text-xs font-mono text-[#425466]">{evt}</span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={loading} className="bg-[#635BFF] hover:bg-[#5751e8] text-white">
          {loading ? 'Saving…' : webhook ? 'Save Changes' : 'Create Webhook'}
        </Button>
      </div>
    </form>
  );
}