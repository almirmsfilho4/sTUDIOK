import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export interface SalesDeal {
  id?: string;
  quoteId?: string;
  projectId?: string;
  name: string;
  email: string;
  phone: string;
  service: string;
  value: number;
  stage: 'novo' | 'contato' | 'proposta' | 'negociacao' | 'fechado' | 'perdido';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  nextAction?: string;
  nextActionDate?: Date;
}

export interface DealActivity {
  id?: string;
  dealId: string;
  type: 'stage_change' | 'note_added' | 'proposal_sent' | 'meeting_scheduled' | 'closed_won' | 'closed_lost';
  description: string;
  createdAt: Date;
}

const STAGE_EMAILS = {
  novo: { subject: 'Recebemos seu orçamento! 📋', template: 'new' },
  contato: { subject: 'Vamos conversar sobre seu projeto! 📞', template: 'contact' },
  proposta: { subject: 'Sua proposta está pronta! 💼', template: 'proposal' },
  negociacao: { subject: 'Ajustes na proposta? 🤔', template: 'negotiation' },
  fechado: { subject: 'Parabéns! Vamos começar! 🎉', template: 'won' },
  perdido: { subject: 'Sentimos muito... 😔', template: 'lost' }
};

export async function createDeal(deal: Omit<SalesDeal, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const now = new Date();
  const docRef = await addDoc(collection(db, 'deals'), {
    ...deal,
    createdAt: now,
    updatedAt: now,
  });

  await addDoc(collection(db, 'dealActivities'), {
    dealId: docRef.id,
    type: 'stage_change',
    description: `Negócio criado no estágio: ${deal.stage}`,
    createdAt: now,
  });

  return docRef.id;
}

export async function updateDealStage(dealId: string, newStage: SalesDeal['stage'], notes?: string): Promise<void> {
  const dealRef = doc(db, 'deals', dealId);
  const now = new Date();

  await updateDoc(dealRef, {
    stage: newStage,
    updatedAt: now,
  });

  await addDoc(collection(db, 'dealActivities'), {
    dealId,
    type: 'stage_change',
    description: `Estágio alterado para: ${newStage}${notes ? ` - ${notes}` : ''}`,
    createdAt: now,
  });

const dealSnap = await getDocs(query(collection(db, 'deals'), where('__name__', '==', dealId)));
 if (!dealSnap.empty) {
  const dealDoc = dealSnap.docs[0];
  if (dealDoc) {
   const dealData = dealDoc.data();
   await sendStageEmail(dealData.email, dealData.name, newStage);
  }
 }
}

async function sendStageEmail(email: string, name: string, stage: SalesDeal['stage']): Promise<void> {
  const templates: Record<string, { subject: string; body: string }> = {
    novo: {
      subject: 'Recebemos seu orçamento! 📋',
      body: `Olá ${name}!Recebemos seu orçamento e nossa equipe já está analisando suas necessidades.Em breve entraremos em contato com uma proposta personalizada.Atenciosamente,Equipe ESTUDIOK`
    },
    contato: {
      subject: 'Vamos conversar sobre seu projeto! 📞',
      body: `Olá ${name}!Gostaríamos de entender melhor seu projeto para criar a melhor proposta.Vamos agendar uma breve ligação? Responda este email com seus melhores horários.Atenciosamente,Equipe ESTUDIOK`
    },
    proposta: {
      subject: 'Sua proposta está pronta! 💼',
      body: `Olá ${name}!Sua proposta personalizada está pronta!Analise com calma e qualquer dúvida, estamos à disposição.Atenciosamente,Equipe ESTUDIOK`
    },
    negociacao: {
      subject: 'Ajustes na proposta? 🤔',
      body: `Olá ${name}!Vimos que você está analisando a proposta.Está tudo ok? Podemos fazer ajustes se necessário!Fale conosco!Atenciosamente,Equipe ESTUDIOK`
    },
    fechado: {
      subject: 'Parabéns! Vamos começar! 🎉',
      body: `Olá ${name}!É um prazer ter você como cliente!Em breve nossa equipe entrará em contato para iniciar o projeto.Atenciosamente,Equipe ESTUDIOK`
    },
    perdido: {
      subject: 'Sentimos muito... 😔',
      body: `Olá ${name}!Sentimos que não seja desta vez.Quando precisar de nossos serviços, estaremos aqui!Fique à vontade para entrar em contato no futuro.Atenciosamente,Equipe ESTUDIOK`
    }
  };

  const template = templates[stage];
  if (template && email) {
    try {
      await resend.emails.send({
        from: 'ESTUDIOK <noreply@estudiak.com>',
        to: email,
        subject: template.subject,
        text: template.body,
      });
    } catch (error) {
      console.error('Error sending stage email:', error);
    }
  }
}

export async function getDeals(): Promise<SalesDeal[]> {
  const q = query(collection(db, 'deals'), orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  } as SalesDeal));
}

export async function getDealActivities(dealId: string): Promise<DealActivity[]> {
  const q = query(
    collection(db, 'dealActivities'), 
    where('dealId', '==', dealId),
    orderBy('createdAt', 'desc')
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
  } as DealActivity));
}

export async function addDealNote(dealId: string, note: string): Promise<void> {
  await addDoc(collection(db, 'dealActivities'), {
    dealId,
    type: 'note_added',
    description: note,
    createdAt: new Date(),
  });

  await updateDoc(doc(db, 'deals', dealId), {
    notes: note,
    updatedAt: new Date(),
  });
}