import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

export interface TaskEffort {
  id: string;
  projectId: string;
  taskName: string;
  category: 'design' | 'development' | 'content' | 'testing' | 'deployment' | 'meeting';
  estimatedHours: number;
  actualHours: number;
  assigneeId?: string;
  assigneeName?: string;
  status: 'pending' | 'in_progress' | 'completed';
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  createdAt: Date;
}

const EFFORT_TEMPLATES = {
  'Landing Page': [
    { taskName: 'Wireframe', category: 'design', estimatedHours: 2 },
    { taskName: 'Design Desktop', category: 'design', estimatedHours: 4 },
    { taskName: 'Design Mobile', category: 'design', estimatedHours: 2 },
    { taskName: 'HTML/CSS', category: 'development', estimatedHours: 6 },
    { taskName: 'JavaScript', category: 'development', estimatedHours: 4 },
    { taskName: 'Formulário', category: 'development', estimatedHours: 2 },
    { taskName: 'Responsividade', category: 'testing', estimatedHours: 2 },
    { taskName: 'Publicação', category: 'deployment', estimatedHours: 1 },
  ],
  'Site Institucional': [
    { taskName: 'Arquitetura', category: 'design', estimatedHours: 3 },
    { taskName: 'Wireframes', category: 'design', estimatedHours: 4 },
    { taskName: 'Design Home', category: 'design', estimatedHours: 6 },
    { taskName: 'Design Páginas Internas', category: 'design', estimatedHours: 8 },
    { taskName: 'Desenvolvimento Home', category: 'development', estimatedHours: 8 },
    { taskName: 'Desenvolvimento Páginas', category: 'development', estimatedHours: 16 },
    { taskName: 'CMS', category: 'development', estimatedHours: 8 },
    { taskName: 'SEO On-page', category: 'development', estimatedHours: 4 },
    { taskName: 'Testes', category: 'testing', estimatedHours: 6 },
    { taskName: 'Publicação', category: 'deployment', estimatedHours: 2 },
  ],
  'E-commerce': [
    { taskName: 'Arquitetura', category: 'design', estimatedHours: 6 },
    { taskName: 'Design UI', category: 'design', estimatedHours: 16 },
    { taskName: 'Frontend', category: 'development', estimatedHours: 24 },
    { taskName: 'Backend', category: 'development', estimatedHours: 32 },
    { taskName: 'Pagamentos', category: 'development', estimatedHours: 12 },
    { taskName: 'Frete', category: 'development', estimatedHours: 8 },
    { taskName: 'Painel Admin', category: 'development', estimatedHours: 16 },
    { taskName: 'SEO', category: 'development', estimatedHours: 8 },
    { testName: 'Testes', category: 'testing', estimatedHours: 12 },
    { taskName: 'Publicação', category: 'deployment', estimatedHours: 4 },
  ],
};

export async function createProjectTasks(projectId: string, projectType: string): Promise<void> {
  const template = EFFORT_TEMPLATES[projectType as keyof typeof EFFORT_TEMPLATES];
  
  if (!template) return;

  for (const task of template) {
    await addDoc(collection(db, 'taskEfforts'), {
      projectId,
      taskName: task.taskName,
      category: task.category,
      estimatedHours: task.estimatedHours,
      actualHours: 0,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
  }
}

export async function getProjectTasks(projectId: string): Promise<TaskEffort[]> {
  const q = query(collection(db, 'taskEfforts'), where('projectId', '==', projectId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    startDate: doc.data().startDate?.toDate(),
    dueDate: doc.data().dueDate?.toDate(),
    completedAt: doc.data().completedAt?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
  } as TaskEffort));
}

export async function updateTaskProgress(taskId: string, actualHours: number, status: TaskEffort['status']): Promise<void> {
  const updateData: any = { actualHours, status };
  if (status === 'completed') updateData.completedAt = new Date();

  await updateDoc(doc(db, 'taskEfforts', taskId), updateData);
}

export async function getProjectEffortSummary(projectId: string): Promise<{
  estimated: number;
  actual: number;
  byCategory: Record<string, { estimated: number; actual: number }>;
  completed: number;
  pending: number;
}> {
  const tasks = await getProjectTasks(projectId);

  const byCategory: Record<string, { estimated: number; actual: number }> = {};
  let estimated = 0;
  let actual = 0;

  tasks.forEach(task => {
estimated += task.estimatedHours;
 actual += task.actualHours;

 const category = task.category ?? 'other';
 if (!byCategory[category]) {
  byCategory[category] = { estimated: 0, actual: 0 };
 }
 byCategory[category]!.estimated += task.estimatedHours;
 byCategory[category]!.actual += task.actualHours;
});

  return {
    estimated,
    actual,
    byCategory,
    completed: tasks.filter(t => t.status === 'completed').length,
    pending: tasks.filter(t => t.status !== 'completed').length,
  };
}

export function estimateProjectHours(serviceType: string, pages: number, features: string[]): number {
  const base = {
    'Landing Page': 20,
    'Site Institucional': 60,
    'E-commerce': 150,
    'Blog': 40,
    'Portal': 200,
    'App Mobile': 300,
    'Sistema Web': 250,
  };

  let hours = base[serviceType as keyof typeof base] || 50;

  if (pages > 10) hours += (pages - 10) * 3;
  if (features.length > 5) hours += (features.length - 5) * 4;

  return hours;
}