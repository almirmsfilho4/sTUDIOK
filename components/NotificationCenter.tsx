'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument } from '@/lib/firebase-services';

interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  link?: string;
}

export function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPanel, setShowPanel] = useState(false);

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  const loadNotifications = async () => {
    try {
      const data = await getDocuments('notifications');
      const userNotifications = (data as any[])
        .filter(n => n.userId === user?.uid)
        .sort((a, b) => {
          const dateA = a.createdAt?.toDate?.() || new Date(0);
          const dateB = b.createdAt?.toDate?.() || new Date(0);
          return dateB.getTime() - dateA.getTime();
        });
      setNotifications(userNotifications.slice(0, 20));
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await import('@/lib/firebase-services').then(m => 
        m.updateDocument('notifications', id, { read: true })
      );
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    for (const notification of notifications.filter(n => !n.read)) {
      await markAsRead(notification.id);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-500/10 border-green-500/30 text-green-500';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500';
      case 'error': return 'bg-red-500/10 border-red-500/30 text-red-500';
      default: return 'bg-[#00D44FF]/10 border-[#00D4FF]/30 text-[#00D4FF]';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success': return '✓';
      case 'warning': return '⚠';
      case 'error': return '✕';
      default: return 'ℹ';
    }
  };

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-gray-400 hover:text-white transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Panel */}
      {showPanel && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />
          <div className="absolute right-0 mt-2 w-96 max-h-[500px] bg-[#0A0A0A] border border-[#1A1A1A] rounded-xl shadow-2xl z-50 overflow-hidden">
            <div className="p-4 border-b border-[#1A1A1A] flex items-center justify-between">
              <h3 className="font-bold">Notificações</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#00D4FF] hover:underline"
                >
                  Marcar todas como lida
                </button>
              )}
            </div>

            <div className="overflow-y-auto max-h-96">
              {loading ? (
                <div className="p-8 text-center text-gray-500">
                  Carregando...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  Nenhuma notificação
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={`p-4 border-b border-[#1A1A1A] cursor-pointer hover:bg-[#1A1A1A]/50 transition-colors ${
                      !notification.read ? 'bg-[#00D4FF]/5' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 ${getTypeStyles(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{notification.title}</p>
                        <p className="text-gray-400 text-sm truncate">{notification.message}</p>
<p className="text-gray-500 text-xs mt-1">
 {notification.createdAt instanceof Date ? notification.createdAt.toLocaleDateString('pt-BR') : 'Agora'}
 </p>
                      </div>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-[#00D4FF] rounded-full shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export async function sendNotification(
  userId: string,
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info',
  link?: string
) {
  try {
    await createDocument('notifications', {
      userId,
      title,
      message,
      type,
      read: false,
      createdAt: new Date(),
      link,
    });
  } catch (error) {
    console.error('Error sending notification:', error);
  }
}

export async function sendBulkNotification(
  userIds: string[],
  title: string,
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
) {
  for (const userId of userIds) {
    await sendNotification(userId, title, message, type);
  }
}