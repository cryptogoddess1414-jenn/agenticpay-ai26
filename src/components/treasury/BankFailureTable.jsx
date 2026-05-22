import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Clock, ChevronUp, ChevronDown } from 'lucide-react';

function timeAgo(date) {
  const h = Math.floor((Date.now() - date.getTime()) / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function BankFailureTable({ banks, activeLines, onToggle }) {
  const [sort, setSort] = useState({ key: 'failures', dir: 'desc' });

  const sorted = [...banks].sort((a, b) => {
    const v = sort.dir === 'asc' ? 1 : -1;
    return a[sort.key] > b[sort.key] ? v : -v;
  });

  const cols = [
    { key: 'name',        label: 'Bank' },
    { key: 'successRate', label: 'Success Rate' },
    { key: 'failures',    label: 'Failures (30d)' },
    { key: 'avgLatency',  label: 'Avg Latency' },
    { key: 'optimalWindow', label: 'Optimal Window', nosort: true },
  ];

  const toggleSort = (key, nosort) => {
    if (nosort) return;
    setSort(s => s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <h3 className="text-sm font-bold text-[#0A2540]">Bank Failure Patterns</h3>
        <span className="text-[10px] text-[#8898AA] ml-auto">Click chart legend to toggle trend lines</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-50">
              {cols.map(c => (
                <th key={c.key} onClick={() => toggleSort(c.key, c.nosort)}
                  className={`text-left px-5 py-3 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider ${!c.nosort ? 'cursor-pointer hover:text-[#0A2540]' : ''}`}>
                  <span className="flex items-center gap-1">
                    {c.label}
                    {!c.nosort && sort.key === c.key && (sort.dir === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />)}
                  </span>
                </th>
              ))}
              <th className="text-left px-5 py-3 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider">Toggle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sorted.map((bank, i) => {
              const isActive = activeLines.includes(bank.id);
              const sr = (bank.successRate * 100).toFixed(1);
              return (
                <motion.tr key={bank.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }} className="hover:bg-gray-50/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-semibold text-[#0A2540] text-xs">{bank.name}</p>
                    <p className="text-[10px] text-[#8898AA]">{bank.country} · {timeAgo(bank.lastFailure)}</p>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-bold ${parseFloat(sr) >= 95 ? 'text-green-600' : parseFloat(sr) >= 90 ? 'text-amber-500' : 'text-red-500'}`}>{sr}%</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs font-bold text-[#0A2540]">{bank.failures}</span>
                    <span className="text-[10px] text-[#8898AA] ml-1">/ {bank.totalPayouts}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-xs text-[#425466]">{bank.avgLatency}d</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[11px] font-medium text-[#635BFF] bg-[#EEF0FF] px-2 py-0.5 rounded-md">{bank.optimalWindow}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => onToggle(bank.id)}
                      className={`w-8 h-4 rounded-full transition-colors relative ${isActive ? 'bg-[#635BFF]' : 'bg-gray-200'}`}>
                      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${isActive ? 'left-4' : 'left-0.5'}`} />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}