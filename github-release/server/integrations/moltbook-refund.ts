import { moltbookClient } from './moltbook-client';
interface Refund {
  id: string;
  paymentId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'processed' | 'failed';
  createdAt: number;
}
export class MoltbookRefund {
  async create(paymentId: string, amount: number, reason: string): Promise<Refund | null> {
    const result = await moltbookClient.request<Refund>('/refunds', {
      method: 'POST',
      body: JSON.stringify({ paymentId, amount, reason }),
    });
    return result.data ?? null;
  }
  async get(refundId: string): Promise<Refund | null> {
    const result = await moltbookClient.request<Refund>(`/refunds/${refundId}`);
    return result.data ?? null;
  }
  async listByPayment(paymentId: string): Promise<Refund[]> {
    const result = await moltbookClient.request<Refund[]>(`/refunds?paymentId=${paymentId}`);
    return result.data ?? [];
  }
}
export const moltbookRefund = new MoltbookRefund();
