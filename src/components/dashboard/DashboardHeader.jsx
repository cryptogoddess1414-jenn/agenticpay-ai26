import React from 'react';
import { Activity } from 'lucide-react';
import { useDashboard } from './DashboardContext';
import ExportButton from './ExportButton';

// We use a context pattern via prop-passing; this component is self-contained for the header.
export default function DashboardHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Activity className="w-5 h-5 text-[#635BFF]" />
          <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">API Analytics</h1>
          <span className="flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Live
          </span>
        </div>
        <p className="text-sm text-[#8898AA]">Real-time insights — refreshes every 5 seconds</p>
      </div>
      <div className="flex items-center gap-3">
        <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white text-[#425466] focus:outline-none focus:border-[#635BFF]">
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>
    </div>
  );
}