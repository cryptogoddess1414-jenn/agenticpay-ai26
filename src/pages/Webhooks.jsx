import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import Navbar from '../components/landing/Navbar';
import WebhookCard from '../components/webhooks/WebhookCard';
import WebhookForm from '../components/webhooks/WebhookForm';
import WebhookTestModal from '../components/webhooks/WebhookTestModal';
import { Button } from '@/components/ui/button';
import { Plus, Webhook, BookOpen, X } from 'lucide-react';

export default function Webhooks() {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingWebhook, setEditingWebhook] = useState(null);
  const [testingWebhook, setTestingWebhook] = useState(null);

  const fetchWebhooks = async () => {
    const data = await base44.entities.Webhook.list('-created_date');
    setWebhooks(data);
    setLoading(false);
  };

  useEffect(() => { fetchWebhooks(); }, []);

  const handleSave = async (data) => {
    setSaving(true);
    if (editingWebhook) {
      await base44.entities.Webhook.update(editingWebhook.id, data);
    } else {
      await base44.entities.Webhook.create(data);
    }
    await fetchWebhooks();
    setSaving(false);
    setShowForm(false);
    setEditingWebhook(null);
  };

  const handleEdit = (webhook) => {
    setEditingWebhook(webhook);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await base44.entities.Webhook.delete(id);
    setWebhooks(prev => prev.filter(w => w.id !== id));
  };

  const handleToggle = async (webhook) => {
    const newStatus = webhook.status === 'active' ? 'inactive' : 'active';
    await base44.entities.Webhook.update(webhook.id, { status: newStatus });
    setWebhooks(prev => prev.map(w => w.id === webhook.id ? { ...w, status: newStatus } : w));
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingWebhook(null);
  };

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[900px] mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Webhook className="w-5 h-5 text-[#635BFF]" />
                <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">Webhooks</h1>
              </div>
              <p className="text-sm text-[#8898AA]">
                Register outgoing endpoints to receive real-time event notifications.
              </p>
            </div>
            <Button
              onClick={() => { setEditingWebhook(null); setShowForm(true); }}
              className="bg-[#635BFF] hover:bg-[#5751e8] text-white flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Add Endpoint
            </Button>
          </div>

          {/* Docs callout */}
          <div className="bg-[#635BFF]/5 border border-[#635BFF]/20 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
            <BookOpen className="w-4 h-4 text-[#635BFF] flex-shrink-0" />
            <p className="text-xs text-[#425466]">
              Webhook payloads are signed with HMAC-SHA256 using your endpoint secret.
              Verify the <span className="font-mono font-semibold">X-FlutterStack-Signature</span> header to ensure authenticity.
            </p>
          </div>

          {/* Form panel */}
          {showForm && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-bold text-[#0A2540]">
                  {editingWebhook ? 'Edit Endpoint' : 'New Endpoint'}
                </h2>
                <button onClick={handleCloseForm} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <WebhookForm
                webhook={editingWebhook}
                onSave={handleSave}
                onCancel={handleCloseForm}
                loading={saving}
              />
            </div>
          )}

          {/* Webhook list */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="h-28 bg-white rounded-2xl border border-gray-100 animate-pulse" />
              ))}
            </div>
          ) : webhooks.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-gray-200 flex flex-col items-center justify-center py-20 text-center">
              <Webhook className="w-10 h-10 text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">No webhook endpoints yet</p>
              <p className="text-xs text-gray-300 mt-1 mb-5">
                Add your first endpoint to start receiving real-time events.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                variant="outline"
                className="flex items-center gap-2 border-[#635BFF] text-[#635BFF] hover:bg-[#635BFF]/5"
              >
                <Plus className="w-4 h-4" />
                Add Endpoint
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {webhooks.map(webhook => (
                <WebhookCard
                  key={webhook.id}
                  webhook={webhook}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={() => handleToggle(webhook)}
                  onTest={setTestingWebhook}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {testingWebhook && (
        <WebhookTestModal
          webhook={testingWebhook}
          onClose={() => { setTestingWebhook(null); fetchWebhooks(); }}
        />
      )}
    </div>
  );
}