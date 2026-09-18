import React, { useState } from 'react';
import { X, QrCode, UtensilsCrossed, ShoppingBag, Check } from 'lucide-react';
import { useRestaurant } from '../context/RestaurantContext';

export const TableModal: React.FC = () => {
  const {
    isTableModalOpen,
    setIsTableModalOpen,
    tableNumber,
    setTableNumber,
    orderType,
    setOrderType
  } = useRestaurant();

  const [tempTable, setTempTable] = useState<string>(tableNumber);

  if (!isTableModalOpen) return null;

  const handleSave = () => {
    setTableNumber(tempTable);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('table', tempTable);
      window.history.replaceState(null, '', url.toString());
    }
    setIsTableModalOpen(false);
  };

  const tableList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="table-modal-container"
        className="relative w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-left space-y-6"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-[#c5a059]" />
            <h3 className="text-base font-bold text-white font-heading">
              Select Dining Table & Order Type
            </h3>
          </div>
          <button
            onClick={() => setIsTableModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 hover:border-zinc-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dine-in vs Takeaway toggle */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
            Order Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setOrderType('dine-in')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                orderType === 'dine-in'
                  ? 'bg-[#c5a059] text-black border-[#c5a059] shadow'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4" />
              <span>Dine-In (Table Service)</span>
            </button>

            <button
              type="button"
              onClick={() => setOrderType('takeaway')}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
                orderType === 'takeaway'
                  ? 'bg-[#c5a059] text-black border-[#c5a059] shadow'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Takeaway / Pick-Up</span>
            </button>
          </div>
        </div>

        {/* Table Selector Grid (Strictly 10 Dining Tables) */}
        {orderType === 'dine-in' && (
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Select Your Table (1 - 10)</span>
              <span className="text-[#c5a059]">Active: Table #{tempTable}</span>
            </label>

            <div className="grid grid-cols-5 gap-2">
              {tableList.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTempTable(t)}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                    tempTable === t
                      ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-lg scale-105 font-black'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:text-white'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-zinc-500 pt-1">
              Tables are bound dynamically via QR code or manual selection above.
            </p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#c5a059] hover:bg-[#d6b26b] text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Confirm Table #{tempTable}</span>
        </button>
      </div>
    </div>
  );
};
