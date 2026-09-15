import React, { useState } from 'react';
import { 
  Clock, 
  CheckCircle2, 
  Flame, 
  ChefHat, 
  Bell, 
  Wine, 
  GlassWater, 
  Plus, 
  ArrowLeft,
  UtensilsCrossed,
  RotateCw,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { OrderStatus } from '../types';

export const OrderTracking: React.FC = () => {
  const {
    activeTrackingOrder,
    setActiveView,
    advanceOrderStatus,
    orderHistory
  } = useRestaurant();

  const [serviceMessage, setServiceMessage] = useState<string | null>(null);

  // If no active tracking order, pick the latest from history
  const order = activeTrackingOrder || (orderHistory.length > 0 ? orderHistory[0] : null);

  const handleRequestService = (action: string) => {
    setServiceMessage(`✓ Request sent to floor staff: ${action} for Table #${order?.tableNumber || 12}`);
    setTimeout(() => {
      setServiceMessage(null);
    }, 4000);
  };

  // Step definitions — includes pending and rejected
  const steps: { id: OrderStatus; label: string; desc: string; icon: React.ElementType }[] = [
    {
      id: 'pending_reception',
      label: 'Order Placed',
      desc: 'Waiting for reception confirmation',
      icon: Bell
    },
    {
      id: 'confirmed_reception',
      label: 'Reception Confirmed',
      desc: 'Order verified by reception desk',
      icon: CheckCircle2
    },
    {
      id: 'sent_to_kitchen',
      label: 'Sent to Kitchen',
      desc: 'Order forwarded to kitchen staff',
      icon: Flame
    },
    {
      id: 'accepted_by_kitchen',
      label: 'Kitchen Accepted',
      desc: 'Chef has accepted your order',
      icon: ChefHat
    },
    {
      id: 'preparing',
      label: 'Preparing',
      desc: 'Freshly chopped & wok tossed',
      icon: Flame
    },
    {
      id: 'ready',
      label: 'Ready',
      desc: 'Plated & garnished for service',
      icon: CheckCircle2
    },
    {
      id: 'completed',
      label: 'Completed',
      desc: 'Enjoy your hot meal!',
      icon: UtensilsCrossed
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'pending_reception':
      case 'pending':
      case 'received':
      case 'payment_pending':
        return 0;
      case 'confirmed_reception':
        return 1;
      case 'sent_to_kitchen':
        return 2;
      case 'accepted_by_kitchen':
      case 'accepted':
        return 3;
      case 'preparing':
        return 4;
      case 'ready':
        return 5;
      case 'completed':
        return 6;
      default:
        return 0;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;
  const isRejected = order?.status === 'rejected' || order?.status === 'rejected_reception' || order?.status === 'rejected_kitchen';

  if (!order) {
    return (
      <div className="py-16 px-4 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-amber-500">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">No Active Table Orders</h2>
        <p className="text-xs text-zinc-400">
          You haven't placed an order for this table yet. Check out our sizzling digital menu!
        </p>
        <button
          onClick={() => setActiveView('home')}
          className="px-5 py-2.5 bg-amber-500 text-black font-extrabold text-xs rounded-xl shadow hover:bg-amber-400"
        >
          View Menu
        </button>
      </div>
    );
  }

  return (
    <div className="py-8 sm:py-12 bg-[#0c0c0e]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-left">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setActiveView('home')}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </button>

          {/* Simulate kitchen status (dev/demo only) */}
          {!isRejected && order.status !== 'completed' && (
            <button
              onClick={() => advanceOrderStatus(order.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-amber-400 transition-all shadow"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Simulate Kitchen Step</span>
            </button>
          )}
        </div>

        {/* Live Service Request Toast */}
        {serviceMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>{serviceMessage}</span>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* REJECTED state — special UI                               */}
        {/* -------------------------------------------------------- */}
        {isRejected && (
          <div className="rounded-2xl bg-gradient-to-br from-red-950/60 to-[#0c0a0a] border border-red-800/50 p-6 sm:p-8 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <span className="text-xs text-red-400 font-bold uppercase tracking-wider">
                  {order?.status === 'rejected_reception' ? 'Order Cancelled by Reception' : order?.status === 'rejected_kitchen' ? 'Order Rejected by Kitchen' : 'Order Rejected'} · Table #{order.tableNumber}
                </span>
                <h2 className="text-xl font-black text-white mt-0.5">
                  Order #{order.orderNumber}
                </h2>
              </div>
            </div>

            <div className="p-4 bg-red-950/40 border border-red-800/40 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-red-300">
                <AlertTriangle className="w-4 h-4" />
                We're sorry — your order could not be fulfilled
              </div>
              {(order.rejectionReason || order.cancellationReason) && (
                <p className="text-sm text-zinc-300">
                  <span className="text-zinc-500">Reason: </span>
                  {order.cancellationReason || order.rejectionReason}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setActiveView('home')}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Place a New Order
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------- */}
        {/* Normal order status card                                  */}
        {/* -------------------------------------------------------- */}
        {!isRejected && (
          <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#191510] border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
              <div>
                <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">
                  Live Kitchen Tracker • Table #{order.tableNumber}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-white mt-1">
                  Order #{order.orderNumber}
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-right">
                  <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                    {order.status === 'accepted' || order.status === 'accepted_by_kitchen' ? 'Est. Prep Time' : 'Est. Preparation'}
                  </span>
                  <span className="text-base font-black text-amber-400 flex items-center gap-1.5 justify-end">
                    <Clock className="w-4 h-4 text-amber-400" />
                    {order.status === 'completed'
                      ? 'Delivered'
                      : order.estimatedPrepTime
                      ? `${order.estimatedPrepTime} mins`
                      : `${order.estimatedMinutes} mins remaining`}
                  </span>
                </div>
              </div>
            </div>

            {/* Kitchen acceptance note */}
            {(order.status === 'accepted' || order.status === 'accepted_by_kitchen') && order.kitchenNote && (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl">
                <div className="text-xs font-bold text-emerald-400 mb-1">💬 Message from Kitchen</div>
                <p className="text-xs text-emerald-200">{order.kitchenNote}</p>
              </div>
            )}

            {/* Kitchen acceptance without note */}
            {(order.status === 'accepted' || order.status === 'accepted_by_kitchen') && !order.kitchenNote && (
              <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-xs text-emerald-300 font-semibold">
                ✅ Your order has been accepted! Estimated preparation time: <strong>{order.estimatedPrepTime || order.estimatedMinutes} minutes</strong>
              </div>
            )}

            {/* Interactive Step Timeline */}
            <div className="relative pt-2 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 sm:gap-2 relative">
                {steps.map((step, idx) => {
                  const isPassed = idx < currentStepIndex;
                  const isCurrent = idx === currentStepIndex;
                  const isUpcoming = idx > currentStepIndex;
                  const Icon = step.icon;

                  return (
                    <div
                      key={step.id}
                      className={`relative p-3 rounded-xl border transition-all flex flex-col justify-between space-y-2 ${
                        isCurrent
                          ? 'bg-amber-500/15 border-amber-500 shadow-lg shadow-amber-500/10'
                          : isPassed
                          ? 'bg-zinc-950/80 border-emerald-800/80'
                          : 'bg-zinc-950/40 border-zinc-800 opacity-40'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            isPassed
                              ? 'bg-emerald-500 text-black'
                              : isCurrent
                              ? 'bg-amber-500 text-black animate-pulse'
                              : 'bg-zinc-800 text-zinc-400'
                          }`}
                        >
                          {isPassed ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                        </div>

                        {isCurrent && (
                          <span className="text-[9px] bg-amber-500 text-black font-black uppercase px-1.5 py-0.5 rounded">
                            Now
                          </span>
                        )}
                      </div>

                      <div>
                        <h4
                          className={`text-xs font-bold ${
                            isCurrent
                              ? 'text-amber-400'
                              : isPassed
                              ? 'text-emerald-400'
                              : 'text-zinc-400'
                          }`}
                        >
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Table Actions */}
            <div className="pt-2 border-t border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Need Table Assistance?
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  onClick={() => handleRequestService('Chilled Ice Bucket for BYOB')}
                  className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left transition-all"
                >
                  <Wine className="w-4 h-4 text-amber-500 mb-1" />
                  <div className="text-xs font-bold text-white">Ice Bucket</div>
                  <div className="text-[10px] text-zinc-500">For table BYOB</div>
                </button>

                <button
                  onClick={() => handleRequestService('Chilled Water & Drinking Glasses')}
                  className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left transition-all"
                >
                  <GlassWater className="w-4 h-4 text-cyan-400 mb-1" />
                  <div className="text-xs font-bold text-white">Chilled Glasses</div>
                  <div className="text-[10px] text-zinc-500">Extra drinkware</div>
                </button>

                <button
                  onClick={() => handleRequestService('Floor Waiter Assistance')}
                  className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left transition-all"
                >
                  <Bell className="w-4 h-4 text-amber-400 mb-1" />
                  <div className="text-xs font-bold text-white">Call Waiter</div>
                  <div className="text-[10px] text-zinc-500">Assistance at table</div>
                </button>

                <button
                  onClick={() => setActiveView('home')}
                  className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left transition-all"
                >
                  <Plus className="w-4 h-4 text-emerald-400 mb-1" />
                  <div className="text-xs font-bold text-white">Add More Food</div>
                  <div className="text-[10px] text-zinc-500">Order extra bites</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ordered Dishes Recap */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white">
            Dishes in Order #{order.orderNumber}
          </h3>

          <div className="space-y-2 divide-y divide-zinc-800/60">
            {order.items.map((item) => (
              <div
                key={item.cartItemId}
                className="pt-2 first:pt-0 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center font-bold text-amber-400 text-xs">
                    {item.quantity}x
                  </span>
                  <div>
                    <div className="font-bold text-white text-sm">{item.food.name}</div>
                    <div className="text-zinc-400 text-[11px] flex gap-2">
                      <span className="capitalize text-red-400">Spice: {item.spiceLevel}</span>
                      {item.selectedAddons && item.selectedAddons.length > 0 && (
                        <span>+ {item.selectedAddons.map((a) => a.name).join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="font-black text-amber-400 text-sm">
                  Rs. {item.itemTotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm font-black text-white">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  order.paymentMethod === 'online'
                    ? 'bg-emerald-950 border border-emerald-700/80 text-emerald-400'
                    : order.paymentMethod === 'card'
                    ? 'bg-blue-950 border border-blue-700/80 text-blue-400'
                    : 'bg-amber-950 border border-amber-700/80 text-amber-400'
                }`}>
                  {order.paymentMethod === 'online' && '✅ Paid Online'}
                  {order.paymentMethod === 'card' && '💳 Pay at Table (Card POS)'}
                  {order.paymentMethod === 'cash' && '💵 Pay at Table (Cash)'}
                </span>

                {order.transactionId && (
                  <span className="text-[11px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded">
                    {order.transactionId}
                  </span>
                )}
              </div>

              <span className="text-amber-400 font-heading text-lg">
                Total: Rs. {order.total.toLocaleString()}
              </span>
            </div>

            {order.paymentMethod !== 'online' && (
              <div className="text-[11px] text-zinc-400 bg-zinc-950/80 border border-zinc-800/80 p-2.5 rounded-xl flex items-center gap-2">
                <span className="text-amber-400 font-bold">🔔 Server Notified:</span>
                <span>
                  {order.paymentMethod === 'card' 
                    ? 'Floor staff is bringing a mobile POS card reader to Table #' + order.tableNumber + '.'
                    : 'Cashier and floor waiter will settle cash bill at Table #' + order.tableNumber + '.'
                  }
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
