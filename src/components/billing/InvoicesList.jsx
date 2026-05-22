import React from 'react';
import { FileText, ExternalLink } from 'lucide-react';

const STATUS_COLORS = {
  paid: 'bg-emerald-100 text-emerald-700',
  open: 'bg-orange-100 text-orange-700',
  void: 'bg-gray-100 text-gray-500',
  uncollectible: 'bg-red-100 text-red-700',
};

export default function InvoicesList({ invoices }) {
  if (!invoices || invoices.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-[#0A2540] mb-4">Invoice History</h3>
        <p className="text-sm text-gray-400 text-center py-6">No invoices yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 className="text-sm font-bold text-[#0A2540] mb-4">Invoice History</h3>
      <div className="space-y-2">
        {invoices.map(inv => (
          <div key={inv.id} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-3">
              <FileText className="w-4 h-4 text-gray-300" />
              <div>
                <p className="text-xs font-medium text-[#0A2540]">
                  {new Date(inv.created * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-[10px] text-gray-400">{inv.number || inv.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${STATUS_COLORS[inv.status] || 'bg-gray-100 text-gray-500'}`}>
                {inv.status}
              </span>
              <span className="text-xs font-semibold text-[#0A2540]">${(inv.amount_paid / 100).toFixed(2)}</span>
              {inv.hosted_invoice_url && (
                <a href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer" className="text-[#635BFF] hover:text-[#5751E8]">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}