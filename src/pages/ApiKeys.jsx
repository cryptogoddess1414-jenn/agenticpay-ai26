import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/landing/Navbar';
import ApiKeyCard from '../components/api-keys/ApiKeyCard';
import CreateKeyModal from '../components/api-keys/CreateKeyModal';
import KeyLogsModal from '../components/api-keys/KeyLogsModal';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Plus, Key, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function ApiKeys() {
  const [keys, setKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [logsKey, setLogsKey] = useState(null);
  const [filter, setFilter] = useState('all'); // all | live | test | revoked

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    const res = await base44.functions.invoke('apiKeys', { action: 'list' });
    setKeys(res.data.keys || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchKeys(); }, [fetchKeys]);

  const handleCreate = async (data) => {
    const res = await base44.functions.invoke('apiKeys', { action: 'create', ...data });
    if (res.data?.full_key) {
      await fetchKeys();
      return res.data.full_key;
    }
    toast.error('Failed to create key');
    return null;
  };

  const handleRevoke = async (apiKey) => {
    await base44.functions.invoke('apiKeys', { action: 'revoke', id: apiKey.id });
    toast.success(`Key "${apiKey.name}" revoked`);
    fetchKeys();
  };

  const handleDelete = async (apiKey) => {
    if (!confirm(`Delete key "${apiKey.name}"? This cannot be undone.`)) return;
    await base44.functions.invoke('apiKeys', { action: 'delete', id: apiKey.id });
    toast.success('Key deleted');
    fetchKeys();
  };

  const filtered = keys.filter(k => {
    if (filter === 'all') return true;
    if (filter === 'revoked') return k.status === 'revoked';
    return k.mode === filter && k.status !== 'revoked';
  });

  const liveCount = keys.filter(k => k.mode === 'live' && k.status === 'active').length;
  const testCount = keys.filter(k => k.mode === 'test' && k.status === 'active').length;
  const revokedCount = keys.filter(k => k.status === 'revoked').length;

  return (
    <div className="min-h-screen bg-[#F6F9FC]">
      <Navbar />
      <div className="pt-[70px]">
        <div className="max-w-[900px] mx-auto px-6 py-10">

          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#635BFF] flex items-center justify-center shadow-sm">
                <Key className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-[#0A2540] tracking-tight">API Keys</h1>
                <p className="text-sm text-[#8898AA]">Manage your live and test API keys, view usage logs, and revoke compromised keys.</p>
              </div>
            </div>
            <Button onClick={() => setShowCreate(true)} className="bg-[#635BFF] hover:bg-[#5751e8] gap-2">
              <Plus className="w-4 h-4" /> New API Key
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: 'Live Keys', value: liveCount, color: 'text-green-600', bg: 'bg-green-50 border-green-100' },
              { label: 'Test Keys', value: testCount, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
              { label: 'Revoked', value: revokedCount, color: 'text-red-500', bg: 'bg-red-50 border-red-100' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} border rounded-2xl px-4 py-3`}>
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400 font-medium mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 mb-6 w-fit">
            {[
              { key: 'all', label: 'All' },
              { key: 'live', label: 'Live' },
              { key: 'test', label: 'Test' },
              { key: 'revoked', label: 'Revoked' },
            ].map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  filter === f.key ? 'bg-[#635BFF] text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Key list */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-5 h-5 animate-spin text-[#635BFF]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-gray-200 rounded-2xl">
              <AlertCircle className="w-8 h-8 text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-300">No keys found</p>
              <p className="text-xs text-gray-200 mt-1">Create your first API key to get started.</p>
              <Button onClick={() => setShowCreate(true)} size="sm" className="mt-4 bg-[#635BFF] hover:bg-[#5751e8] gap-1.5">
                <Plus className="w-3.5 h-3.5" /> New API Key
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(k => (
                <ApiKeyCard
                  key={k.id}
                  apiKey={k}
                  onRevoke={handleRevoke}
                  onDelete={handleDelete}
                  onViewLogs={setLogsKey}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <CreateKeyModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
      />

      <KeyLogsModal
        apiKey={logsKey}
        onClose={() => setLogsKey(null)}
      />
    </div>
  );
}