import React, { useState, useMemo } from 'react';
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
  ArrowLeft,
  Plus,
  KeyRound,
  Edit2,
  Trash2,
  X,
  Lock
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { Order, OrderStatus, StaffAccount, StaffRole } from '../types';

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
  const { 
    staffUser, 
    logoutStaff, 
    kitchenOrders, 
    orderHistory, 
    advanceOrderStatus, 
    pollKitchenOrders, 
    setActiveView, 
    loginAsRole,
    staffAccounts,
    addStaffAccount,
    updateStaffAccount,
    resetStaffPassword,
    deleteStaffAccount
  } = useRestaurant();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'staff'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals for Staff Management
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<StaffAccount | null>(null);

  // Add form fields
  const [newStaffCode, setNewStaffCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'kitchen' | 'cashier'>('kitchen');
  const [newPassword, setNewPassword] = useState('');
  const [addError, setAddError] = useState('');

  // Edit form fields
  const [editName, setEditName] = useState('');
  const [editRole, setEditRole] = useState<'kitchen' | 'cashier' | 'admin'>('kitchen');
  const [editStatus, setEditStatus] = useState<'active' | 'inactive'>('active');

  // Reset form fields
  const [resetPasswordInput, setResetPasswordInput] = useState('');
  const [resetSuccess, setResetSuccess] = useState('');

  const handleOpenAddModal = () => {
    setNewStaffCode('');
    setNewName('');
    setNewRole('kitchen');
    setNewPassword('');
    setAddError('');
    setShowAddModal(true);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!newStaffCode.trim()) {
      setAddError('Please enter a Staff ID.');
      return;
    }
    if (!newName.trim()) {
      setAddError('Please enter the staff member name.');
      return;
    }
    if (!newPassword || newPassword.length < 4) {
      setAddError('Password must be at least 4 characters.');
      return;
    }

    const res = addStaffAccount({
      staffCode: newStaffCode.trim().toUpperCase(),
      name: newName.trim(),
      role: newRole,
      status: 'active',
      passwordHash: newPassword
    });

    if (res.success) {
      setShowAddModal(false);
    } else {
      setAddError(res.message || 'Failed to create account.');
    }
  };

  const handleOpenEditModal = (account: StaffAccount) => {
    setSelectedAccount(account);
    setEditName(account.name);
    setEditRole(account.role);
    setEditStatus(account.status);
    setShowEditModal(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAccount) {
      updateStaffAccount(selectedAccount.id, {
        name: editName.trim(),
        role: editRole,
        status: editStatus
      });
      setShowEditModal(false);
    }
  };

  const handleOpenResetModal = (account: StaffAccount) => {
    setSelectedAccount(account);
    setResetPasswordInput('');
    setResetSuccess('');
    setShowResetModal(true);
  };

  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordInput || resetPasswordInput.length < 4) {
      alert('Password must be at least 4 characters.');
      return;
    }
    if (selectedAccount) {
      resetStaffPassword(selectedAccount.id, resetPasswordInput);
      setResetSuccess('Password reset successfully!');
      setTimeout(() => {
        setShowResetModal(false);
      }, 700);
    }
  };

  const handleDeleteAccount = (account: StaffAccount) => {
    if (confirm(`Are you sure you want to revoke/delete access for ${account.name} (${account.staffCode})?`)) {
      deleteStaffAccount(account.id);
    }
  };

  const allOrders = useMemo(() => {
    const map = new Map<string, Order>();
    (kitchenOrders || []).forEach((o) => map.set(o.id, o));
    (orderHistory || []).forEach((o) => { if (!map.has(o.id)) map.set(o.id, o); });
    return Array.from(map.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
  }, [kitchenOrders, orderHistory]);

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

        {/* Staff tab (RBAC Management) */}
        {activeTab === 'staff' && (
          <div className="space-y-4">
            <div className="bg-[#111114] border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-4 sm:p-5 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#c5a059]" />
                    <span>Staff Account Management (RBAC)</span>
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Manage role-based access for Kitchen and Cashier staff. Credentials persist across browser sessions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="px-4 py-2.5 bg-[#c5a059] hover:bg-[#d6b26b] text-black font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Add New Staff</span>
                </button>
              </div>

              {/* Staff Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="border-b border-zinc-800 bg-[#0d0d0f]">
                    <tr>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Staff Member</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Staff ID</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Assigned Role</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Status</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold">Access Scope</th>
                      <th className="px-4 py-3 text-[10px] uppercase tracking-wider text-zinc-400 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {staffAccounts.map((account) => {
                      const isSelf = account.staffCode === staffUser.staffCode;
                      const isKitchen = account.role === 'kitchen';
                      const isCashier = account.role === 'cashier';
                      const isAdmin = account.role === 'admin';

                      return (
                        <tr key={account.id} className="hover:bg-zinc-900/40 transition-colors">
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                                isAdmin
                                  ? 'bg-[#c5a059]/20 text-[#c5a059] border border-[#c5a059]/40'
                                  : isKitchen
                                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                                  : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                              }`}>
                                {isAdmin ? <ShieldCheck className="w-4 h-4" /> : isKitchen ? <ChefHat className="w-4 h-4" /> : <Store className="w-4 h-4" />}
                              </div>
                              <div>
                                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                  <span>{account.name}</span>
                                  {isSelf && (
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-normal">You</span>
                                  )}
                                </div>
                                <div className="text-[10px] text-zinc-500">Created: {account.createdAt}</div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5">
                            <code className="font-mono text-xs font-bold text-[#c5a059] bg-[#1a1815] px-2 py-0.5 rounded border border-[#c5a059]/20">
                              {account.staffCode}
                            </code>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1 text-xs font-bold capitalize px-2.5 py-0.5 rounded-full border ${
                              isAdmin
                                ? 'bg-[#c5a059]/15 text-[#c5a059] border-[#c5a059]/30'
                                : isKitchen
                                ? 'bg-sky-500/15 text-sky-400 border-sky-500/30'
                                : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                            }`}>
                              {account.role}
                            </span>
                          </td>

                          <td className="px-4 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold ${
                              account.status === 'active' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                account.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'
                              }`} />
                              <span className="capitalize">{account.status}</span>
                            </span>
                          </td>

                          <td className="px-4 py-3.5 text-xs text-zinc-400">
                            {isAdmin ? 'Full System (/admin)' : isKitchen ? 'Kitchen Display (/kitchen)' : 'Cashier Portal (/cashier)'}
                          </td>

                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => handleOpenResetModal(account)}
                                className="p-1.5 text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 rounded-lg transition-colors cursor-pointer"
                                title="Reset Password"
                              >
                                <KeyRound className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => handleOpenEditModal(account)}
                                className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                                title="Edit Details"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {!isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAccount(account)}
                                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors cursor-pointer"
                                  title="Revoke Access / Delete"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* RBAC Info Card */}
            <div className="p-4 bg-[#111114] border border-zinc-800 rounded-xl flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#c5a059] shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-400 space-y-1">
                <span className="font-bold text-white block">Role Isolation & Access Boundary:</span>
                <p>
                  Staff members assigned to <strong>Kitchen</strong> can strictly access the Kitchen Display System (<code className="text-[#c5a059]">/kitchen</code>).
                  Staff assigned to <strong>Cashier</strong> can strictly access billing & order settlement (<code className="text-emerald-400">/cashier</code>).
                  Neither can access <code className="text-white">/admin</code>.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODAL: ADD STAFF ================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#c5a059]/20 text-[#c5a059] flex items-center justify-center">
                  <Plus className="w-4 h-4 stroke-[3]" />
                </div>
                <h3 className="text-base font-bold text-white">Create Staff Account</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {addError && (
              <div className="p-3 bg-red-950/60 border border-red-800/60 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{addError}</span>
              </div>
            )}

            <form onSubmit={handleCreateStaff} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Staff ID / Code
                </label>
                <input
                  type="text"
                  required
                  value={newStaffCode}
                  onChange={(e) => setNewStaffCode(e.target.value.toUpperCase())}
                  placeholder="e.g. KIT-102 or CSH-101"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Kasun Bandara"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Assigned Role
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value as 'kitchen' | 'cashier')}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="kitchen">Kitchen (Live Cooking KDS)</option>
                  <option value="cashier">Cashier (Orders, Settlements & Billing)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 4 characters"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d6b26b] text-black font-extrabold text-xs uppercase tracking-wider shadow"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: EDIT STAFF ================= */}
      {showEditModal && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Edit Staff Account</h3>
                <span className="text-xs text-[#c5a059] font-mono">{selectedAccount.staffCode}</span>
              </div>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Assigned Role
                </label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value as 'kitchen' | 'cashier' | 'admin')}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="kitchen">Kitchen</option>
                  <option value="cashier">Cashier</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  Account Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as 'active' | 'inactive')}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive / Suspended</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d6b26b] text-black font-extrabold text-xs uppercase tracking-wider shadow"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: RESET PASSWORD ================= */}
      {showResetModal && selectedAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl p-6 text-left space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Reset Staff Password</h3>
                <span className="text-xs text-zinc-400">{selectedAccount.name} ({selectedAccount.staffCode})</span>
              </div>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-white bg-zinc-900"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccess && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSaveResetPassword} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 block mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    required
                    value={resetPasswordInput}
                    onChange={(e) => setResetPasswordInput(e.target.value)}
                    placeholder="Enter new password (min 4 chars)"
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#c5a059] hover:bg-[#d6b26b] text-black font-extrabold text-xs uppercase tracking-wider shadow"
                >
                  Set New Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
