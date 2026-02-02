import { moltbookClient } from './moltbook-client';
interface Transfer {
  id: string;
  from: string;
  to: string;
  amount: number;
  currency: string;
  memo?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: number;
}
export class MoltbookTransfer {
  async create(from: string, to: string, amount: number, memo?: string): Promise<Transfer | null> {
    const result = await moltbookClient.request<Transfer>('/transfers', {
      method: 'POST',
      body: JSON.stringify({ from, to, amount, memo }),
    });
    return result.data ?? null;
  }
  async get(transferId: string): Promise<Transfer | null> {
    const result = await moltbookClient.request<Transfer>(`/transfers/${transferId}`);
    return result.data ?? null;
  }
  async reverse(transferId: string, reason: string): Promise<Transfer | null> {
    const result = await moltbookClient.request<Transfer>(`/transfers/${transferId}/reverse`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
    return result.data ?? null;
  }
  async listByMerchant(merchantId: string): Promise<Transfer[]> {
    const result = await moltbookClient.request<Transfer[]>(`/transfers?merchantId=${merchantId}`);
    return result.data ?? [];
  }
}
export const moltbookTransfer = new MoltbookTransfer();
