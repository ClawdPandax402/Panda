interface WebhookEvent {
  type: 'payment.verified' | 'access.granted' | 'access.expired';
  payload: Record<string, unknown>;
  timestamp: number;
}
export class WebhookDispatcher {
  private endpoints: Map<string, string[]> = new Map();
  register(eventType: string, url: string): void {
    const urls = this.endpoints.get(eventType) ?? [];
    urls.push(url);
    this.endpoints.set(eventType, urls);
  }
  async dispatch(event: WebhookEvent): Promise<void> {
    const urls = this.endpoints.get(event.type) ?? [];
    await Promise.allSettled(urls.map(url => 
      fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
      })
    ));
  }
}
export const webhookDispatcher = new WebhookDispatcher();
