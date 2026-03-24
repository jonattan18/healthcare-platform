import { create } from 'zustand';
import type { Notification } from '../types';

interface NotificationState {
  notifications: Notification[];
  permission: NotificationPermission;
  addNotification: (n: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  requestPermission: () => Promise<void>;
  sendBrowserNotification: (title: string, body: string) => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [
    {
      id: '1',
      title: 'Critical Alert',
      message: 'Patient Michael Rodriguez requires immediate attention — vitals declining.',
      type: 'error',
      read: false,
      timestamp: Date.now() - 300_000,
    },
    {
      id: '2',
      title: 'Lab Results Ready',
      message: 'Lab results for Sarah Johnson (P-1001) are now available.',
      type: 'info',
      read: false,
      timestamp: Date.now() - 1_800_000,
    },
    {
      id: '3',
      title: 'Patient Discharged',
      message: 'Marcus Williams has been successfully discharged.',
      type: 'success',
      read: true,
      timestamp: Date.now() - 7_200_000,
    },
  ],
  permission: typeof Notification !== 'undefined' ? Notification.permission : 'default',

  addNotification: (n) =>
    set((state) => ({
      notifications: [
        {
          ...n,
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          read: false,
        },
        ...state.notifications,
      ],
    })),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),

  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),

  requestPermission: async () => {
    if (typeof Notification === 'undefined') return;
    const permission = await Notification.requestPermission();
    set({ permission });
  },

  sendBrowserNotification: (title, body) => {
    const { permission, addNotification } = get();
    addNotification({ title, message: body, type: 'info' });

    if (permission === 'granted' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.showNotification(title, {
          body,
          icon: '/favicon.svg',
          badge: '/favicon.svg',
        });
      });
    }
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
