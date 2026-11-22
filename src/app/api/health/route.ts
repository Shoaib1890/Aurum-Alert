import { NextResponse } from 'next/server';

export async function GET() {
  const isGoldApiConfigured = Boolean(
    process.env.GOLDAPI_API_KEY &&
      !process.env.GOLDAPI_API_KEY.includes('your-key-here')
  );

  const isSupabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const isWhatsAppConfigured = Boolean(
    process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
  );

  return NextResponse.json({
    status: 'ok',
    phase: '2A',
    app: 'Daily Bullion Alert',
    timezone: 'Asia/Kolkata (IST)',
    scheduledAlertTime: '07:00 AM IST',
    services: {
      goldApi: isGoldApiConfigured ? 'configured' : 'unconfigured (Set GOLDAPI_API_KEY in .env.local)',
      storage: 'local_file (.data/bullion_snapshots.json)',
      supabase: isSupabaseConfigured ? 'configured' : 'deferred (free tier optional)',
      whatsapp: isWhatsAppConfigured ? 'configured' : 'unconfigured (Phase 3)',
    },
    timestamp: new Date().toISOString(),
  });
}
