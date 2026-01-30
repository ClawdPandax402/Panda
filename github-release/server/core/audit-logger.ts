type AuditEvent = 'payment' | 'access' | 'error' | 'security';
interface AuditEntry {
  event: AuditEvent;
  hash: string;
  timestamp: number;
}
export class AuditLogger {
  private logs: AuditEntry[] = [];
  private maxSize = 10000;
  log(event: AuditEvent, data: Record<string, unknown>): void {
    const hash = this.hashData(JSON.stringify(data));
    this.logs.push({ event, hash, timestamp: Date.now() });
    if (this.logs.length > this.maxSize) this.logs.shift();
  }
  private hashData(data: string): string {
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }
  getRecentLogs(count: number = 100): AuditEntry[] {
    return this.logs.slice(-count);
  }
}
export const auditLogger = new AuditLogger();
