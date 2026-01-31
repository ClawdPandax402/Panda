import { moltbookClient } from './moltbook-client';
interface Invoice {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  memo: string;
  expiresAt: number;
  paymentUrl: string;
  status: 'pending' | 'paid' | 'expired';
}
export class MoltbookInvoice {
  async create(amount: number, recipient: string, memo: string = '', expiresIn: number = 3600000): Promise<Invoice | null> {
    const result = await moltbookClient.request<Invoice>('/invoices', {
      method: 'POST',
      body: JSON.stringify({ amount, recipient, memo, expiresAt: Date.now() + expiresIn }),
    });
    return result.data ?? null;
  }
  async get(invoiceId: string): Promise<Invoice | null> {
    const result = await moltbookClient.request<Invoice>(`/invoices/${invoiceId}`);
    return result.data ?? null;
  }
  async void(invoiceId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/invoices/${invoiceId}/void`, { method: 'POST' });
    return result.success;
  }
}
export const moltbookInvoice = new MoltbookInvoice();
