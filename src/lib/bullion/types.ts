export interface GoldApiQuote {
  timestamp: number;
  metal: 'XAU' | 'XAG';
  currency: 'INR';
  exchange?: string;
  symbol: string;
  prev_close_price: number;
  open_price?: number;
  low_price?: number;
  high_price?: number;
  open_time?: number;
  price: number;
  ch?: number;
  chp?: number;
  ask?: number;
  bid?: number;
  price_gram_24k?: number;
  price_gram_22k?: number;
  price_gram_21k?: number;
  price_gram_20k?: number;
  price_gram_18k?: number;
  price_gram_16k?: number;
  price_gram_14k?: number;
  price_gram_10k?: number;
  error?: string;
  message?: string;
}

export interface GoldApiErrorResponse {
  error?: string;
  message?: string;
  status?: number;
}
