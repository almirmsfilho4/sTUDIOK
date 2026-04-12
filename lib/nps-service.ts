import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

export interface NPSSurvey {
  id: string;
  projectId: string;
  clientName: string;
  clientEmail: string;
  score: number;
  feedback?: string;
  promoters: boolean;
  passives: boolean;
  detractors: boolean;
  sentAt?: Date;
  respondedAt?: Date;
}

export async function sendNPSSurvey(projectId: string, clientEmail: string, clientName: string): Promise<string> {
  const docRef = await addDoc(collection(db, 'npsSurveys'), {
    projectId,
    clientName,
    clientEmail,
    score: 0,
    promoters: false,
    passives: false,
    detractors: false,
    sentAt: serverTimestamp(),
  });

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

  await resend.emails.send({
    from: 'ESTUDIOK <noreply@estudiak.com>',
    to: clientEmail,
    subject: 'Como foi sua experiência com a ESTUDIOK?',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; background: #0A0A0A; color: #fff; padding: 40px; }
          .container { max-width: 600px; margin: 0 auto; background: #1A1A1A; border-radius: 12px; padding: 40px; }
          h1 { color: #00D4FF; }
          .buttons { display: flex; gap: 10px; justify-content: center; margin: 30px 0; }
          .btn { padding: 15px 25px; border-radius: 8px; text-decoration: none; font-weight: bold; }
          .btn-0 { background: #EF4444; color: white; }
          .btn-1 { background: #F97316; color: white; }
          .btn-2 { background: #F59E0B; color: white; }
          .btn-3 { background: #84CC16; color: white; }
          .btn-4 { background: #22C55E; color: white; }
          .btn-5 { background: #10B981; color: white; }
          .btn-6 { background: #14B8A6; color: white; }
          .btn-7 { background: #06B6D4; color: white; }
          .btn-8 { background: #0EA5E9; color: white; }
          .btn-9 { background: #3B82F6; color: white; }
          .btn-10 { background: #8B5CF6; color: white; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Olá ${clientName}!</h1>
          <p>Recebemos seu projeto recentemente e gostaríamos de saber sua experiência.</p>
          <p>Em uma escala de 0 a 10, qual a probabilidade de você nos recomendar para um amigo?</p>
          
          <div class="buttons">
            ${[0,1,2,3,4,5,6,7,8,9,10].map(n => `
              <a href="https://estudiak.com/nps/responder?survey=${docRef.id}&score=${n}" class="btn btn-${n}">${n}</a>
            `).join('')}
          </div>
          
          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Esta pesquisa é totalmente anônima. Obrigado pelo feedback!
          </p>
        </div>
      </body>
      </html>
    `,
  });

  return docRef.id;
}

export async function respondNPSSurvey(surveyId: string, score: number, feedback?: string): Promise<void> {
  const survey = await getNPSSurvey(surveyId);
  if (!survey) return;

  const promoters = score >= 9;
  const passives = score >= 7 && score <= 8;
  const detractors = score <= 6;

  await updateDoc(doc(db, 'npsSurveys', surveyId), {
    score,
    feedback,
    promoters,
    passives,
    detractors,
    respondedAt: serverTimestamp(),
  });
}

export async function getNPSSurvey(surveyId: string): Promise<NPSSurvey | null> {
  const snapshot = await getDocs(query(collection(db, 'npsSurveys'), where('__name__', '==', surveyId)));
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    sentAt: data.sentAt?.toDate(),
    respondedAt: data.respondedAt?.toDate(),
  } as NPSSurvey;
}

export async function getNPSStats(): Promise<{
  total: number;
  average: number;
  promoters: number;
  passives: number;
  detractors: number;
  nps: number;
}> {
  const snapshot = await getDocs(collection(db, 'npsSurveys'));
  const surveys = snapshot.docs
    .map(doc => doc.data())
    .filter(s => s.score > 0);

  if (surveys.length === 0) {
    return { total: 0, average: 0, promoters: 0, passives: 0, detractors: 0, nps: 0 };
  }

  const total = surveys.length;
  const average = surveys.reduce((acc, s) => acc + s.score, 0) / total;
  const promoters = surveys.filter(s => s.promoters).length;
  const passives = surveys.filter(s => s.passives).length;
  const detractors = surveys.filter(s => s.detractors).length;

  const nps = Math.round(((promoters - detractors) / total) * 100);

  return { total, average, promoters, passives, detractors, nps };
}

export function getNPSGrade(nps: number): string {
  if (nps >= 80) return 'Excelente';
  if (nps >= 60) return 'Ótimo';
  if (nps >= 40) return 'Bom';
  if (nps >= 20) return 'Regular';
  return 'Ruim';
}

export function getNPSColor(nps: number): string {
  if (nps >= 80) return '#22C55E';
  if (nps >= 60) return '#10B981';
  if (nps >= 40) return '#F59E0B';
  if (nps >= 20) return '#F97316';
  return '#EF4444';
}