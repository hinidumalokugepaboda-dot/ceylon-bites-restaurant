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
    setIsTableModalOpen(false);
  };

  const tableList = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '12', '14', '15', '18', '20'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        id="table-modal-container"
        className="relative w-full max-w-md bg-[#121215] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 text-left space-y-6"
      >
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-white font-heading">
              Select Dining Table & Order Type
            </h3>
          </div>
          <button
            onClick={() => setIsTableModalOpen(false)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900"
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
                  ? 'bg-amber-500 text-black border-amber-400 shadow'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300'
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
                  ? 'bg-amber-500 text-black border-amber-400 shadow'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-300'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Takeaway / Pick-Up</span>
            </button>
          </div>
        </div>

        {/* Table Selector Grid */}
        {orderType === 'dine-in' && (
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-between">
              <span>Select Your Table Number</span>
              <span className="text-amber-400">Current: Table #{tempTable}</span>
            </label>

            <div className="grid grid-cols-5 gap-2">
              {tableList.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTempTable(t)}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    tempTable === t
                      ? 'bg-amber-500 text-black border-amber-400 shadow'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="text-[11px] text-zinc-400 block mb-1">
                Or type custom table number:
              </label>
              <input
                type="text"
                value={tempTable}
                onChange={(e) => setTempTable(e.target.value)}
                placeholder="e.g. 12"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow flex items-center justify-center gap-1.5"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Confirm Table #{tempTable}</span>
        </button>
      </div>
    </div>
  );
};
