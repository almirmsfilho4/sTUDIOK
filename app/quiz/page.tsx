'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const questions = [
  {
    id: 'service',
    question: 'Que tipo de projeto você precisa?',
    options: [
      { value: 'site', label: 'Site Institucional', icon: '🌐' },
      { value: 'landing', label: 'Landing Page', icon: '📄' },
      { value: 'ecommerce', label: 'Loja Virtual', icon: '🛒' },
      { value: 'app', label: 'App Mobile', icon: '📱' },
      { value: 'sistema', label: 'Sistema Web', icon: '💻' },
    ]
  },
  {
    id: 'budget',
    question: 'Qual é o seu orçamento estimado?',
    options: [
      { value: 'baixo', label: 'até R$ 1.000', icon: '💵' },
      { value: 'medio', label: 'R$ 1.000 - R$ 5.000', icon: '💰' },
      { value: 'alto', label: 'R$ 5.000 - R$ 15.000', icon: '🏦' },
      { value: 'enterprise', label: 'Acima de R$ 15.000', icon: '🚀' },
    ]
  },
  {
    id: 'timeline',
    question: 'Quando precisa entregar?',
    options: [
      { value: 'urgente', label: 'Urgente (até 7 dias)', icon: '🔥' },
      { value: 'rapido', label: 'Rápido (7-15 dias)', icon: '⚡' },
      { value: 'normal', label: 'Normal (15-30 dias)', icon: '📅' },
      { value: 'flexivel', label: 'Flexível', icon: '🗓️' },
    ]
  },
  {
    id: 'company',
    question: 'Qual é o porte da sua empresa?',
    options: [
      { value: 'iniciante', label: 'Iniciante/Autônomo', icon: '🌱' },
      { value: 'pequeno', label: 'Pequeno (1-10 func.)', icon: '🏠' },
      { value: 'medio', label: 'Médio (11-50 func.)', icon: '🏢' },
      { value: 'grande', label: 'Grande (50+ func.)', icon: '🏛️' },
    ]
  },
  {
    id: 'contact',
    question: 'Agora, nos informe seus dados para entrarmos em contato:',
    fields: [
      { id: 'name', label: 'Seu Nome', type: 'text', placeholder: 'Seu nome completo' },
      { id: 'email', label: 'Email', type: 'email', placeholder: 'seu@email.com' },
      { id: 'phone', label: 'WhatsApp', type: 'tel', placeholder: '(11) 99999-9999' },
    ]
  }
];

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [contactInfo, setContactInfo] = useState({ name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentStep];
  const isLastStep = currentStep === questions.length - 1;
  const progress = ((currentStep + 1) / questions.length) * 100;

  const handleOptionSelect = (value: string) => {
    if (!currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: value });
    
    if (!isLastStep) {
      setTimeout(() => setCurrentStep(currentStep + 1), 300);
    }
  };

  const handleContactSubmit = async () => {
    if (!contactInfo.name || !contactInfo.email || !contactInfo.phone) {
      alert('Preencha todos os campos');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/leads/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...answers,
          ...contactInfo,
          projectType: answers.service,
          source: 'quiz'
        })
      });

      if (response.ok) {
        router.push('/obrigado?from=quiz');
      } else {
        alert('Erro ao enviar. Tente novamente.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Erro ao enviar. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ESTUDIOK" className="w-12 h-12 object-contain" />
            <span className="text-xl font-bold">ESTUDIOK</span>
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <div className="h-2 bg-[#1A1A1A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#7B2CBF] to-[#00D4FF] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-center text-gray-400 mt-2">
              Passo {currentStep + 1} de {questions.length}
            </p>
          </div>

          <div className="card p-8">
            <h2 className="text-2xl font-bold mb-8 text-center">
              {currentQuestion?.question}
            </h2>

            {!isLastStep ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion?.options?.map((option: any) => (
                  <button
                    key={option.value}
                    onClick={() => handleOptionSelect(option.value)}
                    className={`p-6 rounded-xl border transition-all text-left hover:scale-105 ${
                      answers[currentQuestion.id] === option.value
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                        : 'border-[#1A1A1A] bg-[#050505] hover:border-[#00D4FF]/50'
                    }`}
                  >
                    <span className="text-3xl mb-2 block">{option.icon}</span>
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome</label>
                  <input
                    type="text"
                    value={contactInfo.name}
                    onChange={(e) => setContactInfo({ ...contactInfo, name: e.target.value })}
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 focus:border-[#00D4FF] focus:outline-none"
                    placeholder="Seu nome completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={contactInfo.email}
                    onChange={(e) => setContactInfo({ ...contactInfo, email: e.target.value })}
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 focus:border-[#00D4FF] focus:outline-none"
                    placeholder="seu@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">WhatsApp</label>
                  <input
                    type="tel"
                    value={contactInfo.phone}
                    onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                    className="w-full bg-[#050505] border border-[#1A1A1A] rounded-lg px-4 py-3 focus:border-[#00D4FF] focus:outline-none"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                <button
                  onClick={handleContactSubmit}
                  disabled={isSubmitting}
                  className="w-full btn-primary py-4 text-lg mt-4 disabled:opacity-50"
                >
                  {isSubmitting ? 'Enviando...' : 'Receber Orçamento Grátis →'}
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              className="text-gray-400 hover:text-white disabled:opacity-50"
            >
              ← Voltar
            </button>
            <Link href="/orcamento" className="text-[#00D4FF] hover:underline">
              Ir para orçamento completo →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}