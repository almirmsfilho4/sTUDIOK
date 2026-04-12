'use client';

import { useState } from 'react';
import Link from 'next/link';
import PremiumIcon from './PremiumIcon';

interface SitePriceQuizProps {
  color?: string;
}

const questions = [
  {
    id: 'tipo',
    question: 'Que tipo de site você precisa?',
    options: [
      { label: 'Site institucional', value: 'institucional', price: 497 },
      { label: 'Loja virtual / E-commerce', value: 'ecommerce', price: 997 },
      { label: 'Sistema web / Software', value: 'sistema', price: 1997 },
      { label: 'App mobile', value: 'app', price: 2997 },
    ]
  },
  {
    id: 'paginas',
    question: 'Quantas páginas precisa?',
    options: [
      { label: '1-3 páginas (Simples)', value: 'simples', multiplier: 1 },
      { label: '4-8 páginas (Moderado)', value: 'medio', multiplier: 1.3 },
      { label: '9+ páginas (Completo)', value: 'complexo', multiplier: 1.6 },
    ]
  },
  {
    id: 'funcionalidades',
    question: 'Quais funcionalidades precisa?',
    options: [
      { label: 'Apenas Apresentação', value: 'basico', multiplier: 1 },
      { label: 'Blog + Contato', value: 'blog', multiplier: 1.2 },
      { label: 'Agendamento/Reservas', value: 'agendamento', multiplier: 1.4 },
      { label: 'E-commerce completo', value: 'ecommerce', multiplier: 1.8 },
      { label: 'Área de membros', value: 'membros', multiplier: 2 },
    ]
  },
  {
    id: 'prazo',
    question: 'Qual prazo ideal?',
    options: [
      { label: 'Em até 7 dias', value: 'urgente', multiplier: 1.3 },
      { label: 'Em até 15 dias', value: 'normal', multiplier: 1 },
      { label: 'Em até 30 dias', value: 'flexivel', multiplier: 0.9 },
    ]
  }
];

export default function SitePriceQuiz({ color = '#8B5CF6' }: SitePriceQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [showResult, setShowResult] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);

const handleAnswer = (option: any) => {
  const currentQ = questions[currentQuestion];
  if (!currentQ) return;
  
  const newAnswers = { ...answers };
  newAnswers[currentQ.id] = option;
  setAnswers(newAnswers);

  if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
  } else {
    calculatePrice({ ...newAnswers, [currentQ.id]: option });
  }
};

  const calculatePrice = (finalAnswers: any) => {
    let basePrice = 497;
    
    if (finalAnswers.tipo) {
      basePrice = finalAnswers.tipo.price || 497;
    }

    let multiplier = 1;
    if (finalAnswers.paginas) multiplier *= finalAnswers.paginas.multiplier || 1;
    if (finalAnswers.funcionalidades) multiplier *= finalAnswers.funcionalidades.multiplier || 1;
    if (finalAnswers.prazo) multiplier *= finalAnswers.prazo.multiplier || 1;

    const finalPrice = Math.round(basePrice * multiplier);
    setEstimatedPrice(finalPrice);
    setShowResult(true);
  };

  const reset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setEstimatedPrice(0);
  };

  if (showResult) {
    return (
      <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#8B5CF6]/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <PremiumIcon name="dollar" size={40} className="text-[#8B5CF6]" />
          </div>
          
          <h3 className="text-2xl font-bold mb-2">Estimativa Pronta!</h3>
          <p className="text-gray-400 mb-6">Baseado nas suas respostas:</p>
          
          <div className="bg-[#050505] rounded-2xl p-6 mb-6">
            <p className="text-gray-400 text-sm mb-1">Valor estimado</p>
            <p className="text-4xl font-black" style={{ color }}>R$ {estimatedPrice}</p>
            <p className="text-gray-500 text-xs mt-2">Pagamento único</p>
          </div>

          <Link 
            href={`/orcamento?valor=${estimatedPrice}`}
            className="block w-full py-4 rounded-full font-bold text-lg mb-4"
            style={{ backgroundColor: color }}
          >
            Solicitar Orçamento →
          </Link>
          
          <button 
            onClick={reset}
            className="text-gray-400 text-sm hover:text-white"
          >
            Refazer cálculo
          </button>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion] || questions[0];

  return (
    <div className="bg-[#0A0A0A] rounded-3xl p-8 border border-white/10 max-w-md mx-auto">
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Questão {currentQuestion + 1} de {questions.length}</span>
          <span>{Math.round((currentQuestion / questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-[#050505] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all"
            style={{ 
              width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              backgroundColor: color 
            }} 
          />
        </div>
      </div>

<h3 className="text-xl font-bold mb-6 text-center">{question?.question}</h3>

<div className="space-y-3">
{question?.options?.map((option, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(option)}
            className="w-full p-4 bg-[#050505] hover:bg-[#8B5CF6]/10 border border-white/10 hover:border-[#8B5CF6]/30 rounded-xl text-left transition-all"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-between">
        {currentQuestion > 0 && (
          <button 
            onClick={() => setCurrentQuestion(currentQuestion - 1)}
            className="text-gray-400 hover:text-white"
          >
            ← Voltar
          </button>
        )}
      </div>
    </div>
  );
}