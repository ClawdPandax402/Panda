import { moltbookClient } from './moltbook-client';
interface Customer {
  id: string;
  wallet: string;
  email?: string;
  metadata: Record<string, string>;
  createdAt: number;
  totalSpent: number;
}
export class MoltbookCustomer {
  async create(wallet: string, metadata: Record<string, string> = {}): Promise<Customer | null> {
    const result = await moltbookClient.request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify({ wallet, metadata }),
    });
    return result.data ?? null;
  }
  async getByWallet(wallet: string): Promise<Customer | null> {
    const result = await moltbookClient.request<Customer>(`/customers/wallet/${wallet}`);
    return result.data ?? null;
  }
  async update(customerId: string, updates: Partial<Customer>): Promise<boolean> {
    const result = await moltbookClient.request(`/customers/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return result.success;
  }
  async getPaymentHistory(customerId: string): Promise<{ id: string; amount: number; date: number }[]> {
    const result = await moltbookClient.request<{ id: string; amount: number; date: number }[]>(`/customers/${customerId}/payments`);
    return result.data ?? [];
  }
}
export const moltbookCustomer = new MoltbookCustomer();
