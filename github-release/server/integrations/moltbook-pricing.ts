import { moltbookClient } from './moltbook-client';
interface PricingTier {
  id: string;
  name: string;
  unitAmount: number;
  currency: string;
  interval?: 'one_time' | 'daily' | 'weekly' | 'monthly' | 'yearly';
  features: string[];
}
export class MoltbookPricing {
  async createTier(tier: Omit<PricingTier, 'id'>): Promise<PricingTier | null> {
    const result = await moltbookClient.request<PricingTier>('/pricing/tiers', {
      method: 'POST',
      body: JSON.stringify(tier),
    });
    return result.data ?? null;
  }
  async getTier(tierId: string): Promise<PricingTier | null> {
    const result = await moltbookClient.request<PricingTier>(`/pricing/tiers/${tierId}`);
    return result.data ?? null;
  }
  async updateTier(tierId: string, updates: Partial<PricingTier>): Promise<boolean> {
    const result = await moltbookClient.request(`/pricing/tiers/${tierId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return result.success;
  }
  async listTiers(productId: string): Promise<PricingTier[]> {
    const result = await moltbookClient.request<PricingTier[]>(`/pricing/tiers?productId=${productId}`);
    return result.data ?? [];
  }
}
export const moltbookPricing = new MoltbookPricing();
