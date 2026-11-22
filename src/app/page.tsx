'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { StatusBanner } from '@/components/dashboard/StatusBanner';
import { BenchmarkExplainer } from '@/components/dashboard/BenchmarkExplainer';
import { PriceOverview } from '@/components/dashboard/PriceOverview';
import { HistoricalChart } from '@/components/dashboard/HistoricalChart';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { INITIAL_EMPTY_RATES, DEFAULT_NOTIFICATION_CONFIG } from '@/lib/constants';
import { BullionOverview } from '@/types/bullion';

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
    <div className="space-y-8">
      {/* 1. System Health & Ingestion Pipeline Status Banner */}
      <section>
        <StatusBanner
          overview={overview}
          onRefresh={handleManualRefresh}
          isRefreshing={isRefreshing}
          cooldownRemaining={cooldownRemaining}
        />
      </section>

      {/* 2. Educational & Regulatory Notice: International Spot vs. Domestic Retail */}
      <section>
        <BenchmarkExplainer />
      </section>

      {/* 3. Bullion Rates Cards (24K Gold 10g, 22K Gold 10g, Silver 1kg) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Live Bullion Spot Rates
            </h2>
            <p className="text-xs text-slate-500">
              International spot prices converted to INR via live Forex rates (ex-customs duty, ex-GST).
            </p>
          </div>
        </div>

        <PriceOverview rates={overview.rates} />
      </section>

      {/* 4. Historical Snapshots & Session Analysis */}
      <section>
        <HistoricalChart />
      </section>

      {/* 5. WhatsApp Notification Settings & Schedule */}
      <section>
        <NotificationSettings config={DEFAULT_NOTIFICATION_CONFIG} />
      </section>
    </div>
  );
}
