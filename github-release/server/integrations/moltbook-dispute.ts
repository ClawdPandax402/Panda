import { moltbookClient } from './moltbook-client';
interface Dispute {
  id: string;
  paymentId: string;
  amount: number;
  reason: 'fraud' | 'not_received' | 'not_as_described' | 'other';
  evidence: string[];
  status: 'open' | 'under_review' | 'won' | 'lost';
  createdAt: number;
  deadline: number;
}
export class MoltbookDispute {
  async get(disputeId: string): Promise<Dispute | null> {
    const result = await moltbookClient.request<Dispute>(`/disputes/${disputeId}`);
    return result.data ?? null;
  }
  async submitEvidence(disputeId: string, evidence: string[]): Promise<boolean> {
    const result = await moltbookClient.request(`/disputes/${disputeId}/evidence`, {
      method: 'POST',
      body: JSON.stringify({ evidence }),
    });
    return result.success;
  }
  async accept(disputeId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/disputes/${disputeId}/accept`, { method: 'POST' });
    return result.success;
  }
  async listOpen(merchantId: string): Promise<Dispute[]> {
    const result = await moltbookClient.request<Dispute[]>(`/disputes?merchantId=${merchantId}&status=open`);
    return result.data ?? [];
  }
}
export const moltbookDispute = new MoltbookDispute();
