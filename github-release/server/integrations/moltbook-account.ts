import { moltbookClient } from './moltbook-client';
interface MoltbookAccount {
  id: string;
  wallet: string;
  balance: number;
  currency: string;
  createdAt: number;
}
interface AccountStats {
  totalTransactions: number;
  totalVolume: number;
  successRate: number;
}
export class MoltbookAccountManager {
  async getAccount(wallet: string): Promise<MoltbookAccount | null> {
    const result = await moltbookClient.request<MoltbookAccount>(`/accounts/${wallet}`);
    return result.data ?? null;
  }
  async getStats(wallet: string): Promise<AccountStats | null> {
    const result = await moltbookClient.request<AccountStats>(`/accounts/${wallet}/stats`);
    return result.data ?? null;
  }
  async linkWallet(wallet: string, signature: string): Promise<boolean> {
    const result = await moltbookClient.request('/accounts/link', {
      method: 'POST',
      body: JSON.stringify({ wallet, signature }),
    });
    return result.success;
  }
}
export const moltbookAccount = new MoltbookAccountManager();
