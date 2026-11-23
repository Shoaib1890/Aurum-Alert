import React from 'react';
import { Send, Clock, MessageSquare, ShieldCheck, GitBranch } from 'lucide-react';
import { ManualTriggerButton } from './ManualTriggerButton';
import { NotificationScheduleConfig } from '@/types/bullion';

interface NotificationSettingsProps {
  config: NotificationScheduleConfig;
}

export function NotificationSettings({ config }: NotificationSettingsProps) {
  return (
    <div className="glass-panel rounded-2xl p-6 border border-sky-500/25 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight font-mono">
                AUTOMATED 07:00 AM IST TELEGRAM DISPATCH
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-bold">
                07:00 AM IST
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              Powered by Telegram Bot API & GitHub Actions cloud cron. 100% independent of personal PC.
            </p>
          </div>
        </div>

        <span className="text-xs px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-cyber-emerald font-mono font-bold">
          TELEGRAM ACTIVE
        </span>
      </div>

      <div className="py-6 space-y-6">
        {/* Specs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-vault-900 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-mono mb-1">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>SCHEDULE RULE</span>
            </div>
            <div className="text-lg font-bold text-white font-mono">
              07:00 AM IST
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Cron Expression: <code>30 1 * * *</code> (01:30 UTC)
            </p>
          </div>

          <div className="p-4 rounded-xl bg-vault-900 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-mono mb-1">
              <MessageSquare className="w-4 h-4 text-sky-400" />
              <span>TARGET CHAT ID</span>
            </div>
            <div className="text-lg font-bold text-sky-300 font-mono">
              {process.env.NEXT_PUBLIC_CHAT_ID_MASKED || '624****151'}
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Securely set via TELEGRAM_CHAT_ID
            </p>
          </div>

          <div className="p-4 rounded-xl bg-vault-900 border border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 font-mono mb-1">
              <GitBranch className="w-4 h-4 text-cyber-emerald" />
              <span>SERVERLESS CLOUD</span>
            </div>
            <div className="text-sm font-bold text-white font-mono">
              GitHub Actions Runner
            </div>
            <p className="text-[11px] text-slate-500 font-mono mt-0.5">
              Zero Local Dependency • 24/7 Reliability
            </p>
          </div>
        </div>

        {/* Message Format Preview Terminal */}
        <div className="rounded-xl border border-slate-800 bg-vault-950 p-5 font-mono text-xs shadow-2xl">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800 text-slate-400 text-[11px]">
            <span className="flex items-center gap-1.5 font-bold text-sky-400">
              <ShieldCheck className="w-4 h-4" />
              Official Telegram Broadcast Message Format
            </span>
            <span className="text-[10px] text-slate-400">
              parse_mode: Markdown
            </span>
          </div>
          <div className="space-y-1 text-slate-300 leading-relaxed">
            <p className="text-slate-200">Good Morning! ☀️</p>
            <p className="text-amber-300 font-bold">🔔 *AURUM ALERT – DAILY BULLION UPDATE*</p>
            <p className="text-slate-400">📅 Date: [Today's Date in IST]</p>
            <div className="pt-1">
              <p className="text-amber-200 font-semibold">🥇 *GOLD PRICES*</p>
              <p>• 24K Gold (10g): ₹[Price]</p>
              <p>• 22K Gold (10g): ₹[Price]</p>
            </div>
            <div className="pt-1">
              <p className="text-slate-200 font-semibold">🥈 *SILVER PRICES*</p>
              <p>• Silver (1kg): ₹[Price]</p>
            </div>
            <div className="pt-1">
              <p className="text-cyber-emerald font-semibold">📊 *DAILY MARKET MOVEMENT*</p>
              <p>• Gold: [₹ Delta] ([% Change])</p>
              <p>• Silver: [₹ Delta] ([% Change])</p>
            </div>
            <div className="pt-2 text-slate-400 text-[11px] border-t border-slate-800/80">
              <p>📌 Source: GoldAPI.io</p>
              <p>International Spot Prices converted to INR.</p>
              <p>These are not official IBJA domestic retail rates.</p>
            </div>
            <p className="text-slate-200 pt-1">Have a great day!</p>
          </div>
        </div>

        {/* Manual Test Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div>
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Manual Telegram Test Broadcast
            </h4>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Trigger a test message right now to confirm delivery to your personal Telegram bot chat.
            </p>
          </div>

          <ManualTriggerButton />
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
        <span className="flex items-center gap-1.5 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-cyber-emerald" />
          Workflow: .github/workflows/daily-bullion-alert.yml
        </span>
        <span>
          Cron: 30 1 * * * (01:30 UTC = 07:00 IST)
        </span>
      </div>
    </div>
  );
}
