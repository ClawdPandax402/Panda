import { moltbookClient } from './moltbook-client';
import { moltbookPayment } from './moltbook-payment';
import { moltbookCheckout } from './moltbook-checkout';
import { moltbookSubscription } from './moltbook-subscription';
import { moltbookMerchant } from './moltbook-merchant';
import { moltbookCustomer } from './moltbook-customer';
import { moltbookBalance } from './moltbook-balance';
import { moltbookRefund } from './moltbook-refund';
interface MoltbookSDKConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}
export class MoltbookSDK {
  readonly payments = moltbookPayment;
  readonly checkout = moltbookCheckout;
  readonly subscriptions = moltbookSubscription;
  readonly merchants = moltbookMerchant;
  readonly customers = moltbookCustomer;
  readonly balance = moltbookBalance;
  readonly refunds = moltbookRefund;
  constructor(config: MoltbookSDKConfig) {
    Object.assign(moltbookClient, { config });
  }
  async healthCheck(): Promise<boolean> {
    try {
      const result = await moltbookClient.request('/health');
      return result.success;
    } catch {
      return false;
    }
  }
}
export function createMoltbookSDK(config: MoltbookSDKConfig): MoltbookSDK {
  return new MoltbookSDK(config);
}
