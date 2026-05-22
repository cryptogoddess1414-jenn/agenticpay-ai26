import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import TicketList from '../components/support/TicketList';
import TicketForm from '../components/support/TicketForm';
import TicketChat from '../components/support/TicketChat';
import { Plus, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Support() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.auth.me().then(async (u) => {
      setUser(u);
      const list = await base44.entities.SupportTicket.filter({ user_email: u.email }, '-created_date');
      setTickets(list);
      setLoading(false);
    }).catch(() => {
      base44.auth.redirectToLogin('/support');
    });
  }, []);

  const handleCreated = (ticket) => {
    setTickets(prev => [ticket, ...prev]);
    setShowForm(false);
    setSelectedTicket(ticket);
  };

  if (loading) {
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
        <div className="max-w-[1100px] mx-auto px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-black text-[#0A2540]">Support</h1>
              <p className="text-sm text-gray-400 mt-0.5">Submit a ticket and chat with our team</p>
            </div>
            {!showForm && !selectedTicket && (
              <Button onClick={() => setShowForm(true)} className="bg-[#635BFF] hover:bg-[#5751E8] text-white flex items-center gap-2">
                <Plus className="w-4 h-4" /> New Ticket
              </Button>
            )}
            {(showForm || selectedTicket) && (
              <Button variant="outline" onClick={() => { setShowForm(false); setSelectedTicket(null); }} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" /> Back to Tickets
              </Button>
            )}
          </div>

          {showForm && (
            <TicketForm user={user} onCreated={handleCreated} onCancel={() => setShowForm(false)} />
          )}

          {selectedTicket && !showForm && (
            <TicketChat ticket={selectedTicket} user={user} isAdmin={false} onStatusChange={(updated) => {
              setSelectedTicket(updated);
              setTickets(prev => prev.map(t => t.id === updated.id ? updated : t));
            }} />
          )}

          {!showForm && !selectedTicket && (
            <TicketList tickets={tickets} onSelect={setSelectedTicket} loading={loading} />
          )}
        </div>
      </div>
    </div>
  );
}