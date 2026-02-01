import { moltbookClient } from './moltbook-client';
import { moltbookMerchant } from './moltbook-merchant';
import { moltbookPayment } from './moltbook-payment';
import { moltbookCheckout } from './moltbook-checkout';
import { moltbookSubscription } from './moltbook-subscription';
interface PlatformStatus {
  operational: boolean;
  services: { name: string; status: 'up' | 'degraded' | 'down' }[];
  lastUpdated: number;
}
export class MoltbookPlatform {
  readonly merchant = moltbookMerchant;
  readonly payment = moltbookPayment;
  readonly checkout = moltbookCheckout;
  readonly subscription = moltbookSubscription;
  async getStatus(): Promise<PlatformStatus | null> {
    const result = await moltbookClient.request<PlatformStatus>('/status');
    return result.data ?? null;
  }
  async healthCheck(): Promise<boolean> {
    const status = await this.getStatus();
    return status?.operational ?? false;
  }
  async getApiVersion(): Promise<string> {
    const result = await moltbookClient.request<{ version: string }>('/version');
    return result.data?.version ?? 'unknown';
  }
}
export const moltbookPlatform = new MoltbookPlatform();
