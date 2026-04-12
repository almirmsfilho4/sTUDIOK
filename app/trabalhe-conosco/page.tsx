'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const vagas = [
  { titulo: 'Desenvolvedor Frontend', tipo: 'PJ/CLT', local: 'Remoto', desc: 'Desenvolvimento de sites e aplicações React/Next.js' },
  { titulo: 'Designer UI/UX', tipo: 'PJ', local: 'Remoto', desc: 'Criação de interfaces modernas e intuitivas' },
  { titulo: 'Especialista SEO', tipo: 'PJ', local: 'Remoto', desc: 'Otimização de sites para motores de busca' },
  { titulo: 'Atendimento ao Cliente', tipo: 'CLT', local: 'São Paulo/SP', desc: 'Suporte e venda para clientes' },
];

export default function TrabalheConoscoPage() {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '',Linkedin: '', vaga: '', mensagem: '' });
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
          <Link href="/" className="text-gray-400 hover:text-white">
            Voltar
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-6">
              <PremiumIcon name="users" size={16} className="text-[#8B5CF6]" />
              <span className="text-[#8B5CF6] font-semibold text-sm">Carreiras</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Trabalhe na <span className="text-[#8B5CF6]">ESTUDIOK</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Junte-se à equipe que está revolucionando a presença digital de milhares de negócios.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Vagas Abertas</h2>
              <div className="space-y-4">
                {vagas.map((vaga, i) => (
                  <div key={i} className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg">{vaga.titulo}</h3>
                      <div className="flex gap-2">
                        <span className="text-xs bg-[#8B5CF6]/20 text-[#8B5CF6] px-2 py-1 rounded">{vaga.tipo}</span>
                        <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded">{vaga.local}</span>
                      </div>
                    </div>
                    <p className="text-gray-400 text-sm">{vaga.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-gradient-to-r from-[#8B5CF6]/20 to-[#8B5CF6]/5 rounded-2xl p-6 border border-[#8B5CF6]/30">
                <h3 className="font-bold mb-2">Não achou sua vaga?</h3>
                <p className="text-gray-400 text-sm">Envie seu currículo mesmo assim. Adoramos conhecer novos talentos!</p>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-6">Candidate-se</h2>
              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                {enviado ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <PremiumIcon name="check" size={32} className="text-green-500" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Candidatura Enviada!</h3>
                    <p className="text-gray-400">Entraremos em contato em breve.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-400 mb-2">Nome completo</label>
                      <input required type="text" className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none" />
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
                      <label className="block text-gray-400 mb-2">LinkedIn (opcional)</label>
                      <input type="url" className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Vaga de interesse</label>
                      <select className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none">
                        <option value="">Selecione uma vaga</option>
                        {vagas.map((v, i) => (
                          <option key={i} value={v.titulo}>{v.titulo}</option>
                        ))}
                        <option value="outra">Outra / Currículo geral</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-400 mb-2">Mensagem</label>
                      <textarea rows={4} className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none" placeholder="Conte-nos sobre você..." />
                    </div>
                    <button type="submit" className="w-full bg-[#8B5CF6] hover:opacity-90 text-white py-4 rounded-xl font-bold">
                      Enviar Candidatura →
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