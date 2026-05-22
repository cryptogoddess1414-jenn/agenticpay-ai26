import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { Clock, Loader2 } from 'lucide-react';

const STATUS_COLOR = {
  2: 'text-green-600 bg-green-50',
  4: 'text-amber-600 bg-amber-50',
  5: 'text-red-600 bg-red-50',
};

const METHOD_COLOR = {
  GET:    'text-blue-600 bg-blue-50',
  POST:   'text-green-700 bg-green-50',
  PUT:    'text-amber-700 bg-amber-50',
  DELETE: 'text-red-600 bg-red-50',
};

export default function KeyLogsModal({ apiKey, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!apiKey) return;
    setLoading(true);
    base44.functions.invoke('apiKeys', { action: 'logs', id: apiKey.id })
      .then(res => setLogs(res.data.logs || []))
      .finally(() => setLoading(false));
  }, [apiKey?.id]);

  return (
    <Dialog open={!!apiKey} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#0A2540] flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#635BFF]" />
            Usage Logs — <span className="font-mono text-sm text-[#635BFF]">{apiKey?.key_prefix}…</span>
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-5 h-5 animate-spin text-[#635BFF]" />
          </div>
        ) : logs.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-300">No usage logs yet.</div>
        ) : (
          <div className="max-h-[420px] overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b border-gray-100">
                  <th className="text-left px-3 py-2 text-gray-400 font-semibold">Method</th>
                  <th className="text-left px-3 py-2 text-gray-400 font-semibold">Endpoint</th>
                  <th className="text-left px-3 py-2 text-gray-400 font-semibold">Status</th>
                  <th className="text-left px-3 py-2 text-gray-400 font-semibold">Latency</th>
                  <th className="text-left px-3 py-2 text-gray-400 font-semibold">IP</th>
                  <th className="text-left px-3 py-2 text-gray-400 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map(log => (
                  <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${METHOD_COLOR[log.method] || 'text-gray-500 bg-gray-50'}`}>
                        {log.method}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 font-mono text-[#425466]">{log.endpoint}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${STATUS_COLOR[Math.floor(log.status_code / 100)] || 'text-gray-500 bg-gray-50'}`}>
                        {log.status_code}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-[#8898AA]">{log.latency_ms}ms</td>
                    <td className="px-3 py-2.5 text-[#8898AA] font-mono">{log.ip_address || '—'}</td>
                    <td className="px-3 py-2.5 text-[#8898AA]">
                      {log.created_date ? new Date(log.created_date).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}