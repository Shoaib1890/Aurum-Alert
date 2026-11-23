export interface TelegramSendMessagePayload {
  chat_id: string | number;
  text: string;
  parse_mode?: 'Markdown' | 'HTML';
  disable_web_page_preview?: boolean;
}

export interface TelegramApiResponse {
  ok: boolean;
  result?: {
    message_id: number;
    chat: {
      id: number;
      title?: string;
      username?: string;
      type: string;
    };
    date: number;
    text: string;
  };
  description?: string;
  error_code?: number;
}

export interface DispatchLogEntry {
  id: string;
  dateKey: string; // YYYY-MM-DD in IST
  dispatchedAt: string; // ISO string
  channel: 'telegram';
  recipientMasked: string;
  status: 'sent' | 'failed' | 'skipped_duplicate';
  messageId?: string;
  errorMessage?: string;
  pricesSummary: {
    gold24k: number | null;
    gold22k: number | null;
    silver: number | null;
  };
}
