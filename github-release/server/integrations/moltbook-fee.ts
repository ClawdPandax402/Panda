import { moltbookClient } from './moltbook-client';
interface FeeStructure {
  fixedFee: number;
  percentageFee: number;
  minFee: number;
  maxFee?: number;
  currency: string;
}
interface FeeCalculation {
  amount: number;
  fee: number;
  netAmount: number;
  breakdown: { type: string; amount: number }[];
}
export class MoltbookFee {
  async getStructure(merchantId: string): Promise<FeeStructure | null> {
    const result = await moltbookClient.request<FeeStructure>(`/fees/structure/${merchantId}`);
    return result.data ?? null;
  }
  async calculate(amount: number, merchantId: string): Promise<FeeCalculation | null> {
    const result = await moltbookClient.request<FeeCalculation>('/fees/calculate', {
      method: 'POST',
      body: JSON.stringify({ amount, merchantId }),
    });
    return result.data ?? null;
  }
  calculateLocal(amount: number, structure: FeeStructure): number {
    const percentFee = amount * (structure.percentageFee / 100);
    let totalFee = structure.fixedFee + percentFee;
    totalFee = Math.max(totalFee, structure.minFee);
    if (structure.maxFee) totalFee = Math.min(totalFee, structure.maxFee);
    return totalFee;
  }
}
export const moltbookFee = new MoltbookFee();
