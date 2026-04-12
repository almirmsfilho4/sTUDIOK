'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumHero from '@/components/PremiumHero';
import PremiumIcons from '@/components/PremiumIcons';
import { Card, Button, Badge } from '@/components/PremiumUI';

type Competitor = {
  id: string;
  name: string;
  price: number | string;
  features: {
    [key: string]: boolean | string;
  };
  rating: number;
  pros: string[];
  cons: string[];
  color: string;
  icon: keyof typeof PremiumIcons;
};

export default function ComparadorConcorrentesPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('estudiok');

  const competitors: Competitor[] = [
    {
      id: 'estudiok',
      name: 'ESTUDIOK',
      price: 2997,
      features: {
        'Automação Completa': true,
        '10 APIs IA Gratuitas': true,
        'Garantia 30 Dias': true,
        'Suporte Premium': '24/7 WhatsApp',
        'Setup Gratuito': true,
        'Resultados em 7 Dias': true,
        'Sistema de Indicação': 'R$ 500 por lead',
        'Treinamento Incluso': true,
        'Customização Total': true,
        'Pagamento Mensal': true,
      },
      rating: 5.0,
      pros: ['Melhor custo-benefício', 'Suporte em português', 'Sem fidelidade'],
      cons: ['Não tem escritório físico'],
      color: 'bg-gradient-to-r from-blue-600 to-blue-700',
      icon: 'Award',
    },
    {
      id: 'agencia-traditional',
      name: 'Agência Tradicional',
      price: 'R$ 8.000+',
      features: {
        'Automação Completa': false,
        '10 APIs IA Gratuitas': false,
        'Garantia 30 Dias': false,
        'Suporte Premium': 'Horário comercial',
        'Setup Gratuito': false,
        'Resultados em 7 Dias': false,
        'Sistema de Indicação': false,
        'Treinamento Incluso': 'R$ 2.000 extra',
        'Customização Total': 'Limitada',
        'Pagamento Mensal': 'Anual adiantado',
      },
      rating: 3.2,
      pros: ['Escritório físico', 'Equipe grande'],
      cons: ['Caríssimo', 'Lento', 'Sem garantia', 'Contrato anual'],
      color: 'bg-gradient-to-r from-gray-600 to-gray-700',
      icon: 'Building',
    },
    {
      id: 'freelancer',
      name: 'Freelancer',
      price: 'R$ 1.500-5.000',
      features: {
        'Automação Completa': 'Parcial',
        '10 APIs IA Gratuitas': false,
        'Garantia 30 Dias': false,
        'Suporte Premium': 'Quando disponível',
        'Setup Gratuito': false,
        'Resultados em 7 Dias': 'Raro',
        'Sistema de Indicação': false,
        'Treinamento Incluso': false,
        'Customização Total': 'Depende do freelancer',
        'Pagamento Mensal': 'À combinar',
      },
      rating: 2.8,
      pros: ['Preço inicial baixo', 'Flexibilidade'],
      cons: ['Risco de sumir', 'Qualidade instável', 'Sem suporte', 'Sem garantia'],
      color: 'bg-gradient-to-r from-yellow-600 to-yellow-700',
      icon: 'User',
    },
    {
      id: 'software-saas',
      name: 'Software SaaS Internacional',
      price: '$299/mês',
      features: {
        'Automação Completa': true,
        '10 APIs IA Gratuitas': false,
        'Garantia 30 Dias': false,
        'Suporte Premium': 'Inglês apenas',
        'Setup Gratuito': false,
        'Resultados em 7 Dias': true,
        'Sistema de Indicação': false,
        'Treinamento Incluso': 'Tutoriais em inglês',
        'Customização Total': false,
        'Pagamento Mensal': true,
      },
      rating: 4.1,
      pros: ['Tecnologia avançada', 'Escalável'],
      cons: ['Sem suporte BR', 'Custo em dólar', 'Sem personalização local', 'Complexo'],
      color: 'bg-gradient-to-r from-purple-600 to-purple-700',
      icon: 'Globe',
    },
  ];

  const featureLabels = [
    'Automação Completa',
    '10 APIs IA Gratuitas',
    'Garantia 30 Dias',
    'Suporte Premium',
    'Setup Gratuito',
    'Resultados em 7 Dias',
    'Sistema de Indicação',
    'Treinamento Incluso',
    'Customização Total',
    'Pagamento Mensal',
  ];

  const getFeatureDisplay = (value?: boolean | string) => {
    if (value === true) return { text: '✓', color: 'text-green-600', bg: 'bg-green-50' };
    if (value === false) return { text: '✗', color: 'text-red-600', bg: 'bg-red-50' };
    return { text: value || '-', color: 'text-yellow-600', bg: 'bg-yellow-50' };
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <PremiumHero
          title={
            <>
              Comparador de <span className="text-blue-600">Concorrentes</span>
              <br />
              Veja por que somos a melhor escolha
            </>
          }
          subtitle="Compare recursos, preços e benefícios. Descubra por que a ESTUDIOK oferece o melhor custo-benefício do mercado."
          ctaText="Ver Comparativo Completo"
          ctaHref="#tabela-comparativa"
        >
          <div className="flex justify-center items-center space-x-4 mt-6">
            <div className="bg-blue-50 rounded-full p-2">
              <PremiumIcons.Scale className="h-6 w-6 text-blue-600" />
            </div>
            <div className="bg-blue-50 rounded-full p-2">
              <PremiumIcons.TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div className="bg-blue-50 rounded-full p-2">
              <PremiumIcons.Trophy className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </PremiumHero>
      </section>

      {/* Tabela Comparativa */}
      <section id="tabela-comparativa" className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comparação Detalhada</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Analise lado a lado todos os recursos e diferenciais
            </p>
          </div>

          {/* Cards dos concorrentes */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {competitors.map((competitor) => {
              const Icon = PremiumIcons[competitor.icon];
              return (
                <div
                  key={competitor.id}
                  onClick={() => setSelectedPlan(competitor.id)}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedPlan === competitor.id ? 'scale-105' : ''
                  }`}
                >
                  <Card className={`${selectedPlan === competitor.id ? 'ring-2 ring-blue-500' : ''} h-full`}>
                    <div className={`${competitor.color} text-white rounded-t-lg p-6`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="bg-white/20 rounded-full p-2">
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="premium">
                          {competitor.rating.toFixed(1)} ★
                        </Badge>
                      </div>
                      <h3 className="text-xl font-bold">{competitor.name}</h3>
                      <div className="text-2xl font-bold mt-2">
                        {typeof competitor.price === 'number' 
                          ? `R$ ${competitor.price.toLocaleString()}/mês`
                          : competitor.price}
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-2">Pontos Fortes</h4>
                          <ul className="space-y-1">
                            {competitor.pros.slice(0, 3).map((pro, idx) => (
                              <li key={idx} className="flex items-center text-sm text-green-600">
                                <PremiumIcons.Check className="h-4 w-4 mr-2 flex-shrink-0" />
                                {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-2">Pontos Fracos</h4>
                          <ul className="space-y-1">
                            {competitor.cons.slice(0, 3).map((con, idx) => (
                              <li key={idx} className="flex items-center text-sm text-red-600">
                                <PremiumIcons.X className="h-4 w-4 mr-2 flex-shrink-0" />
                                {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      <div className="mt-6">
                          <Button
                            variant={selectedPlan === competitor.id ? 'primary' : 'secondary'}
                            className="w-full"
                            onClick={() => setSelectedPlan(competitor.id)}
                          >
                          {selectedPlan === competitor.id ? 'Selecionado' : 'Selecionar'}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Tabela de Recursos Detalhada */}
          <Card className="overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left p-6 font-semibold text-gray-700">
                      <PremiumIcons.Grid className="h-5 w-5 inline mr-2" />
                      Recursos
                    </th>
                    {competitors.map((competitor) => (
                      <th key={competitor.id} className="text-center p-6 font-semibold">
                        <div className={`${competitor.color} text-white rounded-lg p-4`}>
                          <div className="flex flex-col items-center">
                            <div className="text-lg font-bold">{competitor.name}</div>
                            <div className="text-sm opacity-90">
                              {typeof competitor.price === 'number' 
                                ? `R$ ${competitor.price.toLocaleString()}/mês`
                                : competitor.price}
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {featureLabels.map((feature, idx) => (
                    <tr key={feature} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 font-medium text-gray-700">
                        {feature}
                      </td>
                      {competitors.map((competitor) => {
                        const featureValue = competitor.features[feature];
                        const display = getFeatureDisplay(featureValue);
                        return (
                          <td key={`${competitor.id}-${feature}`} className="text-center p-4">
                            <div className={`inline-flex items-center justify-center ${display.bg} px-4 py-2 rounded-full`}>
                              <span className={`${display.color} font-medium`}>
                                {display.text}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-8 bg-gradient-to-r from-blue-50 to-blue-100 border-t border-blue-200">
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-2">Conclusão da Análise</h3>
                  <p className="text-gray-600">
                    A ESTUDIOK oferece o melhor custo-benefício com recursos premium a preço acessível.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Link href="/checkout" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00D4FF]/30 transition-all">
                    <PremiumIcons.ShoppingCart className="h-5 w-5 mr-2" />
                    Escolher ESTUDIOK
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Vantagens Exclusivas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Vantagens Exclusivas da ESTUDIOK</h2>
              <p className="text-gray-600">
                Recursos que você não encontra em nenhum outro concorrente
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: 'Zap',
                  title: 'Suporte WhatsApp 24/7',
                  description: 'Atendimento direto com nossa equipe em português',
                },
                {
                  icon: 'ShieldCheck',
                  title: 'Garantia de 30 Dias',
                  description: 'Teste sem risco. Se não gostar, devolvemos seu dinheiro',
                },
                {
                  icon: 'Coins',
                  title: 'Sistema de Indicação',
                  description: 'Ganhe R$ 500 por cada indicação que virar cliente',
                },
                {
                  icon: 'Cpu',
                  title: '10 APIs IA Gratuitas',
                  description: 'Rotação automática entre múltiplas IAs sem custo extra',
                },
                {
                  icon: 'Users',
                  title: 'Setup Gratuito',
                  description: 'Implementação completa sem custos adicionais',
                },
                {
                  icon: 'Clock',
                  title: 'Sem Contrato de Fidelidade',
                  description: 'Cancele quando quiser sem multas ou burocracia',
                },
              ].map((vantagem, idx) => {
                const Icon = PremiumIcons[vantagem.icon as keyof typeof PremiumIcons];
                return (
                  <Card key={idx} className="hover:shadow-xl transition-shadow">
                    <div className="p-6 text-center">
                      <div className="bg-blue-50 rounded-full p-3 inline-block mb-4">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{vantagem.title}</h3>
                      <p className="text-gray-600 text-sm">{vantagem.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Calculadora de Economia */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
            <div className="p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Economize até 70%</h2>
                <p className="text-green-100 text-lg">
                  Comparado com agências tradicionais, você economiza milhares de reais
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">R$ 5.000+</div>
                  <p className="text-green-100">Economia mensal vs agência</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">R$ 60.000+</div>
                  <p className="text-green-100">Economia anual</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">3×</div>
                  <p className="text-green-100">Mais resultados pelo mesmo investimento</p>
                </div>
              </div>

              <div className="text-center">
                <Link href="/checkout" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  <PremiumIcons.Calculator className="h-5 w-5 mr-2" />
                  Calcular Minha Economia
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Pronto para Escolher o Melhor?</h2>
          <p className="text-gray-600 mb-8 text-lg">
            A análise não mente: a ESTUDIOK oferece o melhor custo-benefício com 
            recursos premium a preço acessível.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/checkout" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-[#00D4FF]/30 transition-all">
              <PremiumIcons.ShoppingCart className="h-5 w-5 mr-2" />
              Escolher ESTUDIOK Agora
            </Link>
            <Link href="/simulador-roi" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white border border-[#242424] rounded-xl font-semibold hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5 transition-all">
              <PremiumIcons.Calculator className="h-5 w-5 mr-2" />
              Calcular Meu ROI
            </Link>
          </div>
          <p className="text-gray-500 text-sm mt-6">
            <PremiumIcons.ShieldCheck className="h-4 w-4 inline mr-1" />
            Protegido pela Garantia de 30 Dias • Sem contrato de fidelidade
          </p>
        </div>
      </section>
    </div>
  );
}