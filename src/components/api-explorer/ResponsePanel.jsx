import React, { useState } from 'react';
import { Copy, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

const STATUS_COLOR = {
  2: 'text-green-600 bg-green-50 border-green-200',
  3: 'text-blue-600 bg-blue-50 border-blue-200',
  4: 'text-amber-600 bg-amber-50 border-amber-200',
  5: 'text-red-600 bg-red-50 border-red-200',
};

function syntaxHighlight(json) {
  if (typeof json !== 'string') json = JSON.stringify(json, null, 2);
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'text-amber-600'; // number
      if (/^"/.test(match)) {
        if (/:$/.test(match)) cls = 'text-[#635BFF] font-semibold'; // key
        else cls = 'text-green-600'; // string
      } else if (/true|false/.test(match)) cls = 'text-blue-500';
      else if (/null/.test(match)) cls = 'text-gray-400';
      return `<span class="${cls}">${match}</span>`;
    });
}

export default function ResponsePanel({ result }) {
  const [tab, setTab] = useState('body');

  if (!result) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl flex items-center justify-center py-16">
        <div className="text-center">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-sm font-semibold text-gray-300">Response will appear here</p>
          <p className="text-xs text-gray-200 mt-1">Hit Send to execute the request</p>
        </div>
      </div>
    );
  }

  if (result.error) {
    return (
      <div className="bg-white border border-red-200 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <XCircle className="w-4 h-4 text-red-500" />
          <span className="text-sm font-bold text-red-600">Network Error</span>
          <span className="text-xs text-gray-400 ml-auto">{result.latency}ms</span>
        </div>
        <pre className="bg-red-50 rounded-xl p-4 text-xs text-red-700 font-mono whitespace-pre-wrap">{result.error}</pre>
      </div>
    );
  }

  const bucket = Math.floor(result.status / 100);
  const statusColor = STATUS_COLOR[bucket] || 'text-gray-600 bg-gray-50 border-gray-200';
  const bodyStr = typeof result.body === 'string' ? result.body : JSON.stringify(result.body, null, 2);

  const copy = () => { navigator.clipboard.writeText(bodyStr); toast.success('Copied!'); };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
      {/* Status bar */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-gray-50/60 flex-wrap">
        <span className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-lg border ${statusColor}`}>
          {bucket === 2
            ? <CheckCircle2 className="w-3.5 h-3.5" />
            : <XCircle className="w-3.5 h-3.5" />}
          {result.status} {result.statusText}
        </span>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="w-3 h-3" /> {result.latency}ms
        </span>
        <span className="text-xs text-gray-300 ml-auto text-right">
          {bodyStr.length > 0 && `${(bodyStr.length / 1024).toFixed(1)} KB`}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-100">
        {['body', 'headers'].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-xs font-semibold capitalize border-b-2 transition-colors ${
              tab === t ? 'border-[#635BFF] text-[#635BFF]' : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}>
            {t}
          </button>
        ))}
        <button onClick={copy} className="ml-auto px-4 py-2.5 text-xs text-gray-400 hover:text-[#635BFF] flex items-center gap-1 transition-colors">
          <Copy className="w-3 h-3" /> Copy
        </button>
      </div>

      {/* Content */}
      <div className="max-h-[400px] overflow-auto p-4">
        {tab === 'body' ? (
          typeof result.body === 'object' && result.body !== null ? (
            <pre
              className="text-[11px] font-mono leading-relaxed"
              dangerouslySetInnerHTML={{ __html: syntaxHighlight(result.body) }}
            />
          ) : (
            <pre className="text-[11px] font-mono text-[#425466] leading-relaxed whitespace-pre-wrap">{bodyStr}</pre>
          )
        ) : (
          <table className="w-full text-xs">
            <tbody className="divide-y divide-gray-50">
              {Object.entries(result.headers || {}).map(([k, v]) => (
                <tr key={k} className="hover:bg-gray-50">
                  <td className="py-1.5 pr-4 font-mono font-semibold text-[#635BFF] align-top">{k}</td>
                  <td className="py-1.5 font-mono text-[#425466] break-all">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}