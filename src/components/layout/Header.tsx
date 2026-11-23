'use client';

import React, { useState, useEffect } from 'react';
import { Coins, Send, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

export function Header() {
  const [currentTimeIST, setCurrentTimeIST] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const istTime = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now);
      setCurrentTimeIST(istTime + ' IST');
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Coins className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                  Daily Bullion Alert
                </h1>
                <Badge variant="emerald" size="sm">
                  Spot INR
                </Badge>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                National Spot Gold & Silver Morning Digest
              </p>
            </div>
          </div>

          {/* Right Header: Clock & Schedule Status */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentTimeIST || 'Loading IST...'}
              </div>
              <span className="text-[11px] text-slate-400">
                Scheduled Daily Broadcast: 07:00 AM IST
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 font-medium">
                <Send className="w-3.5 h-3.5 text-sky-600" />
                <span>Morning Telegram Engine</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
