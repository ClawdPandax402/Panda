import { moltbookClient } from './moltbook-client';
interface Balance {
  available: number;
  pending: number;
  reserved: number;
  currency: string;
}
interface BalanceTransaction {
  id: string;
  type: 'credit' | 'debit' | 'reserve' | 'release';
  amount: number;
  description: string;
  createdAt: number;
}
export class MoltbookBalance {
  async get(merchantId: string): Promise<Balance | null> {
    const result = await moltbookClient.request<Balance>(`/balance/${merchantId}`);
    return result.data ?? null;
  }
  async getTransactions(merchantId: string, limit: number = 50): Promise<BalanceTransaction[]> {
    const result = await moltbookClient.request<BalanceTransaction[]>(`/balance/${merchantId}/transactions?limit=${limit}`);
    return result.data ?? [];
  }
  async reserve(merchantId: string, amount: number, reason: string): Promise<boolean> {
    const result = await moltbookClient.request(`/balance/${merchantId}/reserve`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });
    return result.success;
  }
  async release(merchantId: string, amount: number): Promise<boolean> {
    const result = await moltbookClient.request(`/balance/${merchantId}/release`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
    return result.success;
  }
}
export const moltbookBalance = new MoltbookBalance();
