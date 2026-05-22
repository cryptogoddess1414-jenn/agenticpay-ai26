import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { CheckCircle2, XCircle, Eye, Minus, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ACTION_CONFIG = {
  auto_approve:   { label: 'Auto Approved', icon: CheckCircle2, cls: 'text-green-600 bg-green-50' },
  auto_deny:      { label: 'Auto Denied',   icon: XCircle,      cls: 'text-red-600 bg-red-50' },
  require_review: { label: 'Sent to Review',icon: Eye,          cls: 'text-amber-600 bg-amber-50' },
  no_rule_match:  { label: 'No Rule Match', icon: Minus,        cls: 'text-gray-500 bg-gray-50' },
};

export default function RefundAuditLogTable() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await base44.entities.RefundAuditLog.list('-created_date', 50);
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, []);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-bold text-[#0A2540]">Refund Audit Log</p>
          <p className="text-[11px] text-[#8898AA]">Last 50 rule evaluations</p>
        </div>
        <Button variant="ghost" size="sm" onClick={fetchLogs} className="text-[#8898AA] gap-1.5">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      {loading ? (
        <div className="p-5 space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-10 bg-gray-50 rounded-lg animate-pulse" />)}
        </div>
      ) : logs.length === 0 ? (
        <div className="text-center py-10 text-[#8898AA] text-sm">No audit entries yet.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Transaction', 'Customer', 'Amount', 'Risk', 'CLV', 'Rule', 'Action', 'Source', 'Time'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[10px] font-semibold text-[#8898AA] uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => {
                const cfg = ACTION_CONFIG[log.action_taken] || ACTION_CONFIG.no_rule_match;
                const Icon = cfg.icon;
                return (
                  <tr key={log.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 0 ? '' : 'bg-gray-50/30'}`}>
                    <td className="px-4 py-2.5 font-mono text-[#635BFF]">{log.transaction_id?.slice(0, 12) || '—'}</td>
                    <td className="px-4 py-2.5 text-[#425466] max-w-[120px] truncate">{log.customer_email || '—'}</td>
                    <td className="px-4 py-2.5 font-semibold text-[#0A2540]">${log.amount?.toLocaleString() || 0}</td>
                    <td className="px-4 py-2.5">
                      <span className={`font-bold ${log.risk_score >= 0.7 ? 'text-red-500' : log.risk_score >= 0.4 ? 'text-amber-500' : 'text-green-600'}`}>
                        {log.risk_score != null ? (log.risk_score * 100).toFixed(0) : '—'}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[#425466]">{log.clv != null ? `$${log.clv.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-2.5 text-[#425466] max-w-[140px] truncate">{log.rule_name || <span className="text-gray-300">—</span>}</td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${cfg.cls}`}>
                        <Icon className="w-3 h-3" />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-[#8898AA] capitalize">{log.source || '—'}</td>
                    <td className="px-4 py-2.5 text-[#8898AA] whitespace-nowrap">
                      {log.created_date ? new Date(log.created_date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}