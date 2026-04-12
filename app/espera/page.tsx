'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WaitlistEntry {
  email: string;
  name?: string;
  interest?: string;
  position?: number;
}

export default function WaitlistPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [interest, setInterest] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [position, setPosition] = useState<number | null>(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    loadWaitlistCount();
  }, []);

  const loadWaitlistCount = async () => {
    try {
      const { getDocuments } = await import('@/lib/firebase-services');
      const data = await getDocuments('waitlist');
      setCount((data as any[])?.length || 0);
    } catch (error) {
      setCount(127);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const { createDocument, getDocuments } = await import('@/lib/firebase-services');
      
      const data = await getDocuments('waitlist');
      const entries = (data as any[]) || [];
      const position = entries.length + 1;

      await createDocument('waitlist', {
        email,
        name: name || '',
        interest: interest || '',
        position,
        createdAt: new Date(),
        status: 'active',
      });

      setPosition(position);
      setSuccess(true);

      await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/email/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: '🎉 Você entrou na lista de espera da ESTUDIOK!',
          html: `
            <h1>Bem-vindo à lista de espera! 🚀</h1>
            <p>Olá ${name || 'amigo'}!</p>
            <p>Você está na posição <strong>#${position}</strong> da nossa lista de espera.</p>
            <p>Em breve enviaremos novidades exclusivas para você!</p>
            <hr>
            <p>Enquanto isso, conheça nossos serviços: <a href="https://estudiok.com">estudiok.com</a></p>
          `,
        }),
      });
    } catch (error) {
      console.error('Error joining waitlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
        <div className="max-w-xl w-full text-center">
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#7B2CBF] flex items-center justify-center animate-[scaleIn_0.5s_ease-out]">
            <span className="text-5xl">🎉</span>
          </div>

          <h1 className="text-4xl font-bold mb-4">
            Você está na lista! 🎊
          </h1>
          
          <p className="text-xl text-gray-400 mb-8">
            Muito obrigado pelo interesse! Você está na posição <span className="text-[#00D4FF] font-bold">#{position}</span>
          </p>

          <div className="card p-6 mb-8">
            <h3 className="font-bold mb-4">O que vem a seguir?</h3>
            <div className="space-y-3 text-left">
              <p>📧 <strong>Email de confirmação</strong> - Chegará em alguns minutos</p>
              <p>🎁 <strong>Oferta especial</strong> - Você terá acesso antecipado</p>
              <p>⭐ <strong>Beneficios exclusivos</strong> - Apenas para quem está na lista</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="btn-primary">
              Voltar ao Início
            </Link>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            Compartilhe e suba na lista! Mais pessoas = posições melhores 🔥
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#7B2CBF]/20 border border-[#7B2CBF]/30 mb-6">
            <span className="w-2 h-2 bg-[#7B2CBF] rounded-full animate-pulse"></span>
            <span className="text-[#7B2CBF] font-medium">Em breve</span>
          </div>
          
          <h1 className="text-5xl font-bold mb-4">
            Lista de <span className="bg-gradient-to-r from-[#00D4FF] via-[#7B2CBF] to-[#FF006E] bg-clip-text text-transparent">Espera</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-xl mx-auto">
            Seja o primeiro a saber sobre nossos novos serviços e ofertas exclusivas!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="card p-6 text-center">
            <p className="text-4xl font-bold text-[#00D4FF]">{count}+</p>
            <p className="text-gray-400">Pessoas na lista</p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-4xl font-bold text-green-500">07</p>
            <p className="text-gray-400">Dias até o lançamento</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="card p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Entrar na lista de espera
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nome (opcional)</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">O que você procura? (opcional)</label>
              <select
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                className="input-field"
              >
                <option value="">Selecione uma opção</option>
                <option value="site">Site Institucional</option>
                <option value="ecommerce">E-commerce</option>
                <option value="app">App Mobile</option>
                <option value="sistema">Sistema Web</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg mt-6"
            >
              {loading ? 'Entrando...' : 'Garantir minha vaga!'}
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            🔒 Respeitamos sua privacidade. Sem spam!
          </p>
        </form>

        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">Já tem uma conta?</p>
          <Link href="/login" className="text-[#00D4FF] hover:underline">
            Fazer login →
          </Link>
        </div>
      </div>
    </div>
  );
}