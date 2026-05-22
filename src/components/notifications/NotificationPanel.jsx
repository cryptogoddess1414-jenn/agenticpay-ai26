import React from 'react';
import { X, CheckCheck, Bell, Zap, CreditCard, Activity, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const TYPE_CONFIG = {
  system:       { icon: Bell,          bg: 'bg-blue-100',   color: 'text-blue-600' },
  subscription: { icon: CreditCard,    bg: 'bg-purple-100', color: 'text-purple-600' },
  activity:     { icon: Activity,      bg: 'bg-green-100',  color: 'text-green-600' },
  alert:        { icon: AlertTriangle, bg: 'bg-orange-100', color: 'text-orange-600' },
};

function NotificationItem({ notification, onMarkRead, onDismiss }) {
  const cfg = TYPE_CONFIG[notification.type] || TYPE_CONFIG.system;
  const Icon = cfg.icon;
  const timeAgo = notification.created_date
    ? formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })
    : '';

  return (
    <div
      className={`flex gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 ${!notification.is_read ? 'bg-blue-50/40' : ''}`}
      onClick={() => !notification.is_read && onMarkRead(notification.id)}
    >
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${cfg.bg} flex items-center justify-center mt-0.5`}>
        <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-xs font-semibold text-gray-800 ${!notification.is_read ? 'font-bold' : ''}`}>
            {notification.title}
          </p>
          {!notification.is_read && (
            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1" />
          )}
        </div>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{notification.message}</p>
        <p className="text-[10px] text-gray-400 mt-1">{timeAgo}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); onDismiss(notification.id); }}
        className="flex-shrink-0 p-1 rounded hover:bg-gray-200 transition-colors opacity-0 group-hover:opacity-100 self-start mt-0.5"
      >
        <X className="w-3 h-3 text-gray-400" />
      </button>
    </div>
  );
}

export default function NotificationPanel({ notifications, onMarkAllRead, onMarkRead, onDismiss, onClose }) {
  const unread = notifications.filter(n => !n.is_read).length;

  return (
    <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-gray-800">Notifications</h3>
          {unread > 0 && (
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded-full">
              {unread} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {unread > 0 && (
            <button
              onClick={onMarkAllRead}
              className="flex items-center gap-1 text-[10px] text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors"
            >
              <CheckCheck className="w-3 h-3" />
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 transition-colors">
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-3">
              <Bell className="w-4 h-4 text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-500">You're all caught up!</p>
            <p className="text-xs text-gray-400 mt-1">No notifications right now.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {notifications.map(n => (
              <div key={n.id} className="group">
                <NotificationItem notification={n} onMarkRead={onMarkRead} onDismiss={onDismiss} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}