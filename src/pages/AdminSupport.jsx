import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import AdminTicketsTable from '../components/support/AdminTicketsTable';
import TicketChat from '../components/support/TicketChat';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminSupport() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      if (u?.role !== 'admin') { window.location.href = '/'; return; }
      setUser(u);
      await loadTickets();
    });
  }, []);

  const loadTickets = async () => {
    setLoading(true);
    const list = await base44.entities.SupportTicket.list('-created_date', 100);
    setTickets(list);
    setLoading(false);
  };

  // Real-time updates
  useEffect(() => {
    const unsub = base44.entities.SupportTicket.subscribe((event) => {
      if (event.type === 'create') {
        setTickets(prev => [event.data, ...prev]);
      } else if (event.type === 'update') {
        setTickets(prev => prev.map(t => t.id === event.id ? event.data : t));
        setSelectedTicket(prev => prev?.id === event.id ? event.data : prev);
      }
    });
    return unsub;
  }, []);

  const openCounts = {
    open: tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#F6F9FC] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#635BFF] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[1200px] mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-[#0A2540]">Support Inbox</h1>
              <p className="text-sm text-gray-400 mt-0.5">Manage and respond to customer tickets</p>
            </div>
            {selectedTicket && (
              <Button variant="outline" onClick={() => setSelectedTicket(null)} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Inbox
              </Button>
            )}
          </div>

          {/* Stats */}
          {!selectedTicket && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Open', value: openCounts.open, color: 'text-blue-600', bg: 'bg-blue-50' },
                { label: 'In Progress', value: openCounts.in_progress, color: 'text-orange-600', bg: 'bg-orange-50' },
                { label: 'Resolved', value: openCounts.resolved, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              ].map(stat => (
                <div key={stat.label} className={`${stat.bg} rounded-xl px-5 py-4 border border-white`}>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>
          )}

          {selectedTicket ? (
            <TicketChat
              ticket={selectedTicket}
              user={user}
              isAdmin={true}
              onStatusChange={(updated) => {
                setSelectedTicket(updated);
                setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
              }}
            />
          ) : (
            <AdminTicketsTable tickets={tickets} loading={loading} onSelect={setSelectedTicket} />
          )}
        </div>
      </div>
    </div>
  );
}