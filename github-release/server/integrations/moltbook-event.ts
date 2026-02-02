import { moltbookClient } from './moltbook-client';
interface Event {
  id: string;
  type: string;
  data: Record<string, unknown>;
  createdAt: number;
  processed: boolean;
}
interface EventSubscription {
  id: string;
  eventTypes: string[];
  webhookUrl: string;
  active: boolean;
}
export class MoltbookEvent {
  async list(limit: number = 100): Promise<Event[]> {
    const result = await moltbookClient.request<Event[]>(`/events?limit=${limit}`);
    return result.data ?? [];
  }
  async get(eventId: string): Promise<Event | null> {
    const result = await moltbookClient.request<Event>(`/events/${eventId}`);
    return result.data ?? null;
  }
  async subscribe(eventTypes: string[], webhookUrl: string): Promise<EventSubscription | null> {
    const result = await moltbookClient.request<EventSubscription>('/events/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ eventTypes, webhookUrl }),
    });
    return result.data ?? null;
  }
  async unsubscribe(subscriptionId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/events/subscriptions/${subscriptionId}`, { method: 'DELETE' });
    return result.success;
  }
  async replay(eventId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/events/${eventId}/replay`, { method: 'POST' });
    return result.success;
  }
}
export const moltbookEvent = new MoltbookEvent();
