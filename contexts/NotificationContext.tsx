'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/app/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, writeBatch } from 'firebase/firestore';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'project' | 'payment' | 'message';
  title: string;
  message: string;
  duration?: number;
  link?: string;
  read?: boolean;
  createdAt?: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  realtimeNotifications: Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [realtimeNotifications, setRealtimeNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const unreadCount = realtimeNotifications.filter(n => !n.read).length;

  useEffect(() => {
    if (!user) {
      setRealtimeNotifications([]);
      return;
    }

    const q = query(
      collection(db, 'userNotifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Notification[];
      setRealtimeNotifications(notifs);
    });

    return () => unsubscribe();
  }, [user]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      id,
      duration: notification.duration || 5000,
      ...notification
    };

    setNotifications(prev => [...prev, newNotification]);

    if ((newNotification.duration || 0) > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration || 5000);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  }, []);

  const markAsRead = useCallback((id: string) => {
    if (user) {
      const docRef = doc(db, 'userNotifications', id);
      updateDoc(docRef, { read: true });
    }
  }, [user]);

  const markAllAsRead = useCallback(() => {
    if (user && realtimeNotifications.length > 0) {
      const batch = writeBatch(db);
      realtimeNotifications.filter(n => !n.read).forEach(n => {
        batch.update(doc(db, 'userNotifications', n.id), { read: true });
      });
      batch.commit();
    }
  }, [user, realtimeNotifications]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount,
      addNotification, 
      removeNotification,
      markAsRead,
      markAllAsRead,
      realtimeNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}