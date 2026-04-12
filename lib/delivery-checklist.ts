import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

export interface ChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  required: boolean;
}

export interface ProjectChecklist {
  id: string;
  projectId: string;
  items: ChecklistItemStatus[];
  completedBy?: string;
  completedAt?: Date;
  createdAt: Date;
}

export interface ChecklistItemStatus {
  itemId: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  notes?: string;
}

export const DEFAULT_CHECKLIST: ChecklistItem[] = [
  { id: 'design', category: 'Design', title: 'Design Finalizado', description: 'Todas as telas aprovadas pelo cliente', required: true },
  { id: 'responsive', category: 'Design', title: 'Responsividade', description: 'Layout funciona em mobile/tablet/desktop', required: true },
  { id: 'colors', category: 'Design', title: 'Cores e Tipografia', description: 'Paleta de cores e fontes corretas aplicadas', required: true },
  { id: 'seo_meta', category: 'SEO', title: 'Meta Tags', description: 'Title, description e OG tags configuradas', required: true },
  { id: 'seo_sitemap', category: 'SEO', title: 'Sitemap XML', description: 'Sitemap gerado e submetido ao Google', required: true },
  { id: 'seo_robots', category: 'SEO', title: 'Robots.txt', description: 'Arquivo robots.txt configurado', required: false },
  { id: 'performance', category: 'Técnico', title: 'Performance', description: 'PageSpeed acima de 80', required: true },
  { id: 'ssl', category: 'Técnico', title: 'SSL/HTTPS', description: 'Certificado SSL instalado e funcionando', required: true },
  { id: 'forms', category: 'Funcional', title: 'Formulários', description: 'Todos os formulários funcionando', required: true },
  { id: 'analytics', category: 'Funcional', title: 'Analytics', description: 'Google Analytics ou similar instalado', required: true },
  { id: 'links', category: 'Funcional', title: 'Links', description: 'Todos os links internos funcionando', required: true },
  { id: 'images', category: 'Conteúdo', title: 'Imagens Otimizadas', description: 'Imagens comprimidas e com alt text', required: true },
  { id: 'copy', category: 'Conteúdo', title: 'Conteúdo Revisado', description: 'Textos revisados e sem erros', required: true },
  { id: 'hosting', category: 'Infra', title: 'Hospedagem', description: 'Site publicado e acessível', required: true },
  { id: 'backup', category: 'Infra', title: 'Backup', description: 'Backup do projeto realizado', required: true },
  { id: 'docs', category: 'Documentação', title: 'Documentação', description: 'Manual do cliente entregue', required: false },
];

export async function createProjectChecklist(projectId: string): Promise<string> {
  const items: ChecklistItemStatus[] = DEFAULT_CHECKLIST.map(item => ({
    itemId: item.id,
    completed: false,
  }));

  const docRef = await addDoc(collection(db, 'projectChecklists'), {
    projectId,
    items,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function getProjectChecklist(projectId: string): Promise<ProjectChecklist | null> {
  const q = query(collection(db, 'projectChecklists'), where('projectId', '==', projectId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    completedAt: data.completedAt?.toDate(),
    createdAt: data.createdAt?.toDate(),
  } as ProjectChecklist;
}

export async function updateChecklistItem(
  checklistId: string,
  itemId: string,
  completed: boolean,
  userId: string,
  notes?: string
): Promise<void> {
  const checklist = await getDocChecklist(checklistId);
  if (!checklist) return;

  const items = checklist.items.map(item => {
    if (item.itemId === itemId) {
      return {
        ...item,
        completed,
        completedAt: completed ? new Date() : null,
        completedBy: completed ? userId : null,
        notes: notes || item.notes,
      };
    }
    return item;
  });

  const allRequired = DEFAULT_CHECKLIST
    .filter(i => i.required)
    .every(i => items.find(item => item.itemId === i.id)?.completed);

  await updateDoc(doc(db, 'projectChecklists', checklistId), {
    items,
    completedBy: allRequired ? userId : null,
    completedAt: allRequired ? new Date() : null,
  });
}

async function getDocChecklist(checklistId: string): Promise<ProjectChecklist | null> {
  const snapshot = await getDocs(query(collection(db, 'projectChecklists'), where('__name__', '==', checklistId)));
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    completedAt: data.completedAt?.toDate(),
    createdAt: data.createdAt?.toDate(),
  } as ProjectChecklist;
}

export async function getChecklistProgress(checklistId: string): Promise<{ total: number; completed: number; percentage: number }> {
  const checklist = await getDocChecklist(checklistId);
  if (!checklist) return { total: 0, completed: 0, percentage: 0 };

  const total = checklist.items.length;
  const completed = checklist.items.filter(i => i.completed).length;

  return {
    total,
    completed,
    percentage: Math.round((completed / total) * 100),
  };
}

export async function getChecklistByCategory(checklistId: string): Promise<{ category: string; items: ChecklistItem[]; completed: number; total: number }[]> {
  const checklist = await getDocChecklist(checklistId);
  if (!checklist) return [];

  const categories = Array.from(new Set(DEFAULT_CHECKLIST.map(i => i.category)));

  return categories.map(category => {
    const categoryItems = DEFAULT_CHECKLIST.filter(i => i.category === category);
    const completed = categoryItems.filter(item => 
      checklist.items.find(i => i.itemId === item.id)?.completed
    ).length;

    return {
      category,
      items: categoryItems,
      completed,
      total: categoryItems.length,
    };
  });
}