'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumHero from '@/components/PremiumHero';
import PremiumIcons from '@/components/PremiumIcons';
import { Card, Button, Badge, StatCard } from '@/components/PremiumUI';

export default function IndicacaoPage() {
  const [nomeIndicado, setNomeIndicado] = useState('');
  const [emailIndicado, setEmailIndicado] = useState('');
  const [telefoneIndicado, setTelefoneIndicado] = useState('');
  const [empresaIndicado, setEmpresaIndicado] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em produção, aqui seria uma chamada de API
    console.log('Indicação enviada:', {
      nome: nomeIndicado,
      email: emailIndicado,
      telefone: telefoneIndicado,
      empresa: empresaIndicado,
    });
    setSubmitted(true);
    
    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitted(false);
      setNomeIndicado('');
      setEmailIndicado('');
      setTelefoneIndicado('');
      setEmpresaIndicado('');
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-purple-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <PremiumHero
          title={
            <>
              Sistema de <span className="text-purple-600">Indicação Premium</span>
              <br />
              Ganhe <span className="text-green-600">R$ 500</span> por indicação
            </>
          }
          subtitle="Indique empreendedores que precisam de marketing digital e receba R$ 500 por cada um que virar cliente."
          ctaText="Começar a Indicar Agora"
          ctaHref="#formulario-indicacao"
        >
          <div className="flex justify-center items-center space-x-4 mt-6">
            <div className="bg-green-50 rounded-full p-2">
              <PremiumIcons.Coins className="h-6 w-6 text-green-600" />
            </div>
            <div className="bg-purple-50 rounded-full p-2">
              <PremiumIcons.Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="bg-yellow-50 rounded-full p-2">
              <PremiumIcons.Gift className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </PremiumHero>

        {/* Banner de Recompensa */}
        <div className="container mx-auto px-4 md:px-6 -mt-20 relative z-10">
          <div className="max-w-3xl mx-auto">
            <Card className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-2xl">
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">R$ 500 por Indicação</h2>
                    <p className="text-green-100">Pagamento via PIX em até 24h após o cliente fechar</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Badge variant="premium" className="text-lg px-4 py-2">
                      <PremiumIcons.Zap className="h-5 w-5 mr-1" />
                      Pagamento Imediato
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Como Funciona o Programa</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Simples, rápido e lucrativo. Veja como você pode começar a ganhar agora mesmo.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 mb-16">
            {[
              {
                icon: 'UserPlus',
                title: '1. Indique',
                description: 'Preencha o formulário com os dados do empreendedor',
                color: 'from-blue-50 to-blue-100',
              },
              {
                icon: 'MessageSquare',
                title: '2. Contatamos',
                description: 'Nossa equipe entra em contato em até 24h',
                color: 'from-purple-50 to-purple-100',
              },
              {
                icon: 'Handshake',
                title: '3. Fechamos',
                description: 'O indicado fecha contrato com a ESTUDIOK',
                color: 'from-green-50 to-green-100',
              },
              {
                icon: 'Coins',
                title: '4. Você Ganha',
                description: 'R$ 500 depositados via PIX em 24h',
                color: 'from-yellow-50 to-yellow-100',
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

          {/* Estatísticas */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <StatCard
              title="Total Pago em Indicações"
              value="R$ 42.500+"
              icon={<PremiumIcons.Coins className="h-6 w-6" />}
              description="Distribuídos para nossos parceiros"
              trend="up"
            />
            <StatCard
              title="Indicações Convertidas"
              value="85+"
              icon={<PremiumIcons.Users className="h-6 w-6" />}
              description="Empreendedores indicados que viraram clientes"
              trend="up"
            />
            <StatCard
              title="Taxa de Conversão"
              value="63%"
              icon={<PremiumIcons.Percent className="h-6 w-6" />}
              description="Dos indicados fecham contrato"
              trend="up"
            />
          </div>

          {/* Formulário de Indicação */}
          <section id="formulario-indicacao" className="mb-16">
            <div className="max-w-2xl mx-auto">
              {submitted ? (
                <Card className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200">
                  <div className="p-8 text-center">
                    <div className="bg-green-100 rounded-full p-4 inline-block mb-6">
                      <PremiumIcons.CheckCircle className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Indicação Enviada com Sucesso!</h2>
                    <p className="text-gray-700 mb-6">
                      Nossa equipe entrará em contato com {nomeIndicado} em até 24 horas.
                      Você será notificado assim que o processo avançar.
                    </p>
                    <div className="bg-white p-4 rounded-lg mb-6">
                      <div className="flex items-center justify-center">
                        <PremiumIcons.Coins className="h-6 w-6 text-yellow-600 mr-2" />
                        <span className="text-lg font-semibold">
                          Ganhe R$ 500 se {nomeIndicado} fechar contrato!
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => setSubmitted(false)}
                    >
                      <PremiumIcons.Refresh className="h-5 w-5 mr-2" />
                      Fazer Nova Indicação
                    </Button>
                  </div>
                </Card>
              ) : (
                <Card>
                  <div className="p-8">
                    <div className="text-center mb-8">
                      <h2 className="text-2xl font-bold mb-2">Formulário de Indicação</h2>
                      <p className="text-gray-600">
                        Preencha os dados do empreendedor que você está indicando
                      </p>
                    </div>

                    <form onSubmit={handleSubmit}>
                      <div className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <PremiumIcons.User className="h-4 w-4 inline mr-2" />
                            Nome Completo do Indicado
                          </label>
                          <input
                            type="text"
                            value={nomeIndicado}
                            onChange={(e) => setNomeIndicado(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Digite o nome completo"
                            required
                          />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              <PremiumIcons.Mail className="h-4 w-4 inline mr-2" />
                              Email do Indicado
                            </label>
                            <input
                              type="email"
                              value={emailIndicado}
                              onChange={(e) => setEmailIndicado(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="email@empresa.com"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">
                              <PremiumIcons.Phone className="h-4 w-4 inline mr-2" />
                              WhatsApp do Indicado
                            </label>
                            <input
                              type="tel"
                              value={telefoneIndicado}
                              onChange={(e) => setTelefoneIndicado(e.target.value)}
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              placeholder="(11) 99999-9999"
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <PremiumIcons.Building className="h-4 w-4 inline mr-2" />
                            Nome da Empresa (opcional)
                          </label>
                          <input
                            type="text"
                            value={empresaIndicado}
                            onChange={(e) => setEmpresaIndicado(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Nome da empresa ou negócio"
                          />
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                          <div className="flex items-start">
                            <PremiumIcons.AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <h4 className="font-semibold mb-1">Importante</h4>
                              <p className="text-sm text-yellow-700">
                                O indicado será contatado pela nossa equipe em até 24 horas.
                                Você receberá R$ 500 via PIX assim que ele fechar contrato.
                              </p>
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
                            <PremiumIcons.Send className="h-5 w-5 mr-2" />
                            Enviar Indicação
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </Card>
              )}
            </div>
          </section>

          {/* FAQ */}
          <section className="mb-16">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
                <p className="text-gray-600">
                  Tire suas dúvidas sobre o programa de indicações
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    question: 'Quem pode participar do programa?',
                    answer: 'Qualquer pessoa pode indicar empreendores. Não é necessário ser cliente da ESTUDIOK para participar.',
                  },
                  {
                    question: 'Como e quando recebo o pagamento?',
                    answer: 'O pagamento de R$ 500 é feito via PIX em até 24 horas após o indicado assinar o contrato e realizar o primeiro pagamento.',
                  },
                  {
                    question: 'Existe limite de indicações?',
                    answer: 'Não! Você pode indicar quantos empreendores quiser. Cada indicação convertida vale R$ 500.',
                  },
                  {
                    question: 'O indicado sabe que eu o indiquei?',
                    answer: 'Sim, informamos que ele foi indicado por você. Isso cria uma relação de confiança e transparência.',
                  },
                  {
                    question: 'Preciso acompanhar o processo?',
                    answer: 'Não, nossa equipe cuida de todo o processo de vendas. Você apenas recebe a notificação e o pagamento quando o contrato for fechado.',
                  },
                ].map((item, idx) => (
                  <Card key={idx}>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <PremiumIcons.HelpCircle className="h-5 w-5 text-purple-600 mr-2" />
                        {item.question}
                      </h3>
                      <p className="text-gray-600">{item.answer}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section>
            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-purple-600 to-blue-700 text-white">
                <div className="p-8 md:p-12 text-center">
                  <h2 className="text-3xl font-bold mb-4">Comece a Ganhar Agora</h2>
                  <p className="text-purple-100 mb-8 text-lg">
                    Não perca tempo. Cada indicação pode valer R$ 500 no seu bolso.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="#formulario-indicacao" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-purple-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                      <PremiumIcons.UserPlus className="h-5 w-5 mr-2" />
                      Fazer Minha Primeira Indicação
                    </Link>
                    <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white border border-[#242424] rounded-xl font-semibold hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5 transition-all">
                      <PremiumIcons.ChevronLeft className="h-5 w-5 mr-2" />
                      Voltar para Home
                    </Link>
                  </div>
                  <p className="text-purple-100 text-sm mt-6">
                    <PremiumIcons.Shield className="h-4 w-4 inline mr-1" />
                    Programa 100% seguro e transparente • Pagamentos garantidos via PIX
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