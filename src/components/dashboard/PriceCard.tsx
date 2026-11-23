import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info, Sparkles, ShieldCheck } from 'lucide-react';
import { BullionRate } from '@/types/bullion';
import {
  formatINR,
  formatChangeDelta,
  formatPercentage,
  formatISTTimestamp,
} from '@/lib/utils/formatters';

interface PriceCardProps {
  rate: BullionRate;
  icon?: React.ReactNode;
  accentColor?: 'gold' | 'silver' | 'crown';
}

export function PriceCard({ rate, icon, accentColor = 'gold' }: PriceCardProps) {
  const hasPrice = rate.price !== null && rate.isAvailable;
  const isPositive = (rate.changeAmount ?? 0) > 0;
  const isNegative = (rate.changeAmount ?? 0) < 0;
  const isNeutral = (rate.changeAmount ?? 0) === 0;

  const getBorderColor = () => {
    if (accentColor === 'silver') return 'from-slate-400 via-slate-200 to-slate-500';
    if (accentColor === 'crown') return 'from-amber-600 via-amber-400 to-yellow-600';
    return 'from-amber-400 via-yellow-300 to-amber-600';
  };

  const getBadgeStyle = () => {
    if (accentColor === 'silver') return 'bg-slate-700/50 text-slate-200 border-slate-500/40';
    if (accentColor === 'crown') return 'bg-amber-600/20 text-amber-300 border-amber-600/40';
    return 'bg-amber-500/20 text-amber-200 border-amber-500/40';
  };

  return (
    <div className="glass-panel rounded-2xl relative overflow-hidden group hover:border-amber-400/50 transition-all duration-300 hover:shadow-[0_0_35px_rgba(229,184,66,0.12)]">
      {/* Top Metallic Foil Line */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${getBorderColor()}`} />

      <div className="p-6">
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${
                accentColor === 'silver'
                  ? 'bg-slate-800/80 text-slate-200 border-slate-700'
                  : 'bg-vault-900 text-amber-400 border-amber-500/30'
              }`}
            >
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white group-hover:text-amber-200 transition-colors tracking-tight">
                  {rate.metalName}
                </h3>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">{rate.purity}</p>
            </div>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-lg border font-mono font-semibold ${getBadgeStyle()}`}
          >
            {rate.unit === '10g' ? '10 GRAMS' : '1 KILOGRAM'}
          </span>
        </div>

        {/* Live Price Display */}
        <div className="my-5">
          {hasPrice ? (
            <div>
              <div className="flex items-baseline gap-2.5">
                <span
                  className={`text-3.5xl sm:text-4xl font-black font-mono tracking-tight tabular-numbers ${
                    accentColor === 'silver' ? 'silver-gradient-text' : 'gold-gradient-text'
                  }`}
                >
                  {formatINR(rate.price)}
                </span>
                <span className="text-xs font-mono font-bold text-slate-400">INR</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Wholesale Spot Rate (Ex-Duty / GST)</span>
              </p>
            </div>
          ) : (
            <div className="py-4 px-3.5 rounded-xl bg-vault-900 border border-dashed border-slate-700 text-center">
              <span className="text-xs font-mono text-amber-300">Awaiting Price Feed</span>
            </div>
          )}
        </div>

        {/* Price Delta & Previous Close Section */}
        <div className="pt-4 border-t border-slate-800 space-y-2.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 font-medium">Session Movement:</span>
            {hasPrice ? (
              <div className="flex items-center gap-1.5 font-medium">
                {isPositive && (
                  <span className="inline-flex items-center gap-1 text-cyber-emerald bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/30 font-mono font-bold">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {formatChangeDelta(rate.changeAmount)} ({formatPercentage(rate.changePercentage)})
                  </span>
                )}
                {isNegative && (
                  <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/30 font-mono font-bold">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {formatChangeDelta(rate.changeAmount)} ({formatPercentage(rate.changePercentage)})
                  </span>
                )}
                {isNeutral && (
                  <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 font-mono">
                    <Minus className="w-3.5 h-3.5" />
                    Unchanged
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-500 font-mono text-[11px]">Syncing</span>
            )}
          </div>

          <div className="flex items-center justify-between text-slate-400 text-[11px]">
            <span>Prior Trading Close:</span>
            <span className="font-mono font-semibold text-slate-200">
              {rate.previousClose ? formatINR(rate.previousClose) : '—'}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Strip */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 py-2.5 px-6 bg-vault-950/70 border-t border-slate-800/80 font-mono">
        <span className="flex items-center gap-1 truncate max-w-[60%]">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span className="truncate">GoldAPI Spot Feed</span>
        </span>
        <span className="text-slate-500 text-[10px]">
          {rate.tradingDate ? formatISTTimestamp(rate.tradingDate) : 'Today'}
        </span>
      </div>
    </div>
  );
}
