'use client';

import Link from 'next/link';
import PremiumHero from '@/components/PremiumHero';
import PremiumIcons from '@/components/PremiumIcons';
import { Card, Badge, Button } from '@/components/PremiumUI';

export default function GarantiaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section - Garantia de 30 Dias */}
      <section className="relative overflow-hidden">
        <PremiumHero
          title={
            <>
              <span className="text-green-600">Garantia de 30 Dias</span>
              <br />
              Sucesso ou seu dinheiro de volta
            </>
          }
          subtitle="Arrisque-se a investir no seu negócio com 100% de segurança. Se não estiver satisfeito, devolvemos seu dinheiro."
          ctaText="Quero Proteção Garantida"
          ctaHref="/checkout/garantia-30-dias"
        >
          <div className="flex justify-center items-center space-x-4 mt-6">
            <div className="bg-green-50 rounded-full p-2">
              <PremiumIcons.ShieldCheck className="h-6 w-6 text-green-600" />
            </div>
            <div className="bg-green-50 rounded-full p-2">
              <PremiumIcons.CreditCard className="h-6 w-6 text-green-600" />
            </div>
            <div className="bg-green-50 rounded-full p-2">
              <PremiumIcons.Clock className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </PremiumHero>

        {/* Selo Premium de Garantia */}
        <div className="container mx-auto px-4 md:px-6 -mt-20 relative z-10">
          <div className="max-w-2xl mx-auto">
            <Card className="bg-gradient-to-r from-green-600 to-emerald-700 text-white shadow-2xl">
              <div className="flex flex-col md:flex-row items-center justify-between p-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-white/20 rounded-full p-4">
                    <PremiumIcons.Star className="h-10 w-10" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Selo Premium de Garantia</h2>
                    <p className="text-green-100">Certificado de segurança e qualidade</p>
                  </div>
                </div>
                <div className="mt-4 md:mt-0">
                  <Badge variant="premium" className="text-lg px-4 py-2">
                    100% Seguro
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Como Funciona Nossa Garantia</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Transparência e segurança em cada etapa do processo
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <div className="text-center p-6">
              <div className="bg-blue-50 rounded-full p-4 inline-block mb-4">
                <PremiumIcons.Calendar className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dia 1-7: Implementação</h3>
              <p className="text-gray-600">
                Começamos o trabalho imediatamente após o pagamento. Você já verá os primeiros resultados.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center p-6">
              <div className="bg-yellow-50 rounded-full p-4 inline-block mb-4">
                <PremiumIcons.CheckCircle className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dia 8-29: Validação</h3>
              <p className="text-gray-600">
                Período para testar todos os recursos e verificar se atende suas expectativas.
              </p>
            </div>
          </Card>

          <Card>
            <div className="text-center p-6">
              <div className="bg-red-50 rounded-full p-4 inline-block mb-4">
                <PremiumIcons.Refresh className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Dia 30: Decisão</h3>
              <p className="text-gray-600">
                Se não estiver satisfeito, solicitamos o reembolso e devolvemos 100% do valor.
              </p>
            </div>
          </Card>
        </div>
      </section>

      {/* Por que oferecemos garantia */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Por que Confiamos Tanto no Nosso Trabalho</h2>
              <p className="text-gray-600">
                Nossa garantia não é apenas uma promessa - é o reflexo da qualidade do que entregamos
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start space-x-4">
                  <PremiumIcons.ChartBar className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Resultados Comprovados</h3>
                    <p className="text-gray-600">
                      Mais de 95% dos nossos clientes renovam o contrato após o primeiro mês.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start space-x-4">
                  <PremiumIcons.Users className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Suporte Premium</h3>
                    <p className="text-gray-600">
                      Equipe especializada disponível para resolver qualquer dúvida durante o período.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start space-x-4">
                  <PremiumIcons.Rocket className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Método Testado</h3>
                    <p className="text-gray-600">
                      Processo validado em mais de 200 projetos com taxas de sucesso consistentes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-start space-x-4">
                  <PremiumIcons.Shield className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Transparência Total</h3>
                    <p className="text-gray-600">
                      Todos os processos documentados e acessíveis durante todo o período.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perguntas Frequentes */}
      <section className="py-16 container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
            <p className="text-gray-600">
              Tire suas dúvidas sobre nossa garantia de 30 dias
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <PremiumIcons.HelpCircle className="h-5 w-5 text-green-600 mr-2" />
                  Como faço para solicitar o reembolso?
                </h3>
                <p className="text-gray-600">
                  Basta enviar um email para suporte@estudiok.com.br dentro do prazo de 30 dias informando que deseja cancelar.
                  Processamos o reembolso em até 5 dias úteis.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <PremiumIcons.HelpCircle className="h-5 w-5 text-green-600 mr-2" />
                  Preciso dar algum motivo para o reembolso?
                </h3>
                <p className="text-gray-600">
                  Não. A garantia é incondicional. Se você não estiver satisfeito por qualquer motivo, devolvemos seu dinheiro.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <PremiumIcons.HelpCircle className="h-5 w-5 text-green-600 mr-2" />
                  E se eu quiser continuar após os 30 dias?
                </h3>
                <p className="text-gray-600">
                  Apenas continue usando nossos serviços. Não há necessidade de fazer nada - o serviço continua normalmente.
                </p>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2 flex items-center">
                  <PremiumIcons.HelpCircle className="h-5 w-5 text-green-600 mr-2" />
                  A garantia cobre todos os produtos?
                </h3>
                <p className="text-gray-600">
                  Sim! Todos os nossos produtos e serviços possuem a garantia de 30 dias, incluindo templates, cursos e consultorias.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-emerald-700">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Proteção Total para seu Investimento
              </h2>
              <p className="text-green-100 mb-8 text-lg">
                Invista com segurança e transforme seu negócio sem medo de perder dinheiro.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/checkout/garantia-30-dias" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-green-700 rounded-xl font-semibold hover:bg-gray-100 transition-all">
                  <PremiumIcons.ShieldCheck className="h-5 w-5 mr-2" />
                  Quero Garantia de 30 Dias
                </Link>
                <Link href="/" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white border border-[#242424] rounded-xl font-semibold hover:border-[#00D4FF]/50 hover:bg-[#00D4FF]/5 transition-all">
                  <PremiumIcons.ChevronLeft className="h-5 w-5 mr-2" />
                  Voltar para Home
                </Link>
              </div>
              <p className="text-green-100 text-sm mt-6">
                <PremiumIcons.Lock className="h-4 w-4 inline mr-1" />
                Pagamento 100% seguro via Stripe • Reembolso garantido em até 5 dias úteis
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}