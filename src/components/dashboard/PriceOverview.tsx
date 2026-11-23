import React from 'react';
import { Coins, CircleDot, Shield } from 'lucide-react';
import { PriceCard } from './PriceCard';
import { BullionRate, MetalType } from '@/types/bullion';

interface PriceOverviewProps {
  rates: Record<MetalType, BullionRate>;
}

export function PriceOverview({ rates }: PriceOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* 24K Gold Card */}
      <PriceCard
        rate={rates.gold_24k}
        accentColor="gold"
        icon={<Coins className="w-6 h-6 text-amber-400" />}
      />

      {/* 22K Gold Card */}
      <PriceCard
        rate={rates.gold_22k}
        accentColor="crown"
        icon={<CircleDot className="w-6 h-6 text-amber-500" />}
      />

      {/* Silver 999 Card */}
      <PriceCard
        rate={rates.silver}
        accentColor="silver"
        icon={<Shield className="w-6 h-6 text-slate-300" />}
      />
    </div>
  );
}
