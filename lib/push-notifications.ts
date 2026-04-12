'use client';

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushNotification {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: Record<string, any>;
  actions?: { action: string; title: string }[];
}

const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

export async function subscribeToPush(): Promise<PushSubscription | null> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.warn('Push notifications not supported');
    return null;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.warn('Notification permission denied');
      return null;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY) as unknown as BufferSource,
    });

    return subscription.toJSON() as unknown as PushSubscription;
  } catch (error) {
    console.error('Error subscribing to push:', error);
    return null;
  }
}

export async function unsubscribeFromPush(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
    return true;
  } catch (error) {
    console.error('Error unsubscribing from push:', error);
    return false;
  }
}

export async function sendPushNotification(notification: PushNotification): Promise<void> {
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.ready;
  
await registration.showNotification(notification.title, {
  body: notification.body,
  icon: notification.icon || '/icon-192.png',
  badge: notification.badge || '/badge-72.png',
  tag: notification.tag,
  data: notification.data,
  vibrate: [200, 100, 200],
  requireInteraction: true,
 } as NotificationOptions);
}

export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export async function isPushSupported(): Promise<boolean> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return false;
  }
  const permission = await Notification.permission;
  return permission === 'granted';
}

export function onNotificationClick(callback: (event: Event) => void): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('notificationclick', callback as any);
  }
}

export const NOTIFICATION_TYPES = {
  PROJECT_UPDATE: 'project_update',
  NEW_MESSAGE: 'new_message',
  PAYMENT_RECEIVED: 'payment_received',
  WARRANTY_EXPIRING: 'warranty_expiring',
  TASK_ASSIGNED: 'task_assigned',
  PROPOSAL_RECEIVED: 'proposal_received',
};

export function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    [NOTIFICATION_TYPES.PROJECT_UPDATE]: '/icons/project.png',
    [NOTIFICATION_TYPES.NEW_MESSAGE]: '/icons/message.png',
    [NOTIFICATION_TYPES.PAYMENT_RECEIVED]: '/icons/payment.png',
    [NOTIFICATION_TYPES.WARRANTY_EXPIRING]: '/icons/warning.png',
    [NOTIFICATION_TYPES.TASK_ASSIGNED]: '/icons/task.png',
    [NOTIFICATION_TYPES.PROPOSAL_RECEIVED]: '/icons/proposal.png',
  };
  return icons[type] || '/icon-192.png';
}