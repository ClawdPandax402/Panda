import { moltbookClient } from './moltbook-client';
interface Merchant {
  id: string;
  name: string;
  wallet: string;
  verified: boolean;
  tier: 'starter' | 'growth' | 'enterprise';
  createdAt: number;
}
interface MerchantSettings {
  webhookUrl: string;
  notifyEmail: string;
  autoWithdraw: boolean;
  withdrawThreshold: number;
}
export class MoltbookMerchant {
  async register(name: string, wallet: string): Promise<Merchant | null> {
    const result = await moltbookClient.request<Merchant>('/merchants', {
      method: 'POST',
      body: JSON.stringify({ name, wallet }),
    });
    return result.data ?? null;
  }
  async getProfile(merchantId: string): Promise<Merchant | null> {
    const result = await moltbookClient.request<Merchant>(`/merchants/${merchantId}`);
    return result.data ?? null;
  }
  async updateSettings(merchantId: string, settings: Partial<MerchantSettings>): Promise<boolean> {
    const result = await moltbookClient.request(`/merchants/${merchantId}/settings`, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
    return result.success;
  }
  async verify(merchantId: string, documents: string[]): Promise<boolean> {
    const result = await moltbookClient.request(`/merchants/${merchantId}/verify`, {
      method: 'POST',
      body: JSON.stringify({ documents }),
    });
    return result.success;
  }
}
export const moltbookMerchant = new MoltbookMerchant();
