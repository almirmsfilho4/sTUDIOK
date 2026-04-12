'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument } from '@/lib/firebase-services';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: any;
}

export default function CommunityChat() {
  const { user, userData } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    try {
      const data = await getDocuments('community_messages');
      const sorted = (data as Message[]).sort((a, b) => 
        (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
      ).slice(0, 50).reverse();
      setMessages(sorted);
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newMessage.trim()) return;

    try {
      await createDocument('community_messages', {
        userId: user.uid,
        userName: userData?.name || user.email?.split('@')[0] || 'Usuário',
        content: newMessage.trim(),
        createdAt: new Date()
      });
      setNewMessage('');
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-4xl mx-auto h-screen flex flex-col">
        <header className="p-4 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="ESTUDIOK" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="font-bold">Comunidade ESTUDIOK</h1>
              <p className="text-xs text-green-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {messages.length} mensagens online
              </p>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center text-gray-500 py-8">Carregando mensagens...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>Nenhuma mensagem ainda.</p>
              <p className="text-sm">Seja o primeiro a interagir!</p>
            </div>
          ) : (
            messages.map(msg => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.userId === user?.uid ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B2CBF] flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {msg.userName.charAt(0).toUpperCase()}
                </div>
                <div className={`max-w-[70%] ${msg.userId === user?.uid ? 'text-right' : ''}`}>
                  <div className={`inline-block p-3 rounded-lg ${
                    msg.userId === user?.uid 
                      ? 'bg-[#00D4FF] text-black' 
                      : 'bg-[#1A1A1A]'
                  }`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {msg.userName} • {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-4 border-t border-[#1A1A1A]">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Digite sua mensagem..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary" disabled={!newMessage.trim()}>
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
