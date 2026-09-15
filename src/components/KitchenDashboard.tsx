import React, { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  CheckCircle2,
  ChefHat,
  Clock,
  Flame,
  History,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  RotateCcw,
  User,
  UtensilsCrossed,
  X,
  XCircle
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order, OrderStatus } from '../types';
import { AcceptOrderModal } from './AcceptOrderModal';
import { RejectOrderModal } from './RejectOrderModal';

// ----------------------------------------------------------------
// Status badge config
// ----------------------------------------------------------------
type BadgeConfig = { label: string; color: string };

const STATUS_BADGE: Record<OrderStatus, BadgeConfig> = {
  pending_reception: { label: 'Pending Reception', color: 'bg-amber-100 text-amber-700' },
  payment_pending: { label: 'Payment Pending', color: 'bg-amber-100 text-amber-700' },
  confirmed_reception: { label: 'Confirmed', color: 'bg-emerald-100 text-emerald-700' },
  sent_to_kitchen: { label: 'New Order', color: 'bg-sky-100 text-sky-700' },
  accepted_by_kitchen: { label: 'Accepted', color: 'bg-violet-100 text-violet-700' },
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Ready', color: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'Completed', color: 'bg-slate-100 text-slate-600' },
  rejected_reception: { label: 'Cancelled by Reception', color: 'bg-red-100 text-red-700' },
  rejected_kitchen: { label: 'Rejected', color: 'bg-red-100 text-red-700' },
  pending: { label: 'Pending', color: 'bg-amber-100 text-amber-700' },
  received: { label: 'Received', color: 'bg-amber-100 text-amber-700' },
  accepted: { label: 'Accepted', color: 'bg-violet-100 text-violet-700' },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700' }
};

// ----------------------------------------------------------------
// Live clock
// ----------------------------------------------------------------
const LiveClock: React.FC = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className="font-mono text-sm font-semibold text-slate-700">
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
    </span>
  );
};

// ----------------------------------------------------------------
// Sidebar nav
// ----------------------------------------------------------------
type SidebarSection = 'dashboard' | 'new' | 'preparing' | 'ready' | 'completed' | 'rejected' | 'history' | 'notifications';

const SIDEBAR_ITEMS: { id: SidebarSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'new', label: 'New Orders', icon: Bell },
  { id: 'preparing', label: 'Preparing', icon: Flame },
  { id: 'ready', label: 'Ready', icon: CheckCircle2 },
  { id: 'completed', label: 'Completed', icon: UtensilsCrossed },
  { id: 'rejected', label: 'Rejected', icon: XCircle },
  { id: 'history', label: 'Order History', icon: History },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
const formatTime = (ts: string) => {
  if (!ts) return '—';
  try {
    if (ts.includes(',')) return ts.split(',')[0]?.trim() || ts;
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return ts;
  }
};

// ----------------------------------------------------------------
// Order Card
// ----------------------------------------------------------------
interface OrderCardProps {
  order: Order;
  isNew: boolean;
  onAccept: (order: Order) => void;
  onReject: (order: Order) => void;
  onAdvance: (orderId: string) => void;
}

const KitchenOrderCard: React.FC<OrderCardProps> = ({ order, isNew, onAccept, onReject, onAdvance }) => {
  const badge = STATUS_BADGE[order.status] || STATUS_BADGE.pending;
  const isPending = order.status === 'sent_to_kitchen';
  const isAccepted = order.status === 'accepted_by_kitchen' || order.status === 'accepted';
  const isPreparing = order.status === 'preparing';
  const isReady = order.status === 'ready';
  const isRejected = order.status === 'rejected_kitchen' || order.status === 'rejected';
  const isCompleted = order.status === 'completed';

  return (
    <div className={`rounded-xl border bg-white p-5 space-y-4 transition-all ${
      isNew && isPending
        ? 'border-sky-300 shadow-sm ring-1 ring-sky-100'
        : isRejected
        ? 'border-red-200 opacity-75'
        : isCompleted
        ? 'border-slate-200 opacity-70'
        : 'border-slate-200 hover:shadow-sm'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-slate-900">ORDER #{order.orderNumber}</span>
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${badge.color}`}>
              {badge.label}
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-3 text-sm text-slate-500">
            <span className="font-semibold text-amber-700">TABLE {order.tableNumber}</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Received: {formatTime(order.createdAt)}
            </span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-base font-bold text-slate-900">Rs. {order.total.toLocaleString()}</div>
          <div className="text-xs text-slate-500 capitalize">{order.paymentMethod}</div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* Items */}
      <div className="space-y-2">
        {order.items.map((item) => (
          <div key={item.cartItemId} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-900 font-medium">{item.food.name}</span>
              {item.selectedPortion?.portionCode && (
                <span className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                  {item.selectedPortion.portionCode}
                </span>
              )}
              {item.spiceLevel && (
                <span className="text-xs text-orange-600">🌶 {item.spiceLevel}</span>
              )}
            </div>
            <span className="text-slate-700 font-semibold">× {item.quantity}</span>
          </div>
        ))}
      </div>

      {/* Special notes */}
      {order.specialNotes && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
          <span className="font-semibold">📝 Note:</span> {order.specialNotes}
        </div>
      )}

      {/* BYOB accessories */}
      {(order.needIceBucket || order.needGlassware) && (
        <div className="flex gap-2 text-xs">
          {order.needIceBucket && (
            <span className="rounded-lg border border-cyan-200 bg-cyan-50 px-2 py-1 text-cyan-700">🧊 Ice Bucket</span>
          )}
          {order.needGlassware && (
            <span className="rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-blue-700">🥂 Glassware</span>
          )}
        </div>
      )}

      {/* Accepted info */}
      {isAccepted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            Accepted — Est. {order.estimatedPrepTime || order.estimatedMinutes} minutes
          </div>
          {order.kitchenNote && (
            <div className="text-sm text-slate-600 mt-1 italic">"{order.kitchenNote}"</div>
          )}
        </div>
      )}

      {/* Rejected info */}
      {isRejected && order.rejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-red-700">
            <XCircle className="w-4 h-4" />
            Rejected
          </div>
          <div className="text-sm text-slate-600 mt-1">Reason: "{order.rejectionReason}"</div>
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-slate-100" />

      {/* Action buttons */}
      {isPending && (
        <div className="flex gap-3">
          <button
            onClick={() => onAccept(order)}
            className="flex-[2] py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-1.5"
          >
            <CheckCircle2 className="w-4 h-4" />
            Accept Order
          </button>
          <button
            onClick={() => onReject(order)}
            className="flex-1 py-2.5 rounded-xl bg-white border border-red-200 text-red-600 text-sm font-semibold hover:bg-red-50 transition flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
        </div>
      )}

      {(isAccepted || isPreparing || isReady) && !isCompleted && !isRejected && (
        <button
          onClick={() => onAdvance(order.id)}
          className="w-full py-2.5 rounded-xl bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" />
          Mark as {isAccepted ? 'Preparing' : isPreparing ? 'Ready' : 'Completed'}
        </button>
      )}
    </div>
  );
};

// ----------------------------------------------------------------
// Kitchen Dashboard
// ----------------------------------------------------------------
export const KitchenDashboard: React.FC = () => {
  const {
    staffUser,
    logoutStaff,
    kitchenOrders,
    pollKitchenOrders,
    newOrderNotification,
    dismissNewOrderNotification,
    advanceOrderStatus
  } = useRestaurant();

  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');
  const [acceptTarget, setAcceptTarget] = useState<Order | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Order | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [seenOrderIds] = useState<Set<string>>(new Set());
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    kitchenOrders.forEach((o) => {
      if (o.status === 'sent_to_kitchen' && !seenOrderIds.has(o.id)) {
        setNewIds((prev) => new Set([...prev, o.id]));
        seenOrderIds.add(o.id);
      }
    });
  }, [kitchenOrders, seenOrderIds]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await pollKitchenOrders();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Filter orders for kitchen view — only orders that have passed reception
  const kitchenVisibleOrders = useMemo(() =>
    kitchenOrders.filter((o) => !['pending_reception', 'payment_pending', 'pending', 'received'].includes(o.status)),
    [kitchenOrders]
  );

  const newOrders = useMemo(() =>
    kitchenVisibleOrders.filter((o) => o.status === 'sent_to_kitchen'),
    [kitchenVisibleOrders]
  );
  const preparingOrders = useMemo(() =>
    kitchenVisibleOrders.filter((o) => o.status === 'accepted_by_kitchen' || o.status === 'accepted' || o.status === 'preparing'),
    [kitchenVisibleOrders]
  );
  const readyOrders = useMemo(() =>
    kitchenVisibleOrders.filter((o) => o.status === 'ready'),
    [kitchenVisibleOrders]
  );
  const completedOrders = useMemo(() =>
    kitchenVisibleOrders.filter((o) => o.status === 'completed'),
    [kitchenVisibleOrders]
  );
  const rejectedOrders = useMemo(() =>
    kitchenVisibleOrders.filter((o) => o.status === 'rejected_kitchen' || o.status === 'rejected'),
    [kitchenVisibleOrders]
  );

  const visibleOrders = useMemo(() => {
    switch (activeSection) {
      case 'new':
      case 'dashboard':
        return newOrders;
      case 'preparing':
        return preparingOrders;
      case 'ready':
        return readyOrders;
      case 'completed':
        return completedOrders;
      case 'rejected':
        return rejectedOrders;
      case 'history':
        return kitchenVisibleOrders;
      default:
        return newOrders;
    }
  }, [activeSection, newOrders, preparingOrders, readyOrders, completedOrders, rejectedOrders, kitchenVisibleOrders]);

  const sectionTitle = activeSection === 'dashboard' || activeSection === 'new' ? 'New Orders' :
    activeSection === 'preparing' ? 'Preparing' :
    activeSection === 'ready' ? 'Ready' :
    activeSection === 'completed' ? 'Completed' :
    activeSection === 'rejected' ? 'Rejected' :
    activeSection === 'history' ? 'Order History' :
    activeSection === 'notifications' ? 'Notifications' : 'Orders';

  return (
    <div className="min-h-screen bg-white text-slate-900 flex">
      {/* ============ SIDEBAR ============ */}
      <aside className="w-[260px] min-h-screen border-r border-slate-200 bg-white flex flex-col shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 border border-amber-200">
            <Flame className="h-5 w-5 text-amber-700" />
          </div>
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Kitchen</div>
            <div className="text-base font-bold text-slate-900">Ceylon Bites</div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const count = item.id === 'new' ? newOrders.length :
                          item.id === 'preparing' ? preparingOrders.length :
                          item.id === 'ready' ? readyOrders.length :
                          item.id === 'completed' ? completedOrders.length :
                          item.id === 'rejected' ? rejectedOrders.length : 0;

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {count > 0 && (
                  <span className={`min-w-[22px] h-[22px] flex items-center justify-center rounded-full text-xs font-bold ${
                    isActive ? 'bg-white text-slate-900' :
                    item.id === 'new' ? 'bg-sky-100 text-sky-700' :
                    item.id === 'ready' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Profile */}
        <div className="border-t border-slate-200 px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600">
              <ChefHat className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{staffUser.name}</div>
              <div className="text-xs text-slate-500">Kitchen Staff</div>
            </div>
            <button
              onClick={logoutStaff}
              className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ============ MAIN AREA ============ */}
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Kitchen Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage kitchen orders and preparation</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <Clock className="w-4 h-4 text-slate-400" />
              <LiveClock />
            </div>
            {newOrderNotification && (
              <button
                onClick={dismissNewOrderNotification}
                className="relative p-2 rounded-lg bg-sky-50 border border-sky-200 text-sky-700 hover:bg-sky-100 transition"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-sky-500 rounded-full animate-pulse" />
              </button>
            )}
            <button
              onClick={handleRefresh}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* New Order Alert Banner */}
          {newOrderNotification && (
            <div className="flex items-center gap-4 bg-sky-50 border border-sky-200 rounded-xl p-4">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-sky-700" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-sky-900">New Order Received from Reception</div>
                <div className="text-xs text-sky-700">A confirmed order has arrived and needs kitchen review.</div>
              </div>
              <button
                onClick={dismissNewOrderNotification}
                className="p-2 rounded-lg border border-sky-200 bg-white text-sky-700 hover:bg-sky-50 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => setActiveSection('new')}
              className={`bg-white rounded-xl border p-4 text-left transition hover:shadow-sm ${activeSection === 'new' || activeSection === 'dashboard' ? 'border-sky-300 ring-1 ring-sky-100' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Orders</div>
                <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-sky-700" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{newOrders.length}</div>
            </button>

            <button
              onClick={() => setActiveSection('preparing')}
              className={`bg-white rounded-xl border p-4 text-left transition hover:shadow-sm ${activeSection === 'preparing' ? 'border-blue-300 ring-1 ring-blue-100' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Preparing</div>
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <Flame className="w-4 h-4 text-blue-700" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{preparingOrders.length}</div>
            </button>

            <button
              onClick={() => setActiveSection('ready')}
              className={`bg-white rounded-xl border p-4 text-left transition hover:shadow-sm ${activeSection === 'ready' ? 'border-emerald-300 ring-1 ring-emerald-100' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ready</div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{readyOrders.length}</div>
            </button>

            <button
              onClick={() => setActiveSection('completed')}
              className={`bg-white rounded-xl border p-4 text-left transition hover:shadow-sm ${activeSection === 'completed' ? 'border-slate-300 ring-1 ring-slate-200' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed</div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <UtensilsCrossed className="w-4 h-4 text-slate-600" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{completedOrders.length}</div>
            </button>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">{sectionTitle}</h2>
            <span className="text-sm text-slate-500">{visibleOrders.length} orders</span>
          </div>

          {/* Order Cards */}
          {activeSection === 'notifications' ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Kitchen notifications appear here.</p>
              <p className="text-slate-400 text-xs mt-1">Orders auto-refresh every 10 seconds.</p>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <UtensilsCrossed className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No {sectionTitle.toLowerCase()}</h3>
              <p className="text-sm text-slate-500 mt-1">
                {activeSection === 'new' || activeSection === 'dashboard'
                  ? 'Confirmed orders from reception will appear here.'
                  : `No orders in the "${sectionTitle.toLowerCase()}" queue.`}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 xl:grid-cols-2 2xl:grid-cols-3">
              {visibleOrders
                .sort((a, b) => {
                  if (a.status === 'sent_to_kitchen' && b.status !== 'sent_to_kitchen') return -1;
                  if (a.status !== 'sent_to_kitchen' && b.status === 'sent_to_kitchen') return 1;
                  return 0;
                })
                .map((order) => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    isNew={newIds.has(order.id)}
                    onAccept={setAcceptTarget}
                    onReject={setRejectTarget}
                    onAdvance={advanceOrderStatus}
                  />
                ))}
            </div>
          )}
        </div>
      </main>

      {/* ============ MODALS ============ */}
      {acceptTarget && (
        <AcceptOrderModal
          order={acceptTarget}
          onClose={() => setAcceptTarget(null)}
        />
      )}

      {rejectTarget && (
        <RejectOrderModal
          order={rejectTarget}
          onClose={() => setRejectTarget(null)}
        />
      )}
    </div>
  );
};
