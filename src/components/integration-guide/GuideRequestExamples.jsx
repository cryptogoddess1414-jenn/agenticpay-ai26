import React, { useState } from 'react';
import { ENDPOINTS } from '../../lib/api-endpoints';
import {
  generateJavaScript, generatePython, generateGo, generateRuby, generatePhp
} from '../../lib/code-generators';
import CodeBlock from '../docs/CodeBlock';
import { Key, ChevronDown } from 'lucide-react';

const METHOD_COLOR = {
  GET:    'text-blue-600 bg-blue-50 border-blue-200',
  POST:   'text-green-700 bg-green-50 border-green-200',
  PUT:    'text-amber-700 bg-amber-50 border-amber-200',
  DELETE: 'text-red-600 bg-red-50 border-red-200',
};

const LANGUAGES = [
  { key: 'javascript', label: 'JavaScript', gen: generateJavaScript },
  { key: 'python',     label: 'Python',     gen: generatePython },
  { key: 'go',         label: 'Go',         gen: generateGo },
  { key: 'ruby',       label: 'Ruby',       gen: generateRuby },
  { key: 'php',        label: 'PHP',        gen: generatePhp },
];

export default function GuideRequestExamples({ apiKeys, selectedKey, onSelectKey }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState(ENDPOINTS[0]);
  const [lang, setLang] = useState('javascript');

  const activeKey = selectedKey?.key_prefix
    ? `${selectedKey.key_prefix}••••••••••••••••••••••`
    : 'YOUR_API_KEY';

  // Use a display-safe placeholder that looks real
  const keyForSnippet = selectedKey?.key_prefix
    ? `${selectedKey.key_prefix}xxxxxxxxxxxxxxxxxxxxxxxx`
    : 'YOUR_API_KEY';

  const activeLang = LANGUAGES.find(l => l.key === lang);
  const code = activeLang ? activeLang.gen(selectedEndpoint, keyForSnippet) : '';

  const groups = ENDPOINTS.reduce((acc, ep) => {
    const group = ep.path.split('/')[2] || 'general';
    if (!acc[group]) acc[group] = [];
    acc[group].push(ep);
    return acc;
  }, {});

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar */}
      <aside className="w-full lg:w-56 flex-shrink-0">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden sticky top-[90px]">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endpoints</p>
          </div>
          <nav className="divide-y divide-gray-50 max-h-[65vh] overflow-y-auto">
            {Object.entries(groups).map(([group, eps]) => (
              <div key={group}>
                <div className="px-4 py-2 bg-gray-50/40">
                  <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{group}</p>
                </div>
                {eps.map(ep => (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`w-full flex items-center gap-2 px-4 py-2 text-left transition-colors hover:bg-[#635BFF]/5 ${
                      selectedEndpoint?.id === ep.id ? 'bg-[#635BFF]/8 border-r-2 border-[#635BFF]' : ''
                    }`}
                  >
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded font-mono flex-shrink-0 ${METHOD_COLOR[ep.method] || 'bg-gray-100 text-gray-600'}`}>
                      {ep.method}
                    </span>
                    <span className={`text-xs font-mono truncate ${selectedEndpoint?.id === ep.id ? 'text-[#635BFF] font-semibold' : 'text-[#425466]'}`}>
                      {ep.path}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0 space-y-4">
        {/* Key selector */}
        {apiKeys.length > 0 && (
          <div className="bg-white border border-[#635BFF]/20 rounded-xl px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 flex-shrink-0">
              <Key className="w-3.5 h-3.5 text-[#635BFF]" />
              <span className="text-xs font-semibold text-[#425466]">Using key:</span>
            </div>
            <select
              value={selectedKey?.id || ''}
              onChange={e => {
                const k = apiKeys.find(k => k.id === e.target.value);
                if (k) onSelectKey(k);
              }}
              className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-mono text-[#0A2540] focus:outline-none focus:border-[#635BFF] bg-white"
            >
              {apiKeys.map(k => (
                <option key={k.id} value={k.id}>
                  [{k.mode.toUpperCase()}] {k.name} — {k.key_prefix}…
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Endpoint card */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className={`text-xs font-black px-2.5 py-1 rounded-lg border font-mono ${METHOD_COLOR[selectedEndpoint.method] || ''}`}>
                {selectedEndpoint.method}
              </span>
              <code className="text-sm font-mono font-bold text-[#0A2540]">
                {selectedEndpoint.baseUrl}{selectedEndpoint.path}
              </code>
            </div>
            <p className="text-sm text-[#425466] leading-relaxed">{selectedEndpoint.description}</p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
            {/* Params */}
            <div className="px-6 py-5">
              <h3 className="text-xs font-bold text-[#425466] uppercase tracking-wider mb-4">Parameters</h3>
              {selectedEndpoint.params?.length > 0 ? (
                <div className="space-y-3">
                  {selectedEndpoint.params.map(p => (
                    <div key={p.name} className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <code className="text-xs font-mono font-bold text-[#635BFF]">{p.name}</code>
                        <span className="text-[10px] font-mono text-gray-400 bg-gray-50 border border-gray-200 px-1.5 py-0.5 rounded">{p.type}</span>
                        {p.required
                          ? <span className="text-[10px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">required</span>
                          : <span className="text-[10px] text-gray-300 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">optional</span>
                        }
                      </div>
                      <p className="text-xs text-[#8898AA]">{p.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-300 italic">No parameters required.</p>
              )}
              {selectedEndpoint.sampleBody && (
                <div className="mt-6">
                  <h3 className="text-xs font-bold text-[#425466] uppercase tracking-wider mb-3">Request Body</h3>
                  <pre className="bg-[#F6F9FC] border border-gray-200 rounded-xl p-4 text-[11px] font-mono text-[#425466] overflow-x-auto whitespace-pre">
                    {JSON.stringify(selectedEndpoint.sampleBody, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Code snippet */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-[#425466] uppercase tracking-wider">Code Snippet</h3>
                <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                  {LANGUAGES.map(l => (
                    <button
                      key={l.key}
                      onClick={() => setLang(l.key)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                        lang === l.key ? 'bg-white text-[#0A2540] shadow-sm' : 'text-gray-400 hover:text-gray-600'
                      }`}
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              </div>
              <CodeBlock code={code} language={activeLang?.label || ''} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}