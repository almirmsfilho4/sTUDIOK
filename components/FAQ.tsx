'use client';

import { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  {
    question: "Quanto tempo leva para criar um site?",
    answer: "Para sites institucionais simples, entregamos em até 7 dias. Landing pages em 48h. E-commerces em 10 dias. Não deixamos você esperando meses como agências tradicionais."
  },
  {
    question: "É caro ter um site profissional?",
    answer: "Um site bem desenvolvido é o investimento com maior ROI que você pode fazer. Um cliente por mês já paying for o site inteiro. Além disso, oferecemos 30% OFF neste mês e parcelamento em até 3x sem juros."
  },
  {
    question: "Não tenho conhecimento técnico. Consigo gerenciar?",
    answer: "Absolutamente SIM. Você não precisa saber programar. Entregamos um painel administrativo intuitivo onde você edita tudo com alguns cliques. E se precisar de ajuda, nosso suporte está disponível 24/7."
  },
  {
    question: "Por que não uso um builder como Wix/Wordpress?",
    answer: "Builders géneram sites genéricos que parecem amadores. Você está competindo com milhões de outros sites idénticos. Nossa solução é 100% customizada, otimizada para conversão e com design exclusivo que representa SUA marca."
  },
  {
    question: "Como vou saber que o site vai funcionar?",
    answer: "Antes de entregar, você approve o projeto. Mostramos métricas de SEO, velocidade e usabilidade. E oferecemos 30 dias de garantia - se algo não funcionar, corrigimos sem custo adicional."
  },
  {
    question: "E se meu concorrente já tem um site melhor?",
    answer: "Esse é exatamente o problema. Cada dia sem presença digital você perde clientes para quem já está online. A boa notícia: com 30% OFF, você pode ter um site melhor que o deles por menos."
  },
  {
    question: "Quais formas de pagamento vocês aceitam?",
    answer: "PIX (10% desconto), cartão de crédito (até 3x sem juros), boleto ou transferência. Para projetos maiores, parcelamos em até 12x. Sem taxas ocultas - o orçamento que você recebe é o que paga."
  },
  {
    question: "Vocês oferecem suporte depois da entrega?",
    answer: "SIM! Não abandonamos você após o projeto. Included suporte por 30 dias. Também oferecemos planos de manutenção a partir de R$ 197/mês com alterações ilimitadas."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-[#0A0A0A]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-[#00D4FF] font-medium">FAQ</span>
          <h2 className="text-4xl font-bold mt-2">Perguntas Frequentes</h2>
          <p className="text-gray-400 mt-4">
            Tudo o que você precisa saber antes de contratar nossos serviços
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="card overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-medium pr-4">{faq.question}</span>
                <svg 
                  className={`w-6 h-6 text-[#00D4FF] flex-shrink-0 transition-transform duration-200 ${openIndex === index ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div 
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-40' : 'max-h-0'
                }`}
              >
                <p className="px-6 pb-6 text-gray-400">{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
