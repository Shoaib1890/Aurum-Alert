import { NextResponse } from 'next/server';
import { goldApiProvider } from '@/lib/bullion/providers/goldapi';
import { telegramService } from '@/lib/telegram/service';

/**
 * POST /api/notifications/test
 * Dispatches a real test Telegram message using configured server credentials
 */
export async function POST() {
  try {
    const hasToken = Boolean(process.env.TELEGRAM_BOT_TOKEN);
    const hasChatId = Boolean(process.env.TELEGRAM_CHAT_ID);

    if (!hasToken || !hasChatId) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Telegram credentials incomplete in .env.local. Required: TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID.',
          code: 'CREDENTIALS_MISSING',
        },
        { status: 400 }
      );
    }

    // Fetch latest rates
    const overview = await goldApiProvider.getBullionPrices(false);
    if (!overview.hasData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot send test alert: Unable to fetch bullion rates from GoldAPI.io.',
        },
        { status: 500 }
      );
    }

    // Force send test alert (bypasses date deduplication for testing)
    const result = await telegramService.sendDailyAlert(overview, { force: true });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          preview: result.preview,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      recipient: telegramService.maskChatId(process.env.TELEGRAM_CHAT_ID!),
      dispatchedAt: new Date().toISOString(),
      preview: result.preview,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      {
        success: false,
        error: `Test notification failed: ${msg}`,
      },
      { status: 500 }
    );
  }
}
