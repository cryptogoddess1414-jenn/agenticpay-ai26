import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from './DashboardContext';

const METHOD_COLORS = {
  GET: 'bg-blue-50 text-blue-600',
  POST: 'bg-green-50 text-green-600',
  DELETE: 'bg-red-50 text-red-500',
  PUT: 'bg-amber-50 text-amber-600',
};

export default function TopEndpointsTable() {
  const { endpoints } = useDashboard();

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-[#0A2540]">Top Endpoints</h3>
        <p className="text-xs text-[#8898AA]">By request volume, live</p>
      </div>

      <div className="space-y-2">
        <AnimatePresence>
          {endpoints.map((ep, i) => (
            <motion.div
              key={ep.path}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: i * 0.04 }}
              className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${METHOD_COLORS[ep.method] ?? 'bg-gray-100 text-gray-500'}`}>
                  {ep.method}
                </span>
                <span className="text-xs text-[#425466] font-mono truncate">{ep.path}</span>
              </div>
              <div className="flex flex-col items-end ml-3 shrink-0">
                <span className="text-xs font-bold text-[#0A2540] tabular-nums">{ep.calls.toLocaleString()}</span>
                <span className={`text-[10px] font-semibold ${parseFloat(ep.errorRate) > 1.5 ? 'text-red-500' : 'text-[#8898AA]'}`}>
                  {ep.errorRate}% err
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}