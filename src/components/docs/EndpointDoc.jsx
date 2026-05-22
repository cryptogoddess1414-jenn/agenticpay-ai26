import React, { useState } from 'react';
import CodeBlock from './CodeBlock';
import {
  generatePython,
  generateJavaScript,
  generateGo,
  generateRuby,
  generatePhp,
} from '../../lib/code-generators';

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

export default function EndpointDoc({ endpoint, apiKey }) {
  const [lang, setLang] = useState('javascript');

  const activeLang = LANGUAGES.find(l => l.key === lang);
  const code = activeLang ? activeLang.gen(endpoint, apiKey || 'YOUR_API_KEY') : '';

  return (
    <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-2 flex-wrap">
          <span className={`text-xs font-black px-2.5 py-1 rounded-lg border font-mono ${METHOD_COLOR[endpoint.method] || ''}`}>
            {endpoint.method}
          </span>
          <code className="text-sm font-mono font-bold text-[#0A2540]">{endpoint.baseUrl}{endpoint.path}</code>
        </div>
        <p className="text-sm text-[#425466] leading-relaxed">{endpoint.description}</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 divide-y xl:divide-y-0 xl:divide-x divide-gray-100">
        {/* Left: Params */}
        <div className="px-6 py-5">
          <h3 className="text-xs font-bold text-[#425466] uppercase tracking-wider mb-4">Parameters</h3>
          {endpoint.params?.length > 0 ? (
            <div className="space-y-3">
              {endpoint.params.map(p => (
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

          {endpoint.sampleBody && (
            <div className="mt-6">
              <h3 className="text-xs font-bold text-[#425466] uppercase tracking-wider mb-3">Example Request Body</h3>
              <pre className="bg-[#F6F9FC] border border-gray-200 rounded-xl p-4 text-[11px] font-mono text-[#425466] overflow-x-auto whitespace-pre">
                {JSON.stringify(endpoint.sampleBody, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Right: Code snippets */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-[#425466] uppercase tracking-wider">Code Snippet</h3>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              {LANGUAGES.map(l => (
                <button
                  key={l.key}
                  onClick={() => setLang(l.key)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                    lang === l.key
                      ? 'bg-white text-[#0A2540] shadow-sm'
                      : 'text-gray-400 hover:text-gray-600'
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
    </article>
  );
}