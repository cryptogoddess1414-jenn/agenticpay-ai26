import React, { useState } from 'react';
import { Search, Clock, AlertCircle, CheckCircle2, XCircle, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-blue-100 text-blue-700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  resolved: { label: 'Resolved', color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-500', icon: XCircle },
};

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-500',
  medium: 'bg-blue-100 text-blue-600',
  high: 'bg-orange-100 text-orange-600',
  urgent: 'bg-red-100 text-red-600',
};

export default function AdminTicketsTable({ tickets, loading, onSelect }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = tickets.filter(t => {
    const matchSearch = t.subject?.toLowerCase().includes(search.toLowerCase()) ||
      t.user_email?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-[#0A2540]">Support Tickets</h3>
          <p className="text-xs text-gray-400">{tickets.length} total</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-32 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative w-44">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <Input placeholder="Search…" className="pl-8 h-8 text-xs" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1,2,3].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Subject</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">User</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Category</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Priority</th>
                <th className="text-left py-2 pr-4 font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="text-left py-2 font-semibold text-gray-400 uppercase tracking-wide">Opened</th>
                <th className="w-6 py-2"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-10 text-gray-400">No tickets found</td></tr>
              ) : (
                filtered.map(ticket => {
                  const s = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
                  const StatusIcon = s.icon;
                  return (
                    <tr
                      key={ticket.id}
                      onClick={() => onSelect(ticket)}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="py-3 pr-4">
                        <p className="font-medium text-[#0A2540] truncate max-w-[200px]">{ticket.subject}</p>
                      </td>
                      <td className="py-3 pr-4 text-gray-500">{ticket.user_email}</td>
                      <td className="py-3 pr-4 capitalize text-gray-500">{ticket.category}</td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${PRIORITY_COLORS[ticket.priority]}`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${s.color}`}>
                          <StatusIcon className="w-3 h-3" />{s.label}
                        </span>
                      </td>
                      <td className="py-3 text-gray-400">{new Date(ticket.created_date).toLocaleDateString()}</td>
                      <td className="py-3"><ChevronRight className="w-3.5 h-3.5 text-gray-300" /></td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}