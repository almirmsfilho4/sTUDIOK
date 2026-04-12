import { getDocuments } from './firebase-services';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  startedAt: Date;
  nextBillingDate?: Date;
}

export interface PlanFeatures {
  hasEcommerce: boolean;
  hasBlog: boolean;
  hasChat: boolean;
  hasAnalytics: boolean;
  hasCustomDomain: boolean;
  hasMultiUsers: boolean;
  hasWhiteLabel: boolean;
  hasApiAccess: boolean;
  maxPages: number;
  maxProducts: number;
  hasPrioritySupport: boolean;
  has24hSupport: boolean;
}

export const PLAN_FEATURES: Record<string, PlanFeatures> = {
  starter: {
    hasEcommerce: false,
    hasBlog: false,
    hasChat: false,
    hasAnalytics: false,
    hasCustomDomain: false,
    hasMultiUsers: false,
    hasWhiteLabel: false,
    hasApiAccess: false,
    maxPages: 5,
    maxProducts: 0,
    hasPrioritySupport: false,
    has24hSupport: false,
  },
  profissional: {
    hasEcommerce: true,
    hasBlog: true,
    hasChat: true,
    hasAnalytics: true,
    hasCustomDomain: true,
    hasMultiUsers: false,
    hasWhiteLabel: false,
    hasApiAccess: false,
    maxPages: 15,
    maxProducts: 50,
    hasPrioritySupport: true,
    has24hSupport: false,
  },
  business: {
    hasEcommerce: true,
    hasBlog: true,
    hasChat: true,
    hasAnalytics: true,
    hasCustomDomain: true,
    hasMultiUsers: true,
    hasWhiteLabel: true,
    hasApiAccess: true,
    maxPages: -1,
    maxProducts: -1,
    hasPrioritySupport: true,
    has24hSupport: true,
  },
};

export async function getUserSubscription(userId: string): Promise<Subscription | null> {
  try {
    const subscriptions = await getDocuments('subscriptions');
    const sub = (subscriptions as any[]).find(
      s => s.userId === userId && s.status === 'active'
    );
    if (!sub) return null;
    return {
      id: sub.id,
      userId: sub.userId,
      planId: sub.planId,
      status: sub.status,
      startedAt: sub.startedAt?.toDate?.() || new Date(),
      nextBillingDate: sub.nextBillingDate?.toDate?.(),
    };
  } catch (error) {
    console.error('Error getting subscription:', error);
    return null;
  }
}

export function getPlanFeatures(planId: string): PlanFeatures {
 return PLAN_FEATURES[planId] ?? PLAN_FEATURES.starter!;
}

export function hasFeature(planId: string, feature: keyof PlanFeatures): boolean {
  const features = getPlanFeatures(planId);
  return Boolean(features[feature]);
}

export function canAccessFeature(userPlan: string | null, feature: keyof PlanFeatures): boolean {
  if (!userPlan) return false;
  return hasFeature(userPlan, feature);
}

export function checkFeatureAccess(userPlan: string | null, feature: keyof PlanFeatures): { allowed: boolean; message?: string } {
  if (!userPlan) {
    return {
      allowed: false,
      message: 'Assine um plano para acessar este recurso',
    };
  }
  
  const allowed = canAccessFeature(userPlan, feature);
  
  if (!allowed) {
    const planNames: Record<string, string> = {
      starter: 'Starter',
      profissional: 'Profissional',
      business: 'Business',
    };
    return {
      allowed: false,
      message: `Este recurso está disponível apenas nos planos ${planNames[userPlan] || userPlan} ou superior.`,
    };
  }
  
  return { allowed: true };
}
