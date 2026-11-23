import { BullionOverview } from '@/types/bullion';
import {
  TelegramSendMessagePayload,
  TelegramApiResponse,
  DispatchLogEntry,
} from './types';
import { dispatchLogManager } from './dispatch-log';
import { formatINR, formatChangeDelta, formatPercentage } from '@/lib/utils/formatters';

export class TelegramNotificationService {
  /**
   * Masks chat ID for safe logging and display (e.g., "1234****89")
   */
  public maskChatId(chatId: string): string {
    const trimmed = chatId.trim();
    if (trimmed.length <= 4) return '****';
    return `${trimmed.slice(0, 3)}****${trimmed.slice(-3)}`;
  }

  /**
   * Generates the formatted message body strictly according to Aurum Alert standard
   */
  public formatMessageBody(overview: BullionOverview): string {
    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }).format(today);

    const gold24k = overview.rates.gold_24k;
    const gold22k = overview.rates.gold_22k;
    const silver = overview.rates.silver;

    const goldChangeStr = `${formatChangeDelta(gold24k.changeAmount)} (${formatPercentage(gold24k.changePercentage)})`;
    const silverChangeStr = `${formatChangeDelta(silver.changeAmount)} (${formatPercentage(silver.changePercentage)})`;

    return `Good Morning! ☀️

🔔 *AURUM ALERT – DAILY BULLION UPDATE*

📅 Date: ${formattedDate}

🥇 *GOLD PRICES*
• 24K Gold (10g): ${formatINR(gold24k.price)}
• 22K Gold (10g): ${formatINR(gold22k.price)}

🥈 *SILVER PRICES*
• Silver (1kg): ${formatINR(silver.price)}

📊 *DAILY MARKET MOVEMENT*
• Gold: ${goldChangeStr}
• Silver: ${silverChangeStr}

📌 Source: GoldAPI.io
International Spot Prices converted to INR.
These are not official IBJA domestic retail rates.

Have a great day!`;
  }

  /**
   * Gets current date key in IST (YYYY-MM-DD)
   */
  public getTodayISTDateKey(): string {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    return formatter.format(new Date());
  }

  /**
   * Sends the automated message via Telegram Bot API sendMessage endpoint
   */
  public async sendDailyAlert(
    overview: BullionOverview,
    options: { force?: boolean; dryRun?: boolean } = {}
  ): Promise<{
    success: boolean;
    status: 'sent' | 'skipped_duplicate' | 'failed' | 'dry_run';
    messageId?: string;
    error?: string;
    preview?: string;
  }> {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!overview.hasData) {
      return {
        success: false,
        status: 'failed',
        error: 'Cannot dispatch Telegram alert: Bullion price data is missing or unavailable.',
      };
    }

    const messageBody = this.formatMessageBody(overview);

    if (options.dryRun) {
      console.log('[Telegram Notification] DRY RUN ONLY — Message was not sent:');
      console.log(messageBody);
      return {
        success: true,
        status: 'dry_run',
        preview: messageBody,
      };
    }

    if (!botToken || !chatId) {
      return {
        success: false,
        status: 'failed',
        error:
          'Missing Telegram credentials. Ensure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID are configured in environment variables.',
      };
    }

    const maskedChat = this.maskChatId(chatId);
    const todayKey = this.getTodayISTDateKey();

    // 1. Prevent duplicate sends for the same date unless force is specified
    if (!options.force && dispatchLogManager.hasDispatchedForDate(todayKey)) {
      const logEntry: DispatchLogEntry = {
        id: `skip_${Date.now()}`,
        dateKey: todayKey,
        dispatchedAt: new Date().toISOString(),
        channel: 'telegram',
        recipientMasked: maskedChat,
        status: 'skipped_duplicate',
        pricesSummary: {
          gold24k: overview.rates.gold_24k.price,
          gold22k: overview.rates.gold_22k.price,
          silver: overview.rates.silver.price,
        },
      };
      dispatchLogManager.saveLog(logEntry);

      return {
        success: true,
        status: 'skipped_duplicate',
        error: `An alert has already been successfully sent for today (${todayKey}). Use force=true to override.`,
        preview: messageBody,
      };
    }

    // 2. Build Telegram Bot API request payload
    const payload: TelegramSendMessagePayload = {
      chat_id: chatId.trim(),
      text: messageBody,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    };

    const endpoint = `https://api.telegram.org/bot${botToken.trim()}/sendMessage`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let telegramError = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errData = (await response.json()) as TelegramApiResponse;
          if (errData.description) {
            telegramError = `Telegram API Error (${errData.error_code ?? response.status}): ${errData.description}`;
          }
        } catch {
          // Response body was not JSON
        }

        const failedLog: DispatchLogEntry = {
          id: `fail_${Date.now()}`,
          dateKey: todayKey,
          dispatchedAt: new Date().toISOString(),
          channel: 'telegram',
          recipientMasked: maskedChat,
          status: 'failed',
          errorMessage: telegramError,
          pricesSummary: {
            gold24k: overview.rates.gold_24k.price,
            gold22k: overview.rates.gold_22k.price,
            silver: overview.rates.silver.price,
          },
        };
        dispatchLogManager.saveLog(failedLog);

        return {
          success: false,
          status: 'failed',
          error: telegramError,
          preview: messageBody,
        };
      }

      const resData = (await response.json()) as TelegramApiResponse;
      const messageId = String(resData.result?.message_id || 'unknown');

      // 3. Save successful dispatch log
      const successLog: DispatchLogEntry = {
        id: `sent_${Date.now()}`,
        dateKey: todayKey,
        dispatchedAt: new Date().toISOString(),
        channel: 'telegram',
        recipientMasked: maskedChat,
        status: 'sent',
        messageId,
        pricesSummary: {
          gold24k: overview.rates.gold_24k.price,
          gold22k: overview.rates.gold_22k.price,
          silver: overview.rates.silver.price,
        },
      };
      dispatchLogManager.saveLog(successLog);

      return {
        success: true,
        status: 'sent',
        messageId,
        preview: messageBody,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown network error';
      return {
        success: false,
        status: 'failed',
        error: `Failed to contact Telegram Bot API: ${msg}`,
        preview: messageBody,
      };
    }
  }
}

export const telegramService = new TelegramNotificationService();
