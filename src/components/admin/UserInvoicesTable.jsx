import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, RotateCcw } from 'lucide-react';

const STATUS_CONFIG = {
  succeeded: { icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50', label: 'Paid' },
  failed: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Failed' },
  pending: { icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', label: 'Pending' },
  refunded: { icon: RotateCcw, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Refunded' },
};

export default function UserInvoicesTable({ transactions }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="text-sm font-bold text-[#0A2540] mb-4">Invoices & Transactions</h3>

      {transactions.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-6">No transactions found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Date</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Plan</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-right py-2 font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(t => {
                const cfg = STATUS_CONFIG[t.status] || STATUS_CONFIG.pending;
                const Icon = cfg.icon;
                const dateStr = t.date
                  ? format(new Date(t.date), 'MMM d, yyyy')
                  : t.created_date
                  ? format(new Date(t.created_date), 'MMM d, yyyy')
                  : '—';
                return (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-2.5 pr-4 text-gray-600">{dateStr}</td>
                    <td className="py-2.5 pr-4 capitalize text-gray-600">{t.type || '—'}</td>
                    <td className="py-2.5 pr-4 capitalize text-gray-500">{t.plan || '—'}</td>
                    <td className="py-2.5 pr-4">
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${cfg.bg}`}>
                        <Icon className={`w-3 h-3 ${cfg.color}`} />
                        <span className={`text-[10px] font-semibold ${cfg.color}`}>{cfg.label}</span>
                      </div>
                    </td>
                    <td className={`py-2.5 text-right font-bold ${t.type === 'refund' ? 'text-red-500' : 'text-[#0A2540]'}`}>
                      {t.type === 'refund' ? '-' : ''}${t.amount?.toLocaleString() ?? '0'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-100">
                <td colSpan={4} className="py-2.5 text-xs font-semibold text-gray-500">Total Paid</td>
                <td className="py-2.5 text-right text-sm font-bold text-[#0A2540]">
                  ${transactions.filter(t => t.status === 'succeeded').reduce((s, t) => s + (t.amount || 0), 0).toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}