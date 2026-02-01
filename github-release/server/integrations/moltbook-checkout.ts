import { moltbookClient } from './moltbook-client';
interface CheckoutSession {
  id: string;
  url: string;
  amount: number;
  currency: string;
  items: CheckoutItem[];
  expiresAt: number;
  status: 'pending' | 'completed' | 'expired';
}
interface CheckoutItem {
  name: string;
  quantity: number;
  price: number;
}
export class MoltbookCheckout {
  async createSession(items: CheckoutItem[], successUrl: string, cancelUrl: string): Promise<CheckoutSession | null> {
    const amount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const result = await moltbookClient.request<CheckoutSession>('/checkout/sessions', {
      method: 'POST',
      body: JSON.stringify({ items, amount, successUrl, cancelUrl }),
    });
    return result.data ?? null;
  }
  async getSession(sessionId: string): Promise<CheckoutSession | null> {
    const result = await moltbookClient.request<CheckoutSession>(`/checkout/sessions/${sessionId}`);
    return result.data ?? null;
  }
  async expire(sessionId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/checkout/sessions/${sessionId}/expire`, { method: 'POST' });
    return result.success;
  }
}
export const moltbookCheckout = new MoltbookCheckout();
