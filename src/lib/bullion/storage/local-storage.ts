import fs from 'fs';
import path from 'path';
import { BullionOverview, HistoricalDataPoint, MetalType } from '@/types/bullion';
import { BullionStorage, BullionSnapshot } from './types';
import { formatISTDate } from '@/lib/utils/formatters';

const STORAGE_DIR = path.join(process.cwd(), '.data');
const STORAGE_FILE = path.join(STORAGE_DIR, 'bullion_snapshots.json');

export class LocalFileBullionStorage implements BullionStorage {
  private ensureDirectory() {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
  }

  private readAll(): BullionSnapshot[] {
    try {
      this.ensureDirectory();
      if (!fs.existsSync(STORAGE_FILE)) {
        return [];
      }
      const raw = fs.readFileSync(STORAGE_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.error('Failed to read bullion snapshots from local file storage:', err);
      return [];
    }
  }

  private writeAll(snapshots: BullionSnapshot[]) {
    try {
      this.ensureDirectory();
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(snapshots, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to save bullion snapshots to local file storage:', err);
    }
  }

  async saveSnapshot(overview: BullionOverview): Promise<void> {
    if (!overview.hasData) return;

    const snapshots = this.readAll();
    const newSnapshot: BullionSnapshot = {
      id: `snap_${Date.now()}`,
      recordedAt: new Date().toISOString(),
      rates: overview.rates,
      provider: overview.providerName,
      source: overview.sourceNotice,
    };

    // Keep up to 60 snapshots locally to avoid unbounded growth
    snapshots.unshift(newSnapshot);
    if (snapshots.length > 60) {
      snapshots.length = 60;
    }

    this.writeAll(snapshots);
  }

  async getLatestSnapshot(): Promise<BullionOverview | null> {
    const snapshots = this.readAll();
    if (snapshots.length === 0) return null;

    const latest = snapshots[0];
    return {
      rates: latest.rates,
      hasData: true,
      lastSuccessfulSync: latest.recordedAt,
      nextScheduledSync: '07:00 AM IST',
      marketStatus: 'open',
      providerName: latest.provider,
      sourceNotice: latest.source,
      isStale: true,
      staleReason: 'Loaded from local persistent storage cache',
    };
  }

  async getHistoricalData(
    metal: MetalType,
    limit: number = 30
  ): Promise<HistoricalDataPoint[]> {
    const snapshots = this.readAll();
    if (snapshots.length === 0) return [];

    // Reverse to chronological order (oldest to newest)
    const chronological = [...snapshots].reverse();
    const points: HistoricalDataPoint[] = [];

    for (const snap of chronological) {
      const rate = snap.rates[metal];
      if (rate && rate.price !== null) {
        points.push({
          date: snap.recordedAt,
          formattedDate: formatISTDate(snap.recordedAt),
          price: rate.price,
        });
      }
    }

    return points.slice(-limit);
  }
}

export const localBullionStorage = new LocalFileBullionStorage();
