import { useMemo, type ElementType } from 'react';
import { Bell, X, CheckCircle2, Clock, ChefHat, XCircle, Flame } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import type { CustomerNotification } from '../types';

interface CustomerNotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const notificationIconMap: Record<
  CustomerNotification['type'],
  { icon: ElementType; color: string }
> = {
  NEW_ORDER: { icon: Bell, color: 'text-amber-400' },
  RECEPTION_CANCELLED: { icon: XCircle, color: 'text-red-400' },
  RECEPTION_CONFIRMED: { icon: CheckCircle2, color: 'text-emerald-400' },
  SENT_TO_KITCHEN: { icon: Flame, color: 'text-sky-400' },
  KITCHEN_ACCEPTED: { icon: ChefHat, color: 'text-emerald-400' },
  KITCHEN_REJECTED: { icon: XCircle, color: 'text-red-400' },
  ORDER_PREPARING: { icon: Flame, color: 'text-blue-400' },
  ORDER_READY: { icon: CheckCircle2, color: 'text-emerald-300' },
  ORDER_COMPLETED: { icon: CheckCircle2, color: 'text-zinc-400' },
};

function formatTimeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffSec = Math.floor(diffMs / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export default function CustomerNotificationPanel({
  isOpen,
  onClose,
}: CustomerNotificationPanelProps) {
  const { customerNotifications, markCustomerNotificationRead } = useRestaurant();

  const sorted = useMemo(
    () => [...customerNotifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [customerNotifications]
  );

  const unreadCount = useMemo(
    () => customerNotifications.filter((n) => !n.read).length,
    [customerNotifications]
  );

  const handleMarkAllRead = () => {
    customerNotifications
      .filter((n) => !n.read)
      .forEach((n) => markCustomerNotificationRead(n.id));
  };

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 z-50 w-[380px] max-h-[400px] rounded-2xl border border-zinc-800 bg-[#121215] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#c5a059] text-[#0a0a0a] text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-xs text-[#c5a059] hover:text-[#d4b06a] transition-colors cursor-pointer"
            >
              Mark all as read
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Notification list */}
      <div className="overflow-y-auto flex-1">
        {sorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <Bell className="w-8 h-8 text-zinc-600 mb-3" />
            <p className="text-sm text-zinc-500">No notifications yet</p>
            <p className="text-xs text-zinc-600 mt-1">
              Order updates will appear here
            </p>
          </div>
        ) : (
          sorted.map((notification) => {
            const { icon: Icon, color } = notificationIconMap[notification.type] ?? {
              icon: Bell,
              color: 'text-zinc-400',
            };

            return (
              <button
                key={notification.id}
                onClick={() => {
                  if (!notification.read) {
                    markCustomerNotificationRead(notification.id);
                  }
                }}
                className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors cursor-pointer ${
                  notification.read
                    ? 'bg-transparent hover:bg-zinc-800/40'
                    : 'bg-zinc-800/30 hover:bg-zinc-800/60'
                } border-b border-zinc-800/60 last:border-b-0`}
              >
                {/* Icon */}
                <div
                  className={`mt-0.5 flex-shrink-0 rounded-full p-1.5 ${
                    notification.read ? 'bg-zinc-800/50' : 'bg-zinc-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm leading-snug ${
                        notification.read
                          ? 'text-zinc-400 font-normal'
                          : 'text-white font-medium'
                      }`}
                    >
                      {notification.title}
                    </p>
                    {!notification.read && (
                      <span className="mt-1.5 flex-shrink-0 w-2 h-2 rounded-full bg-[#c5a059]" />
                    )}
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Clock className="w-3 h-3 text-zinc-600" />
                    <span className="text-[11px] text-zinc-600">
                      {formatTimeAgo(notification.createdAt)}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
