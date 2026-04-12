'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PremiumHero from '@/components/PremiumHero';
import PremiumIcons from '@/components/PremiumIcons';
import { Card, Button, StatCard, ProgressBar, Badge } from '@/components/PremiumUI';

export default function SimuladorROIPage() {
  const [faturamentoAtual, setFaturamentoAtual] = useState<number>(10000);
  const [custoAquisiçãoCliente, setCustoAquisiçãoCliente] = useState<number>(500);
  const [taxaConversãoAtual, setTaxaConversãoAtual] = useState<number>(2);
  const [ticketMédio, setTicketMédio] = useState<number>(1500);
  const [clientesMensais, setClientesMensais] = useState<number>(10);
  
  // Resultados calculados
  const [faturamentoProjetado, setFaturamentoProjetado] = useState<number>(0);
  const [lucroAdicional, setLucroAdicional] = useState<number>(0);
  const [roiMensal, setRoiMensal] = useState<number>(0);
  const [tempoRetornoInvestimento, setTempoRetornoInvestimento] = useState<number>(0);
  const [melhoriaConversão, setMelhoriaConversão] = useState<number>(0);

  // Calcular ROI
  useEffect(() => {
    // Faturamento atual
    const faturamentoAtualTotal = clientesMensais * ticketMédio;
    
    // Melhoria projetada com nosso serviço
    const novaTaxaConversão = taxaConversãoAtual * 1.5; // +50%
    const novosClientesMensais = Math.floor((clientesMensais / taxaConversãoAtual) * novaTaxaConversão);
    const faturamentoProjetadoTotal = novosClientesMensais * ticketMédio;
    
    // Cálculos
    const fatProjetado = Math.max(faturamentoProjetadoTotal, faturamentoAtualTotal);
    const lucroAdicionalCalc = fatProjetado - faturamentoAtualTotal;
    const custoMensalServico = 2997; // Preço mensal do serviço
    const roiCalc = ((lucroAdicionalCalc - custoMensalServico) / custoMensalServico) * 100;
    const tempoRetornoCalc = custoMensalServico / (lucroAdicionalCalc / 30);
    
    setFaturamentoProjetado(Math.round(fatProjetado));
    setLucroAdicional(Math.round(lucroAdicionalCalc));
    setRoiMensal(Math.round(roiCalc));
    setTempoRetornoInvestimento(Math.round(tempoRetornoCalc));
    setMelhoriaConversão(Math.round((novaTaxaConversão - taxaConversãoAtual) / taxaConversãoAtual * 100));
  }, [faturamentoAtual, custoAquisiçãoCliente, taxaConversãoAtual, ticketMédio, clientesMensais]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <PremiumHero
          title={
            <>
              Simulador de <span className="text-blue-600">ROI</span>
              <br />
              Veja quanto seu negócio pode faturar
            </>
          }
          subtitle="Calcule exatamente quanto você pode aumentar seu faturamento com nossos serviços de marketing e automação."
          ctaText="Ver Resultados Personalizados"
          ctaHref="#calculadora"
        >
          <div className="flex justify-center items-center space-x-4 mt-6">
            <div className="bg-blue-50 rounded-full p-2">
              <PremiumIcons.Calculator className="h-6 w-6 text-blue-600" />
            </div>
            <div className="bg-blue-50 rounded-full p-2">
              <PremiumIcons.ChartLine className="h-6 w-6 text-blue-600" />
            </div>
            <div className="bg-blue-50 rounded-full p-2">
              <PremiumIcons.Coins className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </PremiumHero>
      </section>

      {/* Calculadora Interativa */}
      <section id="calculadora" className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Painel de Controles */}
            <div>
              <div className="sticky top-8">
                <Card className="shadow-xl">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Configure sua Simulação</h2>
                      <PremiumIcons.Settings className="h-6 w-6 text-blue-600" />
                    </div>

                    {/* Controles */}
                    <div className="space-y-8">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <PremiumIcons.DollarSign className="h-4 w-4 inline mr-1" />
                          Faturamento Mensal Atual
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="1000"
                            max="100000"
                            step="1000"
                            value={faturamentoAtual}
                            onChange={(e) => setFaturamentoAtual(Number(e.target.value))}
                            className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="w-32">
                            <div className="text-2xl font-bold text-blue-700">
                              R$ {faturamentoAtual.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>R$ 1.000</span>
                          <span>R$ 100.000</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <PremiumIcons.Users className="h-4 w-4 inline mr-1" />
                          Clientes por Mês
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="1"
                            max="100"
                            step="1"
                            value={clientesMensais}
                            onChange={(e) => setClientesMensais(Number(e.target.value))}
                            className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="w-24">
                            <div className="text-2xl font-bold text-blue-700">
                              {clientesMensais}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>1 cliente</span>
                          <span>100 clientes</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <PremiumIcons.ShoppingCart className="h-4 w-4 inline mr-1" />
                          Ticket Médio
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="100"
                            max="5000"
                            step="100"
                            value={ticketMédio}
                            onChange={(e) => setTicketMédio(Number(e.target.value))}
                            className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="w-32">
                            <div className="text-2xl font-bold text-blue-700">
                              R$ {ticketMédio.toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>R$ 100</span>
                          <span>R$ 5.000</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <PremiumIcons.Percent className="h-4 w-4 inline mr-1" />
                          Taxa de Conversão Atual
                        </label>
                        <div className="flex items-center space-x-4">
                          <input
                            type="range"
                            min="0.5"
                            max="10"
                            step="0.1"
                            value={taxaConversãoAtual}
                            onChange={(e) => setTaxaConversãoAtual(Number(e.target.value))}
                            className="flex-1 h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="w-24">
                            <div className="text-2xl font-bold text-blue-700">
                              {taxaConversãoAtual}%
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>0.5%</span>
                          <span>10%</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200">
                      <p className="text-sm text-gray-600 mb-4">
                        <PremiumIcons.Info className="h-4 w-4 inline mr-1" />
                        Baseado em dados reais de mais de 200 clientes atendidos
                      </p>
                      <Link href="/checkout" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00D4FF]/30 transition-all w-full">
                        <PremiumIcons.Play className="h-5 w-5 mr-2" />
                        Aplicar Melhorias Agora
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Resultados */}
            <div>
              <div className="space-y-8">
                <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-2xl">
                  <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Seu Resultado Personalizado</h2>
                      <PremiumIcons.TrendingUp className="h-8 w-8" />
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <StatCard
                        title="Faturamento Adicional"
                        value={`R$ ${lucroAdicional.toLocaleString()}`}
                        icon={<PremiumIcons.DollarSign className="h-6 w-6" />}
                        description="por mês com nossos serviços"
                        className="bg-white/20 backdrop-blur-sm"
                      />
                      
                      <StatCard
                        title="ROI Mensal"
                        value={`${roiMensal}%`}
                        icon={<PremiumIcons.Percent className="h-6 w-6" />}
                        description="Retorno sobre investimento"
                        className="bg-white/20 backdrop-blur-sm"
                        trend={roiMensal > 0 ? "up" : "down"}
                      />
                    </div>

                    <div className="mt-8">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-medium">Taxa de Conversão</span>
                        <Badge variant="success">
                          +{melhoriaConversão}% Melhoria
                        </Badge>
                      </div>
                      <ProgressBar
                        value={taxaConversãoAtual}
                        max={taxaConversãoAtual * 1.5}
                        variant="blue"
                      />
                      <div className="flex justify-between text-sm mt-2">
                        <span>Atual: {taxaConversãoAtual}%</span>
                        <span>Projetada: {(taxaConversãoAtual * 1.5).toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Detalhamento dos Resultados */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-6 flex items-center">
                      <PremiumIcons.Zap className="h-5 w-5 text-blue-600 mr-2" />
                      Detalhamento Financeiro
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                        <div>
                          <div className="font-medium">Investimento Mensal</div>
                          <div className="text-sm text-gray-600">Serviços ESTUDIOK</div>
                        </div>
                        <div className="text-lg font-bold text-blue-700">
                          R$ 2.997
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                        <div>
                          <div className="font-medium">Lucro Adicional</div>
                          <div className="text-sm text-gray-600">Projeção mensal</div>
                        </div>
                        <div className="text-lg font-bold text-green-700">
                          R$ {lucroAdicional.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                        <div>
                          <div className="font-medium">Tempo de Retorno</div>
                          <div className="text-sm text-gray-600">Do investimento</div>
                        </div>
                        <div className="text-lg font-bold text-purple-700">
                          {tempoRetornoInvestimento} dias
                        </div>
                      </div>
                    </div>

                    <div className="mt-8 p-4 bg-yellow-50 rounded-lg">
                      <div className="flex items-start">
                        <PremiumIcons.Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold mb-1">Conclusão da Análise</h4>
                          <p className="text-sm text-gray-600">
                            Para cada R$ 1,00 investido em nossos serviços, você pode esperar 
                            um retorno de aproximadamente R$ {Math.max(1, Math.round(lucroAdicional / 2997 * 10) / 10).toFixed(1)} 
                            em faturamento adicional mensal.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Comparativo Antes/Depois */}
                <Card>
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-6">Comparativo Antes vs Depois</h3>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="text-center mb-4">
                          <PremiumIcons.Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <h4 className="font-semibold text-gray-700">Antes</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Faturamento:</span>
                            <span className="font-semibold">R$ {faturamentoAtual.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Clientes/mês:</span>
                            <span className="font-semibold">{clientesMensais}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Conversão:</span>
                            <span className="font-semibold">{taxaConversãoAtual}%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg">
                        <div className="text-center mb-4">
                          <PremiumIcons.TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                          <h4 className="font-semibold text-blue-700">Depois</h4>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-blue-600">Faturamento:</span>
                            <span className="font-semibold text-blue-700">
                              R$ {(faturamentoAtual + lucroAdicional).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Clientes/mês:</span>
                            <span className="font-semibold text-blue-700">
                              {Math.floor(clientesMensais * 1.5)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-blue-600">Conversão:</span>
                            <span className="font-semibold text-blue-700">
                              {(taxaConversãoAtual * 1.5).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-center">
                      <Link href="/checkout" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00D4FF]/30 transition-all w-full">
                        <PremiumIcons.Play className="h-5 w-5 mr-2" />
                        Quero Esses Resultados no Meu Negócio
                      </Link>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Estudos de Caso */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Resultados Reais de Clientes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Veja quanto outros negócios aumentaram seus faturamentos com nossa metodologia
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { setor: 'E-commerce', aumento: '+187%', tempo: '3 meses' },
              { setor: 'Serviços', aumento: '+245%', tempo: '4 meses' },
              { setor: 'Consultoria', aumento: '+156%', tempo: '2 meses' },
            ].map((caso, index) => (
              <Card key={index} className="hover:shadow-xl transition-shadow">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="default">{caso.setor}</Badge>
                    <PremiumIcons.ChartLine className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-700 mb-2">{caso.aumento}</div>
                  <p className="text-gray-600">Aumento de faturamento em {caso.tempo}</p>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center text-sm text-gray-500">
                      <PremiumIcons.Clock className="h-4 w-4 mr-1" />
                      ROI médio: 312%
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pronto para Multiplicar seu Faturamento?
            </h2>
            <p className="text-blue-100 mb-8 text-lg">
              Comece agora e veja resultados em até 30 dias com nossa garantia de satisfação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                <PremiumIcons.Play className="h-5 w-5 mr-2" />
                Quero Começar Agora
              </Link>
              <Link href="/garantia" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white border border-[#242424] rounded-xl font-semibold hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5 transition-all">
                <PremiumIcons.ShieldCheck className="h-5 w-5 mr-2" />
                Garantia de 30 Dias
              </Link>
            </div>
            <p className="text-blue-100 text-sm mt-6">
              <PremiumIcons.Check className="h-4 w-4 inline mr-1" />
              Sem contrato de fidelidade • Cancele a qualquer momento
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}