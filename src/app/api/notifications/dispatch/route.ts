import { NextRequest, NextResponse } from 'next/server';
import { goldApiProvider } from '@/lib/bullion/providers/goldapi';
import { whatsAppService } from '@/lib/whatsapp/service';

/**
 * POST /api/notifications/dispatch
 * Webhook endpoint for serverless cron schedulers.
 * Protected by Bearer CRON_SECRET authorization header.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // Verify secret if configured
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid CRON_SECRET' },
        { status: 401 }
      );
    }

    const overview = await goldApiProvider.getBullionPrices(false);
    if (!overview.hasData) {
      return NextResponse.json(
        { success: false, error: 'Unable to retrieve bullion prices' },
        { status: 500 }
      );
    }

    const result = await whatsAppService.sendDailyAlert(overview, { force: false });

    return NextResponse.json(result);
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Daily dispatch failure: ${msg}` },
      { status: 500 }
    );
  }
}
