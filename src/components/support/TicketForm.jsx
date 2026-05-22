import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

export default function TicketForm({ user, onCreated, onCancel }) {
  const [form, setForm] = useState({ subject: '', description: '', priority: 'medium', category: 'general' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const ticket = await base44.entities.SupportTicket.create({
      ...form,
      user_email: user.email,
      user_name: user.full_name || user.email,
      status: 'open',
    });
    onCreated(ticket);
    setSubmitting(false);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-8 max-w-2xl">
      <h2 className="text-base font-bold text-[#0A2540] mb-6">Submit a New Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Subject</label>
          <Input
            placeholder="Brief description of your issue"
            value={form.subject}
            onChange={e => setForm({ ...form, subject: e.target.value })}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Category</label>
            <Select value={form.category} onValueChange={v => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="technical">Technical</SelectItem>
                <SelectItem value="account">Account</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Priority</label>
            <Select value={form.priority} onValueChange={v => setForm({ ...form, priority: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Description</label>
          <Textarea
            placeholder="Describe your issue in detail..."
            className="h-32 resize-none"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            required
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={submitting} className="bg-[#635BFF] hover:bg-[#5751E8] text-white">
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Ticket'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}