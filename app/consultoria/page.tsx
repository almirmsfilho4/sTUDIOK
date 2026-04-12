'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumHero from '@/components/PremiumHero';
import PremiumIcons from '@/components/PremiumIcons';
import { Card, Button, Badge, StatCard } from '@/components/PremiumUI';

export default function ConsultoriaPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção, aqui seria integração com checkout
    console.log('Consulta solicitada:', {
      nome,
      email,
      whatsapp,
      empresa,
      objetivo,
    });
    setSubmitted(true);
    
    // Simulação de redirecionamento para checkout
    setTimeout(() => {
      window.location.href = '/checkout/consultoria-express';
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <PremiumHero
          title={
            <>
              Consultoria <span className="text-green-600">Express</span>
              <br />
              R$ 297 • 30 minutos • Resultados Imediatos
            </>
          }
          subtitle="Sessão estratégica com nossos especialistas. Identificamos oportunidades e traçamos plano de ação para seu negócio."
          ctaText="Agendar Minha Consultoria"
          ctaHref="#formulario-consultoria"
        >
          <div className="flex justify-center items-center space-x-4 mt-6">
            <div className="bg-green-50 rounded-full p-2">
              <PremiumIcons.Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="bg-yellow-50 rounded-full p-2">
              <PremiumIcons.Lightbulb className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="bg-blue-50 rounded-full p-2">
              <PremiumIcons.Target className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </PremiumHero>

        {/* Banner de Preço */}
        <div className="container mx-auto px-4 md:px-6 -mt-20 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-2xl">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">R$ 297 • 30 Minutos</h2>
                    <p className="text-green-100">Valor único • Sem mensalidade • Com plano de ação</p>
                  </div>
                    <div className="mt-4 md:mt-0">
                    <Badge variant="premium" className="text-lg px-4 py-2">
                      <PremiumIcons.Zap className="h-5 w-5 mr-1" />
                      Resultados Imediatos
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* O que você recebe */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">O que você leva desta consultoria</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Mais do que uma conversa, você recebe um plano de ação concreto para implementar imediatamente
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: 'FileText',
                title: 'Diagnóstico Completo',
                description: 'Análise detalhada do seu negócio atual e identificação de gargalos.',
                color: 'from-blue-50 to-blue-100',
              },
              {
                icon: 'Target',
                title: 'Plano de Ação',
                description: 'Roteiro passo a passo com ações prioritárias para implementar.',
                color: 'from-green-50 to-green-100',
              },
              {
                icon: 'Zap',
                title: 'Estratégias Práticas',
                description: 'Técnicas testadas e comprovadas para aumentar resultados.',
                color: 'from-yellow-50 to-yellow-100',
              },
             ].map((item, idx) => {
               return (
                 <Card key={idx} className={`bg-gradient-to-r ${item.color}`}>
                   <div className="p-6 text-center">
                     <div className="mb-4">
                       <div className="bg-white rounded-full p-3 inline-block">
                         <PremiumIcons.PremiumIcon name={item.icon} className="h-8 w-8" />
                       </div>
                     </div>
                     <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                     <p className="text-gray-600">{item.description}</p>
                   </div>
                 </Card>
               );
             })}
          </div>

          {/* Estatísticas */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <StatCard
              title="Clientes Atendidos"
              value="350+"
              icon={<PremiumIcons.Users className="h-6 w-6" />}
              description="Empreendedores transformados"
              trend="up"
            />
            <StatCard
              title="Aumento Médio"
              value="142%"
              icon={<PremiumIcons.ChartLine className="h-6 w-6" />}
              description="Nos resultados após 3 meses"
              trend="up"
            />
            <StatCard
              title="Satisfação"
              value="97%"
              icon={<PremiumIcons.Star className="h-6 w-6" />}
              description="Taxa de aprovação dos clientes"
              trend="up"
            />
          </div>

          {/* Formulário de Solicitação */}
          <section id="formulario-consultoria" className="mb-16">
            <div className="max-w-2xl mx-auto">
              {submitted ? (
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                  <div className="p-8 text-center">
                    <div className="bg-green-100 rounded-full p-4 inline-block mb-6">
                      <PremiumIcons.CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Solicitação Recebida!</h2>
                    <p className="text-gray-700 mb-6">
                      Em instantes você será redirecionado para o pagamento seguro.
                    </p>
                    <div className="bg-white p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-center">
                        <PremiumIcons.Calendar className="h-6 w-6 text-green-600 mr-2" />
                        <span className="text-lg font-semibold">
                          Redirecionando para agendamento...
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                      Se o redirecionamento não acontecer automaticamente em 5 segundos,{' '}
                      <button
                        onClick={() => window.location.href = '/checkout/consultoria-express'}
                        className="text-green-600 font-medium hover:underline"
                      >
                        clique aqui
                      </button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card>
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold mb-2">Solicitar Consultoria</h2>
                      <p className="text-gray-600">
                        Preencha os dados para personalizarmos sua sessão
                      </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <PremiumIcons.User className="h-4 w-4 inline mr-2" />
                            Seu Nome Completo
                          </label>
                          <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Digite seu nome completo"
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              <PremiumIcons.Mail className="h-4 w-4 inline mr-2" />
                              Seu Email
                            </label>
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="seu@email.com"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              <PremiumIcons.Phone className="h-4 w-4 inline mr-2" />
                              WhatsApp
                            </label>
                            <input
                              type="tel"
                              value={whatsapp}
                              onChange={(e) => setWhatsapp(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="(11) 99999-9999"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <PremiumIcons.Building className="h-4 w-4 inline mr-2" />
                            Nome da Empresa/Negócio
                          </label>
                          <input
                            type="text"
                            value={empresa}
                            onChange={(e) => setEmpresa(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder="Nome da sua empresa ou negócio"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <PremiumIcons.Target className="h-4 w-4 inline mr-2" />
                            Principal Objetivo com a Consultoria
                          </label>
                          <select
                            value={objetivo}
                            onChange={(e) => setObjetivo(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            required
                          >
                            <option value="">Selecione seu objetivo principal</option>
                            <option value="aumentar-vendas">Aumentar Vendas</option>
                            <option value="melhorar-site">Melhorar Site/App</option>
                            <option value="captar-leads">Captar Mais Leads</option>
                            <option value="reduzir-custos">Reduzir Custos</option>
                            <option value="escalar-negocio">Escalar o Negócio</option>
                            <option value="outro">Outro Objetivo</option>
                          </select>
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                          <div className="flex items-start">
                            <PremiumIcons.Info className="h-5 w-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold mb-1">O que você recebe</h4>
                              <ul className="text-sm text-green-700 space-y-1">
                                <li>• Diagnóstico completo do seu negócio</li>
                                <li>• Plano de ação com 5-7 passos concretos</li>
                                <li>• Estratégias específicas para seu caso</li>
                                <li>• Gravação da sessão disponível por 30 dias</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        <div>
                          <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                          >
                            <PremiumIcons.CreditCard className="h-5 w-5 mr-2" />
                            Solicitar Consultoria - R$ 297
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Card>
              )}
            </div>
          </section>

          {/* Temas Abordados */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Temas que Podemos Abordar</h2>
                <p className="text-gray-600">
                  Escolha o foco da sua consultoria ou deixe que nossos especialistas definam
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    icon: 'TrendingUp',
                    title: 'Marketing Digital',
                    topics: ['SEO', 'Tráfego pago', 'Redes sociais', 'Email marketing'],
                  },
                  {
                    icon: 'ShoppingCart',
                    title: 'Vendas & Conversão',
                    topics: ['Funil de vendas', 'Copywriting', 'UX/UI', 'Testes A/B'],
                  },
                  {
                    icon: 'Cpu',
                    title: 'Tecnologia',
                    topics: ['Automação', 'Ferramentas', 'Integrações', 'Performance'],
                  },
                  {
                    icon: 'DollarSign',
                    title: 'Finanças & ROI',
                    topics: ['Custos', 'Investimentos', 'Métricas', 'Retorno'],
                  },
                 ].map((tema, idx) => {
                   return (
                     <Card key={idx} className="hover:shadow-xl transition-shadow">
                       <div className="p-6">
                         <div className="flex items-center mb-4">
                           <div className="bg-green-50 rounded-full p-3 mr-4">
                             <PremiumIcons.PremiumIcon name={tema.icon} className="h-6 w-6 text-green-600" />
                           </div>
                           <h3 className="text-lg font-semibold">{tema.title}</h3>
                         </div>
                         <ul className="space-y-2">
                           {tema.topics.map((topic, tIdx) => (
                             <li key={tIdx} className="flex items-center text-sm text-gray-600">
                               <PremiumIcons.Check className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                               {topic}
                             </li>
                           ))}
                         </ul>
                       </div>
                     </Card>
                   );
                 })}
              </div>
            </div>
          </section>

          {/* Depoimentos */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Resultados após a Consultoria</h2>
                <p className="text-gray-600">
                  Veja o que outros empreendedores conseguiram
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    nome: 'Ricardo Mendes',
                    empresa: 'E-commerce de Esportes',
                    resultado: '+220% em 2 meses',
                    texto: 'A consultoria identificou falhas no checkout que custavam R$ 15.000/mês em vendas perdidas.',
                  },
                  {
                    nome: 'Fernanda Lima',
                    empresa: 'Consultoria em RH',
                    resultado: '45% mais leads',
                    texto: 'As estratégias de conteúdo sugeridas transformaram nossa captação de leads.',
                  },
                ].map((depoimento, idx) => (
                  <Card key={idx} className="bg-gradient-to-r from-green-50 to-green-100">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-white rounded-full p-2 mr-4">
                          <PremiumIcons.Quote className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-bold">{depoimento.nome}</h3>
                          <p className="text-sm text-gray-600">{depoimento.empresa}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{depoimento.texto}"</p>
                      <div className="bg-white px-4 py-2 rounded-lg inline-block">
                        <span className="font-bold text-green-600">{depoimento.resultado}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Comparativo */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-6 text-center">Por que vale cada centavo</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <PremiumIcons.CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                        Consultoria Express
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <PremiumIcons.Check className="h-4 w-4 text-green-600 mr-2" />
                          R$ 297 • Valor único
                        </li>
                        <li className="flex items-center text-sm">
                          <PremiumIcons.Check className="h-4 w-4 text-green-600 mr-2" />
                          30 minutos • Foco total
                        </li>
                        <li className="flex items-center text-sm">
                          <PremiumIcons.Check className="h-4 w-4 text-green-600 mr-2" />
                          Plano de ação concreto
                        </li>
                        <li className="flex items-center text-sm">
                          <PremiumIcons.Check className="h-4 w-4 text-green-600 mr-2" />
                          Gravação disponível
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center">
                        <PremiumIcons.XCircle className="h-5 w-5 text-red-600 mr-2" />
                        Alternativas Caras
                      </h4>
                      <ul className="space-y-2">
                        <li className="flex items-center text-sm">
                          <PremiumIcons.X className="h-4 w-4 text-red-600 mr-2" />
                          R$ 2.000+ • Agências
                        </li>
                        <li className="flex items-center text-sm">
                          <PremiumIcons.X className="h-4 w-4 text-red-600 mr-2" />
                          Meses de contrato
                        </li>
                        <li className="flex items-center text-sm">
                          <PremiumIcons.X className="h-4 w-4 text-red-600 mr-2" />
                          Propostas genéricas
                        </li>
                        <li className="flex items-center text-sm">
                          <PremiumIcons.X className="h-4 w-4 text-red-600 mr-2" />
                          Sem garantia de resultado
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* CTA Final */}
          <section>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
                <div className="p-8 md:p-12 text-center">
                  <h2 className="text-3xl font-bold mb-4">Invista em Resultados Reais</h2>
                  <p className="text-green-100 mb-8 text-lg">
                    Por R$ 297 você pode descobrir oportunidades que valem milhares.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="#formulario-consultoria" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                      <PremiumIcons.Calendar className="h-5 w-5 mr-2" />
                      Solicitar Minha Consultoria
                    </Link>
                    <Link href="/garantia" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                      <PremiumIcons.ShieldCheck className="h-5 w-5 mr-2" />
                      Garantia de Satisfação
                    </Link>
                  </div>
                  <p className="text-green-100 text-sm mt-6">
                    <PremiumIcons.Clock className="h-4 w-4 inline mr-1" />
                    Sessão de 30 minutos • Plano de ação incluído • Sem compromisso futuro
                  </p>
                </div>
              </Card>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}