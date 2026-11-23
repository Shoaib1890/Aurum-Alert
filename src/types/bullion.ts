export type MetalType = 'gold_24k' | 'gold_22k' | 'silver';

export type MetalUnit = '10g' | '1kg';

export interface BullionRate {
  id?: string;
  metalType: MetalType;
  metalName: string;
  purity: string;
  price: number | null;
  currency: 'INR';
  unit: MetalUnit;
  changeAmount: number | null;
  changePercentage: number | null;
  previousClose: number | null;
  tradingDate: string | null;
  source: string;
  isAvailable: boolean;
  updatedAt?: string;
  isStale?: boolean;
}

export interface HistoricalDataPoint {
  date: string;
  price: number;
  formattedDate: string;
}

export interface CacheInfo {
  isCached: boolean;
  cacheAgeSeconds: number;
  ttlSeconds: number;
  cachedAt?: string;
}

export interface BullionOverview {
  rates: Record<MetalType, BullionRate>;
  hasData: boolean;
  isStale?: boolean;
  staleReason?: string;
  lastSuccessfulSync: string | null;
  nextScheduledSync: string;
  marketStatus: 'open' | 'closed' | 'awaiting_sync';
  providerName: string;
  sourceNotice: string;
  cacheInfo?: CacheInfo;
  error?: string;
}

export interface SyncStatus {
  database: 'connected' | 'disconnected' | 'unconfigured' | 'local_file';
  priceApi: 'connected' | 'disconnected' | 'unconfigured' | 'rate_limited';
  cronScheduler: 'active' | 'standby' | 'unconfigured';
  lastSyncTimestamp: string | null;
  providerName?: string;
  errorMessage?: string;
  isStale?: boolean;
  cacheAgeSeconds?: number;
}

export interface NotificationScheduleConfig {
  scheduledTimeIST: string;
  cronExpression: string;
  recipientMasked: string;
  provider: 'telegram_bot' | 'none';
  status: 'configured' | 'pending_credentials' | 'disabled';
  lastDispatchStatus: 'sent' | 'failed' | 'never';
  lastDispatchedAt: string | null;
}
