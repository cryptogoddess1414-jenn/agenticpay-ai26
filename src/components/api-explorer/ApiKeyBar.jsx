import React, { useState } from 'react';
import { Key, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ApiKeyBar({ apiKey, setApiKey, keyValid }) {
  const [show, setShow] = useState(false);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold text-[#425466] flex-shrink-0">
        <Key className="w-3.5 h-3.5 text-[#635BFF]" />
        API Key
      </div>
      <div className="relative flex-1 w-full">
        <input
          type={show ? 'text' : 'password'}
          value={apiKey}
          onChange={e => setApiKey(e.target.value)}
          placeholder="sk_live_••••••••••••••••••••••••••"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm font-mono text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10"
        />
        <button
          onClick={() => setShow(v => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <div className="flex-shrink-0">
        {apiKey.length > 8 && (
          keyValid
            ? <span className="flex items-center gap-1 text-xs font-semibold text-green-600"><CheckCircle2 className="w-3.5 h-3.5" /> Verified</span>
            : <span className="flex items-center gap-1 text-xs font-semibold text-red-500"><XCircle className="w-3.5 h-3.5" /> Invalid</span>
        )}
      </div>
    </div>
  );
}