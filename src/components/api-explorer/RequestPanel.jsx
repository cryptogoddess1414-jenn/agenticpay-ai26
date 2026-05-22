import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Copy, ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const METHOD_COLOR = {
  GET:    'text-blue-600 bg-blue-50 border-blue-200',
  POST:   'text-green-700 bg-green-50 border-green-200',
  PUT:    'text-amber-700 bg-amber-50 border-amber-200',
  PATCH:  'text-orange-700 bg-orange-50 border-orange-200',
  DELETE: 'text-red-600 bg-red-50 border-red-200',
};

function HeaderRow({ header, onChange, onRemove }) {
  return (
    <div className="flex gap-2 items-center">
      <input value={header.key} onChange={e => onChange({ ...header, key: e.target.value })}
        placeholder="Header name" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#635BFF]" />
      <input value={header.value} onChange={e => onChange({ ...header, value: e.target.value })}
        placeholder="Value" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#635BFF]" />
      <button onClick={onRemove} className="p-1 text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
    </div>
  );
}

export default function RequestPanel({ endpoint, apiKey, onResult }) {
  const [headers, setHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [showHeaders, setShowHeaders] = useState(true);
  const [showBody, setShowBody] = useState(true);

  // Reset body when endpoint changes
  useEffect(() => {
    if (endpoint?.sampleBody) {
      setBody(JSON.stringify(endpoint.sampleBody, null, 2));
    } else {
      setBody('');
    }
  }, [endpoint?.id]);

  const buildCurl = () => {
    const allHeaders = [
      ...(apiKey ? [`  -H "Authorization: Bearer ${apiKey}"`] : []),
      ...headers.filter(h => h.key).map(h => `  -H "${h.key}: ${h.value}"`),
    ];
    const bodyPart = body && endpoint?.method !== 'GET' ? `  -d '${body}'` : '';
    return `curl -X ${endpoint.method} "${endpoint.baseUrl}${endpoint.path}" \\\n${allHeaders.join(' \\\n')}${bodyPart ? ` \\\n${bodyPart}` : ''}`;
  };

  const handleSend = async () => {
    if (!apiKey) { toast.error('Enter your API key first'); return; }
    setLoading(true);
    onResult(null);
    const start = Date.now();
    try {
      const reqHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` };
      headers.filter(h => h.key).forEach(h => { reqHeaders[h.key] = h.value; });

      const opts = { method: endpoint.method, headers: reqHeaders };
      if (body && endpoint.method !== 'GET') opts.body = body;

      const res = await fetch(`${endpoint.baseUrl}${endpoint.path}`, opts);
      const latency = Date.now() - start;
      let json = null;
      const text = await res.text();
      try { json = JSON.parse(text); } catch { json = text; }
      onResult({ status: res.status, statusText: res.statusText, latency, body: json, headers: Object.fromEntries(res.headers.entries()) });
    } catch (err) {
      onResult({ error: err.message, latency: Date.now() - start });
    }
    setLoading(false);
  };

  const copyCode = (code) => { navigator.clipboard.writeText(code); toast.success('Copied!'); };

  if (!endpoint) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white border border-gray-200 rounded-2xl py-20">
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-300">Select an endpoint to get started</p>
          <p className="text-xs text-gray-200 mt-1">Choose from the sidebar on the left</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-0 bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <span className={`text-xs font-black px-2.5 py-1 rounded-lg border font-mono flex-shrink-0 ${METHOD_COLOR[endpoint.method] || ''}`}>
            {endpoint.method}
          </span>
          <span className="text-sm font-mono text-[#0A2540] font-semibold truncate">{endpoint.baseUrl}{endpoint.path}</span>
        </div>
        <Button
          onClick={handleSend}
          disabled={loading}
          size="sm"
          className="bg-[#635BFF] hover:bg-[#5751e8] text-white flex items-center gap-1.5 flex-shrink-0"
        >
          <Play className="w-3.5 h-3.5" />
          {loading ? 'Sending…' : 'Send'}
        </Button>
      </div>

      {/* Description */}
      {endpoint.description && (
        <div className="px-5 py-3 bg-blue-50/50 border-b border-blue-100">
          <p className="text-xs text-[#425466]">{endpoint.description}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
        {/* Headers */}
        <div>
          <button onClick={() => setShowHeaders(v => !v)}
            className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
            <span className="text-xs font-bold text-[#425466] uppercase tracking-wide">Headers</span>
            {showHeaders ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {showHeaders && (
            <div className="px-5 pb-4 space-y-2">
              {apiKey && (
                <div className="flex gap-2 items-center opacity-60 cursor-not-allowed">
                  <div className="flex-1 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-mono bg-gray-50 text-gray-400">Authorization</div>
                  <div className="flex-1 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-mono bg-gray-50 text-gray-400 truncate">Bearer {apiKey.slice(0, 16)}…</div>
                  <div className="w-5" />
                </div>
              )}
              {headers.map((h, i) => (
                <HeaderRow key={i} header={h}
                  onChange={val => setHeaders(prev => prev.map((x, j) => j === i ? val : x))}
                  onRemove={() => setHeaders(prev => prev.filter((_, j) => j !== i))}
                />
              ))}
              <button onClick={() => setHeaders(prev => [...prev, { key: '', value: '' }])}
                className="flex items-center gap-1 text-xs text-[#635BFF] hover:underline mt-1">
                <Plus className="w-3 h-3" /> Add header
              </button>
            </div>
          )}
        </div>

        {/* Body */}
        {endpoint.method !== 'GET' && (
          <div>
            <button onClick={() => setShowBody(v => !v)}
              className="w-full flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
              <span className="text-xs font-bold text-[#425466] uppercase tracking-wide">Request Body</span>
              {showBody ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {showBody && (
              <div className="px-5 pb-4">
                <textarea
                  value={body}
                  onChange={e => setBody(e.target.value)}
                  rows={8}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs font-mono text-[#0A2540] focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/10 resize-none bg-[#FAFBFC]"
                  placeholder='{ "key": "value" }'
                  spellCheck={false}
                />
              </div>
            )}
          </div>
        )}

        {/* cURL snippet */}
        <div className="px-5 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-[#425466] uppercase tracking-wide">cURL</span>
            <button onClick={() => copyCode(buildCurl())} className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#635BFF] transition-colors">
              <Copy className="w-3 h-3" /> Copy
            </button>
          </div>
          <pre className="bg-[#0A2540] text-green-400 rounded-xl p-4 text-[11px] font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">
            {buildCurl()}
          </pre>
        </div>

        {/* Parameters table */}
        {endpoint.params?.length > 0 && (
          <div className="px-5 py-4">
            <p className="text-xs font-bold text-[#425466] uppercase tracking-wide mb-3">Parameters</p>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-2 text-gray-400 font-semibold uppercase tracking-wide text-[10px]">Name</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-semibold uppercase tracking-wide text-[10px]">Type</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-semibold uppercase tracking-wide text-[10px]">Required</th>
                    <th className="text-left px-4 py-2 text-gray-400 font-semibold uppercase tracking-wide text-[10px]">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {endpoint.params.map(p => (
                    <tr key={p.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-2.5 font-mono font-semibold text-[#635BFF]">{p.name}</td>
                      <td className="px-4 py-2.5 text-gray-400 font-mono">{p.type}</td>
                      <td className="px-4 py-2.5">
                        {p.required
                          ? <span className="text-red-500 font-semibold">required</span>
                          : <span className="text-gray-300">optional</span>}
                      </td>
                      <td className="px-4 py-2.5 text-[#425466]">{p.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}