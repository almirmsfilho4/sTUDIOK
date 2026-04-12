import { collection, addDoc, updateDoc, doc, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface SupportTicket {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  subject: string;
  description: string;
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  assignedTo?: string;
  assignedToEmail?: string;
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
  messages: TicketMessage[];
}

export interface TicketMessage {
  id?: string;
  userId: string;
  userEmail: string;
  userName: string;
  content: string;
  isInternal: boolean;
  createdAt: Date;
  attachments?: TicketAttachment[];
}

export interface TicketAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

export class SupportService {
  private static readonly COLLECTION = 'support_tickets';

  static async createTicket(ticketData: Omit<SupportTicket, 'id' | 'createdAt' | 'updatedAt' | 'messages'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, this.COLLECTION), {
        ...ticketData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        messages: []
      });

      console.log('✅ Ticket created:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('❌ Error creating ticket:', error);
      throw new Error('Failed to create support ticket');
    }
  }

  static async addMessage(ticketId: string, message: Omit<TicketMessage, 'id' | 'createdAt'>): Promise<void> {
    try {
      const ticketRef = doc(db, this.COLLECTION, ticketId);
      const ticket = await this.getTicket(ticketId);
      
      if (!ticket) {
        throw new Error('Ticket not found');
      }

      const newMessage = {
        ...message,
        createdAt: Timestamp.now()
      };

      await updateDoc(ticketRef, {
        messages: [...ticket.messages, newMessage],
        updatedAt: Timestamp.now(),
        status: message.isInternal ? ticket.status : 'open'
      });

      console.log('✅ Message added to ticket:', ticketId);
    } catch (error) {
      console.error('❌ Error adding message:', error);
      throw new Error('Failed to add message to ticket');
    }
  }

  static async updateTicketStatus(ticketId: string, status: SupportTicket['status'], assignedTo?: string): Promise<void> {
    try {
      const ticketRef = doc(db, this.COLLECTION, ticketId);
      
      await updateDoc(ticketRef, {
        status,
        ...(assignedTo && { assignedTo }),
        updatedAt: Timestamp.now(),
        ...(status === 'resolved' && { resolvedAt: Timestamp.now() })
      });

      console.log('✅ Ticket status updated:', ticketId, status);
    } catch (error) {
      console.error('❌ Error updating ticket status:', error);
      throw new Error('Failed to update ticket status');
    }
  }

  static async getTicket(ticketId: string): Promise<SupportTicket | null> {
    try {
      // Implementar busca específica por ticket
      return null;
    } catch (error) {
      console.error('❌ Error getting ticket:', error);
      return null;
    }
  }

  static async getUserTickets(userId: string): Promise<SupportTicket[]> {
    try {
      const q = query(
        collection(db, this.COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        resolvedAt: doc.data().resolvedAt?.toDate()
      })) as SupportTicket[];
    } catch (error) {
      console.error('❌ Error getting user tickets:', error);
      return [];
    }
  }

  static async getAllTickets(filters?: {
    status?: string;
    priority?: string;
    category?: string;
  }): Promise<SupportTicket[]> {
    try {
      let q = query(collection(db, this.COLLECTION), orderBy('createdAt', 'desc'));

      if (filters?.status) {
        q = query(q, where('status', '==', filters.status));
      }

      if (filters?.priority) {
        q = query(q, where('priority', '==', filters.priority));
      }

      if (filters?.category) {
        q = query(q, where('category', '==', filters.category));
      }

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
        resolvedAt: doc.data().resolvedAt?.toDate()
      })) as SupportTicket[];
    } catch (error) {
      console.error('❌ Error getting all tickets:', error);
      return [];
    }
  }

  static async assignTicket(ticketId: string, assignedTo: string, assignedToEmail: string): Promise<void> {
    try {
      const ticketRef = doc(db, this.COLLECTION, ticketId);
      
      await updateDoc(ticketRef, {
        assignedTo,
        assignedToEmail,
        updatedAt: Timestamp.now(),
        status: 'pending'
      });

      console.log('✅ Ticket assigned:', ticketId, 'to', assignedTo);
    } catch (error) {
      console.error('❌ Error assigning ticket:', error);
      throw new Error('Failed to assign ticket');
    }
  }

  static async getStats(): Promise<{
    total: number;
    open: number;
    pending: number;
    resolved: number;
    closed: number;
    averageResolutionTime: number;
  }> {
    try {
      const tickets = await this.getAllTickets();
      
      const now = new Date();
      const resolvedTickets = tickets.filter(t => t.status === 'resolved' && t.resolvedAt);
      
      const totalResolutionTime = resolvedTickets.reduce((total, ticket) => {
        if (ticket.createdAt && ticket.resolvedAt) {
          return total + (ticket.resolvedAt.getTime() - ticket.createdAt.getTime());
        }
        return total;
      }, 0);

      const averageResolutionTime = resolvedTickets.length > 0 
        ? totalResolutionTime / resolvedTickets.length / (1000 * 60 * 60) // horas
        : 0;

      return {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        pending: tickets.filter(t => t.status === 'pending').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        averageResolutionTime: Math.round(averageResolutionTime)
      };
    } catch (error) {
      console.error('❌ Error getting support stats:', error);
      return {
        total: 0,
        open: 0,
        pending: 0,
        resolved: 0,
        closed: 0,
        averageResolutionTime: 0
      };
    }
  }
}

// Categorias pré-definidas
export const TICKET_CATEGORIES = [
  'technical_issue',
  'billing',
  'account',
  'feature_request',
  'bug_report',
  'general_inquiry',
  'urgent_support'
];

export const CATEGORY_LABELS: Record<string, string> = {
  technical_issue: 'Problema Técnico',
  billing: 'Cobrança/Faturamento',
  account: 'Conta/Login',
  feature_request: 'Sugestão de Funcionalidade',
  bug_report: 'Reportar Bug',
  general_inquiry: 'Dúvida Geral',
  urgent_support: 'Suporte Urgente'
};

export const PRIORITY_LABELS: Record<string, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
  urgent: 'Urgente'
};