import { moltbookClient } from './moltbook-client';
interface Notification {
  id: string;
  type: 'payment' | 'refund' | 'subscription' | 'alert';
  channel: 'email' | 'webhook' | 'push';
  recipient: string;
  subject: string;
  body: string;
  sentAt?: number;
  status: 'pending' | 'sent' | 'failed';
}
export class MoltbookNotification {
  async send(notification: Omit<Notification, 'id' | 'sentAt' | 'status'>): Promise<Notification | null> {
    const result = await moltbookClient.request<Notification>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    });
    return result.data ?? null;
  }
  async getStatus(notificationId: string): Promise<Notification | null> {
    const result = await moltbookClient.request<Notification>(`/notifications/${notificationId}`);
    return result.data ?? null;
  }
  async resend(notificationId: string): Promise<boolean> {
    const result = await moltbookClient.request(`/notifications/${notificationId}/resend`, { method: 'POST' });
    return result.success;
  }
}
export const moltbookNotification = new MoltbookNotification();
