'use client';

import React, { useState, useEffect } from 'react';
import { LineChart as ChartIcon, Database, RefreshCw } from 'lucide-react';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MetalType, HistoricalDataPoint } from '@/types/bullion';
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
  const [isLoading, setIsLoading] = useState(false);
  const [showPreviewTrend, setShowPreviewTrend] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function loadHistory() {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/prices/history?metal=${selectedMetal}&limit=30`);
        if (res.ok) {
          const json = await res.json();
          setHistoryData(json.data || []);
        }
      } catch (err) {
        console.error('Failed to load historical data:', err);
      } finally {
        setIsLoading(false);
      }
    }

    if (isMounted) {
      loadHistory();
    }
  }, [selectedMetal, isMounted]);

  // Demo trendline strictly for UI container layout verification when explicitly toggled
  const sampleTrend = [
    { date: 'Session 1', price: 78200 },
    { date: 'Session 2', price: 78550 },
    { date: 'Session 3', price: 78400 },
    { date: 'Session 4', price: 78900 },
    { date: 'Session 5', price: 79250 },
    { date: 'Session 6', price: 79100 },
    { date: 'Latest', price: 79600 },
  ];

  const hasRealData = historyData.length > 1;
  const chartData = hasRealData ? historyData : sampleTrend;

  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5">
        <div>
          <div className="flex items-center gap-2">
            <ChartIcon className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-bold text-slate-900">
              Historical Price Snapshots
            </h3>
            <Badge variant="slate" size="sm">
              International Spot (INR)
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tracking price trajectory recorded across consecutive sync sessions.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Metal Selector */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedMetal('gold_24k')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedMetal === 'gold_24k'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              24K Gold
            </button>
            <button
              onClick={() => setSelectedMetal('gold_22k')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedMetal === 'gold_22k'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              22K Gold
            </button>
            <button
              onClick={() => setSelectedMetal('silver')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                selectedMetal === 'silver'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Silver 999
            </button>
          </div>

          {/* Timeframe Selector */}
          <div className="inline-flex rounded-lg bg-slate-100 p-1 border border-slate-200 text-xs">
            {(['7D', '1M', '3M', '1Y'] as const).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardBody className="p-6">
        {hasRealData && isMounted ? (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="formattedDate" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={['dataMin - 500', 'dataMax + 500']}
                  tickLine={false}
                  tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                />
                <Tooltip
                  formatter={(val: any) => [
                    `₹${Number(val ?? 0).toLocaleString('en-IN')}`,
                    'Spot Rate',
                  ]}
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ fill: '#059669', r: 4 }}
                  activeDot={{ r: 6, fill: '#10b981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : showPreviewTrend && isMounted ? (
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 text-xs">
              <span className="flex items-center gap-1.5 text-amber-700 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                UI Layout Simulation Preview (Sample Curve - No Live Data Claimed)
              </span>
              <button
                onClick={() => setShowPreviewTrend(false)}
                className="text-slate-500 hover:text-slate-800 underline text-xs cursor-pointer"
              >
                Return to Live Empty State
              </button>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampleTrend} margin={{ top: 10, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    domain={['dataMin - 500', 'dataMax + 500']}
                    tickLine={false}
                    tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                  />
                  <Tooltip
                    formatter={(val: any) => [
                      `₹${Number(val ?? 0).toLocaleString('en-IN')}`,
                      'Benchmark Rate',
                    ]}
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#059669"
                    strokeWidth={2.5}
                    dot={{ fill: '#059669', r: 4 }}
                    activeDot={{ r: 6, fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="h-72 w-full flex flex-col items-center justify-center rounded-xl bg-slate-50/70 border border-dashed border-slate-200 text-center p-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 mb-3">
              <Database className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800 mb-1">
              {historyData.length === 1
                ? '1 Snapshot Saved — Need At Least 2 for Trendline'
                : 'No Historical Snapshots Synced Yet'}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mb-4 leading-relaxed">
              Snapshots are automatically saved to local storage upon each price refresh. Once multiple sessions are recorded or synced via the 7:00 AM IST morning cron, this chart will render your price trajectory.
            </p>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowPreviewTrend(true)}
                className="text-xs text-slate-700"
              >
                Preview Chart Container
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
