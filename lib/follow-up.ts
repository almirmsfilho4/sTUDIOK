import { collection, addDoc, getDocs, updateDoc, doc, query, where } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export interface FollowUpSequence {
  id: string;
  name: string;
  trigger: 'new_lead' | 'no_response' | 'budget_view' | 'project_completed';
  steps: FollowUpStep[];
  active: boolean;
}

export interface FollowUpStep {
  day: number;
  subject: string;
  template: string;
  sent?: Date;
}

export interface LeadFollowUp {
  id: string;
  quoteId: string;
  leadEmail: string;
  leadName: string;
  sequenceId: string;
  currentStep: number;
  status: 'active' | 'completed' | 'stopped';
  startedAt: Date;
  lastSentAt?: Date;
  nextSendAt?: Date;
}

const DEFAULT_SEQUENCES: (Omit<FollowUpSequence, 'id'> & { sequenceId: string })[] = [
 {
  name: 'Novo Lead',
  trigger: 'new_lead',
  active: true,
  sequenceId: 'new_lead',
  steps: [
      {
        day: 0,
        subject: 'Obrigado pelo seu interesse! 👋',
        template: `
          Oi {{name}}! 👋
          
          Obrigado pelo seu interesse nos serviços da ESTUDIOK!
          
          Recebemos seu orçamento e nossa equipe está analisando suas necessidades.
          Em breve enviaremos uma proposta personalizada.
          
          Enquanto isso, você pode conhecer alguns casos de sucesso:
          {{portfolio_url}}
          
          Qualquer dúvida, é só responder este email!
          
          Abs,
          Equipe ESTUDIOK
        `,
      },
      {
        day: 2,
        subject: 'Sua proposta está quase pronta! 📋',
        template: `
          Oi {{name}}! 📋
          
          Como vai?
          
          Estamos finalizando sua proposta personalizada. 
          Em até 24 horas você receberá no seu email.
          
          Já sabe que temos entrega em 48 horas?
          Muitos clientes ficaram surpresos com a agilidade!
          
          Abraços,
          Equipe ESTUDIOK
        `,
      },
      {
        day: 5,
        subject: 'Recebeu nossa proposta? 🤔',
        template: `
          Oi {{name}}!
          
          Já enviou nossa proposta para {{email}}.
          
          Gostaríamos de saber se você teve alguma dúvida ou precisa de mais informações.
          
          Мы также falamos em português! 😄
          
          Reply to this email!
          
          Equipe ESTUDIOK
        `,
      },
    ],
  },
];

export async function createFollowUp(quoteId: string, leadEmail: string, leadName: string): Promise<string> {
 const sequence = DEFAULT_SEQUENCES[0];
 if (!sequence || !sequence.steps[0]) {
   throw new Error('No sequence found');
 }
 const nextSend = new Date();
 nextSend.setDate(nextSend.getDate() + sequence.steps[0].day);
  
  const docRef = await addDoc(collection(db, 'leadFollowUps'), {
    quoteId,
    leadEmail,
    leadName,
    sequenceId: 'new_lead',
    currentStep: 0,
    status: 'active',
    startedAt: new Date(),
    nextSendAt: nextSend,
  });
  
  return docRef.id;
}

export async function processFollowUps(): Promise<number> {
  const now = new Date();
  const q = query(
    collection(db, 'leadFollowUps'),
    where('status', '==', 'active'),
    where('nextSendAt', '<=', now)
  );
  
  const snapshot = await getDocs(q);
  let sent = 0;
  
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as LeadFollowUp;
    const sequence = DEFAULT_SEQUENCES.find(s => s.sequenceId === data.sequenceId);
    
    if (!sequence || !sequence.steps[data.currentStep]) {
      await updateDoc(docSnap.ref, { status: 'completed' });
      continue;
    }
    
const step = sequence.steps[data.currentStep]!;
 const emailHtml = step.template
  .replace(/{{name}}/g, data.leadName)
  .replace(/{{email}}/g, data.leadEmail)
  .replace(/{{portfolio_url}}/g, `${process.env.NEXT_PUBLIC_SITE_URL}/portfolio`);

 try {
  await resend.emails.send({
   from: 'ESTUDIOK <noreply@estudiok.com.br>',
   to: data.leadEmail,
   subject: step.subject,
   html: emailHtml.replace(/\n/g, '<br>'),
  });

  const nextStep = data.currentStep + 1;
  const nextSend = new Date();

  if (nextStep < sequence.steps.length && sequence.steps[nextStep]) {
   nextSend.setDate(nextSend.getDate() + sequence.steps[nextStep]!.day);
        await updateDoc(docSnap.ref, {
          currentStep: nextStep,
          lastSentAt: new Date(),
          nextSendAt: nextSend,
        });
      } else {
        await updateDoc(docSnap.ref, {
          status: 'completed',
          lastSentAt: new Date(),
          nextSendAt: null,
        });
      }
      
      sent++;
    } catch (error) {
      console.error('Error sending follow-up:', error);
    }
  }
  
  return sent;
}

export async function stopFollowUp(followUpId: string): Promise<void> {
  const docRef = doc(db, 'leadFollowUps', followUpId);
  await updateDoc(docRef, { status: 'stopped' });
}