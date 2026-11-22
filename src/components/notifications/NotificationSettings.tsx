import React from 'react';
import { Bell, Clock, Smartphone, ShieldCheck, CloudLightning, GitBranch } from 'lucide-react';
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ManualTriggerButton } from './ManualTriggerButton';
import { NotificationScheduleConfig } from '@/types/bullion';

interface NotificationSettingsProps {
  config: NotificationScheduleConfig;
}

export function NotificationSettings({ config }: NotificationSettingsProps) {
  return (
    <Card className="border-slate-200">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Automated 7:00 AM IST WhatsApp Dispatch
              </h3>
              <Badge variant="emerald" size="sm" dot>
                Daily at 07:00 AM IST
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              Powered by GitHub Actions cloud cron. Operates 24/7 without requiring your personal computer to be online.
            </p>
          </div>
        </div>

        <Badge variant="emerald" size="sm">
          Phase 3 Active
        </Badge>
      </CardHeader>

      <CardBody className="p-6 space-y-5">
        {/* Scheduled Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Schedule card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Schedule Frequency</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              07:00 AM IST
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Daily cron trigger: <code>30 1 * * *</code> (01:30 UTC)
            </p>
          </div>

          {/* Delivery Target */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1">
              <Smartphone className="w-4 h-4 text-emerald-600" />
              <span>Target WhatsApp</span>
            </div>
            <div className="text-lg font-bold text-slate-900 font-mono">
              {process.env.NEXT_PUBLIC_RECIPIENT_MASKED || '+91 98*** ***10'}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Configured via WHATSAPP_RECIPIENT_PHONE
            </p>
          </div>

          {/* Cloud Reliability */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 mb-1">
              <GitBranch className="w-4 h-4 text-emerald-600" />
              <span>Free Cloud Scheduler</span>
            </div>
            <div className="text-sm font-bold text-slate-900">
              GitHub Actions Cron
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Runs in GitHub cloud runners (100% free, PC independent)
            </p>
          </div>
        </div>

        {/* Message Template Preview Box */}
        <div className="rounded-xl border border-slate-200 bg-slate-900 text-slate-100 p-5 font-mono text-xs shadow-inner">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 font-sans font-semibold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              Official WhatsApp Message Format (Dispatched at 07:00 AM IST)
            </span>
            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px]">
              Meta Cloud API
            </span>
          </div>
          <div className="space-y-1.5 text-slate-300 leading-relaxed">
            <p className="text-slate-200">Good Morning! ☀️</p>
            <p className="text-amber-400 font-bold">🔔 *AURUM ALERT – DAILY BULLION UPDATE*</p>
            <p className="text-slate-400">📅 Date: [Today's Date in IST]</p>
            <div className="pt-1">
              <p className="text-amber-300 font-semibold">🥇 *GOLD PRICES*</p>
              <p>• 24K Gold (10g): ₹[Price]</p>
              <p>• 22K Gold (10g): ₹[Price]</p>
            </div>
            <div className="pt-1">
              <p className="text-slate-300 font-semibold">🥈 *SILVER PRICES*</p>
              <p>• Silver (1kg): ₹[Price]</p>
            </div>
            <div className="pt-1">
              <p className="text-emerald-400 font-semibold">📊 *DAILY MARKET MOVEMENT*</p>
              <p>• Gold: [₹ Change] ([% Change])</p>
              <p>• Silver: [₹ Change] ([% Change])</p>
            </div>
            <div className="pt-2 text-slate-400 text-[11px] border-t border-slate-800/80">
              <p>📌 Source: GoldAPI.io</p>
              <p>International Spot Prices converted to INR.</p>
              <p>These are not official IBJA domestic retail rates.</p>
            </div>
            <p className="text-slate-200 pt-1">Have a great day!</p>
          </div>
        </div>

        {/* Manual Test Action Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="text-xs font-bold text-slate-800">
              Manual Notification Test Dispatch
            </h4>
            <p className="text-xs text-slate-500">
              Trigger a test WhatsApp message to verify Meta API connectivity and delivery to your personal phone.
            </p>
          </div>

          <ManualTriggerButton />
        </div>
      </CardBody>

      <CardFooter className="bg-slate-50/70 py-3 px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500">
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          Cloud Automation Ready: .github/workflows/daily-bullion-alert.yml
        </span>
        <span className="font-mono text-slate-400">
          Cron Rule: 30 1 * * * (01:30 UTC = 07:00 IST)
        </span>
      </CardFooter>
    </Card>
  );
}
