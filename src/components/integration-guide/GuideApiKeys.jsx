import React, { useState } from 'react';
import { Key, Copy, CheckCircle2, Clock, AlertTriangle, ChevronRight, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const MODE_STYLE = {
  live: 'bg-green-50 border-green-200 text-green-700',
  test: 'bg-amber-50 border-amber-200 text-amber-700',
};

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#635BFF] transition-colors">
      {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export default function GuideApiKeys({ apiKeys, loading, selectedKey, onSelectKey }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}
      </div>
    );
  }

  if (apiKeys.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-20 text-center">
        <Key className="w-10 h-10 text-gray-200 mb-3" />
        <p className="text-sm font-semibold text-gray-400">No active API keys</p>
        <p className="text-xs text-gray-300 mt-1 mb-5">Create a key to start integrating.</p>
        <Link to="/api-keys">
          <Button variant="outline" className="flex items-center gap-2 border-[#635BFF] text-[#635BFF] hover:bg-[#635BFF]/5">
            <Plus className="w-4 h-4" /> Create API Key
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Active', value: apiKeys.length },
          { label: 'Live Keys', value: apiKeys.filter(k => k.mode === 'live').length },
          { label: 'Test Keys', value: apiKeys.filter(k => k.mode === 'test').length },
          { label: 'Total Requests', value: apiKeys.reduce((s, k) => s + (k.total_requests || 0), 0).toLocaleString() },
        ].map(stat => (
          <div key={stat.label} className="bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <p className="text-lg font-extrabold text-[#0A2540]">{stat.value}</p>
            <p className="text-xs text-[#8898AA]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Key cards */}
      <div className="space-y-3">
        {apiKeys.map(key => (
          <div
            key={key.id}
            onClick={() => onSelectKey(key)}
            className={`bg-white rounded-2xl border shadow-sm p-5 cursor-pointer transition-all ${
              selectedKey?.id === key.id
                ? 'border-[#635BFF] ring-2 ring-[#635BFF]/10'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Key className="w-3.5 h-3.5 text-[#635BFF]" />
                  <span className="text-sm font-bold text-[#0A2540]">{key.name}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${MODE_STYLE[key.mode]}`}>
                    {key.mode}
                  </span>
                  {selectedKey?.id === key.id && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#635BFF]/10 text-[#635BFF] border border-[#635BFF]/20">
                      selected for snippets
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <code className="text-xs font-mono text-[#425466] bg-[#F6F9FC] border border-gray-200 px-2.5 py-1 rounded-lg">
                    {key.key_prefix}••••••••••••••••••••••
                  </code>
                  <CopyButton text={key.key_prefix} />
                </div>
              </div>
              <div className="text-right flex-shrink-0 space-y-1">
                <p className="text-xs text-gray-400">{(key.total_requests || 0).toLocaleString()} requests</p>
                {key.last_used_at && (
                  <p className="text-[10px] text-gray-300 flex items-center justify-end gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {new Date(key.last_used_at).toLocaleDateString()}
                  </p>
                )}
                {key.expires_at && new Date(key.expires_at) < new Date() && (
                  <p className="text-[10px] text-red-400 flex items-center justify-end gap-1">
                    <AlertTriangle className="w-2.5 h-2.5" /> Expired
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Link to="/api-keys">
          <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-[#635BFF] border-[#635BFF]/30 hover:bg-[#635BFF]/5">
            Manage all keys <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}