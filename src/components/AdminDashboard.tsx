import React, { useState } from 'react';
import {
  Flame,
  ShieldCheck,
  LogOut,
  BarChart3,
  ShoppingBag,
  UtensilsCrossed,
  Users,
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChefHat,
  RefreshCw,
  Eye,
  Store,
  ArrowLeft
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order, OrderStatus } from '../types';

// ----------------------------------------------------------------
// Status badge
// ----------------------------------------------------------------
const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const config: Record<string, { label: string; cls: string }> = {
    pending:   { label: 'Pending',   cls: 'bg-amber-500/20 text-amber-400 border-amber-500/40' },
    received:  { label: 'Received',  cls: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
    accepted:  { label: 'Accepted',  cls: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' },
    preparing: { label: 'Preparing', cls: 'bg-blue-500/20 text-blue-400 border-blue-500/40' },
    ready:     { label: 'Ready',     cls: 'bg-emerald-500/25 text-emerald-300 border-emerald-400/50' },
    rejected:  { label: 'Rejected',  cls: 'bg-red-500/20 text-red-400 border-red-500/40' },
    completed: { label: 'Completed', cls: 'bg-zinc-700/40 text-zinc-400 border-zinc-700/40' }
  };
  const { label, cls } = config[status] || config.pending;
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${cls}`}>
      {label}
    </span>
  );
};

// ----------------------------------------------------------------
// Metric card
// ----------------------------------------------------------------
const MetricCard: React.FC<{
  label: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  accentCls?: string;
}> = ({ label, value, subtext, icon, accentCls = 'text-[#c5a059]' }) => (
  <div className="p-5 bg-[#111114] border border-zinc-800 rounded-2xl space-y-3">
    <div className="flex items-center justify-between">
      <span className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">{label}</span>
      <div className={`${accentCls}`}>{icon}</div>
    </div>
    <div>
      <div className={`text-2xl font-black ${accentCls}`}>{value}</div>
      {subtext && <div className="text-[11px] text-zinc-500 mt-0.5">{subtext}</div>}
    </div>
  </div>
);

// ----------------------------------------------------------------
// Orders table row
// ----------------------------------------------------------------
const OrderRow: React.FC<{ order: Order; onAdvance: (id: string) => void }> = ({ order, onAdvance }) => {
  const [expanded, setExpanded] = useState(false);
  const canAdvance = !['rejected', 'completed'].includes(order.status);

  return (
    <>
      <tr className="border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors">
        <td className="py-3 px-3 text-xs font-mono font-bold text-[#c5a059]">#{order.orderNumber}</td>
        <td className="py-3 px-3 text-xs text-zinc-300">Table {order.tableNumber}</td>
        <td className="py-3 px-3 text-xs text-zinc-300 max-w-[140px] truncate">{order.customerName}</td>
        <td className="py-3 px-3 text-xs text-zinc-400">
          {order.items.slice(0, 2).map((i) => `${i.quantity}× ${i.food.name}`).join(', ')}
          {order.items.length > 2 && <span className="text-zinc-500"> +{order.items.length - 2} more</span>}
        </td>
        <td className="py-3 px-3 text-xs font-bold text-white">Rs. {order.total.toLocaleString()}</td>
        <td className="py-3 px-3">
          <StatusBadge status={order.status} />
        </td>
        <td className="py-3 px-3 text-xs text-zinc-500">{order.createdAt}</td>
        <td className="py-3 px-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 text-zinc-500 hover:text-white rounded-lg hover:bg-zinc-800 transition-all"
              title="View details"
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            {canAdvance && (
              <button
                onClick={() => onAdvance(order.id)}
                className="p-1.5 text-[#c5a059] hover:text-white rounded-lg hover:bg-[#c5a059]/10 transition-all"
                title="Advance status"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-zinc-800/50 bg-zinc-950/40">
          <td colSpan={8} className="px-4 py-3">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-4 text-xs text-zinc-400">
                <span>Payment: <strong className="text-zinc-300 capitalize">{order.paymentMethod}</strong></span>
                <span>Type: <strong className="text-zinc-300 capitalize">{order.orderType}</strong></span>
                {order.estimatedPrepTime && <span>Est. Time: <strong className="text-emerald-400">{order.estimatedPrepTime} mins</strong></span>}
                {order.specialNotes && <span>Notes: <em className="text-zinc-300">"{order.specialNotes}"</em></span>}
              </div>
              {order.items.map((item) => (
                <div key={item.cartItemId} className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/50 last:border-0">
                  <span className="text-zinc-300">{item.quantity}× {item.food.name} ({item.selectedPortion?.portionName})</span>
                  <span className="text-zinc-400">Rs. {item.itemTotal.toLocaleString()}</span>
                </div>
              ))}
              {order.kitchenNote && (
                <div className="text-xs text-emerald-400">Kitchen note: "{order.kitchenNote}"</div>
              )}
              {order.rejectionReason && (
                <div className="text-xs text-red-400">Rejection reason: "{order.rejectionReason}"</div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

// ----------------------------------------------------------------
// Admin Dashboard
// ----------------------------------------------------------------
export const AdminDashboard: React.FC = () => {
  const { staffUser, logoutStaff, kitchenOrders, orderHistory, advanceOrderStatus, pollKitchenOrders, setActiveView, loginAsRole } = useRestaurant();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'staff'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const allOrders = kitchenOrders.length > 0 ? kitchenOrders : orderHistory;

  const totalRevenue = allOrders.filter((o) => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);
  const pendingCount = allOrders.filter((o) => o.status === 'pending' || o.status === 'received').length;
  const completedCount = allOrders.filter((o) => o.status === 'completed').length;
  const rejectedCount = allOrders.filter((o) => o.status === 'rejected').length;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await pollKitchenOrders();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e5e7eb]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/97 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full border border-[#c5a059]/40 p-0.5">
                <div className="w-full h-full bg-[#141414] rounded-full flex items-center justify-center">
                  <Flame className="w-4 h-4 text-[#c5a059]" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-serif tracking-[0.15em] text-base text-white font-bold">
                    CEYLON <span className="text-[#c5a059]">BITES</span>
                  </span>
                  <span className="hidden sm:inline text-[9px] uppercase font-bold tracking-[0.2em] px-2 py-0.5 border border-[#c5a059]/40 text-[#c5a059]">
                    Admin
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                  <ShieldCheck className="w-3 h-3" />
                  <span>{staffUser.name}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => loginAsRole('kitchen')}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 border border-sky-500/30 bg-sky-500/10 text-sky-400 hover:bg-sky-500/20 text-xs font-semibold rounded-lg transition-all"
                title="Switch to Kitchen Display"
              >
                <ChefHat className="w-3.5 h-3.5" />
                <span>Kitchen</span>
              </button>

              <button
                onClick={() => loginAsRole('reception')}
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold rounded-lg transition-all"
                title="Switch to Cashier / Reception"
              >
                <Store className="w-3.5 h-3.5" />
                <span>Cashier</span>
              </button>

              <button
                onClick={() => setActiveView('home')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/10 hover:border-[#c5a059]/40 text-gray-300 hover:text-white text-xs font-semibold rounded-lg transition-all"
                title="Back to Customer Restaurant"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Storefront</span>
              </button>

              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 text-zinc-400 hover:text-white border border-white/10 rounded-lg transition-all"
                title="Refresh Data"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
              <button
                onClick={logoutStaff}
                className="flex items-center gap-1.5 px-2.5 py-1.5 border border-white/10 text-zinc-400 hover:text-white text-xs uppercase tracking-wider font-semibold rounded-lg transition-all"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* Tab bar */}
        <div className="flex gap-1 border-b border-zinc-800">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'menu', label: 'Menu Items', icon: UtensilsCrossed },
            { id: 'staff', label: 'Staff', icon: Users }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#c5a059] text-[#c5a059]'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                label="Total Orders"
                value={allOrders.length}
                subtext="All time"
                icon={<ShoppingBag className="w-5 h-5" />}
              />
              <MetricCard
                label="Pending"
                value={pendingCount}
                subtext="Awaiting kitchen"
                icon={<AlertCircle className="w-5 h-5" />}
                accentCls="text-amber-400"
              />
              <MetricCard
                label="Completed"
                value={completedCount}
                subtext="Successfully served"
                icon={<CheckCircle2 className="w-5 h-5" />}
                accentCls="text-emerald-400"
              />
              <MetricCard
                label="Revenue"
                value={`Rs. ${totalRevenue.toLocaleString()}`}
                subtext="Completed orders"
                icon={<TrendingUp className="w-5 h-5" />}
              />
            </div>

            {/* Recent orders */}
            <div className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Recent Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-[11px] text-[#c5a059] hover:underline font-semibold"
                >
                  View all →
                </button>
              </div>
              <div className="divide-y divide-zinc-800/50">
                {allOrders.slice(0, 5).map((order) => (
                  <div key={order.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-zinc-800 flex items-center justify-center">
                        <UtensilsCrossed className="w-4 h-4 text-[#c5a059]" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">
                          Order #{order.orderNumber} · Table {order.tableNumber}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''} · {order.createdAt}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-white hidden sm:block">
                        Rs. {order.total.toLocaleString()}
                      </span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
                {allOrders.length === 0 && (
                  <div className="py-8 text-center text-xs text-zinc-500">No orders yet.</div>
                )}
              </div>
            </div>

            {/* Status breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {(['pending', 'accepted', 'preparing', 'ready', 'rejected', 'completed'] as OrderStatus[]).map((s) => {
                const count = allOrders.filter((o) => o.status === s).length;
                return (
                  <div key={s} className="p-3 bg-[#111114] border border-zinc-800 rounded-xl text-center">
                    <div className="text-lg font-black text-white">{count}</div>
                    <StatusBadge status={s} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Orders tab */}
        {activeTab === 'orders' && (
          <div className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden">
            <div className="p-4 border-b border-zinc-800">
              <h3 className="text-sm font-bold text-white">All Orders ({allOrders.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-zinc-800">
                  <tr>
                    {['Order #', 'Table', 'Customer', 'Items', 'Total', 'Status', 'Time', 'Actions'].map((h) => (
                      <th key={h} className="px-3 py-3 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allOrders.map((order) => (
                    <OrderRow key={order.id} order={order} onAdvance={advanceOrderStatus} />
                  ))}
                  {allOrders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-zinc-500">No orders found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Menu tab */}
        {activeTab === 'menu' && (
          <div className="bg-[#111114] border border-zinc-800 rounded-2xl p-6 text-center space-y-4">
            <UtensilsCrossed className="w-12 h-12 text-[#c5a059] mx-auto opacity-50" />
            <div>
              <h3 className="text-sm font-bold text-white">Menu Management</h3>
              <p className="text-xs text-zinc-500 mt-2 max-w-sm mx-auto">
                Menu items are currently managed via the <code className="bg-zinc-800 px-1 rounded">menuData.ts</code> file and database seed.
                A full CRUD menu management UI can be added in a future sprint.
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059] text-xs font-semibold rounded-xl">
              <BarChart3 className="w-3.5 h-3.5" />
              Feature planned for next release
            </div>
          </div>
        )}

        {/* Staff tab */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-zinc-800">
                <h3 className="text-sm font-bold text-white">Staff Accounts</h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Manage via database. New staff accounts require a password hash (bcrypt).
                </p>
              </div>
              <div className="divide-y divide-zinc-800/50">
                {[
                  { code: 'ADMIN001', name: 'Saman Perera', role: 'admin', status: 'Active' },
                  { code: 'KIT001', name: 'Nimal Kumara', role: 'kitchen', status: 'Active' }
                ].map((staff) => (
                  <div key={staff.code} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center">
                        {staff.role === 'admin'
                          ? <ShieldCheck className="w-4 h-4 text-[#c5a059]" />
                          : <ChefHat className="w-4 h-4 text-[#c5a059]" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{staff.name}</div>
                        <div className="text-[11px] text-zinc-500">
                          ID: <code className="font-mono text-zinc-400">{staff.code}</code>
                          &nbsp;·&nbsp;
                          <span className="capitalize">{staff.role}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] text-emerald-400 font-semibold">{staff.status}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#0e0e0e] border border-[#c5a059]/20 rounded-xl">
              <p className="text-[11px] text-zinc-400">
                To add new staff: run <code className="text-[#c5a059] bg-zinc-900 px-1.5 py-0.5 rounded">api/db_extended.sql</code>,
                then INSERT into the <code className="text-[#c5a059] bg-zinc-900 px-1.5 py-0.5 rounded">staff</code> table
                with a bcrypt-hashed password using <code className="text-[#c5a059] bg-zinc-900 px-1.5 py-0.5 rounded">password_hash()</code> in PHP.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
