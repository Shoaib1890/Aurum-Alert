import React from 'react';
import { Globe, AlertCircle, ShieldAlert, Sparkles } from 'lucide-react';

export function BenchmarkExplainer() {
  return (
    <div className="glass-panel rounded-2xl p-5 border border-amber-500/25 relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded">
                Official Regulatory Disclosure
              </span>
              <h3 className="text-sm font-bold text-white tracking-wide">
                International Wholesale Spot in INR — Not Official IBJA Domestic Retail Rates
              </h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl font-sans">
              Rates displayed are sourced from <strong>GoldAPI.io</strong> and represent <strong>pure international bullion spot prices (COMEX/FOREX)</strong> converted directly into Indian Rupees. They <strong>exclude</strong> India basic customs duty (BCD), Agriculture Infrastructure Development Cess (AIDC), local landing margins, state GST (3%), and jeweller showroom making charges. They do not constitute official IBJA domestic physical benchmark rates.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0 font-mono text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vault-900 border border-amber-500/30 text-amber-200">
            <Globe className="w-3.5 h-3.5 text-amber-400" />
            <span>Spot FOREX / INR</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-vault-900 border border-slate-700 text-slate-400">
            <span>Ex-Customs & GST</span>
          </div>
        </div>
      </div>
    </div>
  );
}
