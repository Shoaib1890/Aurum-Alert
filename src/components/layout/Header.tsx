'use client';

import React, { useState, useEffect } from 'react';
import { Coins, Send, Activity, ShieldCheck, Sparkles } from 'lucide-react';

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
    <header className="sticky top-0 z-50 bg-vault-950/85 backdrop-blur-xl border-b border-amber-500/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3.5">
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 via-gold-500 to-amber-700 p-0.5 shadow-[0_0_20px_rgba(229,184,66,0.35)]">
              <div className="w-full h-full bg-vault-950 rounded-[14px] flex items-center justify-center">
                <Coins className="w-6 h-6 text-amber-300 animate-pulse-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight text-white font-mono flex items-center gap-1.5">
                  <span className="gold-gradient-text">AURUM</span>
                  <span className="text-slate-200">ALERT</span>
                </h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-300 font-bold tracking-wider">
                  VAULT v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide">
                Institutional Bullion Benchmark Terminal & Telegram Engine
              </p>
            </div>
          </div>

          {/* Right Header: Clock & Telegram Engine */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-200">
                <span className="w-2 h-2 rounded-full bg-cyber-emerald animate-ping" />
                {currentTimeIST || 'SYNCING IST...'}
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                SCHEDULED BROADCAST: 07:00 AM IST
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 text-xs text-slate-200 bg-vault-900 px-3.5 py-2 rounded-xl border border-sky-500/30 font-mono shadow-inner">
                <Send className="w-3.5 h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Telegram Cloud Engine</span>
                <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
