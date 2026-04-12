import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';

export interface DiaryEntry {
  id: string;
  projectId: string;
  date: Date;
  summary: string;
  progress: number;
  completedTasks: string[];
  pendingTasks: string[];
  blockers?: string;
  mood: 'great' | 'good' | 'neutral' | 'challenging';
  createdAt: Date;
}

export async function createDailyUpdate(projectId: string, data: {
  summary: string;
  progress: number;
  completedTasks: string[];
  pendingTasks: string[];
  blockers?: string;
  mood: DiaryEntry['mood'];
}): Promise<string> {
  const docRef = await addDoc(collection(db, 'projectDiary'), {
    projectId,
    date: new Date(),
    ...data,
    createdAt: serverTimestamp(),
  });

  await addDoc(collection(db, 'notifications'), {
    projectId,
    type: 'diary',
    title: 'Atualização diária',
    message: `Projeto ${projectId}: ${data.progress}% completo`,
    read: false,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getProjectDiary(projectId: string, limit = 30): Promise<DiaryEntry[]> {
  const q = query(
    collection(db, 'projectDiary'),
    where('projectId', '==', projectId),
    orderBy('date', 'desc'),
  );

  const snapshot = await getDocs(q);
  const entries = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    date: doc.data().date?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  } as DiaryEntry));

  return limit ? entries.slice(0, limit) : entries;
}

export async function getDiarySummary(projectId: string): Promise<{
  totalEntries: number;
  averageProgress: number;
  currentStreak: number;
  lastEntry: Date | null;
}> {
  const entries = await getProjectDiary(projectId, 30);

  if (entries.length === 0) {
    return { totalEntries: 0, averageProgress: 0, currentStreak: 0, lastEntry: null };
  }

  const averageProgress = entries.reduce((acc, e) => acc + e.progress, 0) / entries.length;

  let currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

for (let i = 0; i < entries.length; i++) {
 const entry = entries[i];
 if (!entry?.date) continue;
 const entryDate = new Date(entry.date);
 entryDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(today.getDate() - i);

    if (entryDate.getTime() === expectedDate.getTime()) {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    totalEntries: entries.length,
    averageProgress: Math.round(averageProgress),
    currentStreak,
    lastEntry: entries[0]?.date || null,
  };
}

export async function generateWeeklyReport(projectId: string): Promise<string> {
  const entries = await getProjectDiary(projectId, 7);

  if (entries.length === 0) {
    return 'Nenhuma atualização esta semana.';
  }

  const startProgress = entries[entries.length - 1]?.progress || 0;
  const endProgress = entries[0]?.progress || 0;
  const progressDiff = endProgress - startProgress;

  const allCompleted = entries.flatMap(e => e.completedTasks);
  const uniqueCompleted = Array.from(new Set(allCompleted));

  return `
📊 RELATÓRIO SEMANAL - Projeto ${projectId}

📈 Progresso: ${startProgress}% → ${endProgress}% (+${progressDiff}%)

✅ Concluído esta semana:
${uniqueCompleted.map(t => `• ${t}`).join('\n')}

⏳ Pendente:
${entries[0]?.pendingTasks.map(t => `• ${t}`).join('\n') || 'N/A'}

📝 Total de atualizações: ${entries.length}
  `.trim();
}