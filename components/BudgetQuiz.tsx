'use client';

import { useState } from 'react';

interface QuizAnswers {
  serviceType: string;
  projectType: string;
  pages: string;
  features: string[];
  deadline: string;
  budget: string;
  description: string;
}

const QUESTIONS = [
  {
    id: 'serviceType',
    question: 'Que tipo de serviço você precisa?',
    options: [
      { value: 'site', label: 'Site/Web', icon: '🌐' },
      { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
      { value: 'app', label: 'App Mobile', icon: '📱' },
      { value: 'sistema', label: 'Sistema Web', icon: '💻' },
      { value: 'landing', label: 'Landing Page', icon: '📄' },
    ],
    type: 'single',
  },
  {
    id: 'projectType',
    question: 'Qual é o objetivo principal do projeto?',
    options: [
      { value: 'vendas', label: 'Vender produtos/serviços', icon: '💰' },
      { value: 'leads', label: 'Gerar leads/clientes', icon: '🎯' },
      { value: 'informacao', label: 'Informação institucional', icon: '📢' },
      { value: 'app', label: 'Aplicativo utilitário', icon: '⚙️' },
      { value: 'sistema', label: 'Sistema interno', icon: '🏢' },
    ],
    type: 'single',
  },
  {
    id: 'pages',
    question: 'Quantas páginas você precisa?',
    options: [
      { value: '1-3', label: '1-3 páginas', icon: '📄' },
      { value: '4-7', label: '4-7 páginas', icon: '📑' },
      { value: '8-15', label: '8-15 páginas', icon: '📚' },
      { value: '15+', label: 'Mais de 15 páginas', icon: '🏢' },
    ],
    type: 'single',
  },
  {
    id: 'features',
    question: 'Quais funcionalidades você precisa?',
    options: [
      { value: 'formulario', label: 'Formulário de contato', icon: '📝' },
      { value: 'blog', label: 'Blog/Notícias', icon: '📰' },
      { value: 'chat', label: 'Chat online', icon: '💬' },
      { value: 'galeria', label: 'Galeria de imagens', icon: '🖼️' },
      { value: 'agendamento', label: 'Sistema de agendamento', icon: '📅' },
      { value: 'ecommerce', label: 'Carrinho/Compras', icon: '🛒' },
      { value: 'login', label: 'Área de membros', icon: '🔐' },
      { value: 'api', label: 'Integração com API', icon: '🔗' },
    ],
    type: 'multi',
  },
  {
    id: 'deadline',
    question: 'Qual é o prazo desejado?',
    options: [
      { value: '48h', label: '48 horas (express)', icon: '⚡' },
      { value: '1semana', label: '1 semana', icon: '📆' },
      { value: '2semanas', label: '2 semanas', icon: '📆' },
      { value: '1mes', label: '1 mês', icon: '📆' },
      { value: 'flexivel', label: 'Flexível', icon: '🤷' },
    ],
    type: 'single',
  },
  {
    id: 'budget',
    question: 'Qual é seu orçamento aproximado?',
    options: [
      { value: 'ate500', label: 'Até R$ 500', icon: '💵' },
      { value: '500-1000', label: 'R$ 500 - R$ 1.000', icon: '💵' },
      { value: '1000-2000', label: 'R$ 1.000 - R$ 2.000', icon: '💵' },
      { value: '2000-5000', label: 'R$ 2.000 - R$ 5.000', icon: '💵' },
      { value: '5000+', label: 'Acima de R$ 5.000', icon: '💰' },
      { value: 'ainda', label: 'Ainda não tenho certeza', icon: '🤔' },
    ],
    type: 'single',
  },
];

export default function BudgetQuiz({ onComplete }: { onComplete?: (answers: QuizAnswers) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({
    serviceType: '',
    projectType: '',
    pages: '',
    features: [],
    deadline: '',
    budget: '',
    description: '',
  });
  const [description, setDescription] = useState('');

const question = QUESTIONS[currentStep];
 if (!question) return null;
 const progress = ((currentStep + 1) / (QUESTIONS.length + 1)) * 100;

  const handleOptionSelect = (value: string) => {
    if (question.type === 'multi') {
      const current = answers[question.id as keyof QuizAnswers] as string[];
      const newFeatures = current.includes(value)
        ? current.filter(f => f !== value)
        : [...current, value];
      setAnswers({ ...answers, [question.id]: newFeatures });
    } else {
      setAnswers({ ...answers, [question.id]: value });
    }
  };

  const isOptionSelected = (value: string) => {
    if (question.type === 'multi') {
      return (answers[question.id as keyof QuizAnswers] as string[])?.includes(value);
    }
    return answers[question.id as keyof QuizAnswers] === value;
  };

  const canProceed = () => {
    if (question.type === 'multi') {
      return (answers[question.id as keyof QuizAnswers] as string[])?.length > 0;
    }
    return !!answers[question.id as keyof QuizAnswers];
  };

  const handleNext = () => {
    if (currentStep < QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const finalAnswers = { ...answers, description };
      if (onComplete) {
        onComplete(finalAnswers);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Passo {currentStep + 1} de {QUESTIONS.length + 1}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#00D4FF] to-[#7B2CBF] transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

{/* Question */}
 {currentStep < QUESTIONS.length ? (
 <div className="space-y-6">
 <h2 className="text-2xl font-bold text-center">{question?.question}</h2>

 <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
 {question?.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => handleOptionSelect(option.value)}
                className={`p-4 rounded-xl text-center transition-all ${
                  isOptionSelected(option.value)
                    ? 'bg-[#00D4FF] text-black scale-105'
                    : 'bg-[#1A1A1A] hover:bg-[#242424]'
                }`}
              >
                <span className="text-2xl block mb-2">{option.icon}</span>
                <span className="text-sm font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Description Step */
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Quer adicionar mais detalhes?
          </h2>
          <p className="text-gray-400 text-center">
            Conte-nos mais sobre seu projeto (opcional)
          </p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descreva seu projeto, necessidades específicas, referências..."
            className="input-field h-40"
          />
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className={`btn-secondary ${currentStep === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          ← Voltar
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed() && currentStep < QUESTIONS.length}
          className={`btn-primary ${(!canProceed() && currentStep < QUESTIONS.length) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {currentStep < QUESTIONS.length ? 'Próximo →' : 'Finalizar Quiz'}
        </button>
      </div>
    </div>
  );
}