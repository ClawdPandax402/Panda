import { moltbookClient } from './moltbook-client';
interface Report {
  id: string;
  type: 'transactions' | 'revenue' | 'customers' | 'products';
  format: 'json' | 'csv' | 'pdf';
  dateRange: { start: number; end: number };
  status: 'generating' | 'ready' | 'failed';
  downloadUrl?: string;
}
export class MoltbookReport {
  async generate(type: Report['type'], format: Report['format'], start: number, end: number): Promise<Report | null> {
    const result = await moltbookClient.request<Report>('/reports', {
      method: 'POST',
      body: JSON.stringify({ type, format, dateRange: { start, end } }),
    });
    return result.data ?? null;
  }
  async getStatus(reportId: string): Promise<Report | null> {
    const result = await moltbookClient.request<Report>(`/reports/${reportId}`);
    return result.data ?? null;
  }
  async listReports(): Promise<Report[]> {
    const result = await moltbookClient.request<Report[]>('/reports');
    return result.data ?? [];
  }
  async pollUntilReady(reportId: string, maxAttempts: number = 30): Promise<Report | null> {
    for (let i = 0; i < maxAttempts; i++) {
      const report = await this.getStatus(reportId);
      if (report?.status === 'ready') return report;
      if (report?.status === 'failed') return null;
      await new Promise(r => setTimeout(r, 2000));
    }
    return null;
  }
}
export const moltbookReport = new MoltbookReport();
