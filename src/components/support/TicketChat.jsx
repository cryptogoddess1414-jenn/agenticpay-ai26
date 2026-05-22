import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, Loader2, CheckCircle2, Clock, AlertCircle, XCircle } from 'lucide-react';

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

export default function TicketChat({ ticket, user, isAdmin, onStatusChange }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState(ticket.status);
  const bottomRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const unsub = base44.entities.TicketMessage.subscribe((event) => {
      if (event.data?.ticket_id === ticket.id) {
        if (event.type === 'create') setMessages(prev => [...prev, event.data]);
      }
    });
    return unsub;
  }, [ticket.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    const msgs = await base44.entities.TicketMessage.filter({ ticket_id: ticket.id }, 'created_date');
    setMessages(msgs);
  };

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    setSending(true);
    await base44.entities.TicketMessage.create({
      ticket_id: ticket.id,
      sender_email: user.email,
      sender_name: user.full_name || user.email,
      message: newMessage.trim(),
      is_admin: isAdmin,
    });
    setNewMessage('');
    setSending(false);
  };

  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    const updated = await base44.entities.SupportTicket.update(ticket.id, {
      status: newStatus,
      ...(newStatus === 'resolved' ? { resolved_at: new Date().toISOString() } : {}),
    });
    onStatusChange?.(updated);
  };

  const s = STATUS_CONFIG[status] || STATUS_CONFIG.open;
  const StatusIcon = s.icon;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col" style={{ height: '600px' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-[#0A2540]">{ticket.subject}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${s.color}`}>
              <StatusIcon className="w-3 h-3" />{s.label}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${PRIORITY_COLORS[ticket.priority]}`}>
              {ticket.priority}
            </span>
            <span className="text-[10px] text-gray-400 capitalize">{ticket.category}</span>
          </div>
        </div>
        {isAdmin && (
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-36 h-8 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {/* Initial description */}
        <div className="flex gap-3">
          <div className="w-7 h-7 rounded-full bg-[#635BFF]/10 flex items-center justify-center text-[11px] font-bold text-[#635BFF] flex-shrink-0">
            {(ticket.user_name || ticket.user_email || '?')[0].toUpperCase()}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-[#0A2540]">{ticket.user_name || ticket.user_email}</span>
              <span className="text-[10px] text-gray-400">{new Date(ticket.created_date).toLocaleString()}</span>
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Original</span>
            </div>
            <div className="bg-gray-50 rounded-xl rounded-tl-none px-4 py-3 text-sm text-[#425466]">
              {ticket.description}
            </div>
          </div>
        </div>

        {messages.map(msg => {
          const isMine = msg.sender_email === user.email;
          return (
            <div key={msg.id} className={`flex gap-3 ${isMine ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${msg.is_admin ? 'bg-orange-100 text-orange-600' : 'bg-[#635BFF]/10 text-[#635BFF]'}`}>
                {(msg.sender_name || msg.sender_email || '?')[0].toUpperCase()}
              </div>
              <div className={`flex-1 ${isMine ? 'flex flex-col items-end' : ''}`}>
                <div className={`flex items-center gap-2 mb-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                  <span className="text-xs font-semibold text-[#0A2540]">{msg.sender_name || msg.sender_email}</span>
                  {msg.is_admin && <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded font-semibold">Support</span>}
                  <span className="text-[10px] text-gray-400">{new Date(msg.created_date).toLocaleString()}</span>
                </div>
                <div className={`inline-block rounded-xl px-4 py-3 text-sm max-w-[80%] ${isMine ? 'bg-[#635BFF] text-white rounded-tr-none' : 'bg-gray-50 text-[#425466] rounded-tl-none'}`}>
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      {status !== 'closed' && (
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3 items-end">
          <Textarea
            placeholder="Type your message..."
            className="resize-none h-16 text-sm flex-1"
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          />
          <Button onClick={handleSend} disabled={sending || !newMessage.trim()} className="bg-[#635BFF] hover:bg-[#5751E8] text-white h-10 px-4">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      )}
    </div>
  );
}