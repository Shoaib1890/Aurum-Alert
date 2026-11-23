'use client';

import React, { useState } from 'react';
import { Calculator, Coins, ArrowRight, ShieldCheck, Scale } from 'lucide-react';
import { BullionOverview, MetalType } from '@/types/bullion';
import { formatINR } from '@/lib/utils/formatters';

interface BullionCalculatorProps {
  overview: BullionOverview;
}

export function BullionCalculator({ overview }: BullionCalculatorProps) {
  const [selectedMetal, setSelectedMetal] = useState<MetalType>('gold_24k');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState<'grams' | 'tola' | 'troy_oz' | 'kilo'>('grams');

  // Convert entered quantity to grams
  const getGrams = (): number => {
    switch (unit) {
      case 'tola':
        return quantity * 11.6638; // Traditional Indian Tola = 11.66g
      case 'troy_oz':
        return quantity * 31.1035; // 1 Troy Ounce = 31.10g
      case 'kilo':
        return quantity * 1000;
      case 'grams':
      default:
        return quantity;
    }
  };

  const grams = getGrams();

  // Price per gram based on selected metal
  const getPerGramPrice = (): number => {
    if (selectedMetal === 'gold_24k') {
      return (overview.rates.gold_24k.price ?? 107939) / 10;
    }
    if (selectedMetal === 'gold_22k') {
      return (overview.rates.gold_22k.price ?? 98944) / 10;
    }
    return (overview.rates.silver.price ?? 126783) / 1000;
  };

  const perGramPrice = getPerGramPrice();
  const estimatedValue = Math.round(grams * perGramPrice);

  return (
    <div className="glass-panel rounded-2xl p-6 border border-amber-500/20 relative overflow-hidden group">
      {/* Background radial shimmer */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Interactive Bullion Valuation Terminal</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
                Live Formula
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Instantly compute portfolio spot worth using today's live benchmark rates.
            </p>
          </div>
        </div>

        {/* Metal Switcher */}
        <div className="inline-flex rounded-xl bg-vault-900/90 p-1 border border-slate-700/60 text-xs font-mono">
          <button
            onClick={() => setSelectedMetal('gold_24k')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedMetal === 'gold_24k'
                ? 'bg-amber-500 text-vault-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            24K Gold
          </button>
          <button
            onClick={() => setSelectedMetal('gold_22k')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedMetal === 'gold_22k'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            22K Gold
          </button>
          <button
            onClick={() => setSelectedMetal('silver')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              selectedMetal === 'silver'
                ? 'bg-slate-300 text-vault-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Silver 999
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
        {/* Input Parameters */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
              Enter Quantity / Weight
            </label>
            <div className="relative">
              <input
                type="number"
                min="0.1"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-vault-900/90 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-base focus:outline-none focus:border-amber-400 transition-colors"
                placeholder="10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-slate-400 mb-1.5">
              Measurement Unit
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value as any)}
              className="w-full bg-vault-900/90 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-amber-400 transition-colors cursor-pointer"
            >
              <option value="grams">Grams (g)</option>
              <option value="tola">Tola (11.66g - India Standard)</option>
              <option value="troy_oz">Troy Ounces (31.10g)</option>
              <option value="kilo">Kilograms (kg)</option>
            </select>
          </div>
        </div>

        {/* Calculated Result Display Card */}
        <div className="lg:col-span-5 bg-gradient-to-br from-vault-900 via-vault-850 to-vault-950 p-5 rounded-xl border border-amber-500/30 flex flex-col justify-between shadow-xl">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-2">
            <span>Estimated Spot Valuation</span>
            <span className="text-amber-400">≈ {grams.toFixed(2)} grams pure</span>
          </div>

          <div className="my-2">
            <div className="text-3xl font-black gold-gradient-text font-mono tabular-numbers tracking-tight">
              {formatINR(estimatedValue)}
            </div>
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Rate Base: ₹{Math.round(perGramPrice).toLocaleString('en-IN')}/gram (Ex-GST)
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-time Spot Computation</span>
            </span>
            <span className="text-amber-400/80 font-mono">100% Client-Side Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}
