import { moltbookClient } from './moltbook-client';
interface TaxCalculation {
  subtotal: number;
  taxAmount: number;
  total: number;
  taxRate: number;
  jurisdiction: string;
}
interface TaxSettings {
  enabled: boolean;
  inclusivePricing: boolean;
  defaultRate: number;
  exemptProducts: string[];
}
export class MoltbookTax {
  async calculate(amount: number, jurisdiction: string): Promise<TaxCalculation | null> {
    const result = await moltbookClient.request<TaxCalculation>('/tax/calculate', {
      method: 'POST',
      body: JSON.stringify({ amount, jurisdiction }),
    });
    return result.data ?? null;
  }
  async getSettings(merchantId: string): Promise<TaxSettings | null> {
    const result = await moltbookClient.request<TaxSettings>(`/tax/settings/${merchantId}`);
    return result.data ?? null;
  }
  async updateSettings(merchantId: string, settings: Partial<TaxSettings>): Promise<boolean> {
    const result = await moltbookClient.request(`/tax/settings/${merchantId}`, {
      method: 'PATCH',
      body: JSON.stringify(settings),
    });
    return result.success;
  }
}
export const moltbookTax = new MoltbookTax();
