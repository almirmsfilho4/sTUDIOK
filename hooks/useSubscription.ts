'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserSubscription, getPlanFeatures, checkFeatureAccess, PlanFeatures } from '@/lib/subscription-service';

export function useSubscription() {
  const { user, userData } = useAuth();
  const [subscription, setSubscription] = useState<{ planId: string; features: PlanFeatures } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSubscription() {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const sub = await getUserSubscription(user.uid);
        if (sub) {
          setSubscription({
            planId: sub.planId,
            features: getPlanFeatures(sub.planId),
          });
        }
      } catch (error) {
        console.error('Error loading subscription:', error);
      } finally {
        setLoading(false);
      }
    }

    loadSubscription();
  }, [user]);

  const canAccess = (feature: keyof PlanFeatures): boolean => {
    if (!subscription) return false;
    return subscription.features[feature] as boolean;
  };

  const checkAccess = (feature: keyof PlanFeatures) => {
    return checkFeatureAccess(subscription?.planId || null, feature);
  };

  return {
    subscription,
    loading,
    planId: subscription?.planId || null,
    features: subscription?.features || null,
    isActive: !!subscription,
    canAccess,
    checkAccess,
  };
}
