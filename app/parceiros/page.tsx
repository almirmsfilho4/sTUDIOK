'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

export default function ParceirosPage() {
  const [form, setForm] = useState({ nome: '', empresa: '', email: '', telefone: '', cidade: '', mensagem: '' });
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviado(true);
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          </Link>
          <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 px-6 py-3 rounded-full font-bold text-white">
            Seja um Parceiro →
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-6">
              <PremiumIcon name="award" size={16} className="text-[#8B5CF6]" />
              <span className="text-[#8B5CF6] font-semibold text-sm">Programa de Parceria</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Ganhe com a <span className="text-[#8B5CF6]">ESTUDIOK</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Seja nosso parceiro e ganhe comissões indicando clientes que precisam de sites profissionais.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PremiumIcon name="dollar" size={32} className="text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Comissão de 20%</h3>
              <p className="text-gray-400">Ganhe 20% do valor de cada cliente indicado que fechar negócio.</p>
            </div>
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PremiumIcon name="users" size={32} className="text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Sem Limite</h3>
              <p className="text-gray-400">Indique quantos clientes quiser. Quanto mais indicações, mais você ganha.</p>
            </div>
            <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10 text-center">
              <div className="w-16 h-16 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <PremiumIcon name="clock" size={32} className="text-[#8B5CF6]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Pagamento Rápido</h3>
              <p className="text-gray-400">Receba sua comissão em até 5 dias úteis após a conclusão do projeto.</p>
            </div>
          </div>

          <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 mb-16">
            <h2 className="text-2xl font-bold mb-6 text-center">Como Funciona</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Cadastre-se', desc: 'Preencha o formulário' },
                { step: '2', title: 'Indique', desc: 'Compartilhe seu link' },
                { step: '3', title: 'Cliente Fecha', desc: 'Indicado contrata' },
                { step: '4', title: 'Receba', desc: 'Comissão garantida' },
              ].map((item, i) => (
                <div key={i} className="text-center relative">
                  {i < 3 && <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-[#8B5CF6]/30" />}
                  <div className="w-16 h-16 rounded-full bg-[#8B5CF6]/20 border-2 border-[#8B5CF6] flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-black text-[#8B5CF6]">{item.step}</span>
                  </div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Quem pode ser parceiro?</h2>
              <div className="space-y-4">
                {['Agências de marketing digital', 'Profissionais de TI', 'Designers freelance', 'Consultores de negócios', 'Influenciadores digitais', 'Empresas de tecnologia'].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-[#0A0A0A] rounded-xl border border-white/10">
                    <PremiumIcon name="check" size={20} className="text-green-500" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Quero Ser Parceiro</h2>
              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                {enviado ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PremiumIcon name="check" size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Solicitação Enviada!</h3>
                    <p className="text-gray-400">Entraremos em contato em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Nome completo</label>
                      <input required type="text" className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Empresa (opcional)</label>
                      <input type="text" className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">E-mail</label>
                      <input required type="email" className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Telefone</label>
                      <input required type="tel" className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Cidade/Estado</label>
                      <input required type="text" className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-[#8B5CF6] hover:opacity-90 text-white py-4 rounded-xl font-bold">
                      Quero Ser Parceiro →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-8 bg-[#0A0A0A] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">© 2024 ESTUDIOK. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}