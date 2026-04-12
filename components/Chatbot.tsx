'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const QUICK_REPLIES = [
  'Fazer orçamento',
  'Serviços',
  'Prazo e preço',
  'Falar com humano'
];

export default function Chatbot() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [useAI, setUseAI] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [aiEnabled, setAiEnabled] = useState(true);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: '1',
        content: `🤖 **Assistente IA Premium da ESTUDIOK**

Olá! Sou um assistente inteligente com acesso a todas as informações da ESTUDIOK.

🔍 **Posso responder:**
• Preços e orçamentos instantâneos
• Prazos de entrega exatos
• Detalhes de todos os serviços
• Comparativo com concorrentes
• Sugestões personalizadas para seu negócio

💡 **Dica:** Pergunte em português natural!

_O que você gostaria de saber?_`,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const generateAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage })
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.response || getFallbackResponse(userMessage);
      }
    } catch (error) {
      console.error('AI chat error:', error);
    }
    return getFallbackResponse(userMessage);
  };

  const getFallbackResponse = (message: string): string => {
    const lower = message.toLowerCase();
    
    if (lower.includes('orçamento') || lower.includes('budget')) {
      return `Ótimo! Vamos fazer seu orçamento! 🎯

Acesse: https://estudiok.com.br/orçamento

Lá você responderá algumas perguntas sobre seu projeto e receberá uma proposta automática em minutos!`;
    }
    
    if (lower.includes('site') || lower.includes('website')) {
      return `Criamos sites modernos e otimizados para conversão:

• Sites institucionais
• Landing pages
• E-commerces
• Blogs

Todos com SEO, painel administrativo e design exclusivo.

Quer fazer um orçamento? https://estudiok.com.br/orçamento`;
    }
    
    if (lower.includes('app') || lower.includes('aplicativo')) {
      return `Desenvolvemos apps mobile para iOS e Android:

• Apps corporativos
• Delivery
• CRM mobile
• Apps híbridos

Entre em contato para uma avaliação!`;
    }
    
    if (lower.includes('preço') || lower.includes('valor') || lower.includes('custo')) {
      return `Nossos preços variam conforme o projeto:

• Site institucional: a partir de R$ 997
• Landing page: a partir de R$ 697
• E-commerce: a partir de R$ 1.997
• App: a partir de R$ 4.997

Todos com parcelamento em até 12x!`;
    }
    
    if (lower.includes('prazo') || lower.includes('tempo')) {
      return `Entregamos rápido! 🚀

• Sites: 48-72 horas
• Landing pages: 24-48 horas
• E-commerces: 5-7 dias
• Apps: 15-30 dias

Prazo pode variar conforme complexidade.`;
    }
    
    if (lower.includes('contato') || lower.includes('whatsapp')) {
      return `Fale conosco:

• WhatsApp: (32) 98421-4444
• Email: estudiokgames@gmail.com
• Site: https://estudiok.com.br/orçamento`;
    }
    
    return `Obrigado por entrar em contato! 😊

Posso ajudar com mais alguma coisa?
Se preferir, faça um orçamento online: https://estudiok.com.br/orçamento`;
  };

const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    if (aiEnabled) {
      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Como assistente da ESTUDIOK, responda esta pergunta do cliente em português brasileiro natural: "${inputValue}".
            
            Contexto da ESTUDIOK:
            - Empresa: ESTUDIOK - Agência de desenvolvimento web e apps
            - Serviços: sites institucionais, landing pages, e-commerce, apps mobile, sistemas web
            - Preços: oferecemos 30% OFF no primeiro projeto
            - Prazos: sites em 7-15 dias, apps em 15-30 dias
            - Contato: WhatsApp (11) 99999-9999, email contato@estudiok.com
            - Site: https://estudiok.com.br
            - Localização: Brasil
            
            Seja útil, direto ao ponto e convide para conversar via WhatsApp ou fazer orçamento.
            
            Pergunta do cliente: "${inputValue}"`,
            context: 'customer_service',
            useGroq: true
          }),
        });

        const data = await response.json();
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response || data.message || 'Desculpe, não consegui processar sua pergunta.',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Desculpe, estou com problemas técnicos. Entre em contato via WhatsApp: (11) 99999-9999',
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
      } finally {
        setIsTyping(false);
      }
    } else {
      setTimeout(() => {
        const botResponse = "Desculpe, não consegui processar sua mensagem. Você pode entrar em contato pelo WhatsApp para atendimento personalizado?";
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: botResponse,
          sender: 'bot',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-[#7B2CBF] to-[#00D4FF] rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
        aria-label="Abrir chat"
      >
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[500px] bg-[#1A1A1A] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-[#2A2A2A]">
          <div className="bg-gradient-to-r from-[#7B2CBF] to-[#00D4FF] p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-white font-bold">ESTUDIOK</h3>
                <p className="text-white/70 text-xs">Online agora</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.sender === 'user' 
                      ? 'bg-[#00D4FF] text-black' 
                      : 'bg-[#2A2A2A] text-white'
                  }`}
                >
                  <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-[#2A2A2A] p-3 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-[#2A2A2A]">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
              {QUICK_REPLIES.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1.5 bg-[#2A2A2A] text-white text-xs rounded-full whitespace-nowrap hover:bg-[#3A3A3A] transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-[#2A2A2A] text-white px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00D4FF]"
              />
              <button
                onClick={handleSend}
                className="w-12 h-12 bg-[#00D4FF] rounded-xl flex items-center justify-center hover:bg-[#00B8E6] transition-colors"
              >
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}