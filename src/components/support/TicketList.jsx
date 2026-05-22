import React from 'react';
import { MessageCircle, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight } from 'lucide-react';

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-500', icon: XCircle },
};

const PRIORITY_COLORS = {
  low: 'text-gray-400',
  medium: 'text-blue-500',
  high: 'text-orange-500',
  urgent: 'text-red-500',
};

export default function TicketList({ tickets, onSelect, loading }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1,2,3].map(i => <div key={i} className="h-16 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center">
        <MessageCircle className="w-8 h-8 text-gray-200 mx-auto mb-3" />
        <p className="text-sm font-medium text-gray-400">No support tickets yet</p>
        <p className="text-xs text-gray-300 mt-1">Click "New Ticket" to get help</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tickets.map(ticket => {
        const s = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
        const Icon = s.icon;
        return (
          <div
            key={ticket.id}
            onClick={() => onSelect(ticket)}
            className="bg-white border border-gray-200 rounded-xl px-5 py-4 flex items-center gap-4 cursor-pointer hover:border-[#635BFF]/40 hover:shadow-sm transition-all"
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${s.color.replace('bg-', 'text-').split(' ')[0]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#0A2540] truncate">{ticket.subject}</p>
              <p className="text-xs text-gray-400 mt-0.5 capitalize">{ticket.category} · {new Date(ticket.created_date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${s.color}`}>
                {s.label}
              </span>
              <span className={`text-xs font-semibold capitalize ${PRIORITY_COLORS[ticket.priority]}`}>
                {ticket.priority}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </div>
        );
      })}
    </div>
  );
}