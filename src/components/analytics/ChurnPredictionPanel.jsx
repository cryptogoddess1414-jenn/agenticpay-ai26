import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const PLAN_COLOR = {
  free:       'bg-gray-100 text-gray-600',
  starter:    'bg-blue-50 text-blue-700',
  pro:        'bg-[#EEF0FF] text-[#635BFF]',
  enterprise: 'bg-purple-50 text-purple-700',
};

function ScoreBar({ score }) {
  const pct = Math.round(score * 100);
  const color = pct >= 70 ? 'bg-red-500' : pct >= 40 ? 'bg-amber-400' : 'bg-green-500';
  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold tabular-nums ${pct >= 70 ? 'text-red-500' : pct >= 40 ? 'text-amber-500' : 'text-green-600'}`}>
        {pct}%
      </span>
    </div>
  );
}

export default function ChurnPredictionPanel({ subscribers }) {
  const [showAll, setShowAll] = useState(false);
  const [filter, setFilter] = useState('high');

  const filtered = subscribers.filter(s => {
    if (filter === 'high') return s.churnScore >= 0.7;
    if (filter === 'medium') return s.churnScore >= 0.4 && s.churnScore < 0.7;
    return s.churnScore < 0.4;
  });

  const displayed = showAll ? filtered : filtered.slice(0, 8);

  const highCount = subscribers.filter(s => s.churnScore >= 0.7).length;
  const medCount  = subscribers.filter(s => s.churnScore >= 0.4 && s.churnScore < 0.7).length;
  const lowCount  = subscribers.filter(s => s.churnScore < 0.4).length;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-4 h-4 text-[#635BFF]" />
          <div>
            <h3 className="text-sm font-bold text-[#0A2540]">Churn Prediction</h3>
            <p className="text-[11px] text-[#8898AA]">AI-scored risk based on payment history & engagement</p>
          </div>
        </div>
        {/* Risk filter tabs */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          {[
            { key: 'high',   label: `High (${highCount})`,   cls: 'text-red-500' },
            { key: 'medium', label: `Med (${medCount})`,     cls: 'text-amber-500' },
            { key: 'low',    label: `Low (${lowCount})`,     cls: 'text-green-600' },
          ].map(f => (
            <button key={f.key} onClick={() => { setFilter(f.key); setShowAll(false); }}
              className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
                filter === f.key ? `bg-white shadow-sm ${f.cls}` : 'text-gray-400 hover:text-gray-600'
              }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Risk summary */}
      {filter === 'high' && highCount > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 leading-relaxed">
            <strong>{highCount} subscribers</strong> are at high risk of churning based on low API activity, failed payments, and plan age.
            Consider proactive outreach or offering discounts to retain them.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left pb-2.5 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider">Subscriber</th>
              <th className="text-left pb-2.5 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider">Plan</th>
              <th className="text-left pb-2.5 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider hidden sm:table-cell">MRR</th>
              <th className="text-left pb-2.5 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider hidden md:table-cell">Days Active</th>
              <th className="text-left pb-2.5 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider hidden md:table-cell">Last API Call</th>
              <th className="text-left pb-2.5 text-[10px] font-bold text-[#8898AA] uppercase tracking-wider">Churn Risk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {displayed.map((s, i) => (
              <motion.tr
                key={s.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-2.5 pr-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#EEF0FF] flex items-center justify-center flex-shrink-0">
                      <Users className="w-3 h-3 text-[#635BFF]" />
                    </div>
                    <span className="font-mono text-xs text-[#425466]">{s.id}</span>
                  </div>
                </td>
                <td className="py-2.5 pr-4">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${PLAN_COLOR[s.plan]}`}>
                    {s.plan}
                  </span>
                </td>
                <td className="py-2.5 pr-4 hidden sm:table-cell text-xs text-[#425466] font-medium">
                  ${s.mrr}/mo
                </td>
                <td className="py-2.5 pr-4 hidden md:table-cell text-xs text-[#425466]">
                  {s.daysActive}d
                </td>
                <td className="py-2.5 pr-4 hidden md:table-cell">
                  <span className={`text-xs ${s.lastApiCall > 14 ? 'text-red-500 font-semibold' : 'text-[#425466]'}`}>
                    {s.lastApiCall}d ago
                  </span>
                </td>
                <td className="py-2.5">
                  <ScoreBar score={s.churnScore} />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 8 && (
        <button
          onClick={() => setShowAll(v => !v)}
          className="mt-4 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-[#635BFF] hover:text-[#5751e8] py-2 rounded-lg hover:bg-[#635BFF]/5 transition-colors"
        >
          {showAll ? <><ChevronUp className="w-3.5 h-3.5" /> Show less</> : <><ChevronDown className="w-3.5 h-3.5" /> Show all {filtered.length} subscribers</>}
        </button>
      )}
    </div>
  );
}