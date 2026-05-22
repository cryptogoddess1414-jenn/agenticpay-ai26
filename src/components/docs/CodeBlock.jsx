import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <div className="flex items-center justify-between bg-[#0d1117] rounded-t-xl px-4 py-2.5 border border-[#30363d]">
        <span className="text-xs font-semibold text-[#8b949e] uppercase tracking-wider">{language}</span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-[#8b949e] hover:text-white transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="bg-[#0d1117] border border-t-0 border-[#30363d] rounded-b-xl p-4 overflow-x-auto text-[12px] font-mono leading-relaxed text-[#e6edf3] whitespace-pre">
        {code}
      </pre>
    </div>
  );
}