import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  order: number;
  required: boolean;
}

export interface OnboardingProgress {
  id: string;
  projectId: string;
  userId: string;
  currentStep: number;
  completedSteps: string[];
  startedAt: Date;
  completedAt?: Date;
}

export const DEFAULT_ONBOARDING_STEPS: OnboardingStep[] = [
  { id: 'welcome', title: 'Bem-vindo!', description: 'Receba as boas-vindas eoverview do projeto', order: 1, required: true },
  { id: 'kickoff', title: 'Reunião de Kickoff', description: 'Alinhamento de expectativas e cronograma', order: 2, required: true },
  { id: 'briefing', title: 'Briefing Completo', description: 'Preenchimento do formulário de requisitos', order: 3, required: true },
  { id: 'materiais', title: 'Envio de Materiais', description: 'Logos, textos, imagens e referências', order: 4, required: true },
  { id: 'aprovacao', title: 'Aprovação do Design', description: 'Revisão e aprovação do layout', order: 5, required: true },
  { id: 'desenvolvimento', title: 'Desenvolvimento', description: 'Acompanhamento do progresso', order: 6, required: false },
  { id: 'testes', title: 'Fase de Testes', description: 'Testes e ajustes finais', order: 7, required: false },
  { id: 'entrega', title: 'Entrega Final', description: 'Projeto concluido e上线', order: 8, required: true },
  { id: 'suporte', title: 'Período de Suporte', description: '30 dias de suporte gratuito', order: 9, required: false },
];

export async function startOnboarding(projectId: string, userId: string): Promise<string> {
  const docRef = await addDoc(collection(db, 'onboardingProgress'), {
    projectId,
    userId,
    currentStep: 1,
    completedSteps: [],
    startedAt: serverTimestamp(),
  });

  await addDoc(collection(db, 'notifications'), {
    userId,
    type: 'onboarding',
    title: 'Onboarding iniciado',
    message: 'Bem-vindo ao seu novo projeto! Complete os passos para avançar.',
    read: false,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getOnboardingProgress(projectId: string): Promise<OnboardingProgress | null> {
  const q = query(collection(db, 'onboardingProgress'), where('projectId', '==', projectId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    startedAt: data.startedAt?.toDate(),
    completedAt: data.completedAt?.toDate(),
  } as OnboardingProgress;
}

export async function completeOnboardingStep(projectId: string, stepId: string): Promise<void> {
  const progress = await getOnboardingProgress(projectId);
  if (!progress) return;

  const step = DEFAULT_ONBOARDING_STEPS.find(s => s.id === stepId);
  if (!step) return;

  const completedSteps = [...progress.completedSteps, stepId];
  const nextStep = progress.currentStep + 1;

  const isComplete = completedSteps.length >= DEFAULT_ONBOARDING_STEPS.filter(s => s.required).length;

  await updateDoc(doc(db, 'onboardingProgress', progress.id), {
    completedSteps,
    currentStep: nextStep,
    completedAt: isComplete ? new Date() : null,
  });
}

export async function getOnboardingPercentage(projectId: string): Promise<number> {
  const progress = await getOnboardingProgress(projectId);
  if (!progress) return 0;

  const requiredSteps = DEFAULT_ONBOARDING_STEPS.filter(s => s.required).length;
  const completed = progress.completedSteps.filter(s => 
    DEFAULT_ONBOARDING_STEPS.find(st => st.id === s)?.required
  ).length;

  return Math.round((completed / requiredSteps) * 100);
}

export function getNextOnboardingStep(progress: OnboardingProgress): OnboardingStep | null {
  const nextStep = DEFAULT_ONBOARDING_STEPS[progress.currentStep - 1];
  if (progress.completedSteps.includes(nextStep?.id || '')) {
    return DEFAULT_ONBOARDING_STEPS.find(s => !progress.completedSteps.includes(s.id)) || null;
  }
  return nextStep || null;
}

export async function resetOnboarding(projectId: string): Promise<void> {
  const progress = await getOnboardingProgress(projectId);
  if (!progress) return;

  await updateDoc(doc(db, 'onboardingProgress', progress.id), {
    currentStep: 1,
    completedSteps: [],
    completedAt: null,
  });
}