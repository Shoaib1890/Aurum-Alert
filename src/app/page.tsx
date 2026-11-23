'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StatusBanner } from '@/components/dashboard/StatusBanner';
import { BenchmarkExplainer } from '@/components/dashboard/BenchmarkExplainer';
import { PriceOverview } from '@/components/dashboard/PriceOverview';
import { HistoricalChart } from '@/components/dashboard/HistoricalChart';
import { BullionVaultCanvas } from '@/components/3d/BullionVaultCanvas';
import { BullionCalculator } from '@/components/dashboard/BullionCalculator';
import { MarketTickerTape } from '@/components/dashboard/MarketTickerTape';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { INITIAL_EMPTY_RATES, DEFAULT_NOTIFICATION_CONFIG } from '@/lib/constants';
import { BullionOverview, MetalType } from '@/types/bullion';
import { Sparkles, Shield, Eye, Flame } from 'lucide-react';

export default function DashboardPage() {
  const [overview, setOverview] = useState<BullionOverview>({
    rates: INITIAL_EMPTY_RATES,
    hasData: false,
    lastSuccessfulSync: null,
    nextScheduledSync: '07:00 AM IST',
    marketStatus: 'awaiting_sync',
    providerName: 'GoldAPI.io',
    sourceNotice:
      'International Spot Prices Converted to INR (FOREX) — Not Official IBJA Domestic Physical Rates',
  });

  const [active3dMetal, setActive3dMetal] = useState<MetalType>('gold_24k');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0);

  // Fetch prices from server API route
  const fetchPrices = useCallback(async (isManualRefresh: boolean = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    }

    try {
      const url = isManualRefresh ? '/api/prices?refresh=true' : '/api/prices';
      const res = await fetch(url);
      const json = await res.json();

      if (json.overview) {
        setOverview(json.overview);
      }

      if (isManualRefresh) {
        setCooldownRemaining(60);
      }
    } catch (err) {
      console.error('Failed to fetch bullion rates:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchPrices(false);
  }, [fetchPrices]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldownRemaining <= 0) return;

    const timer = setInterval(() => {
      setCooldownRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldownRemaining]);

  const handleManualRefresh = async () => {
    if (cooldownRemaining > 0 || isRefreshing) return;
    await fetchPrices(true);
  };

  return (
    <div className="space-y-10">
      {/* 1. Live Continuous Financial Ticker Tape across the very top */}
      <div className="-mx-4 sm:-mx-6 lg:-mx-8 -mt-8">
        <MarketTickerTape overview={overview} />
      </div>

      {/* 2. System Status & Engine Pipeline */}
      <section>
        <StatusBanner
          overview={overview}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          cooldownRemaining={cooldownRemaining}
        />
      </section>

      {/* 3. Hero Showcase: 3D Bullion Vault Model & Real-Time Spot Benchmark Focus */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Hero Pitch */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Interactive 3D WebGL Mint Inspection</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight font-mono">
            PRECISION <span className="gold-gradient-text">BULLION</span> BENCHMARK VAULT
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-sans">
            Real-time India wholesale gold (24K, 22K per 10g) and silver (per 1kg) spot rates. Engineered with 3D specimen inspection, mathematical portfolio valuation, and independent daily 7:00 AM IST Telegram alerts.
          </p>

          <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
            <div className="p-3.5 rounded-xl bg-vault-900 border border-amber-500/20">
              <div className="text-xs text-slate-400">24K Fine Gold</div>
              <div className="text-lg font-bold text-amber-200 mt-1">999.9 Purity</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Per 10 Grams</div>
            </div>
            <div className="p-3.5 rounded-xl bg-vault-900 border border-amber-600/20">
              <div className="text-xs text-slate-400">22K Crown Gold</div>
              <div className="text-lg font-bold text-amber-300 mt-1">916 Hallmark</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Per 10 Grams</div>
            </div>
            <div className="p-3.5 rounded-xl bg-vault-900 border border-slate-700/60">
              <div className="text-xs text-slate-400">Silver Ingot</div>
              <div className="text-lg font-bold text-slate-200 mt-1">999.0 Pure</div>
              <div className="text-[10px] text-slate-500 mt-0.5">Per 1 Kilogram</div>
            </div>
          </div>
        </div>

        {/* Right: The Interactive 3D WebGL Bullion Ingot */}
        <div className="lg:col-span-5">
          <BullionVaultCanvas
            activeMetal={active3dMetal}
            onMetalChange={(m) => setActive3dMetal(m)}
          />
        </div>
      </section>

      {/* 4. Live Spot Rates Cards Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-white font-mono tracking-tight flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span>LIVE BENCHMARK QUOTES</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Standardized wholesale spot prices converted to INR via live Forex rates.
            </p>
          </div>
        </div>

        <PriceOverview rates={overview.rates} />
      </section>

      {/* 5. Interactive Bullion Valuation Terminal (Calculator) */}
      <section>
        <BullionCalculator overview={overview} />
      </section>

      {/* 6. Regulatory & Source Notice Banner */}
      <section>
        <BenchmarkExplainer />
      </section>

      {/* 7. Historical Trajectory Terminal (Bloomberg View Chart) */}
      <section>
        <HistoricalChart />
      </section>

      {/* 8. Telegram Dispatch Command Center */}
      <section>
        <NotificationSettings config={DEFAULT_NOTIFICATION_CONFIG} />
      </section>
    </div>
  );
}
