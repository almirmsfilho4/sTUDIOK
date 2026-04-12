'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  read: boolean;
}

export default function LiveChat() {
  const { user, userData } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: '1',
          text: 'Olá! 👋 Como posso ajudar você hoje?',
          sender: 'support',
          timestamp: new Date(),
          read: true,
        },
      ]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
      read: true,
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');
    setLoading(true);

    setTimeout(() => {
      const supportResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAutoReply(newMessage),
        sender: 'support',
        timestamp: new Date(),
        read: false,
      };
      setMessages((prev) => [...prev, supportResponse]);
      setLoading(false);
    }, 1000);
  };

  const getAutoReply = (message: string): string => {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('custo')) {
      return 'Os valores variam conforme o projeto. Faça um orçamento gratuito em /orcamento para receber uma proposta personalizada! 💰';
    }
    if (lowerMessage.includes('prazo') || lowerMessage.includes('tempo') || lowerMessage.includes('entrega')) {
      return 'Entregamos projetos em até 48 horas! O prazo exato depende da complexidade. 🚀';
    }
    if (lowerMessage.includes('site') || lowerMessage.includes('website')) {
      return 'Criamos sites institucionais, landing pages e e-commerces. Veja nosso portfólio em /#portfolio ou faça um orçamento! 🌐';
    }
    if (lowerMessage.includes('app') || lowerMessage.includes('mobile')) {
      return 'Desenvolvemos apps para iOS e Android. Solicite um orçamento em /orcamento! 📱';
    }
    if (lowerMessage.includes('oi') || lowerMessage.includes('ola') || lowerMessage.includes('hello')) {
      return 'Olá! Como posso ajudar? Posso informar sobre preços, prazos, serviços ou ajudá-lo a fazer um orçamento! 😊';
    }
    if (lowerMessage.includes('obrigado') || lowerMessage.includes('valeu')) {
      return 'De nada! 😊 Qualquer dúvida, é só perguntar!';
    }

    return 'Obrigado pela mensagem! Vou verificar as informações e respondo em breve. Para um orçamento rápido, visite /orcamento 🎯';
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        {isOpen ? (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-96 max-w-[calc(100vw-3rem)] h-[500px] bg-[#0A0A0A] border border-[#1A1A1A] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-[slideIn_0.3s_ease-out]">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-white">💬</span>
              </div>
              <div>
                <h3 className="font-bold text-white">Suporte ESTUDIOK</h3>
                <p className="text-xs text-white/80">Online agora</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-[#00D4FF] text-black rounded-br-sm'
                      : 'bg-[#1A1A1A] text-white rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-black/60' : 'text-gray-500'}`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#1A1A1A] p-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 py-2 border-t border-[#1A1A1A]">
            <div className="flex flex-wrap gap-2">
              {['Preços', 'Prazo', 'Site', 'App'].map((quick) => (
                <button
                  key={quick}
                  onClick={() => {
                    setNewMessage(quick);
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="text-xs px-3 py-1 rounded-full bg-[#1A1A1A] text-gray-400 hover:text-white hover:bg-[#242424] transition-colors"
                >
                  {quick}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#1A1A1A]">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Digite sua mensagem..."
                className="input-field flex-1"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="btn-primary px-4"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}