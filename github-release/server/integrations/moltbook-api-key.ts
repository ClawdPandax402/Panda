import { moltbookClient } from './moltbook-client';
interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  scopes: string[];
  createdAt: number;
  lastUsed?: number;
  expiresAt?: number;
}
export class MoltbookApiKey {
  async create(name: string, scopes: string[], expiresIn?: number): Promise<{ key: ApiKey; secret: string } | null> {
    const result = await moltbookClient.request<{ key: ApiKey; secret: string }>('/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name, scopes, expiresAt: expiresIn ? Date.now() + expiresIn : undefined }),
    });
    return result.data ?? null;
  }
  async list(): Promise<ApiKey[]> {
    const result = await moltbookClient.request<ApiKey[]>('/api-keys');
    return result.data ?? [];
  }
  async revoke(keyId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/api-keys/${keyId}`, { method: 'DELETE' });
    return result.success;
  }
  async rotate(keyId: string): Promise<{ secret: string } | null> {
    const result = await moltbookClient.request<{ secret: string }>(`/api-keys/${keyId}/rotate`, { method: 'POST' });
    return result.data ?? null;
  }
}
export const moltbookApiKey = new MoltbookApiKey();
