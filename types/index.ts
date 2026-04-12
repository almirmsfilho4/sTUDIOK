export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'client';
  createdAt: Date;
  updatedAt?: Date;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: 'pending' | 'in_progress' | 'review' | 'completed' | 'cancelled' | 'pending_payment';
  progress: number;
  price: number;
  paidAmount: number;
  deadline?: Date;
  features: string[];
  timeline: Array<{
    phase: string;
    description: string;
    completed: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  paymentId?: string;
  paymentStatus?: string;
  paymentDate?: Date;
}

export interface Quote {
  id: string;
  user_id?: string;
  project_type: string;
  features: string[];
  complexity: string;
  deadline: string;
  price: number;
  estimatedDays: number;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  type: 'text' | 'file' | 'system';
  read: boolean;
  createdAt: Date;
}

export interface File {
  id: string;
  project_id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: string;
  createdAt: Date;
}