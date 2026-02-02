import { moltbookClient } from './moltbook-client';
interface Coupon {
  id: string;
  code: string;
  percentOff?: number;
  amountOff?: number;
  currency?: string;
  duration: 'once' | 'repeating' | 'forever';
  durationMonths?: number;
  maxRedemptions?: number;
  timesRedeemed: number;
  valid: boolean;
}
export class MoltbookCoupon {
  async create(coupon: Omit<Coupon, 'id' | 'timesRedeemed' | 'valid'>): Promise<Coupon | null> {
    const result = await moltbookClient.request<Coupon>('/coupons', {
      method: 'POST',
      body: JSON.stringify({ ...coupon, timesRedeemed: 0, valid: true }),
    });
    return result.data ?? null;
  }
  async get(couponId: string): Promise<Coupon | null> {
    const result = await moltbookClient.request<Coupon>(`/coupons/${couponId}`);
    return result.data ?? null;
  }
  async redeem(code: string): Promise<Coupon | null> {
    const result = await moltbookClient.request<Coupon>(`/coupons/redeem/${code}`, { method: 'POST' });
    return result.data ?? null;
  }
  async invalidate(couponId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/coupons/${couponId}`, { method: 'DELETE' });
    return result.success;
  }
}
export const moltbookCoupon = new MoltbookCoupon();
