export interface WhatsAppTextMessagePayload {
  messaging_product: 'whatsapp';
  recipient_type: 'individual';
  to: string;
  type: 'text';
  text: {
    preview_url: boolean;
    body: string;
  };
}

export interface WhatsAppTemplateMessagePayload {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
      }>;
    }>;
  };
}

export interface WhatsAppApiResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

export interface WhatsAppApiErrorResponse {
  error: {
    message: string;
    type: string;
    code: number;
    error_data?: {
      messaging_product: string;
      details: string;
    };
    error_subcode?: number;
    fbtrace_id?: string;
  };
}

export interface DispatchLogEntry {
  id: string;
  dateKey: string; // YYYY-MM-DD in IST
  dispatchedAt: string; // ISO
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
