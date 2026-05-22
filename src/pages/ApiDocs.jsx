import React, { useState } from 'react';
import Navbar from '../components/landing/Navbar';
import DocsSidebar from '../components/docs/DocsSidebar';
import EndpointDoc from '../components/docs/EndpointDoc';
import { ENDPOINTS } from '../lib/api-endpoints';
import { BookOpen, Key, Eye, EyeOff } from 'lucide-react';

export default function ApiDocs() {
  const [selected, setSelected] = useState(ENDPOINTS[0]);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[1280px] mx-auto px-6 py-10">

          {/* Page header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#0A2540] flex items-center justify-center shadow-sm">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">API Reference</h1>
            </div>
            <p className="text-sm text-[#8898AA] ml-12">
              Auto-generated code snippets for every endpoint in Python, JavaScript, Go, Ruby, and PHP.
            </p>
          </div>

          {/* API key personalizer */}
          <div className="bg-white border border-[#635BFF]/30 rounded-2xl px-5 py-4 mb-8 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Key className="w-3.5 h-3.5 text-[#635BFF]" />
              <span className="text-xs font-semibold text-[#425466]">Personalize snippets</span>
            </div>
            <div className="relative flex-1">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder="Paste your API key to pre-fill all snippets"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 pr-10 text-sm font-mono text-[#0A2540] placeholder-gray-300 focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10"
              />
              <button
                onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-300 flex-shrink-0 hidden sm:block">Never stored or sent anywhere.</p>
          </div>

          {/* Layout */}
          <div className="flex flex-col lg:flex-row gap-6">
            <DocsSidebar endpoints={ENDPOINTS} selected={selected} onSelect={setSelected} />
            <main className="flex-1 min-w-0">
              <EndpointDoc endpoint={selected} apiKey={apiKey} />
            </main>
          </div>

        </div>
      </div>
    </div>
  );
}