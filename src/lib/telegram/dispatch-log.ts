import fs from 'fs';
import path from 'path';
import { DispatchLogEntry } from './types';

const LOG_DIR = path.join(process.cwd(), '.data');
const LOG_FILE = path.join(LOG_DIR, 'notification_dispatch_log.json');

export class DispatchLogManager {
  private ensureDir() {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  }

  public readLogs(): DispatchLogEntry[] {
    try {
      this.ensureDir();
      if (!fs.existsSync(LOG_FILE)) {
        return [];
      }
      const raw = fs.readFileSync(LOG_FILE, 'utf-8');
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  public saveLog(entry: DispatchLogEntry): void {
    try {
      this.ensureDir();
      const logs = this.readLogs();
      logs.unshift(entry);
      // Keep up to 60 historical logs locally
      if (logs.length > 60) logs.length = 60;
      fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write dispatch log:', err);
    }
  }

  public hasDispatchedForDate(dateKey: string): boolean {
    const logs = this.readLogs();
    return logs.some((l) => l.dateKey === dateKey && l.status === 'sent');
  }

  public getLatestLog(): DispatchLogEntry | null {
    const logs = this.readLogs();
    return logs.length > 0 ? logs[0] : null;
  }
}

export const dispatchLogManager = new DispatchLogManager();
