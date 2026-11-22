import React from 'react';
import { Shield, Info } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-slate-500 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>National Benchmark Architecture</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Daily Bullion Alert is engineered to track official India-wide wholesale benchmark spot rates (ex-GST, ex-making). Automated morning dispatch operates independently via cloud serverless functions at 7:00 AM IST.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Data Integrity & Standards</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              All prices represent pure 24K (999), 22K (916 jewellery hallmark standard) per 10 grams and Fine Silver (999) per 1 kilogram. No unverified mock prices are ever presented as real market transactions.
            </p>
          </div>

          <div>
            <div className="text-slate-800 font-semibold mb-2">
              Phase Status & Deployment
            </div>
            <p className="text-slate-500 leading-relaxed">
              <strong>Phase 1:</strong> Project scaffolding & production dashboard UI. Database and WhatsApp delivery pipeline will be connected in Phase 2 upon user approval.
            </p>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
          <p>© {new Date().getFullYear()} Daily Bullion Alert. Production Financial Architecture.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              IST Timezone Native (UTC+05:30)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
