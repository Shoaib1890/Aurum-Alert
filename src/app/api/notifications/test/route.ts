import { NextResponse } from 'next/server';
import { goldApiProvider } from '@/lib/bullion/providers/goldapi';
import { whatsAppService } from '@/lib/whatsapp/service';

/**
 * POST /api/notifications/test
 * Dispatches a real test WhatsApp message using configured server credentials
 */
export async function POST() {
  try {
    const hasToken = Boolean(process.env.WHATSAPP_API_TOKEN);
    const hasPhoneId = Boolean(process.env.WHATSAPP_PHONE_NUMBER_ID);
    const hasRecipient = Boolean(process.env.WHATSAPP_RECIPIENT_PHONE);

    if (!hasToken || !hasPhoneId || !hasRecipient) {
      return NextResponse.json(
        {
          success: false,
          error:
            'WhatsApp credentials incomplete in .env.local. Required: WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID, and WHATSAPP_RECIPIENT_PHONE.',
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
    const result = await whatsAppService.sendDailyAlert(overview, { force: true });

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
      recipient: whatsAppService.maskPhoneNumber(process.env.WHATSAPP_RECIPIENT_PHONE!),
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
