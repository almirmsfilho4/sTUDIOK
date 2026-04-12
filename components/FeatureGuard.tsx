'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { checkFeatureAccess, PlanFeatures } from '@/lib/subscription-service';

interface FeatureGuardProps {
  feature: keyof PlanFeatures;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGuard({ feature, children, fallback }: FeatureGuardProps) {
  const router = useRouter();
  const { subscription, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-400 mb-4">Faça login para continuar</p>
        <a href="/login" className="btn-primary">Fazer Login</a>
      </div>
    );
  }

  if (!subscription) {
    return fallback || (
      <div className="text-center p-8 card">
        <h3 className="text-xl font-bold mb-4">Plano Necessário</h3>
        <p className="text-gray-400 mb-4">
          Este recurso está disponível apenas para assinantes.
        </p>
        <a href="/planos" className="btn-primary">Ver Planos</a>
      </div>
    );
  }

  const check = checkFeatureAccess(subscription.planId, feature);

  if (!check.allowed) {
    return fallback || (
      <div className="text-center p-8 card">
        <h3 className="text-xl font-bold mb-4">Recurso Indisponível</h3>
        <p className="text-gray-400 mb-4">{check.message}</p>
        <a href="/planos" className="btn-primary">Upgrade de Plano</a>
      </div>
    );
  }

  return <>{children}</>;
}
