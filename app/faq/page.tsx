'use client';

import Link from 'next/link';
import PremiumIcon from '@/components/PremiumIcon';

const faqs = [
  { q: 'Quanto tempo leva para criar um site?', a: 'Em média 7 dias úteis. O briefing é entregue em 24h e o site fica pronto em até 7 dias, dependendo da complexidade.' },
  { q: 'O que está incluído no preço?', a: 'Domínio .com.br grátis pelo primeiro ano, hospedagem SSL, design responsivo (funciona no celular), painel admin para gerenciar e suporte.' },
  { q: 'Preciso saber programar?', a: 'Não! Todo o site é gerenciável pelo painel admin. Você pode alterar textos, imagens e preços sem saber programação.' },
  { q: 'O site aparece no Google?', a: 'Sim! Otimizamos todos os sites para SEO local, aumentando as chances de aparecer nas buscas do Google.' },
  { q: 'Quais formas de pagamento?', a: 'Aceitamos PIX, cartão de crédito (parcelado em até 12x), boleto bancário e transferência.' },
  { q: 'Tem mensalidade?', a: 'Não! Todos os preços são pagamento único. Você só paga novamente se quiser contratar manutenção ou atualizações.' },
  { q: 'E se não ficar satisfeito?', a: 'Oferecemos garantia de 7 dias. Se não gostar, devolvemos 100% do dinheiro.' },
  { q: 'Como funciona o processo?', a: '1) Você preenche o briefing → 2) Criamos o site → 3) Você revisa e aprova → 4) Publicamos e você recebe.' },
  { q: 'Posso mudar o site depois?', a: 'Sim! Você tem acesso vitalício ao painel admin para fazer alterações quando quiser.' },
  { q: 'Vocês fazem manutenção?', a: 'Sim! Oferecemos planos de manutenção a partir de R$97/mês com atualizações de segurança e conteúdo.' },
];

export default function FAQPage() {
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
        <section className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/20 border border-[#8B5CF6]/30 mb-6">
              <PremiumIcon name="message" size={16} className="text-[#8B5CF6]" />
              <span className="text-[#8B5CF6] font-semibold text-sm">FAQ</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Perguntas <span className="text-[#8B5CF6]">Frequentes</span>
            </h1>
            <p className="text-xl text-gray-400">
              Tudo o que você precisa saber sobre nossos serviços.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0A0A0A] rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Não encontrou sua pergunta?</p>
            <Link href="/orcamento" className="inline-flex items-center gap-2 text-[#8B5CF6] font-semibold hover:underline">
              Fale conosco <PremiumIcon name="arrow-right" size={16} />
            </Link>
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