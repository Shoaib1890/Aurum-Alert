import React from 'react';
import { TrendingUp, TrendingDown, Minus, Info, AlertCircle, Clock } from 'lucide-react';
import { Card, CardBody, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
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
  accentColor?: 'gold' | 'silver';
}

export function PriceCard({ rate, icon, accentColor = 'gold' }: PriceCardProps) {
  const hasPrice = rate.price !== null && rate.isAvailable;
  const isPositive = (rate.changeAmount ?? 0) > 0;
  const isNegative = (rate.changeAmount ?? 0) < 0;
  const isNeutral = (rate.changeAmount ?? 0) === 0;

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-slate-200/90 relative overflow-hidden group">
      {/* Decorative accent top line */}
      <div
        className={`h-1.5 w-full ${
          accentColor === 'gold'
            ? 'bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600'
            : 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-500'
        }`}
      />

      <CardBody className="p-6">
        {/* Header row: Metal Name & Purity */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                accentColor === 'gold'
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-950 transition-colors">
                  {rate.metalName}
                </h3>
                {rate.isStale && (
                  <Badge variant="amber" size="sm">
                    Cached / Stale
                  </Badge>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium">{rate.purity}</p>
            </div>
          </div>

          <Badge variant="slate" size="sm" className="font-mono">
            {rate.unit === '10g' ? 'per 10g' : 'per 1kg'}
          </Badge>
        </div>

        {/* Price Display */}
        <div className="my-5">
          {hasPrice ? (
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight tabular-numbers">
                  {formatINR(rate.price)}
                </span>
                <span className="text-xs font-semibold text-slate-400">INR</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                International Wholesale Spot (Ex-Customs / GST)
              </p>
            </div>
          ) : (
            <div className="py-3 px-3.5 rounded-xl bg-slate-50 border border-dashed border-slate-200 text-center">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 mb-1">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Awaiting Live Market Sync
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Add GOLDAPI_API_KEY to .env.local to activate real-time spot prices.
              </p>
            </div>
          )}
        </div>

        {/* Change Comparison & Previous Close Details */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Session Change:</span>
            {hasPrice ? (
              <div className="flex items-center gap-1.5 font-medium">
                {isPositive && (
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-mono">
                    <TrendingUp className="w-3.5 h-3.5" />
                    {formatChangeDelta(rate.changeAmount)} ({formatPercentage(rate.changePercentage)})
                  </span>
                )}
                {isNegative && (
                  <span className="inline-flex items-center gap-1 text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200 font-mono">
                    <TrendingDown className="w-3.5 h-3.5" />
                    {formatChangeDelta(rate.changeAmount)} ({formatPercentage(rate.changePercentage)})
                  </span>
                )}
                {isNeutral && (
                  <span className="inline-flex items-center gap-1 text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-mono">
                    <Minus className="w-3.5 h-3.5" />
                    Unchanged
                  </span>
                )}
              </div>
            ) : (
              <span className="text-slate-400 font-mono text-[11px]">Pending Key</span>
            )}
          </div>

          {/* Previous Close Row */}
          <div className="flex items-center justify-between text-slate-500 text-[11px]">
            <span>Previous Trading Close:</span>
            <span className="font-mono font-medium text-slate-700">
              {rate.previousClose ? formatINR(rate.previousClose) : '—'}
            </span>
          </div>
        </div>
      </CardBody>

      {/* Footer: Source Notice & Timestamp */}
      <CardFooter className="flex items-center justify-between text-[11px] text-slate-500 py-3 px-6 bg-slate-50/60">
        <span className="flex items-center gap-1 truncate max-w-[60%]">
          <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="truncate">GoldAPI (Spot INR)</span>
        </span>
        <span className="font-mono text-slate-400 text-[10px]">
          {rate.tradingDate ? formatISTTimestamp(rate.tradingDate) : 'Today'}
        </span>
      </CardFooter>
    </Card>
  );
}
