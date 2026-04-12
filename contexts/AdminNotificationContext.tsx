'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { emailService } from '@/lib/email-service';

export interface AdminNotification {
  id: string;
  type: 'new_user' | 'new_project' | 'new_payment';
  data: any;
  timestamp: Date;
  status: 'sent' | 'error';
}

interface AdminNotificationContextType {
  notifyAdmin: (type: 'new_user' | 'new_project' | 'new_payment', data: any) => Promise<void>;
  notifications: AdminNotification[];
  clearNotifications: () => void;
}

const AdminNotificationContext = createContext<AdminNotificationContextType | undefined>(undefined);

export function AdminNotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);

  const notifyAdmin = async (type: 'new_user' | 'new_project' | 'new_payment', data: any) => {
    try {
      const success = await emailService.sendAdminNotification(type, data);
      
      if (success) {
        setNotifications(prev => [...prev, {
          id: Date.now().toString(),
          type,
          data,
          timestamp: new Date(),
          status: 'sent'
        }]);
      }
    } catch (error) {
      console.error('Erro ao enviar notificação:', error);
      setNotifications(prev => [...prev, {
        id: Date.now().toString(),
        type,
        data,
        timestamp: new Date(),
        status: 'error'
      }]);
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <AdminNotificationContext.Provider value={{ notifyAdmin, notifications, clearNotifications }}>
      {children}
    </AdminNotificationContext.Provider>
  );
}

export function useAdminNotifications() {
  const context = useContext(AdminNotificationContext);
  if (context === undefined) {
    throw new Error('useAdminNotifications must be used within a AdminNotificationProvider');
  }
  return context;
}