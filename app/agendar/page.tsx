'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumHero from '@/components/PremiumHero';
import PremiumIcons from '@/components/PremiumIcons';
import { Card, Button, Badge } from '@/components/PremiumUI';
import { trackLeadFormSubmit, trackCalendlyBooking } from '@/components/MarketingScripts';

export default function AgendarPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Registrar lead no analytics
    trackLeadFormSubmit('agendamento_form', {
      nome,
      email,
      whatsapp,
      empresa,
      objetivo,
    });
    
    // Registrar agendamento no analytics
    trackCalendlyBooking(nome, 'consultoria_30min');
    
    setSubmitted(true);
    
    // Redirecionar para Calendly (em produção)
    setTimeout(() => {
      window.open('https://calendly.com/estudiok/consultoria', '_blank');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <PremiumHero
          title={
            <>
              Agendamento <span className="text-orange-600">Premium</span>
              <br />
              Fale com nossos especialistas
            </>
          }
          subtitle="Reserve um horário exclusivo para uma análise gratuita do seu negócio. Veja como podemos multiplicar seus resultados."
          ctaText="Escolher Horário Disponível"
          ctaHref="#formulario-agendamento"
        />

        {/* Banner de Consultoria Gratuita */}
        <div className="container mx-auto px-4 md:px-6 -mt-20 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-2xl">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Consulta Estratégica Gratuita</h2>
                    <p className="text-orange-100">30 minutos para analisar seu negócio e apresentar soluções</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Badge variant="premium" className="text-lg px-4 py-2">
                      <PremiumIcons.Gift className="h-5 w-5 mr-1" />
                      Totalmente Grátis
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Etapas do Agendamento */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Como Funciona a Consulta</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Um processo simples e eficiente para você entender como podemos transformar seu negócio
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              {
                icon: 'Calendar',
                title: '1. Escolha o Horário',
                description: 'Selecione um horário que funcione para você em nossa agenda',
                color: 'from-blue-50 to-blue-100',
              },
              {
                icon: 'Video',
                title: '2. Reunião Online',
                description: 'Videoconferência de 30 minutos com nossos especialistas',
                color: 'from-orange-50 to-orange-100',
              },
              {
                icon: 'FileText',
                title: '3. Plano Personalizado',
                description: 'Receba uma proposta detalhada com estratégias específicas',
                color: 'from-green-50 to-green-100',
              },
             ].map((step, idx) => {
               return (
                 <Card key={idx} className={`bg-gradient-to-r ${step.color}`}>
                   <div className="p-6 text-center">
                     <div className="mb-4">
                       <div className="bg-white rounded-full p-3 inline-block">
                         <PremiumIcons.PremiumIcon name={step.icon} className="h-8 w-8" />
                       </div>
                     </div>
                     <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                     <p className="text-gray-600">{step.description}</p>
                   </div>
                 </Card>
               );
             })}
          </div>

          {/* Formulário de Pré-agendamento */}
          <section id="formulario-agendamento" className="mb-16">
            <div className="max-w-2xl mx-auto">
              {submitted ? (
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                  <div className="p-8 text-center">
                    <div className="bg-green-100 rounded-full p-4 inline-block mb-6">
                      <PremiumIcons.CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Solicitação Enviada!</h2>
                    <p className="text-gray-700 mb-6">
                      Em instantes você será redirecionado para escolher o melhor horário.
                    </p>
                    <div className="bg-white p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-center">
                        <PremiumIcons.Calendar className="h-6 w-6 text-orange-600 mr-2" />
                        <span className="text-lg font-semibold">
                          Escolhendo horário para {nome}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mb-6">
                      Se o redirecionamento não acontecer automaticamente,{' '}
                      <a 
                        href="https://calendly.com/estudiok/consultoria" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 font-medium hover:underline"
                      >
                        clique aqui para acessar a agenda
                      </a>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setSubmitted(false)}
                    >
                      <PremiumIcons.Refresh className="h-5 w-5 mr-2" />
                      Nova Solicitação
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card>
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold mb-2">Pré-agendamento</h2>
                      <p className="text-gray-600">
                        Preencha os dados para personalizarmos sua consulta
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="Nome da sua empresa ou negócio"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <PremiumIcons.Target className="h-4 w-4 inline mr-2" />
                            Principal Objetivo
                          </label>
                          <select
                            value={objetivo}
                            onChange={(e) => setObjetivo(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                          >
                            <option value="">Selecione seu objetivo principal</option>
                            <option value="aumentar-vendas">Aumentar Vendas</option>
                            <option value="captar-leads">Captar Mais Leads</option>
                            <option value="melhorar-site">Melhorar Site/App</option>
                            <option value="automatizar-processos">Automatizar Processos</option>
                            <option value="criar-marca">Criar/Posicionar Marca</option>
                            <option value="outro">Outro Objetivo</option>
                          </select>
                        </div>

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                          <div className="flex items-start">
                            <PremiumIcons.Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold mb-1">O que esperar da consulta</h4>
                              <ul className="text-sm text-blue-700 space-y-1">
                                <li>• Análise do seu negócio atual</li>
                                <li>• Identificação de oportunidades</li>
                                <li>• Estratégias específicas para seu caso</li>
                                <li>• Proposta personalizada (sem compromisso)</li>
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
                            <PremiumIcons.Calendar className="h-5 w-5 mr-2" />
                            Escolher Horário Disponível
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Card>
              )}
            </div>
          </section>

          {/* Vantagens da Consulta */}
          <section className="mb-16">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Benefícios da Consulta Estratégica</h2>
                <p className="text-gray-600">
                  Por que essa conversa pode ser a mais importante para seu negócio
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    icon: 'Eye',
                    title: 'Visão Externa',
                    description: 'Analisamos seu negócio com olhar profissional, identificando oportunidades que você pode não estar vendo.',
                  },
                  {
                    icon: 'Zap',
                    title: 'Ideias Práticas',
                    description: 'Sugerimos ações concretas que você pode implementar imediatamente para ver resultados.',
                  },
                  {
                    icon: 'ChartLine',
                    title: 'Foco em ROI',
                    description: 'Todas as estratégias são pensadas para maximizar seu retorno sobre investimento.',
                  },
                  {
                    icon: 'Shield',
                    title: 'Sem Compromisso',
                    description: 'A consulta é gratuita e sem nenhuma obrigação de contratação posterior.',
                  },
                 ].map((beneficio, idx) => {
                   return (
                     <Card key={idx} className="hover:shadow-xl transition-shadow">
                       <div className="p-6">
                         <div className="flex items-start space-x-4">
                           <div className="bg-orange-50 rounded-full p-3 flex-shrink-0">
                             <PremiumIcons.PremiumIcon name={beneficio.icon} className="h-6 w-6 text-orange-600" />
                           </div>
                           <div>
                             <h3 className="text-lg font-semibold mb-2">{beneficio.title}</h3>
                             <p className="text-gray-600">{beneficio.description}</p>
                           </div>
                         </div>
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
                <h2 className="text-3xl font-bold mb-4">O que nossos clientes dizem</h2>
                <p className="text-gray-600">
                  Resultados reais após a consulta estratégica
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {[
                  {
                    nome: 'Carlos Silva',
                    empresa: 'E-commerce de Moda',
                    resultado: '+180% em 3 meses',
                    texto: 'A consulta identificou falhas no funil de vendas que nem sabíamos que existiam. Em 3 meses, multiplicamos o faturamento.',
                  },
                  {
                    nome: 'Mariana Costa',
                    empresa: 'Clínica de Estética',
                    resultado: '40 leads/dia',
                    texto: 'As estratégias de captação apresentadas na consulta nos fizeram passar de 5 para 40 leads por dia.',
                  },
                ].map((depoimento, idx) => (
                  <Card key={idx} className="bg-gradient-to-r from-orange-50 to-orange-100">
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="bg-white rounded-full p-2 mr-4">
                          <PremiumIcons.Quote className="h-6 w-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="font-bold">{depoimento.nome}</h3>
                          <p className="text-sm text-gray-600">{depoimento.empresa}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4 italic">"{depoimento.texto}"</p>
                      <div className="bg-white px-4 py-2 rounded-lg inline-block">
                        <span className="font-bold text-orange-600">{depoimento.resultado}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
                <div className="p-8 md:p-12 text-center">
                  <h2 className="text-3xl font-bold mb-4">Reserve seu Horário Agora</h2>
                  <p className="text-orange-100 mb-8 text-lg">
                    Horários limitados disponíveis. Garanta sua análise gratuita.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="#formulario-agendamento" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-orange-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                      <PremiumIcons.Calendar className="h-5 w-5 mr-2" />
                      Escolher Horário
                    </Link>
                    <Link href="/simulador-roi" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-all">
                      <PremiumIcons.Calculator className="h-5 w-5 mr-2" />
                      Simular Meu ROI Primeiro
                    </Link>
                  </div>
                  <p className="text-orange-100 text-sm mt-6">
                    <PremiumIcons.Clock className="h-4 w-4 inline mr-1" />
                    Consulta de 30 minutos • Totalmente gratuita • Sem compromisso
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