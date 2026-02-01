import { moltbookClient } from './moltbook-client';
interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  maxUses: number;
  usedCount: number;
  expiresAt?: number;
  active: boolean;
}
export class MoltbookDiscount {
  async create(discount: Omit<Discount, 'id' | 'usedCount'>): Promise<Discount | null> {
    const result = await moltbookClient.request<Discount>('/discounts', {
      method: 'POST',
      body: JSON.stringify({ ...discount, usedCount: 0 }),
    });
    return result.data ?? null;
  }
  async validate(code: string): Promise<{ valid: boolean; discount?: Discount }> {
    const result = await moltbookClient.request<Discount>(`/discounts/validate/${code}`);
    if (result.data && result.data.active && result.data.usedCount < result.data.maxUses) {
      return { valid: true, discount: result.data };
    }
    return { valid: false };
  }
  async apply(code: string, amount: number): Promise<number> {
    const { valid, discount } = await this.validate(code);
    if (!valid || !discount) return amount;
    return discount.type === 'percentage' ? amount * (1 - discount.value / 100) : Math.max(0, amount - discount.value);
  }
  async deactivate(discountId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/discounts/${discountId}`, {
      method: 'PATCH',
      body: JSON.stringify({ active: false }),
    });
    return result.success;
  }
}
export const moltbookDiscount = new MoltbookDiscount();
