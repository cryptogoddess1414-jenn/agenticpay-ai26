import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Pencil, Trash2, ToggleLeft, ToggleRight, CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';

const STATUS_CONFIG = {
  active:   { label: 'Active',   color: 'text-green-600', bg: 'bg-green-50 border-green-200',  Icon: CheckCircle2 },
  inactive: { label: 'Inactive', color: 'text-gray-400',  bg: 'bg-gray-50 border-gray-200',    Icon: Clock },
  failing:  { label: 'Failing',  color: 'text-red-500',   bg: 'bg-red-50 border-red-200',      Icon: AlertTriangle },
};

export default function WebhookCard({ webhook, onEdit, onDelete, onToggle, onTest }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cfg = STATUS_CONFIG[webhook.status] || STATUS_CONFIG.inactive;

  return (
    <div className={`bg-white rounded-2xl border ${webhook.status === 'failing' ? 'border-red-200' : 'border-gray-100'} shadow-sm p-5`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-bold text-[#0A2540]">{webhook.name}</span>
            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full border ${cfg.bg} ${cfg.color}`}>
              <cfg.Icon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>
          <p className="text-xs font-mono text-[#635BFF] truncate">{webhook.url}</p>

          <div className="flex flex-wrap gap-1 mt-3">
            {(webhook.events || []).map(evt => (
              <span key={evt} className="text-[10px] font-mono bg-[#635BFF]/8 text-[#635BFF] px-2 py-0.5 rounded-full border border-[#635BFF]/20">
                {evt}
              </span>
            ))}
            {(!webhook.events || webhook.events.length === 0) && (
              <span className="text-[10px] text-gray-300 italic">No events subscribed</span>
            )}
          </div>

          {webhook.last_triggered_at && (
            <p className="text-[10px] text-gray-400 mt-2">
              Last triggered: {new Date(webhook.last_triggered_at).toLocaleString()}
              {webhook.last_status_code && (
                <span className={`ml-2 font-mono font-semibold ${webhook.last_status_code < 300 ? 'text-green-600' : 'text-red-500'}`}>
                  HTTP {webhook.last_status_code}
                </span>
              )}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onToggle}
            title={webhook.status === 'active' ? 'Disable' : 'Enable'}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#635BFF] transition-colors"
          >
            {webhook.status === 'active'
              ? <ToggleRight className="w-4 h-4 text-[#635BFF]" />
              : <ToggleLeft className="w-4 h-4" />
            }
          </button>
          <button onClick={() => onTest(webhook)}
            title="Test"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#0A2540] transition-colors">
            <Send className="w-4 h-4" />
          </button>
          <button onClick={() => onEdit(webhook)}
            title="Edit"
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#0A2540] transition-colors">
            <Pencil className="w-4 h-4" />
          </button>
          {confirmDelete ? (
            <div className="flex items-center gap-1">
              <button onClick={() => onDelete(webhook.id)}
                className="px-2 py-1 text-xs bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
              <button onClick={() => setConfirmDelete(false)}
                className="px-2 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)}
              title="Delete"
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}