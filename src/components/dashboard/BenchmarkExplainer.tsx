import React from 'react';
import { Globe, AlertCircle, Info } from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';

export function BenchmarkExplainer() {
  return (
    <Card className="border-amber-200/80 bg-gradient-to-r from-amber-50/50 via-white to-slate-50">
      <CardBody className="p-4 sm:p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800 shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                  Market Source Notice
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  International Spot Prices Converted to INR — Not Official IBJA Domestic Rates
                </h3>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed max-w-4xl">
                The rates displayed on this dashboard are sourced from <strong>GoldAPI.io</strong> and represent <strong>international wholesale bullion spot prices (COMEX/FOREX)</strong> converted directly to Indian Rupees. They <strong>exclude</strong> Indian basic customs duty, Agriculture Infrastructure Development Cess (AIDC), local landing margins, state GST (3%), and jeweller making charges. They do not constitute official IBJA domestic physical benchmark rates.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-xs font-semibold text-slate-800 shadow-2xs">
              <Globe className="w-3.5 h-3.5 text-amber-600" />
              <span>International Spot (INR)</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-xs font-medium text-slate-500">
              <Info className="w-3.5 h-3.5 text-slate-400" />
              <span>Ex-Customs & GST</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
