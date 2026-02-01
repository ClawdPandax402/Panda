import { moltbookClient } from './moltbook-client';
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  active: boolean;
  metadata: Record<string, string>;
}
export class MoltbookProduct {
  async create(product: Omit<Product, 'id'>): Promise<Product | null> {
    const result = await moltbookClient.request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
    return result.data ?? null;
  }
  async update(productId: string, updates: Partial<Product>): Promise<Product | null> {
    const result = await moltbookClient.request<Product>(`/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return result.data ?? null;
  }
  async archive(productId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/products/${productId}`, {
      method: 'PATCH',
      body: JSON.stringify({ active: false }),
    });
    return result.success;
  }
  async list(): Promise<Product[]> {
    const result = await moltbookClient.request<Product[]>('/products');
    return result.data ?? [];
  }
}
export const moltbookProduct = new MoltbookProduct();
