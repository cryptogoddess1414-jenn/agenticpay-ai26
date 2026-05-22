import React from 'react';
import { Sparkles, TrendingUp, TrendingDown, Minus, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const SENTIMENT_CONFIG = {
  positive: { label: 'Positive', cls: 'text-green-600 bg-green-50 border-green-200' },
  neutral:  { label: 'Neutral',  cls: 'text-amber-600 bg-amber-50 border-amber-200' },
  negative: { label: 'Caution',  cls: 'text-red-600 bg-red-50 border-red-200' },
};

const TREND_ICON = {
  up:   <TrendingUp  className="w-3.5 h-3.5 text-green-500" />,
  down: <TrendingDown className="w-3.5 h-3.5 text-red-500" />,
  flat: <Minus className="w-3.5 h-3.5 text-gray-400" />,
};

export default function AiSummaryCard({ summary, loading, lastGenerated }) {
  const sentiment = summary?.sentiment ? SENTIMENT_CONFIG[summary.sentiment] : null;

  return (
    <div className="bg-[#0A2540] rounded-2xl border border-white/10 p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#635BFF] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">AgenticPay AI Summary</p>
            <p className="text-[11px] text-[#425466]">Weekly financial performance analysis</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {sentiment && (
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${sentiment.cls}`}>
              {sentiment.label}
            </span>
          )}
          {lastGenerated && (
            <span className="text-[10px] text-[#425466] flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {lastGenerated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-4 bg-white/10 rounded w-3/4" />
          <div className="h-4 bg-white/10 rounded w-full" />
          <div className="h-4 bg-white/10 rounded w-5/6" />
          <div className="h-4 bg-white/10 rounded w-2/3" />
          <p className="text-xs text-[#425466] mt-4 flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-[#635BFF]" />
            AgenticPay AI is analyzing your financial data…
          </p>
        </div>
      ) : summary ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {summary.headline && (
            <p className="text-base font-bold text-white mb-3">{summary.headline}</p>
          )}
          <p className="text-sm text-[#8898AA] leading-relaxed">{summary.summary}</p>

          {summary.key_metrics?.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {summary.key_metrics.map((m, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5">
                  <div className="flex items-center gap-1 mb-1">
                    {TREND_ICON[m.trend] || TREND_ICON.flat}
                    <p className="text-[10px] text-[#425466] font-medium">{m.label}</p>
                  </div>
                  <p className="text-sm font-bold text-white">{m.value}</p>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      ) : (
        <p className="text-sm text-[#425466] italic">No summary generated yet.</p>
      )}
    </div>
  );
}