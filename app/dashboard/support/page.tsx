'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTickets, createTicket, SupportTicket, addTicketMessage } from '@/lib/support-tickets';

export default function SupportPage() {
  const { user, userData } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [newMessage, setNewMessage] = useState('');
  
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    category: 'duvida' as SupportTicket['category'],
    priority: 'media' as SupportTicket['priority'],
  });

  useEffect(() => {
    if (user) loadTickets();
  }, [user]);

  const loadTickets = async () => {
    if (!user) return;
    try {
      const data = await getUserTickets(user.uid);
      setTickets(data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !formData.subject || !formData.description) return;

    try {
      await createTicket({
        userId: user.uid,
        userName: userData?.name || user.email?.split('@')[0] || 'Cliente',
        userEmail: user.email || '',
        subject: formData.subject,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        status: 'open',
      });
      
      setShowForm(false);
      setFormData({ subject: '', description: '', category: 'duvida', priority: 'media' });
      loadTickets();
      alert('✅ Ticket criado com sucesso!');
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('❌ Erro ao criar ticket');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTicket || !newMessage.trim() || !user) return;

    try {
      await addTicketMessage(selectedTicket.id, {
        senderId: user.uid,
        senderName: userData?.name || user.email?.split('@')[0] || 'Cliente',
        senderType: 'cliente',
        content: newMessage,
      });
      
setNewMessage('');
 loadTickets();
 const updated = tickets.find(t => t.id === selectedTicket.id);
 if (updated) setSelectedTicket({ ...updated, messages: [...updated.messages, { id: Date.now().toString(), senderId: user.uid, senderName: 'Cliente', senderType: 'cliente' as const, content: newMessage, createdAt: new Date() }]});
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const statusColors: Record<string, string> = {
    open: 'bg-green-500/20 text-green-500',
    in_progress: 'bg-blue-500/20 text-blue-500',
    waiting: 'bg-yellow-500/20 text-yellow-500',
    resolved: 'bg-purple-500/20 text-purple-500',
    closed: 'bg-gray-500/20 text-gray-500',
  };

  const statusLabels: Record<string, string> = {
    open: 'Aberto',
    in_progress: 'Em Andamento',
    waiting: 'Aguardando',
    resolved: 'Resolvido',
    closed: 'Fechado',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">🎫 Meu Suporte</h2>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          + Novo Ticket
        </button>
      </div>

      {/* Create Ticket Form */}
      {showForm && (
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-4">Abrir novo ticket</h3>
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <label className="text-sm text-gray-400 block mb-2">Assunto</label>
              <input
                type="text"
                value={formData.subject}
                onChange={e => setFormData({ ...formData, subject: e.target.value })}
                className="input-field w-full"
                placeholder="Descreva brevemente o problema"
                required
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 block mb-2">Categoria</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                  className="input-field w-full"
                >
                  <option value="duvida">Dúvida</option>
                  <option value="bug">Bug/Erro</option>
                  <option value="ajuste">Ajuste</option>
                  <option value="financeiro">Financeiro</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-400 block mb-2">Prioridade</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as any })}
                  className="input-field w-full"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="urgente">Urgente</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-400 block mb-2">Descrição</label>
              <textarea
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="input-field w-full h-32"
                placeholder="Descreva o problema em detalhes..."
                required
              />
            </div>
            <div className="flex gap-4">
              <button type="submit" className="btn-primary">Criar Ticket</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      {tickets.length === 0 ? (
        <div className="card p-8 text-center">
          <p className="text-gray-400 mb-4">Você ainda não tem tickets de suporte</p>
          <button onClick={() => setShowForm(true)} className="btn-primary">
            Criar primeiro ticket
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tickets.map(ticket => (
            <div
              key={ticket.id}
              className="card p-4 cursor-pointer hover:border-[#00D4FF]"
              onClick={() => setSelectedTicket(ticket)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{ticket.subject}</h3>
                  <p className="text-sm text-gray-400">{ticket.description.substring(0, 60)}...</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-xs ${statusColors[ticket.status]}`}>
                    {statusLabels[ticket.status]}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {ticket.createdAt?.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-[#1A1A1A] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[#242424] flex justify-between items-center">
              <div>
                <h3 className="font-bold">{selectedTicket.subject}</h3>
                <p className="text-sm text-gray-400">
                  {selectedTicket.category} • {statusLabels[selectedTicket.status]}
                </p>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="bg-[#0A0A0A] p-3 rounded-lg">
                <p className="text-sm">{selectedTicket.description}</p>
              </div>
              
              {selectedTicket.messages?.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-lg ${
                    msg.senderType === 'cliente' ? 'bg-[#00D4FF]/20 ml-8' : 'bg-[#242424] mr-8'
                  }`}
                >
                  <p className="text-xs text-gray-500 mb-1">{msg.senderName}</p>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSendMessage} className="p-4 border-t border-[#242424] flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="input-field flex-1"
              />
              <button type="submit" className="btn-primary px-6">Enviar</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}