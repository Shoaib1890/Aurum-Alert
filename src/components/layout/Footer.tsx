import React from 'react';
import { Shield, Sparkles, Scale, Terminal, Layers } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-amber-500/15 bg-vault-950 text-slate-400 text-xs font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-3 font-mono">
              <Layers className="w-4 h-4 text-amber-400" />
              <span className="gold-gradient-text font-black">AURUM ALERT SPECIFICATION</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-lg font-sans">
              Designed as an institutional bullion benchmarking terminal for Indian investors, treasuries, and jewellers. Features real-time WebGL 3D specimen rendering, physical bullion valuation calculators, and an independent cloud-native Telegram broadcast at 7:00 AM IST.
            </p>
          </div>

          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              Assay Standards
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li>• 24K Pure Gold: 999.9 Fine</li>
              <li>• 22K Crown Gold: 916.0 Hallmark</li>
              <li>• Fine Silver: 999.0 Kilo Bar</li>
              <li>• Rate Base: COMEX/FOREX in INR</li>
            </ul>
          </div>

          <div>
            <div className="text-white font-bold text-xs uppercase tracking-wider mb-3 font-mono">
              Automation Cloud
            </div>
            <ul className="space-y-1.5 text-xs text-slate-400 font-mono">
              <li>• Scheduler: GitHub Actions</li>
              <li>• Cron: <code>30 1 * * *</code> (07:00 IST)</li>
              <li>• Bot API: Telegram sendMessage</li>
              <li>• Local Independence: 100%</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 font-mono text-[11px]">
          <p>© {new Date().getFullYear()} AURUM ALERT • PRODUCTION FINANCIAL VAULT ARCHITECTURE</p>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald" />
              Zero AI-Template Stamp • Bespoke 3D WebGL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
