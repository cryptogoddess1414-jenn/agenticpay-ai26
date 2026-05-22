import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2, Trash2, ShieldOff, Copy, Check } from 'lucide-react';

const MODE_STYLE = {
  live: 'bg-green-50 text-green-700 border-green-200',
  test: 'bg-blue-50 text-blue-700 border-blue-200',
};

const STATUS_STYLE = {
  active:  'bg-emerald-50 text-emerald-700',
  revoked: 'bg-red-50 text-red-500',
  expired: 'bg-gray-100 text-gray-400',
};

export default function ApiKeyCard({ apiKey, onRevoke, onDelete, onViewLogs }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(apiKey.key_prefix + '••••••••••••••••••••');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isActive = apiKey.status === 'active';
  const isExpired = apiKey.expires_at && new Date(apiKey.expires_at) < new Date();

  return (
    <div className={`bg-white border rounded-2xl p-5 transition-all ${!isActive || isExpired ? 'opacity-60' : 'hover:shadow-sm'} border-gray-200`}>
      <div className="flex items-start justify-between gap-3">
        {/* Left */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-bold text-[#0A2540] truncate">{apiKey.name}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${MODE_STYLE[apiKey.mode]}`}>
              {apiKey.mode}
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLE[isExpired ? 'expired' : apiKey.status]}`}>
              {isExpired ? 'expired' : apiKey.status}
            </span>
          </div>

          {/* Key prefix */}
          <div className="flex items-center gap-2 mt-2">
            <code className="text-xs font-mono text-[#635BFF] bg-[#635BFF]/5 px-2 py-1 rounded-lg">
              {apiKey.key_prefix}••••••••••••••••••••
            </code>
            <button onClick={copy} className="text-gray-300 hover:text-[#635BFF] transition-colors">
              {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <span className="text-xs text-[#8898AA]">
              Created {new Date(apiKey.created_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
            {apiKey.expires_at && (
              <span className={`text-xs ${isExpired ? 'text-red-400' : 'text-[#8898AA]'}`}>
                {isExpired ? 'Expired' : 'Expires'} {new Date(apiKey.expires_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            )}
            {apiKey.last_used_at && (
              <span className="text-xs text-[#8898AA]">
                Last used {new Date(apiKey.last_used_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            )}
            <span className="text-xs text-[#8898AA]">
              {(apiKey.total_requests || 0).toLocaleString()} requests
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => onViewLogs(apiKey)}
            className="text-[#425466] hover:text-[#635BFF] hover:bg-[#635BFF]/5 gap-1.5 text-xs">
            <BarChart2 className="w-3.5 h-3.5" /> Logs
          </Button>
          {isActive && !isExpired && (
            <Button variant="ghost" size="sm" onClick={() => onRevoke(apiKey)}
              className="text-[#425466] hover:text-amber-600 hover:bg-amber-50 gap-1.5 text-xs">
              <ShieldOff className="w-3.5 h-3.5" /> Revoke
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={() => onDelete(apiKey)}
            className="text-[#425466] hover:text-red-500 hover:bg-red-50">
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}