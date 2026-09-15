import React, { useMemo, useState, useEffect } from 'react';
import {
  Bell,
  CheckCircle2,
  Clock,
  ClipboardList,
  Flame,
  History,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  User,
  X,
  XCircle,
  FileText,
  Eye,
  ChevronRight
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import type { Order, OrderStatus } from '../types';
import { ReceptionConfirmModal } from './ReceptionConfirmModal';
import { ReceptionCancelModal } from './ReceptionCancelModal';

// ----------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending_reception: 'Pending Reception',
  payment_pending: 'Payment Pending',
  confirmed_reception: 'Confirmed',
  sent_to_kitchen: 'Sent to Kitchen',
  accepted_by_kitchen: 'Kitchen Accepted',
  preparing: 'Preparing',
  ready: 'Ready',
  completed: 'Completed',
  rejected_reception: 'Cancelled',
  rejected_kitchen: 'Rejected by Kitchen',
  pending: 'Pending',
  received: 'Received',
  accepted: 'Accepted',
  rejected: 'Rejected'
};

const STATUS_COLOR: Record<string, string> = {
  pending_reception: 'bg-amber-100 text-amber-700',
  payment_pending: 'bg-amber-100 text-amber-700',
  confirmed_reception: 'bg-emerald-100 text-emerald-700',
  sent_to_kitchen: 'bg-sky-100 text-sky-700',
  accepted_by_kitchen: 'bg-violet-100 text-violet-700',
  preparing: 'bg-blue-100 text-blue-700',
  ready: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-slate-100 text-slate-600',
  rejected_reception: 'bg-red-100 text-red-700',
  rejected_kitchen: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
  received: 'bg-amber-100 text-amber-700',
  accepted: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700'
};

const formatTime = (ts?: string) => {
  if (!ts) return '—';
  try {
    if (ts.includes(',')) return ts.split(',')[0]?.trim() || ts;
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return ts;
  }
};

const formatDateTime = (ts?: string) => {
  if (!ts) return '—';
  try {
    if (ts.includes(',')) return ts;
    return new Date(ts).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  } catch {
    return ts;
  }
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
// Sidebar nav items
// ----------------------------------------------------------------
type SidebarSection = 'dashboard' | 'new' | 'confirmed' | 'cancelled' | 'history' | 'notifications';

const SIDEBAR_ITEMS: { id: SidebarSection; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'new', label: 'New Orders', icon: Bell },
  { id: 'confirmed', label: 'Confirmed Orders', icon: CheckCircle2 },
  { id: 'cancelled', label: 'Cancelled Orders', icon: XCircle },
  { id: 'history', label: 'Order History', icon: History },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

// ----------------------------------------------------------------
// Order Detail Modal
// ----------------------------------------------------------------
const OrderDetailModal: React.FC<{
  order: Order;
  onClose: () => void;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ order, onClose, onConfirm, onCancel }) => {
  const isActionable = ['pending_reception', 'payment_pending', 'pending', 'received'].includes(order.status);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Order #{order.orderNumber}</h3>
            <p className="text-sm text-slate-500">Table {order.tableNumber} · {formatDateTime(order.createdAt)}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[60vh] overflow-y-auto">
          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${STATUS_COLOR[order.status] || 'bg-slate-100 text-slate-600'}`}>
              {STATUS_LABEL[order.status] || order.status}
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Customer Information</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-500">Name:</span> <span className="text-slate-900 font-medium">{order.customerName}</span></div>
              <div><span className="text-slate-500">Phone:</span> <span className="text-slate-900 font-medium">{order.customerPhone}</span></div>
              <div><span className="text-slate-500">Type:</span> <span className="text-slate-900 font-medium capitalize">{order.orderType}</span></div>
              <div><span className="text-slate-500">Payment:</span> <span className="text-slate-900 font-medium capitalize">{order.paymentMethod}</span></div>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Order Items</div>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left">
                    <th className="px-4 py-2 text-xs font-semibold text-slate-500">Item</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 text-center">Qty</th>
                    <th className="px-4 py-2 text-xs font-semibold text-slate-500 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item) => (
                    <tr key={item.cartItemId}>
                      <td className="px-4 py-2.5">
                        <div className="font-medium text-slate-900">{item.food.name}</div>
                        <div className="text-xs text-slate-500">
                          {item.selectedPortion?.portionName && <span>{item.selectedPortion.portionName}</span>}
                          {item.spiceLevel && <span className="ml-2 text-orange-600">🌶 {item.spiceLevel}</span>}
                        </div>
                        {item.specialInstructions && (
                          <div className="text-xs text-slate-400 italic mt-0.5">"{item.specialInstructions}"</div>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center font-medium text-slate-700">{item.quantity}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-slate-900">Rs. {item.itemTotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-slate-700">Rs. {order.subtotal.toLocaleString()}</span>
            </div>
            {(order.discount > 0 || order.loyaltyDiscount > 0) && (
              <div className="flex justify-between text-sm mt-1">
                <span className="text-slate-500">Discount</span>
                <span className="text-emerald-600">-Rs. {((order.discount || 0) + (order.loyaltyDiscount || 0)).toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold mt-2 pt-2 border-t border-slate-200">
              <span className="text-slate-900">Total</span>
              <span className="text-slate-900">Rs. {order.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Special Notes */}
          {order.specialNotes && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-800">
              <span className="font-semibold">Customer Note:</span> {order.specialNotes}
            </div>
          )}

          {/* Rejection reason */}
          {order.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              <span className="font-semibold">Cancellation Reason:</span> {order.rejectionReason}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex gap-3 p-5 border-t border-slate-100 bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition"
          >
            Close
          </button>
          {isActionable && (
            <>
              <button
                onClick={onConfirm}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 text-sm font-bold text-white hover:bg-emerald-600 transition flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Confirm
              </button>
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-sm font-bold text-white hover:bg-red-600 transition flex items-center justify-center gap-1.5"
              >
                <XCircle className="w-4 h-4" />
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ----------------------------------------------------------------
// Main Reception Dashboard
// ----------------------------------------------------------------
export const ReceptionDashboard: React.FC = () => {
  const {
    staffUser,
    logoutStaff,
    orderHistory,
    confirmReceptionOrder,
    rejectReceptionOrder,
    pollKitchenOrders
  } = useRestaurant();

  const [activeSection, setActiveSection] = useState<SidebarSection>('dashboard');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);
  const [confirmOrder, setConfirmOrder] = useState<Order | null>(null);
  const [cancelOrder, setCancelOrder] = useState<Order | null>(null);

  const orders = useMemo(() => orderHistory || [], [orderHistory]);

  const newOrders = useMemo(() =>
    orders.filter((o) => ['pending_reception', 'payment_pending', 'pending', 'received'].includes(o.status)),
    [orders]
  );
  const confirmedOrders = useMemo(() =>
    orders.filter((o) => ['confirmed_reception', 'sent_to_kitchen', 'accepted_by_kitchen', 'preparing', 'ready'].includes(o.status)),
    [orders]
  );
  const cancelledOrders = useMemo(() =>
    orders.filter((o) => ['rejected_reception', 'rejected_kitchen', 'rejected'].includes(o.status)),
    [orders]
  );
  const todayOrders = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter((o) => {
      try {
        return new Date(o.createdAt).toDateString() === today;
      } catch {
        return true; // if date parsing fails, include it
      }
    });
  }, [orders]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await pollKitchenOrders();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Get visible orders based on active section
  const visibleOrders = useMemo(() => {
    switch (activeSection) {
      case 'new': return newOrders;
      case 'confirmed': return confirmedOrders;
      case 'cancelled': return cancelledOrders;
      case 'history': return orders;
      case 'dashboard': return newOrders;
      default: return orders;
    }
  }, [activeSection, newOrders, confirmedOrders, cancelledOrders, orders]);

  const handleViewOrder = (order: Order) => setViewOrder(order);
  const handleConfirmFromDetail = () => {
    if (viewOrder) {
      setConfirmOrder(viewOrder);
      setViewOrder(null);
    }
  };
  const handleCancelFromDetail = () => {
    if (viewOrder) {
      setCancelOrder(viewOrder);
      setViewOrder(null);
    }
  };

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
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Reception</div>
            <div className="text-base font-bold text-slate-900">Ceylon Bites</div>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const count = item.id === 'new' ? newOrders.length :
                          item.id === 'confirmed' ? confirmedOrders.length :
                          item.id === 'cancelled' ? cancelledOrders.length : 0;

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
                    isActive ? 'bg-white text-slate-900' : item.id === 'new' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
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
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-slate-900 truncate">{staffUser.name}</div>
              <div className="text-xs text-slate-500">Reception Staff</div>
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
            <h1 className="text-xl font-bold text-slate-900">Reception Dashboard</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage incoming customer orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 border border-slate-200">
              <Clock className="w-4 h-4 text-slate-400" />
              <LiveClock />
            </div>
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
          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-4">
            <button
              onClick={() => setActiveSection('new')}
              className={`bg-white rounded-xl border p-4 text-left transition hover:shadow-sm ${activeSection === 'new' ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">New Orders</div>
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-amber-700" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{newOrders.length}</div>
            </button>

            <button
              onClick={() => setActiveSection('confirmed')}
              className={`bg-white rounded-xl border p-4 text-left transition hover:shadow-sm ${activeSection === 'confirmed' ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Confirmed</div>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{confirmedOrders.length}</div>
            </button>

            <button
              onClick={() => setActiveSection('cancelled')}
              className={`bg-white rounded-xl border p-4 text-left transition hover:shadow-sm ${activeSection === 'cancelled' ? 'border-red-300 ring-1 ring-red-200' : 'border-slate-200'}`}
            >
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Cancelled</div>
                <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <XCircle className="w-4 h-4 text-red-700" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{cancelledOrders.length}</div>
            </button>

            <div className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Today's Orders</div>
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <ClipboardList className="w-4 h-4 text-slate-600" />
                </div>
              </div>
              <div className="mt-2 text-3xl font-bold text-slate-900">{todayOrders.length}</div>
            </div>
          </div>

          {/* Section Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              {activeSection === 'dashboard' || activeSection === 'new' ? 'New Orders' :
               activeSection === 'confirmed' ? 'Confirmed Orders' :
               activeSection === 'cancelled' ? 'Cancelled Orders' :
               activeSection === 'history' ? 'Order History' :
               activeSection === 'notifications' ? 'Notifications' : 'Orders'}
            </h2>
            <span className="text-sm text-slate-500">{visibleOrders.length} orders</span>
          </div>

          {/* Orders Table */}
          {activeSection === 'notifications' ? (
            <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
              <Bell className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Notification center — new order alerts appear here.</p>
              <p className="text-slate-400 text-xs mt-1">Orders auto-refresh every 10 seconds.</p>
            </div>
          ) : visibleOrders.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-300 p-12 text-center">
              <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-7 h-7 text-slate-400" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No orders found</h3>
              <p className="text-sm text-slate-500 mt-1">
                {activeSection === 'new' ? 'New customer orders will appear here.' :
                 activeSection === 'confirmed' ? 'No confirmed orders yet.' :
                 activeSection === 'cancelled' ? 'No cancelled orders.' :
                 'No orders in history.'}
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Order</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Table</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Time</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Items</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Total</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {visibleOrders.map((order) => {
                    const isNew = ['pending_reception', 'payment_pending', 'pending', 'received'].includes(order.status);
                    return (
                      <tr
                        key={order.id}
                        className={`transition ${isNew ? 'bg-amber-50/50 hover:bg-amber-50' : 'hover:bg-slate-50'}`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {isNew && <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />}
                            <span className="text-sm font-bold text-slate-900">#{order.orderNumber}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-medium text-slate-700">T{order.tableNumber}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-600">{formatTime(order.createdAt)}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm text-slate-700">{order.items.length}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-sm font-semibold text-slate-900">Rs. {order.total.toLocaleString()}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLOR[order.status] || 'bg-slate-100 text-slate-600'}`}>
                            {STATUS_LABEL[order.status] || order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* ============ MODALS ============ */}
      {viewOrder && (
        <OrderDetailModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
          onConfirm={handleConfirmFromDetail}
          onCancel={handleCancelFromDetail}
        />
      )}

      {confirmOrder && (
        <ReceptionConfirmModal
          order={confirmOrder}
          onClose={() => setConfirmOrder(null)}
        />
      )}

      {cancelOrder && (
        <ReceptionCancelModal
          order={cancelOrder}
          onClose={() => setCancelOrder(null)}
        />
      )}
    </div>
  );
};
