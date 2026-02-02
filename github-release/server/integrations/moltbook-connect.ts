import { moltbookClient } from './moltbook-client';
interface ConnectedAccount {
  id: string;
  wallet: string;
  type: 'standard' | 'express' | 'custom';
  payoutsEnabled: boolean;
  chargesEnabled: boolean;
  createdAt: number;
}
export class MoltbookConnect {
  async createAccount(wallet: string, type: ConnectedAccount['type'] = 'express'): Promise<ConnectedAccount | null> {
    const result = await moltbookClient.request<ConnectedAccount>('/connect/accounts', {
      method: 'POST',
      body: JSON.stringify({ wallet, type }),
    });
    return result.data ?? null;
  }
  async getAccount(accountId: string): Promise<ConnectedAccount | null> {
    const result = await moltbookClient.request<ConnectedAccount>(`/connect/accounts/${accountId}`);
    return result.data ?? null;
  }
  async createLoginLink(accountId: string): Promise<string | null> {
    const result = await moltbookClient.request<{ url: string }>(`/connect/accounts/${accountId}/login-link`, { method: 'POST' });
    return result.data?.url ?? null;
  }
  async deleteAccount(accountId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/connect/accounts/${accountId}`, { method: 'DELETE' });
    return result.success;
  }
}
export const moltbookConnect = new MoltbookConnect();
