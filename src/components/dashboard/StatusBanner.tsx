'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Clock, RefreshCw, AlertTriangle, ShieldCheck, Database, Key } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BullionOverview } from '@/types/bullion';
import { formatISTTimestamp } from '@/lib/utils/formatters';

interface StatusBannerProps {
  overview: BullionOverview;
  onRefresh: () => Promise<void>;
  isRefreshing: boolean;
  cooldownRemaining: number;
}

export function StatusBanner({
  overview,
  onRefresh,
  isRefreshing,
  cooldownRemaining,
}: StatusBannerProps) {
  const isApiConfigured = overview.hasData || (overview.error && !overview.error.includes('Missing GOLDAPI_API_KEY'));
  const hasKeyMissing = overview.error?.includes('GOLDAPI_API_KEY');
  const isStale = overview.isStale;

  return (
    <div className="space-y-3">
      {/* Warning Alert if Stale or API key missing */}
      {isStale && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-900 rounded-xl p-3.5 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">Stale Market Data Notice: </span>
            {overview.staleReason || 'Serving last known verified market snapshot.'}
          </div>
        </div>
      )}

      {hasKeyMissing && (
        <div className="bg-blue-500/10 border border-blue-500/30 text-blue-900 rounded-xl p-3.5 flex items-start gap-3">
          <Key className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold">GoldAPI.io Free Key Required: </span>
            To activate real-time spot rates, sign up for free at{' '}
            <a
              href="https://www.goldapi.io/"
              target="_blank"
              rel="noreferrer"
              className="underline font-semibold text-blue-700"
            >
              goldapi.io
            </a>{' '}
            and add <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">GOLDAPI_API_KEY=your_key</code> in{' '}
            <code className="bg-blue-100 px-1 py-0.5 rounded font-mono">.env.local</code>.
          </div>
        </div>
      )}

      {/* Main Banner Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Overall Health & Provider */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-slate-800 text-emerald-400 border border-slate-700 shrink-0">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold text-slate-100">
                  Market Ingestion: {overview.providerName || 'GoldAPI.io'}
                </h2>
                <Badge variant={overview.hasData ? 'emerald' : 'amber'} size="sm" dot>
                  {overview.hasData ? (isStale ? 'Stale / Cached' : 'Live Connected') : 'Awaiting Config'}
                </Badge>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Optimized 2-endpoint batching (XAU + XAG) with 30-min cache to respect 150 req/month free tier.
              </p>
            </div>
          </div>

          {/* Right: Status Indicators & Manual Refresh */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Cache Info */}
            {overview.cacheInfo?.isCached && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  Cached ({Math.floor(overview.cacheInfo.cacheAgeSeconds / 60)}m ago)
                </span>
              </div>
            )}

            {/* Last Sync IST */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs text-slate-300">
              <span className="text-slate-400">Last Update:</span>
              <span className="font-mono text-emerald-400">
                {overview.lastSuccessfulSync
                  ? formatISTTimestamp(overview.lastSuccessfulSync)
                  : 'Pending'}
              </span>
            </div>

            {/* Manual Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              disabled={isRefreshing || cooldownRemaining > 0 || hasKeyMissing}
              className="bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700 hover:text-white text-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>
                {cooldownRemaining > 0
                  ? `Wait ${cooldownRemaining}s`
                  : 'Refresh Prices'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
