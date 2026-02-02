import { moltbookClient } from './moltbook-client';
interface AuditLog {
  id: string;
  action: string;
  actor: string;
  resource: string;
  resourceId: string;
  changes: Record<string, { old: unknown; new: unknown }>;
  ip?: string;
  timestamp: number;
}
export class MoltbookAudit {
  async getLogs(merchantId: string, options: { limit?: number; offset?: number; action?: string } = {}): Promise<AuditLog[]> {
    const params = new URLSearchParams({ merchantId, ...options as Record<string, string> });
    const result = await moltbookClient.request<AuditLog[]>(`/audit?${params}`);
    return result.data ?? [];
  }
  async getByResource(resourceType: string, resourceId: string): Promise<AuditLog[]> {
    const result = await moltbookClient.request<AuditLog[]>(`/audit/resource/${resourceType}/${resourceId}`);
    return result.data ?? [];
  }
  async exportLogs(merchantId: string, startDate: number, endDate: number): Promise<string | null> {
    const result = await moltbookClient.request<{ downloadUrl: string }>('/audit/export', {
      method: 'POST',
      body: JSON.stringify({ merchantId, startDate, endDate }),
    });
    return result.data?.downloadUrl ?? null;
  }
}
export const moltbookAudit = new MoltbookAudit();
