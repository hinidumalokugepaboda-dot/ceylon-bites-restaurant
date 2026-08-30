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
  Sparkles,
  UtensilsCrossed,
  RotateCw
} from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';
import { OrderStatus } from '../types';

export const OrderTracking: React.FC = () => {
  const {
    activeOrder,
    setActiveView,
    simulateNextOrderStatus,
    orderHistory
  } = useRestaurant();

  const [serviceMessage, setServiceMessage] = useState<string | null>(null);

  // If no active order, pick the latest order from history
  const order = activeOrder || (orderHistory.length > 0 ? orderHistory[0] : null);

  const handleRequestService = (action: string) => {
    setServiceMessage(`✓ Request sent to floor staff: ${action} for Table #${order?.tableNumber || 12}`);
    setTimeout(() => {
      setServiceMessage(null);
    }, 4000);
  };

  const steps: { id: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      id: 'received',
      label: 'Order Received',
      desc: 'Sent to kitchen terminal',
      icon: Bell
    },
    {
      id: 'accepted',
      label: 'Accepted by Kitchen',
      desc: 'Chef reviewing spice levels & notes',
      icon: CheckCircle2
    },
    {
      id: 'preparing',
      label: 'Sizzling on Wok',
      desc: 'Freshly chopped & wok tossed',
      icon: Flame
    },
    {
      id: 'ready',
      label: 'Ready for Service',
      desc: 'Plated & garnished for runner',
      icon: ChefHat
    },
    {
      id: 'completed',
      label: 'Served to Table',
      desc: 'Enjoy your hot meal!',
      icon: UtensilsCrossed
    }
  ];

  const getStepIndex = (status: OrderStatus) => {
    switch (status) {
      case 'received': return 0;
      case 'accepted': return 1;
      case 'preparing': return 2;
      case 'ready': return 3;
      case 'completed': return 4;
      default: return 0;
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : 0;

  if (!order) {
    return (
      <div className="py-16 px-4 max-w-xl mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-amber-500">
          <Clock className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white font-heading">No Active Table Orders</h2>
        <p className="text-xs text-zinc-400">
          You haven't placed an order for this table yet. Check out our sizzling digital menu!
        </p>
        <button
          onClick={() => setActiveView('menu')}
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
            onClick={() => setActiveView('menu')}
            className="inline-flex items-center gap-2 text-xs font-bold text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Menu
          </button>

          {/* Interactive kitchen simulator button */}
          <button
            onClick={simulateNextOrderStatus}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-amber-400 transition-all shadow"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Simulate Kitchen Next Step</span>
          </button>
        </div>

        {/* Live Service Request Toast */}
        {serviceMessage && (
          <div className="p-3.5 rounded-xl bg-emerald-950/90 border border-emerald-800 text-emerald-300 text-xs font-bold flex items-center justify-between animate-in fade-in">
            <span>{serviceMessage}</span>
          </div>
        )}

        {/* Hero Order Status Card */}
        <div className="rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-[#191510] border border-amber-500/30 p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
            <div>
              <span className="text-xs text-amber-500 font-bold uppercase tracking-wider">
                Live Kitchen Tracker • Table #{order.tableNumber}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-1">
                Order #{order.orderNumber}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-zinc-950/80 border border-zinc-800 text-right">
                <span className="text-[10px] text-zinc-400 uppercase font-semibold block">
                  Est. Preparation
                </span>
                <span className="text-base font-black text-amber-400 font-heading flex items-center gap-1.5 justify-end">
                  <Clock className="w-4 h-4 text-amber-400" />
                  {order.status === 'completed' ? 'Delivered' : `${order.estimatedPrepTimeMinutes} mins remaining`}
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Step Timeline */}
          <div className="relative pt-2 pb-4">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 sm:gap-2 relative">
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
                        : 'bg-zinc-950/40 border-zinc-850 opacity-40'
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
                onClick={() => setActiveView('menu')}
                className="p-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-amber-500/40 text-left transition-all"
              >
                <Plus className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-white">Add More Food</div>
                <div className="text-[10px] text-zinc-500">Order extra bites</div>
              </button>
            </div>
          </div>
        </div>

        {/* Ordered Dishes Recap */}
        <div className="rounded-2xl bg-zinc-900/90 border border-zinc-800 p-6 space-y-4">
          <h3 className="text-base font-bold text-white font-heading">
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
                      {item.selectedAddons.length > 0 && (
                        <span>+ {item.selectedAddons.map((a) => a.name).join(', ')}</span>
                      )}
                    </div>
                  </div>
                </div>

                <span className="font-black text-amber-400 font-heading text-sm">
                  Rs. {item.itemTotal.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex justify-between text-sm font-black text-white">
            <span>Paid via {order.paymentMethod.toUpperCase()}</span>
            <span className="text-amber-400 font-heading text-base">
              Total: Rs. {order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
