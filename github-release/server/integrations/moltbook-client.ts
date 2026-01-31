interface MoltbookConfig {
  apiKey: string;
  baseUrl: string;
  timeout: number;
}
interface MoltbookResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
export class MoltbookClient {
  private config: MoltbookConfig;
  constructor(config: Partial<MoltbookConfig> = {}) {
    this.config = {
      apiKey: config.apiKey ?? '',
      baseUrl: config.baseUrl ?? 'https://api.moltbook.com/v1',
      timeout: config.timeout ?? 30000,
    };
  }
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<MoltbookResponse<T>> {
    const response = await fetch(`${this.config.baseUrl}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.config.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    const data = await response.json();
    return { success: response.ok, data: response.ok ? data : undefined, error: response.ok ? undefined : data.message };
  }
}
export const moltbookClient = new MoltbookClient();
