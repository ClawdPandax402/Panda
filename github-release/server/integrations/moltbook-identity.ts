import { moltbookClient } from './moltbook-client';
interface Identity {
  id: string;
  wallet: string;
  verified: boolean;
  verificationLevel: 'none' | 'basic' | 'enhanced' | 'full';
  verifiedAt?: number;
}
interface VerificationSession {
  id: string;
  url: string;
  status: 'pending' | 'processing' | 'verified' | 'failed';
  expiresAt: number;
}
export class MoltbookIdentity {
  async getIdentity(wallet: string): Promise<Identity | null> {
    const result = await moltbookClient.request<Identity>(`/identity/${wallet}`);
    return result.data ?? null;
  }
  async createVerificationSession(wallet: string, level: Identity['verificationLevel']): Promise<VerificationSession | null> {
    const result = await moltbookClient.request<VerificationSession>('/identity/verify', {
      method: 'POST',
      body: JSON.stringify({ wallet, level }),
    });
    return result.data ?? null;
  }
  async getSessionStatus(sessionId: string): Promise<VerificationSession | null> {
    const result = await moltbookClient.request<VerificationSession>(`/identity/sessions/${sessionId}`);
    return result.data ?? null;
  }
  async isVerified(wallet: string, minLevel: Identity['verificationLevel'] = 'basic'): Promise<boolean> {
    const identity = await this.getIdentity(wallet);
    const levels = ['none', 'basic', 'enhanced', 'full'];
    return identity ? levels.indexOf(identity.verificationLevel) >= levels.indexOf(minLevel) : false;
  }
}
export const moltbookIdentity = new MoltbookIdentity();
