'use client';

import React, { useState, useEffect } from 'react';
import { LineChart as ChartIcon, Database, Activity, Sparkles } from 'lucide-react';
import { MetalType, HistoricalDataPoint } from '@/types/bullion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

export function HistoricalChart() {
  const [selectedMetal, setSelectedMetal] = useState<MetalType>('gold_24k');
  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '3M' | '1Y'>('1M');
  const [isMounted, setIsMounted] = useState(false);
  const [historyData, setHistoryData] = useState<HistoricalDataPoint[]>([]);
  const [showPreviewTrend, setShowPreviewTrend] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch(`/api/prices/history?metal=${selectedMetal}&limit=30`);
        if (res.ok) {
          const json = await res.json();
          setHistoryData(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load historical data:', err);
      }
    }

    if (isMounted) {
      loadHistory();
    }
  }, [selectedMetal, isMounted]);

  // Demo trendline strictly for UI container layout verification when explicitly toggled
  const sampleTrend = [
    { formattedDate: 'Session 1', price: 104200 },
    { formattedDate: 'Session 2', price: 105650 },
    { formattedDate: 'Session 3', price: 106100 },
    { formattedDate: 'Session 4', price: 105800 },
    { formattedDate: 'Session 5', price: 107250 },
    { formattedDate: 'Session 6', price: 106900 },
    { formattedDate: 'Live Spot', price: 107939 },
  ];

  const hasRealData = historyData.length > 1;
  const chartData = hasRealData ? historyData : sampleTrend;

  const getLineColor = () => {
    if (selectedMetal === 'silver') return '#94A3B8';
    if (selectedMetal === 'gold_22k') return '#F59E0B';
    return '#E5B842';
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-amber-500/20 relative overflow-hidden">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-300">
              <ChartIcon className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Bullion Spot Trajectory & Volatility Terminal</span>
            </h3>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30 uppercase">
              Bloomberg View
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            High-precision price trajectory logged across consecutive trading sessions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
          {/* Metal Selector */}
          <div className="inline-flex rounded-xl bg-vault-900 p-1 border border-slate-700/60">
            <button
              onClick={() => setSelectedMetal('gold_24k')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetal === 'gold_24k'
                  ? 'bg-amber-500 text-vault-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              24K Gold
            </button>
            <button
              onClick={() => setSelectedMetal('gold_22k')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetal === 'gold_22k'
                  ? 'bg-amber-600 text-white font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              22K Gold
            </button>
            <button
              onClick={() => setSelectedMetal('silver')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                selectedMetal === 'silver'
                  ? 'bg-slate-300 text-vault-950 font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Silver 999
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="inline-flex rounded-xl bg-vault-900 p-1 border border-slate-700/60">
            {(['7D', '1M', '3M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  timeframe === tf
                    ? 'bg-vault-800 text-amber-300 border border-amber-500/40 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="pt-6">
        {hasRealData && isMounted ? (
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 15, right: 25, left: 15, bottom: 5 }}>
                <defs>
                  <linearGradient id="bullionGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={getLineColor()} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={getLineColor()} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  fontFamily="monospace"
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  domain={['dataMin - 800', 'dataMax + 800']}
                  tickLine={false}
                  fontFamily="monospace"
                  tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                />
                <Tooltip
                  formatter={(val: any) => [
                    `₹${Number(val ?? 0).toLocaleString('en-IN')}`,
                    'Live Spot Benchmark',
                  ]}
                  contentStyle={{
                    backgroundColor: '#090a0e',
                    border: '1px solid rgba(229, 184, 66, 0.3)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    boxShadow: '0 0 25px rgba(0,0,0,0.8)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke={getLineColor()}
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#bullionGlow)"
                  dot={{ fill: getLineColor(), r: 4 }}
                  activeDot={{ r: 7, fill: '#fff', stroke: getLineColor(), strokeWidth: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : showPreviewTrend && isMounted ? (
          <div>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800 text-xs font-mono">
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                Interactive Simulation Curve
              </span>
              <button
                onClick={() => setShowPreviewTrend(false)}
                className="text-slate-400 hover:text-white underline cursor-pointer"
              >
                Return to Live View
              </button>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sampleTrend} margin={{ top: 15, right: 25, left: 15, bottom: 5 }}>
                  <defs>
                    <linearGradient id="previewGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#E5B842" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#E5B842" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2330" />
                  <XAxis dataKey="formattedDate" stroke="#64748b" fontSize={11} tickLine={false} fontFamily="monospace" />
                  <YAxis
                    stroke="#64748b"
                    fontSize={11}
                    domain={['dataMin - 1000', 'dataMax + 1000']}
                    tickLine={false}
                    fontFamily="monospace"
                    tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                  />
                  <Tooltip
                    formatter={(val: any) => [
                      `₹${Number(val ?? 0).toLocaleString('en-IN')}`,
                      'Spot Rate',
                    ]}
                    contentStyle={{
                      backgroundColor: '#090a0e',
                      border: '1px solid rgba(229, 184, 66, 0.3)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="#E5B842"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#previewGlow)"
                    dot={{ fill: '#E5B842', r: 4 }}
                    activeDot={{ r: 7, fill: '#fff', stroke: '#E5B842', strokeWidth: 3 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-72 w-full flex flex-col items-center justify-center rounded-xl bg-vault-950/60 border border-dashed border-slate-800 text-center p-6">
            <div className="w-12 h-12 rounded-full bg-vault-900 border border-slate-700 flex items-center justify-center text-amber-400 mb-3">
              <Database className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white mb-1 font-mono">
              {historyData.length === 1
                ? '1 Snapshot Logged • Need At Least 2 for Area Curve'
                : 'Awaiting Second Consecutive Snapshot'}
            </h4>
            <p className="text-xs text-slate-400 max-w-md mb-4 leading-relaxed font-sans">
              Daily snapshots are recorded automatically by the 7:00 AM IST Telegram cron runner into local storage. Once multiple sessions are recorded, this area curve plots live trajectory.
            </p>
            <button
              onClick={() => setShowPreviewTrend(true)}
              className="px-4 py-2 rounded-xl bg-vault-900 hover:bg-vault-800 border border-amber-500/30 text-amber-200 text-xs font-mono transition-all cursor-pointer"
            >
              Preview Trajectory Canvas
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
