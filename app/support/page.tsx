'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SupportService, TICKET_CATEGORIES, CATEGORY_LABELS, PRIORITY_LABELS } from '@/lib/support-service';
import Link from 'next/link';

interface SupportTicket {
  id?: string;
  subject: string;
  status: string;
  priority: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function SupportPage() {
  const { user, userData } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'general_inquiry',
    priority: 'medium'
  });

  useEffect(() => {
    if (user) {
      loadTickets();
    }
  }, [user]);

  const loadTickets = async () => {
    try {
      const userTickets = await SupportService.getUserTickets(user!.uid);
      setTickets(userTickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !formData.subject || !formData.description) return;

    try {
      await SupportService.createTicket({
        userId: user.uid,
        userEmail: user.email!,
        userName: userData?.name || user.email!,
        subject: formData.subject,
        description: formData.description,
        status: 'open',
        priority: formData.priority as any,
        category: formData.category
      });

      setFormData({ subject: '', description: '', category: 'general_inquiry', priority: 'medium' });
      setShowCreateForm(false);
      loadTickets();
      
      alert('Ticket criado com sucesso! Entraremos em contato em breve.');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Erro ao criar ticket. Tente novamente.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-blue-500/20 text-blue-500';
      case 'pending': return 'bg-yellow-500/20 text-yellow-500';
      case 'resolved': return 'bg-green-500/20 text-green-500';
      case 'closed': return 'bg-gray-500/20 text-gray-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500/20 text-red-500';
      case 'high': return 'bg-orange-500/20 text-orange-500';
      case 'medium': return 'bg-yellow-500/20 text-yellow-500';
      case 'low': return 'bg-green-500/20 text-green-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Suporte</h1>
            <p className="text-gray-400">Central de ajuda e atendimento</p>
          </div>
          
          {userData?.role === 'admin' ? (
            <Link href="/admin/support" className="btn-primary">
              Painel Admin
            </Link>
          ) : (
            <button 
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Novo Ticket
            </button>
          )}
        </div>

        {showCreateForm && (
          <div className="card mb-6">
            <h2 className="text-xl font-bold mb-4">Criar Novo Ticket</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Assunto
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="input-field"
                  placeholder="Descreva brevemente o problema"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Categoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                >
                  {TICKET_CATEGORIES.map(category => (
                    <option key={category} value={category}>
                      {CATEGORY_LABELS[category]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Prioridade
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="input-field"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                  <option value="urgent">Urgente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Descrição Detalhada
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field min-h-32"
                  placeholder="Descreva o problema em detalhes..."
                  required
                />
              </div>

              <div className="flex gap-3">
                <button type="submit" className="btn-primary">
                  Enviar Ticket
                </button>
                <button 
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-xl font-bold">Meus Tickets</h2>
          
          {tickets.length === 0 ? (
            <div className="card text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#00D4FF]/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🎫</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum ticket encontrado</h3>
              <p className="text-gray-400 mb-4">Você ainda não criou nenhum ticket de suporte</p>
              <button 
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                Criar Primeiro Ticket
              </button>
            </div>
          ) : (
            tickets.map(ticket => (
              <div key={ticket.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{ticket.subject}</h3>
                    <p className="text-gray-400 text-sm">
                      {CATEGORY_LABELS[ticket.category] || ticket.category}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${getPriorityColor(ticket.priority)}`}>
                      {PRIORITY_LABELS[ticket.priority] || ticket.priority}
                    </span>
                    
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(ticket.status)}`}>
                      {ticket.status === 'open' ? 'Aberto' :
                       ticket.status === 'pending' ? 'Pendente' :
                       ticket.status === 'resolved' ? 'Resolvido' : 'Fechado'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-[#1A1A1A]">
                  <p className="text-sm text-gray-400">
                    Criado em {ticket.createdAt.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* FAQ Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">Perguntas Frequentes</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-3">Como faço para pagar meu projeto?</h3>
              <p className="text-gray-400 text-sm">
                Aceitamos cartão de crédito, PIX e boleto através do Mercado Pago. 
                O pagamento pode ser feito diretamente no seu painel do projeto.
              </p>
            </div>
            
            <div className="card">
              <h3 className="font-semibold mb-3">Qual o prazo de entrega?</h3>
              <p className="text-gray-400 text-sm">
                Prazos variam de 7 a 30 dias dependendo da complexidade. 
                Sites simples: 7-14 dias, sistemas complexos: 21-30 dias.
              </p>
            </div>
            
            <div className="card">
              <h3 className="font-semibold mb-3">Posso solicitar alterações?</h3>
              <p className="text-gray-400 text-sm">
                Sim! Oferecemos 3 rodadas de revisões inclusas. 
                Alterações adicionais podem ser cotadas separadamente.
              </p>
            </div>
            
            <div className="card">
              <h3 className="font-semibold mb-3">Como é o suporte pós-entrega?</h3>
              <p className="text-gray-400 text-sm">
                30 dias de suporte gratuito para correções. 
                Oferecemos planos de manutenção mensal após este período.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}