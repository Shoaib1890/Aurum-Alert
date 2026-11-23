'use client';

import React from 'react';
import { Activity, Clock, RefreshCw, AlertTriangle, ShieldCheck, Database, Key, Send } from 'lucide-react';
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
  const isStale = overview.isStale;

  return (
    <div className="space-y-3">
      {/* Warning Alert if Stale */}
      {isStale && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 rounded-xl p-3.5 flex items-start gap-3 backdrop-blur-md">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-amber-300">Stale Market Snapshot: </span>
            {overview.staleReason || 'Serving last known verified market snapshot.'}
          </div>
        </div>
      )}

      {/* Main High-Tech Status Terminal */}
      <div className="glass-panel rounded-2xl p-5 border border-amber-500/20 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left: Engine & Data Pipeline */}
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="p-3 rounded-xl bg-vault-900 border border-amber-500/30 text-amber-300 shadow-inner shrink-0">
              <Activity className="w-5 h-5 text-cyber-emerald animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-bold text-white tracking-wide font-mono">
                  AURUM TERMINAL ENGINE • {overview.providerName || 'GoldAPI.io'}
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-cyber-emerald border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald animate-ping" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                Real-time 2-call batching (XAU+XAG) with 30-min cache quota protection • Telegram Daily Alert 07:00 IST
              </p>
            </div>
          </div>

          {/* Right: Telemetry & Manual Refresh */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Cache Age */}
            {overview.cacheInfo?.isCached && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vault-900 border border-slate-700/60 text-xs text-slate-300 font-mono">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Cached ({Math.floor(overview.cacheInfo.cacheAgeSeconds / 60)}m ago)</span>
              </div>
            )}

            {/* Last Sync */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-vault-900 border border-slate-700/60 text-xs text-slate-300 font-mono">
              <span className="text-slate-500">LAST SYNC:</span>
              <span className="text-amber-300 font-semibold">
                {overview.lastSuccessfulSync
                  ? formatISTTimestamp(overview.lastSuccessfulSync)
                  : 'Pending Sync'}
              </span>
            </div>

            {/* Refresh Action */}
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              isLoading={isRefreshing}
              disabled={isRefreshing || cooldownRemaining > 0}
              className="bg-vault-800/90 border-amber-500/30 text-amber-200 hover:bg-amber-500 hover:text-vault-950 font-mono text-xs transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>
                {cooldownRemaining > 0 ? `COOL (${cooldownRemaining}s)` : 'REFRESH LIVE SPOT'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
