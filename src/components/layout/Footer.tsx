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
              <span>Bullion Spot Architecture</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Daily Bullion Alert tracks wholesale bullion spot rates converted to INR. Automated morning dispatch operates independently via GitHub Actions cloud cron at 7:00 AM IST to Telegram.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
              <Info className="w-4 h-4 text-emerald-600" />
              <span>Data Integrity & Standards</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              All prices represent pure 24K (999), 22K (916 jewellery hallmark standard) per 10 grams and Fine Silver (999) per 1 kilogram. Excludes Indian customs duty, GST (3%), and retail making charges.
            </p>
          </div>

          <div>
            <div className="text-slate-800 font-semibold mb-2">
              Automation Status
            </div>
            <p className="text-slate-500 leading-relaxed">
              <strong>Telegram Bot Integration:</strong> Daily alerts sent directly to your personal Telegram chat every morning at 7:00 AM IST with zero local computer dependency.
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
