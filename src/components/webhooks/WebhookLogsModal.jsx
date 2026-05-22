import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { X, CheckCircle2, XCircle, Clock, RefreshCw, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_CONFIG = {
  success: { Icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50 border-green-200', label: 'Success' },
  failed:  { Icon: XCircle,      color: 'text-red-500',   bg: 'bg-red-50 border-red-200',     label: 'Failed' },
  timeout: { Icon: Clock,        color: 'text-amber-500', bg: 'bg-amber-50 border-amber-200', label: 'Timeout' },
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  return new Date(dateStr).toLocaleDateString();
}

export default function WebhookLogsModal({ webhook, onClose }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchLogs = async () => {
    setLoading(true);
    const data = await base44.entities.WebhookDeliveryLog.filter(
      { webhook_id: webhook.id },
      '-created_date',
      50
    );
    setLogs(data);
    setLoading(false);
  };

  useEffect(() => { fetchLogs(); }, [webhook.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <h2 className="text-sm font-bold text-[#0A2540]">Delivery Logs</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5 truncate max-w-[380px]">{webhook.url}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={fetchLogs} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Refresh">
              <RefreshCw className="w-3.5 h-3.5 text-gray-400" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-6 py-4">
          {loading ? (
            <div className="space-y-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-14 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Clock className="w-8 h-8 text-gray-200 mb-3" />
              <p className="text-sm font-semibold text-gray-400">No deliveries yet</p>
              <p className="text-xs text-gray-300 mt-1">Use the "Test" button to send a sample event.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {logs.map(log => {
                const cfg = STATUS_CONFIG[log.status] || STATUS_CONFIG.failed;
                const isOpen = expanded === log.id;
                return (
                  <div key={log.id}
                    className={`rounded-xl border transition-all ${cfg.bg} cursor-pointer`}
                    onClick={() => setExpanded(isOpen ? null : log.id)}
                  >
                    <div className="flex items-center gap-3 px-4 py-3">
                      <cfg.Icon className={`w-4 h-4 flex-shrink-0 ${cfg.color}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-mono font-semibold text-[#0A2540]">{log.event_type}</span>
                          {log.is_test && (
                            <span className="flex items-center gap-0.5 text-[10px] font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded-full border border-amber-200">
                              <FlaskConical className="w-2.5 h-2.5" /> test
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          {log.http_status_code && (
                            <span className="text-[10px] font-mono text-gray-500">HTTP {log.http_status_code}</span>
                          )}
                          {log.latency_ms != null && (
                            <span className="text-[10px] text-gray-400">{log.latency_ms}ms</span>
                          )}
                          <span className="text-[10px] text-gray-400">{timeAgo(log.created_date)}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                    </div>

                    {isOpen && (
                      <div className="px-4 pb-3 border-t border-current/10 space-y-2 mt-1">
                        {log.error_message && (
                          <div>
                            <p className="text-[10px] font-semibold text-gray-500 mb-1">Error</p>
                            <pre className="text-[10px] font-mono text-red-700 bg-red-100/60 rounded-lg p-2 whitespace-pre-wrap break-all">{log.error_message}</pre>
                          </div>
                        )}
                        {log.response_body && (
                          <div>
                            <p className="text-[10px] font-semibold text-gray-500 mb-1">Response Body</p>
                            <pre className="text-[10px] font-mono text-[#425466] bg-white/70 rounded-lg p-2 whitespace-pre-wrap break-all max-h-24 overflow-auto">{log.response_body}</pre>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-gray-100 flex justify-between items-center flex-shrink-0">
          <p className="text-xs text-gray-400">{logs.length} recent deliveries</p>
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  );
}