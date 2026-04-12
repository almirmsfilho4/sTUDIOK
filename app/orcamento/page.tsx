'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import PremiumIcon from '@/components/PremiumIcon';
import { PRICING, calculatePrice } from '@/lib/pricing';
import { createQuote } from '@/lib/firebase-services';
import { useAuth } from '@/contexts/AuthContext';
import { trackOrcamentoStarted } from '@/components/MarketingScripts';

const steps = [
  { id: 1, title: 'Tipo de Projeto', key: 'projectType' },
  { id: 2, title: 'Funcionalidades', key: 'features' },
  { id: 3, title: 'Complexidade', key: 'complexity' },
  { id: 4, title: 'Prazo', key: 'deadline' },
  { id: 5, title: 'Contato', key: 'contact' },
  { id: 6, title: 'Resumo', key: 'summary' },
];

const projectTypes = [
  { id: 'site', name: 'Site Institucional', icon: 'globe', color: '#00D4FF', description: 'Sites institucionais, blogs, portfólios', basePrice: 1500 },
  { id: 'landing', name: 'Landing Page', icon: 'file', color: '#7B2CBF', description: 'Páginas de captura e vendas', basePrice: 800 },
  { id: 'ecommerce', name: 'E-commerce', icon: 'shopping-cart', color: '#22C55E', description: 'Loja virtual completa', basePrice: 3500 },
  { id: 'app', icon: 'smartphone', name: 'App Mobile', color: '#F59E0B', description: 'Aplicativos iOS e Android', basePrice: 5000 },
  { id: 'sistema', name: 'Sistema Web', icon: 'code', color: '#EF4444', description: 'Sistemas, ERPs, CRMs', basePrice: 8000 },
];

const featureList = [
  { id: 'login', name: 'Sistema de Login', icon: 'lock', price: 500 },
  { id: 'payment', name: 'Pagamentos Online', icon: 'credit-card', price: 800 },
  { id: 'adminPanel', name: 'Painel Admin', icon: 'layout', price: 1200 },
  { id: 'api', name: 'API Rest', icon: 'code', price: 600 },
  { id: 'chat', name: 'Chat em Tempo Real', icon: 'message', price: 400 },
  { id: 'notifications', name: 'Notificações Push', icon: 'bell', price: 300 },
  { id: 'analytics', name: 'Analytics Dashboard', icon: 'chart', price: 500 },
  { id: 'cms', name: 'Gerenciador de Conteúdo', icon: 'file', price: 1000 },
  { id: 'blog', name: 'Blog Integrado', icon: 'file', price: 400 },
  { id: 'seo', name: 'SEO Avançado', icon: 'target', price: 600 },
  { id: 'responsive', name: 'Design Responsivo', icon: 'smartphone', price: 300 },
  { id: 'multiLanguage', name: 'Multi-idioma', icon: 'globe', price: 800 },
];

const complexityLevels = [
  { id: 'basic', name: 'Básico', description: 'Funcionalidades essenciais, design simples', multiplier: 1 },
  { id: 'medium', name: 'Médio', description: 'Mais funcionalidades, design personalizado', multiplier: 1.5 },
  { id: 'high', name: 'Avançado', description: 'Múltiplas funcionalidades, alta complexidade', multiplier: 2.5 },
];

const deadlineOptions = [
  { id: 'urgent', name: 'Urgente', description: '3-7 dias', extra: 0.3 },
  { id: 'fast', name: 'Rápido', description: '7-10 dias', extra: 0.15 },
  { id: 'normal', name: 'Padrão', description: '10-15 dias', extra: 0 },
];

const appDeadlineOptions = [
  { id: 'urgent', name: 'Urgente', description: '7-14 dias', extra: 0.3 },
  { id: 'fast', name: 'Rápido', description: '14-21 dias', extra: 0.15 },
  { id: 'normal', name: 'Padrão', description: '21-30 dias', extra: 0 },
];

export default function OrcamentoPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    projectType: '',
    features: [] as string[],
    complexity: 'medium',
    deadline: 'normal',
    name: '',
    email: '',
    phone: '',
    coupon: '',
  });
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Redirecionar usuários não logados
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/cadastro?redirect=/orcamento');
    }
  }, [user, authLoading, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A]">
        <div className="w-16 h-16 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null; // Redirecionamento em andamento
  }

  const updateData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleFeature = (featureId: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(featureId)
        ? prev.features.filter(f => f !== featureId)
        : [...prev.features, featureId],
    }));
  };

  const { price: basePrice, days } = calculatePrice(
    formData.projectType,
    formData.features,
    formData.complexity,
    formData.deadline
  );
  
  // Apply discount from referral or coupon
  const totalDiscount = couponDiscount + (typeof window !== 'undefined' && localStorage.getItem('referralCode') ? 10 : 0);
  const price = totalDiscount > 0 ? Math.round(basePrice * (1 - totalDiscount / 100)) : basePrice;

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const sessionId = `quote_${typeof window !== 'undefined' ? Date.now() : 'server'}_${Math.random().toString(36).substr(2, 9)}`;
      
      const referralCode = typeof window !== 'undefined' ? localStorage.getItem('referralCode') : null;
      const couponCode = formData.coupon || null;
      
      const quoteId = await createQuote({
        projectType: formData.projectType,
        features: formData.features,
        complexity: formData.complexity as 'basic' | 'medium' | 'high',
        deadline: formData.deadline,
        price,
        estimatedDays: days,
        userId: user?.uid,
        sessionId,
        referralCode,
        couponCode,
      });

      // Clear localStorage after creating quote
      if (typeof window !== 'undefined') {
        localStorage.removeItem('referralCode');
      }

      const projectTypeName = projectTypes.find(t => t.id === formData.projectType)?.name || formData.projectType;
      trackOrcamentoStarted(projectTypeName, price);

      // Redirecionar para página de agradecimento com parâmetros
      router.push(`/orcamento/agradecimento?quoteId=${quoteId}&name=${encodeURIComponent(formData.name)}&projectType=${formData.projectType}&price=${price}`);
    } catch (error) {
      console.error('Error creating quote:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProjectTypeName = () => {
    const type = projectTypes.find(t => t.id === formData.projectType);
    return type?.name || 'Não selecionado';
  };

  const getFeaturesNames = () => {
    return formData.features.map(f => featureList.find(feat => feat.id === f)?.name).filter(Boolean);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-12 bg-gradient-to-b from-[#0A0A0A] to-[#000]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                    currentStep > step.id 
                      ? 'bg-[#00D4FF] text-black' 
                      : currentStep === step.id 
                        ? 'bg-[#00D4FF]/20 border-2 border-[#00D4FF] text-[#00D4FF]'
                        : 'bg-[#1A1A1A] text-gray-500'
                  }`}>
                    {currentStep > step.id ? '✓' : step.id}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-16 sm:w-24 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-[#00D4FF]' : 'bg-[#1A1A1A]'
                    }`}></div>
                  )}
                </div>
              ))}
            </div>
<div className="text-center">
 <h1 className="text-2xl font-bold">{steps[currentStep - 1]?.title || 'Orçamento'}</h1>
 <p className="text-gray-400 text-sm mt-1">Passo {currentStep} de {steps.length}</p>
 </div>
          </div>

          {/* Step Content */}
          <div className="card">
            {/* Step 1: Project Type */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-6">Selecione o tipo de projeto que você deseja:</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {projectTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => updateData('projectType', type.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.projectType === type.id
                          ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                          : 'border-[#242424] hover:border-[#00D4FF]/50'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center`} style={{ backgroundColor: `${type.color}20` }}>
                          <PremiumIcon name={type.icon as any} size={28} className={`text-${type.color.replace('#', '')}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold">{type.name}</h3>
                          <p className="text-sm text-gray-400">{type.description}</p>
                          <span className="text-[#00D4FF] text-sm mt-1 block">A partir de R$ {type.basePrice.toLocaleString()}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Features */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-6">Selecione as funcionalidades desejadas:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {featureList.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all flex items-center gap-4 ${
                        formData.features.includes(feature.id)
                          ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                          : 'border-[#242424] hover:border-[#00D4FF]/50'
                      }`}
                    >
                      <PremiumIcon name={feature.icon as any} size={20} className="text-gray-400" />
                      <span className="font-medium flex-1">{feature.name}</span>
                      <span className="text-[#00D4FF] text-sm">+R$ {feature.price}</span>
                    </button>
                  ))}
                </div>
                <p className="text-gray-400 text-sm mt-4">
                  Funcionalidades selecionadas: {formData.features.length}
                </p>
              </div>
            )}

            {/* Step 3: Complexity */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-6">Qual o nível de complexidade do projeto?</p>
                <div className="space-y-3">
                  {complexityLevels.map((level) => (
                    <button
                      key={level.id}
                      onClick={() => updateData('complexity', level.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.complexity === level.id
                          ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                          : 'border-[#242424] hover:border-[#00D4FF]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{level.name}</h3>
                        <span className="text-[#00D4FF]">x{level.multiplier}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{level.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Deadline */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-6">Qual o prazo desejado?</p>
                <div className="space-y-3">
                  {(formData.projectType === 'app' ? appDeadlineOptions : deadlineOptions).map((option) => (
                    <button
                      key={option.id}
                      onClick={() => updateData('deadline', option.id)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                        formData.deadline === option.id
                          ? 'border-[#00D4FF] bg-[#00D4FF]/10'
                          : 'border-[#242424] hover:border-[#00D4FF]/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{option.name}</h3>
                        <span className={`text-sm ${option.extra > 0 ? 'text-red-400' : option.extra < 0 ? 'text-green-400' : 'text-gray-400'}`}>
                          {option.extra > 0 ? `+${option.extra * 100}%` : option.extra < 0 ? `${option.extra * 100}%` : 'Normal'}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{option.description}</p>
                      {formData.projectType === 'app' && option.id === 'normal' && (
                        <p className="text-[#00D4FF] text-xs mt-1">Inclui publicação na Play Store</p>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Contact */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <p className="text-gray-400 mb-6">Para melhor atendê-lo, informe seus dados:</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Nome completo</label>
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={(e) => updateData('name', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-2">Email</label>
                    <input
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => updateData('email', e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                    <div>
                    <label className="block text-sm text-gray-400 mb-2">WhatsApp/Celular</label>
                    <input
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={(e) => updateData('phone', e.target.value)}
                      className="input-field"
                      required
                    />
                    <p className="text-gray-500 text-xs mt-2">
                      Usaremos para entrar em contato sobre seu orçamento
                    </p>
                  </div>
                  
                  {(typeof window !== 'undefined' && localStorage.getItem('referralCode')) && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <p className="text-green-500 text-sm">
                        ✓ Código de indicação aplicado! {couponDiscount > 0 && `${couponDiscount}% de desconto`}
                      </p>
                    </div>
                  )}
                  
                  {couponDiscount > 0 && (
                    <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-xl">
                      <p className="text-green-500 text-sm">
                        ✓ Cupom aplicado: {couponDiscount}% de desconto
                      </p>
                    </div>
                  )}
                </div>

        <button
          onClick={() => {
            if (!formData.name.trim()) {
              alert('Por favor, informe seu nome completo');
              return;
            }
            if (!formData.email.trim() || !formData.email.includes('@')) {
              alert('Por favor, informe um email válido');
              return;
            }
            if (!formData.phone.trim() || formData.phone.replace(/\D/g, '').length < 10) {
              alert('Por favor, informe um WhatsApp/Celular válido');
              return;
            }
            setCurrentStep(6);
          }}
          className="w-full bg-[#00D4FF] hover:opacity-90 text-black py-4 rounded-xl font-bold mt-6"
        >
          Continuar →
        </button>
              </div>
            )}

            {/* Step 6: Summary */}
            {currentStep === 6 && (
              <div className="space-y-6">
                <p className="text-gray-400 mb-6">Revise o resumo do seu orçamento:</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between py-3 border-b border-[#242424]">
                    <span className="text-gray-400">Tipo de Projeto</span>
                    <span className="font-semibold">{getProjectTypeName()}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#242424]">
                    <span className="text-gray-400">Complexidade</span>
                    <span className="font-semibold capitalize">{formData.complexity}</span>
                  </div>
                  <div className="flex justify-between py-3 border-b border-[#242424]">
                    <span className="text-gray-400">Prazo Estimado</span>
                    <span className="font-semibold">{days} dias</span>
                  </div>
                  <div className="py-3 border-b border-[#242424]">
                    <span className="text-gray-400 block mb-2">Funcionalidades</span>
                    <div className="flex flex-wrap gap-2">
                      {getFeaturesNames().map((name, i) => (
                        <span key={i} className="px-3 py-1 bg-[#00D4FF]/10 text-[#00D4FF] rounded-full text-sm">
                          {name}
                        </span>
                      ))}
                      {formData.features.length === 0 && (
                        <span className="text-gray-500">Nenhuma funcionalidade adicional</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#00D4FF]/10 to-[#7B2CBF]/10 p-6 rounded-xl">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg">Valor Estimado</span>
                    <span className="text-3xl font-bold text-[#00D4FF]">
                      R$ {price.toLocaleString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Este é um valor estimado. O preço final pode variar conforme análise detalhada.
                  </p>
                  {formData.name && (
                    <button
                      onClick={() => {
                        const projectName = projectTypes.find(t => t.id === formData.projectType)?.name || '';
                        const features = getFeaturesNames().join(', ');
                        const message = `Olá! Gostaria de fazer um orçamento para o projeto:\n\n*Tipo:* ${projectName}\n*Complexidade:* ${formData.complexity}\n*Funcionalidades:* ${features || 'Nenhuma'}\n*Prazo:* ${days} dias\n*Valor estimado:* R$ ${price.toLocaleString('pt-BR')}\n\nMeu nome: ${formData.name}\nEmail: ${formData.email}`;
                        const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
                        window.open(whatsappUrl, '_blank');
                      }}
                      className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.173-.164.297-.297.297-.495.099-.198.05-.371-.025-.524-.05-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.974 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Compartilhar no WhatsApp
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-[#242424]">
              <button
                onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  currentStep === 1 
                    ? 'text-gray-500 cursor-not-allowed' 
                    : 'text-white hover:text-[#00D4FF]'
                }`}
              >
                ← Voltar
              </button>
              
{currentStep < 6 ? (
          <button
            onClick={() => {
              if (currentStep === 1 && formData.projectType) {
                const projectTypeName = projectTypes.find(t => t.id === formData.projectType)?.name || formData.projectType;
                trackOrcamentoStarted(projectTypeName);
              }
              setCurrentStep(prev => Math.min(5, prev + 1));
            }}
            disabled={
              (currentStep === 1 && !formData.projectType) ||
              (currentStep === 5 && (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()))
            }
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continuar →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50"
                >
                  {loading ? 'Processando...' : user ? 'Finalizar Orçamento' : 'Criar Conta para Continuar'}
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}