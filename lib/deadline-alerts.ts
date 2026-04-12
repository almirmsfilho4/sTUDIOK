import { db } from '@/app/firebase';
import { collection, getDocs, query, where, updateDoc, doc, serverTimestamp } from 'firebase/firestore';

export interface DeadlineAlert {
  id: string;
  projectId: string;
  projectName: string;
  userId: string;
  deadline: Date;
  daysRemaining: number;
  notified: boolean;
  notifiedAt?: Date;
}

export async function checkUpcomingDeadlines(): Promise<DeadlineAlert[]> {
  const projectsQuery = query(collection(db, 'projects'));
  const snapshot = await getDocs(projectsQuery);

  const alerts: DeadlineAlert[] = [];
  const now = new Date();

  for (const docSnap of snapshot.docs) {
    const project = docSnap.data();

    if (!project.deadline || project.status === 'completed') continue;

    const deadline = project.deadline.toDate ? project.deadline.toDate() : new Date(project.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining <= 3 && daysRemaining >= 0) {
      const alert: DeadlineAlert = {
        id: docSnap.id,
        projectId: docSnap.id,
        projectName: project.name,
        userId: project.userId,
        deadline,
        daysRemaining,
        notified: project.deadlineNotified || false,
      };

      alerts.push(alert);

      if (!alert.notified && daysRemaining <= 3) {
        await sendDeadlineNotification(alert);
      }
    }
  }

  return alerts;
}

async function sendDeadlineNotification(alert: DeadlineAlert): Promise<void> {
  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

  const message = alert.daysRemaining === 0
    ? 'O prazo do seu projeto termina HOJE!'
    : `O prazo do seu projeto termina em ${alert.daysRemaining} dias.`;

  await resend.emails.send({
    from: 'ESTUDIOK <noreply@estudiak.com>',
    to: 'almir.msfilho@hotmail.com',
    subject: `⚠️ Alerta de Prazo: ${alert.projectName}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #0A0A0A; color: #fff;">
        <h2 style="color: #00D4FF;">Alerta de Prazo</h2>
        <p>${message}</p>
        <p><strong>Projeto:</strong> ${alert.projectName}</p>
        <p><strong>Prazo:</strong> ${alert.deadline.toLocaleDateString('pt-BR')}</p>
        <p style="margin-top: 20px; color: #666;">
          Acesse o painel para verificar o progresso.
        </p>
      </div>
    `,
  });

  await updateDoc(doc(db, 'projects', alert.projectId), {
    deadlineNotified: true,
    notificationSentAt: serverTimestamp(),
  });
}

export async function getProjectDeadlines(userId: string): Promise<DeadlineAlert[]> {
  const q = query(collection(db, 'projects'), where('userId', '==', userId));
  const snapshot = await getDocs(q);

  const alerts: DeadlineAlert[] = [];
  const now = new Date();

  for (const docSnap of snapshot.docs) {
    const project = docSnap.data();

    if (!project.deadline || project.status === 'completed') continue;

    const deadline = project.deadline.toDate ? project.deadline.toDate() : new Date(project.deadline);
    const daysRemaining = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (daysRemaining > 0) {
      alerts.push({
        id: docSnap.id,
        projectId: docSnap.id,
        projectName: project.name,
        userId: project.userId,
        deadline,
        daysRemaining,
        notified: project.deadlineNotified || false,
      });
    }
  }

  return alerts.sort((a, b) => a.daysRemaining - b.daysRemaining);
}

export function getUrgencyLevel(daysRemaining: number): 'critical' | 'warning' | 'normal' {
  if (daysRemaining <= 1) return 'critical';
  if (daysRemaining <= 3) return 'warning';
  return 'normal';
}

export function getDeadlineMessage(daysRemaining: number): string {
  if (daysRemaining <= 0) return 'Prazo excedido!';
  if (daysRemaining === 1) return 'Termina amanhã!';
  if (daysRemaining <= 3) return `${daysRemaining} dias restantes`;
  if (daysRemaining <= 7) return `${daysRemaining} dias restantes`;
  return `${daysRemaining} dias restantes`;
}