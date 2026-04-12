'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/app/firebase';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { getProjectDelivery, getWarrantyDaysRemaining, getWarrantyProgress } from '@/lib/warranty-service';
import type { ProjectDelivery } from '@/lib/warranty-service';

interface Project {
  id: string;
  name: string;
  status: string;
  price: number;
  progress?: number;
  user_id?: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: any;
}

interface ReviewItem {
  phase: string;
  description: string;
  status: 'pending' | 'review' | 'approved' | 'rejected';
  completedAt?: Date;
}

const DEFAULT_PHASES: ReviewItem[] = [
  { phase: 'Briefing', description: 'Coleta de requisitos e definição de escopo', status: 'pending' },
  { phase: 'Design', description: 'Criação de protótipos e design visual', status: 'pending' },
  { phase: 'Desenvolvimento', description: 'Programação e implementação', status: 'pending' },
  { phase: 'Revisão', description: 'Testes e ajustes finais', status: 'pending' },
  { phase: 'Entrega', description: 'Publicação e lançamento', status: 'pending' },
];

export default function ProjectDelivery({ projectId, project }: { projectId: string; project?: Project }) {
  const { user } = useAuth();
  const [delivery, setDelivery] = useState<ProjectDelivery | null>(null);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [reviews, setReviews] = useState<ReviewItem[]>(DEFAULT_PHASES);
  const [activeTab, setActiveTab] = useState<'progress' | 'reviews' | 'chat'>('progress');

  useEffect(() => {
    loadDelivery();
    loadMessages();
  }, [projectId]);

  const loadDelivery = async () => {
    try {
      const data = await getProjectDelivery(projectId);
      setDelivery(data);
    } catch (error) {
      console.error('Error loading delivery:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = () => {
    const q = query(
      collection(db, 'projectMessages'),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'asc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as ChatMessage[];
      setMessages(msgs);
    });
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    
    await addDoc(collection(db, 'projectMessages'), {
      projectId,
      senderId: user.uid,
      senderName: user.displayName || user.email?.split('@')[0] || 'Cliente',
      content: newMessage,
      createdAt: serverTimestamp(),
    });
    
    setNewMessage('');
  };

  const handleReviewAction = (phase: string, action: 'approve' | 'reject') => {
    setReviews(prev => prev.map(r => 
      r.phase === phase 
        ? { ...r, status: action === 'approve' ? 'approved' : 'rejected', completedAt: new Date() }
        : r
    ));
  };

  const handlePrint = (type: 'start' | 'delivery') => {
    const content = type === 'start' ? delivery?.startNotes : delivery?.deliveryNotes;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>ESTUDIOK - ${type === 'start' ? 'Início' : 'Entrega'}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #00D4FF; }
            .header { border-bottom: 2px solid #00D4FF; padding-bottom: 20px; margin-bottom: 20px; }
            .content { white-space: pre-wrap; line-height: 1.6; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ESTUDIOK</h1>
            <h2>${type === 'start' ? 'Início do Projeto' : 'Entrega do Projeto'}</h2>
            <h3>${project?.name || delivery?.projectName}</h3>
          </div>
          <div class="content">${content || 'Sem informações.'}</div>
          <div class="footer">
            <p>${new Date().toLocaleString('pt-BR')}</p>
            <p>ESTUDIOK - estudiokgames@gmail.com</p>
          </div>
        </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const daysRemaining = getWarrantyDaysRemaining(delivery?.warrantyEndDate);
  const progress = getWarrantyProgress(delivery?.deliveryDate, delivery?.warrantyEndDate);

  const statusColors: Record<string, string> = {
    in_progress: 'bg-blue-500/20 text-blue-500',
    delivered: 'bg-purple-500/20 text-purple-500',
    warranty_active: 'bg-green-500/20 text-green-500',
    warranty_expired: 'bg-gray-500/20 text-gray-500',
  };

  const statusLabels: Record<string, string> = {
    in_progress: 'Em Andamento',
    delivered: 'Entregue',
    warranty_active: 'Garantia Ativa',
    warranty_expired: 'Garantia Expirada',
  };

  return (
    <div className="space-y-6">
      {/* Header com status */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">Meu Projeto</h3>
        <span className={`px-3 py-1 rounded-full text-sm ${statusColors[delivery?.status || 'in_progress']}`}>
          {statusLabels[delivery?.status || 'in_progress']}
        </span>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[#1A1A1A]">
        {(['progress', 'reviews', 'chat'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 text-sm font-medium transition-colors ${
              activeTab === tab ? 'text-[#00D4FF] border-b-2 border-[#00D4FF]' : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab === 'progress' ? '📊 Progresso' : tab === 'reviews' ? '✅ Revisões' : '💬 Chat'}
          </button>
        ))}
      </div>

      {/* Tab: Progresso */}
      {activeTab === 'progress' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="card p-4">
              <p className="text-sm text-gray-400">Progresso do Projeto</p>
              <p className="text-2xl font-bold text-[#00D4FF]">{project?.progress || 0}%</p>
              <div className="h-2 bg-[#1A1A1A] rounded-full mt-2">
                <div className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF]" style={{ width: `${project?.progress || 0}%` }}></div>
              </div>
            </div>
            {delivery?.deliveryDate && (
              <div className="card p-4">
                <p className="text-sm text-gray-400">Data de Entrega</p>
                <p className="text-lg font-semibold text-green-500">
                  {delivery.deliveryDate.toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
            {delivery?.warrantyEndDate && delivery.status === 'warranty_active' && (
              <div className="card p-4">
                <p className="text-sm text-gray-400">Dias de Garantia</p>
                <p className="text-2xl font-bold text-[#00D4FF]">{daysRemaining}</p>
              </div>
            )}
          </div>

          {delivery?.status === 'warranty_expired' && (
            <div className="card p-6 bg-red-500/10 border border-red-500/20">
              <h4 className="font-bold text-red-500 mb-2">⚠️ Garantia Expirada</h4>
              <p className="text-sm text-gray-400">Entre em contato para renovar seu suporte.</p>
            </div>
          )}

          <div className="card p-6">
            <h4 className="font-bold mb-4">Itens Incluídos</h4>
            <div className="grid md:grid-cols-2 gap-2">
              {(delivery?.features || []).map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">✓</span>
                  <span className="text-gray-300">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button onClick={() => handlePrint('start')} className="btn-secondary flex-1">
              📄 Relatório de Início
            </button>
            {delivery?.deliveryDate && (
              <button onClick={() => handlePrint('delivery')} className="btn-primary flex-1">
                📄 Relatório de Entrega
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab: Revisões */}
      {activeTab === 'reviews' && (
        <div className="space-y-4">
          <p className="text-gray-400 text-sm">Aprove ou rejeite cada etapa do projeto:</p>
          {reviews.map((review, index) => (
            <div key={review.phase} className="card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    review.status === 'approved' ? 'bg-green-500 text-black' :
                    review.status === 'rejected' ? 'bg-red-500 text-white' :
                    review.status === 'review' ? 'bg-yellow-500 text-black' :
                    'bg-[#1A1A1A] text-gray-400'
                  }`}>
                    {review.status === 'approved' ? '✓' : review.status === 'rejected' ? '✗' : index + 1}
                  </div>
                  <div>
                    <p className="font-semibold">{review.phase}</p>
                    <p className="text-sm text-gray-400">{review.description}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {review.status === 'review' && (
                    <>
                      <button 
                        onClick={() => handleReviewAction(review.phase, 'approve')}
                        className="px-3 py-1 bg-green-500/20 text-green-500 rounded text-sm hover:bg-green-500/30"
                      >
                        ✓ Aprovar
                      </button>
                      <button 
                        onClick={() => handleReviewAction(review.phase, 'reject')}
                        className="px-3 py-1 bg-red-500/20 text-red-500 rounded text-sm hover:bg-red-500/30"
                      >
                        ✗ Rejeitar
                      </button>
                    </>
                  )}
                  {review.status === 'approved' && (
                    <span className="text-green-500 text-sm">✓ Aprovado</span>
                  )}
                  {review.status === 'rejected' && (
                    <span className="text-red-500 text-sm">✗ Rejeitado - Aguardando ajustes</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab: Chat */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          <div className="card p-4 h-96 overflow-y-auto space-y-3">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhuma mensagem ainda. Inicie a conversa!</p>
            ) : (
              messages.map(msg => (
                <div key={msg.id} className={`p-3 rounded-lg ${
                  msg.senderId === user?.uid ? 'bg-[#00D4FF]/20 ml-8' : 'bg-[#1A1A1A] mr-8'
                }`}>
                  <p className="text-xs text-gray-500 mb-1">{msg.senderName}</p>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))
            )}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Digite sua mensagem..."
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary px-6">
              Enviar
            </button>
          </form>
        </div>
      )}
    </div>
  );
}