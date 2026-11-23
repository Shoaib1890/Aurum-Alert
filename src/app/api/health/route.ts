import { NextResponse } from 'next/server';

export async function GET() {
  const isGoldApiConfigured = Boolean(
    process.env.GOLDAPI_API_KEY &&
      !process.env.GOLDAPI_API_KEY.includes('your-key-here')
  );

  const isTelegramConfigured = Boolean(
    process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID
  );

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  return NextResponse.json({
    status: 'ok',
    phase: '3-telegram',
    app: 'Daily Bullion Alert',
    timezone: 'Asia/Kolkata (IST)',
    scheduledAlertTime: '07:00 AM IST',
    services: {
      goldApi: isGoldApiConfigured ? 'configured' : 'unconfigured (Set GOLDAPI_API_KEY in .env.local)',
      storage: 'local_file (.data/bullion_snapshots.json)',
      supabase: isSupabaseConfigured ? 'configured' : 'deferred (free tier optional)',
      telegram: isTelegramConfigured ? 'configured' : 'unconfigured (Set TELEGRAM_BOT_TOKEN & TELEGRAM_CHAT_ID)',
    },
    timestamp: new Date().toISOString(),
  });
}
