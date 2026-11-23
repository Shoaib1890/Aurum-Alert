import React from 'react';
import { BullionOverview } from '@/types/bullion';
import { formatINR } from '@/lib/utils/formatters';

interface MarketTickerTapeProps {
  overview: BullionOverview;
}

export function MarketTickerTape({ overview }: MarketTickerTapeProps) {
  const g24k = overview.rates.gold_24k;
  const g22k = overview.rates.gold_22k;
  const silver = overview.rates.silver;

  const ratio =
    g24k.price && silver.price ? ((g24k.price / 10) / (silver.price / 1000)).toFixed(2) : '85.14';

  const items = [
    { label: '24K GOLD (10g)', price: g24k.price ? formatINR(g24k.price) : '₹1,07,939', change: '-0.77%', isUp: false },
    { label: '22K GOLD (10g)', price: g22k.price ? formatINR(g22k.price) : '₹98,944', change: '-0.77%', isUp: false },
    { label: 'FINE SILVER (1kg)', price: silver.price ? formatINR(silver.price) : '₹1,26,783', change: '-1.41%', isUp: false },
    { label: 'GOLD / SILVER RATIO', price: ratio, change: 'NEUTRAL', isUp: true },
    { label: 'TELEGRAM DISPATCH', price: '07:00 AM IST', change: 'ACTIVE', isUp: true },
    { label: 'MARKET BENCHMARK', price: 'LIVE FOREX/INR', change: 'EX-GST', isUp: true },
  ];

  return (
    <div className="w-full bg-vault-950/90 border-b border-amber-500/15 overflow-hidden py-2 backdrop-blur-md select-none text-xs">
      <div className="flex w-[200%] animate-ticker">
        {[...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2.5 px-6 shrink-0 font-mono">
            <span className="text-slate-400 font-semibold tracking-wider text-[11px]">{item.label}:</span>
            <span className="text-amber-200 font-bold tabular-numbers">{item.price}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                item.isUp
                  ? 'bg-emerald-500/10 text-cyber-emerald border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {item.change}
            </span>
            <span className="text-slate-700 ml-4">•</span>
          </div>
        ))}
      </div>
    </div>
  );
}
