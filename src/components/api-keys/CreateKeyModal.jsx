import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy, Check, AlertTriangle } from 'lucide-react';

function CreateForm({ onSubmit, loading }) {
  const [name, setName] = useState('');
  const [mode, setMode] = useState('test');
  const [expires, setExpires] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, mode, expires_at: expires || undefined });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
      <div>
        <label className="block text-xs font-semibold text-[#425466] mb-1.5">Key Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Production Backend"
          required
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10"
        />
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#425466] mb-1.5">Mode</label>
        <div className="flex gap-2">
          {['test', 'live'].map(m => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all capitalize ${
                mode === m
                  ? m === 'live'
                    ? 'bg-green-50 border-green-300 text-green-700'
                    : 'bg-blue-50 border-blue-300 text-blue-700'
                  : 'border-gray-200 text-gray-400 hover:border-gray-300'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-[#425466] mb-1.5">Expiration Date <span className="font-normal text-gray-300">(optional)</span></label>
        <input
          type="date"
          value={expires}
          onChange={e => setExpires(e.target.value)}
          min={new Date().toISOString().split('T')[0]}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-[#0A2540] focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full bg-[#635BFF] hover:bg-[#5751e8]">
        {loading ? 'Generating…' : 'Generate API Key'}
      </Button>
    </form>
  );
}

function RevealKey({ fullKey, onDone }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(fullKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="pt-2 space-y-4">
      <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl">
        <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 leading-relaxed">
          Copy your key now — it will <strong>never be shown again</strong>. Store it somewhere safe.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-[#0d1117] text-green-400 rounded-xl px-4 py-3 text-xs font-mono overflow-x-auto whitespace-nowrap">
          {fullKey}
        </code>
        <Button size="icon" variant="outline" onClick={copy} className="flex-shrink-0">
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </Button>
      </div>
      <Button onClick={onDone} className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90">
        Done — I've saved my key
      </Button>
    </div>
  );
}

export default function CreateKeyModal({ open, onClose, onCreate }) {
  const [loading, setLoading] = useState(false);
  const [fullKey, setFullKey] = useState(null);

  const handleSubmit = async (data) => {
    setLoading(true);
    const key = await onCreate(data);
    if (key) setFullKey(key);
    setLoading(false);
  };

  const handleClose = () => {
    setFullKey(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#0A2540]">
            {fullKey ? 'Save Your API Key' : 'Create API Key'}
          </DialogTitle>
        </DialogHeader>
        {fullKey
          ? <RevealKey fullKey={fullKey} onDone={handleClose} />
          : <CreateForm onSubmit={handleSubmit} loading={loading} />
        }
      </DialogContent>
    </Dialog>
  );
}