'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

export default function CalculadoraROIPage() {
  const [faturamentoAtual, setFaturamentoAtual] = useState(10000);
  const [ticketMedio, setTicketMedio] = useState(500);
  const [novosClientes, setNovosClientes] = useState(5);
  const [investimentoSite, setInvestimentoSite] = useState(497);

  const novosClientesMes = novosClientes;
  const receitaAdicional = novosClientesMes * ticketMedio;
  const receitaAnual = receitaAdicional * 12;
  const roi = ((receitaAnual - investimentoSite) / investimentoSite) * 100;
  const payback = investimentoSite / receitaAdicional;

  return (
    <div className="min-h-screen bg-[#050505]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#050505]/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="ESTUDIOK" className="h-12" />
          </Link>
          <Link href="/orcamento" className="bg-[#8B5CF6] hover:opacity-90 px-6 py-3 rounded-full font-bold text-white">
            Solicitar Orçamento →
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20">
        <section className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-6">
              <PremiumIcon name="chart" size={16} className="text-[#8B5CF6]" />
              <span className="text-[#8B5CF6] font-semibold text-sm">Calculadora de ROI</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Quanto Seu Site Pode <span className="text-[#8B5CF6]">Faturar?</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Descubra o retorno sobre investimento de ter um site profissional para seu negócio.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10">
              <h2 className="text-xl font-bold mb-6">Dados do Seu Negócio</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-400 mb-2">Faturamento mensal atual (R$)</label>
                  <input
                    type="number"
                    value={faturamentoAtual}
                    onChange={(e) => setFaturamentoAtual(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none"
                  />
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={faturamentoAtual}
                    onChange={(e) => setFaturamentoAtual(Number(e.target.value))}
                    className="w-full mt-2 accent-[#8B5CF6]"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Ticket médio por cliente (R$)</label>
                  <input
                    type="number"
                    value={ticketMedio}
                    onChange={(e) => setTicketMedio(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Novos clientes/mês com site: {novosClientes}</label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={novosClientes}
                    onChange={(e) => setNovosClientes(Number(e.target.value))}
                    className="w-full mt-2 accent-[#8B5CF6]"
                  />
                  <p className="text-xs text-gray-500 mt-1">Pesquisas mostram média de 5-15 novos clientes/mês</p>
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">Investimento no site (R$)</label>
                  <input
                    type="number"
                    value={investimentoSite}
                    onChange={(e) => setInvestimentoSite(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-[#050505] border border-white/10 rounded-xl text-white focus:border-[#8B5CF6] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-[#8B5CF6]/20 to-[#8B5CF6]/5 rounded-3xl p-8 border border-[#8B5CF6]/30">
                <h2 className="text-2xl font-bold mb-6 text-center">Seu ROI Estimado</h2>
                
                <div className="text-center mb-8">
                  <div className="text-6xl font-black text-[#8B5CF6] mb-2">{roi.toFixed(0)}%</div>
                  <p className="text-gray-400">Retorno sobre investimento</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#050505] rounded-2xl p-4 text-center">
                    <PremiumIcon name="dollar" size={24} className="text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-500">R$ {receitaAdicional.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Receita/mês</div>
                  </div>
                  <div className="bg-[#050505] rounded-2xl p-4 text-center">
                    <PremiumIcon name="trending-up" size={24} className="text-[#8B5CF6] mx-auto mb-2" />
                    <div className="text-2xl font-bold text-[#8B5CF6]">R$ {receitaAnual.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Receita/ano</div>
                  </div>
                  <div className="bg-[#050505] rounded-2xl p-4 text-center">
                    <PremiumIcon name="clock" size={24} className="text-yellow-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-yellow-500">{payback.toFixed(1)}</div>
                    <div className="text-xs text-gray-400">Meses para payback</div>
                  </div>
                  <div className="bg-[#050505] rounded-2xl p-4 text-center">
                    <PremiumIcon name="bolt" size={24} className="text-orange-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-500">R$ {(receitaAnual - investimentoSite).toLocaleString()}</div>
                    <div className="text-xs text-gray-400">Lucro líquido/ano</div>
                  </div>
                </div>

                <Link href="/orcamento" className="block w-full bg-[#8B5CF6] hover:opacity-90 text-white py-4 rounded-full font-bold text-center text-lg">
                  Criar Meu Site →
                </Link>
              </div>

              <div className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold mb-4">Por que ter um site?</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="flex items-center gap-2">
                    <PremiumIcon name="check" size={16} className="text-green-500" />
                    <span>Aparece no Google quando clientes buscam</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <PremiumIcon name="check" size={16} className="text-green-500" />
                    <span>Funciona 24 horas por dia</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <PremiumIcon name="check" size={16} className="text-green-500" />
                    <span>Profissionaliza sua marca</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <PremiumIcon name="check" size={16} className="text-green-500" />
                    <span>Reduz custo com publicidade</span>
                  </li>
                </ul>
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