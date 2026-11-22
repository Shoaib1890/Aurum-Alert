import { BullionOverview, HistoricalDataPoint, MetalType } from '@/types/bullion';

export interface BullionSnapshot {
  id: string;
  recordedAt: string;
  rates: BullionOverview['rates'];
  provider: string;
  source: string;
}

export interface BullionStorage {
  saveSnapshot(overview: BullionOverview): Promise<void>;
  getLatestSnapshot(): Promise<BullionOverview | null>;
  getHistoricalData(metal: MetalType, limit?: number): Promise<HistoricalDataPoint[]>;
}
