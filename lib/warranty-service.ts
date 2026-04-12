import { collection, addDoc, getDocs, updateDoc, doc, query, where, orderBy, getDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface ProjectDelivery {
  id?: string;
  projectId: string;
  projectName: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  
  startDate: Date;
  deliveryDate?: Date;
  warrantyEndDate?: Date;
  
  status: 'in_progress' | 'delivered' | 'warranty_active' | 'warranty_expired';
  
  startNotes: string;
  deliveryNotes: string;
  
  deliverables: string[];
  features: string[];
  
  documents: {
    contract?: string;
    startReport?: string;
    deliveryReport?: string;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const DEFAULT_FEATURES = [
  'Design responsivo (mobile, tablet, desktop)',
  'Otimização para SEO',
  'Integração com Google Analytics',
  'Formulário de contato funcional',
  'SSL/HTTPS gratuito',
  'Entrega do código fonte',
  '30 dias de suporte pós-entrega',
];

export async function createProjectDelivery(projectId: string, projectName: string, clientId: string, clientData: any): Promise<string> {
  const startDate = new Date();
  const warrantyEndDate = new Date();
  warrantyEndDate.setDate(warrantyEndDate.getDate() + 30);

  const delivery: Omit<ProjectDelivery, 'id'> = {
    projectId,
    projectName,
    clientId,
    clientName: clientData.name || 'Cliente',
    clientEmail: clientData.email || '',
    startDate,
    status: 'in_progress',
    startNotes: `
## 🎯 Início do Projeto

O projeto "${projectName}" está oficialmente iniciado!

### O que foi acordado:
- Entrega em 48-72 horas úteis
- Suporte durante todo o desenvolvimento
- Revisões ilimitadas até a aprovação

### Próximos Passos:
1. Briefing detalhado
2. Criação do design/mockup
3. Desenvolvimento
4. Revisões e ajustes
5. Entrega final

### Suporte:
Durante todo o projeto, você terá acesso ao nosso suporte via chat ou email.

**Data de Início:** ${startDate.toLocaleDateString('pt-BR')}
    `.trim(),
    deliveryNotes: '',
    deliverables: [],
    features: DEFAULT_FEATURES,
    documents: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const docRef = await addDoc(collection(db, 'projectDeliveries'), delivery);
  return docRef.id;
}

export async function getProjectDelivery(projectId: string): Promise<ProjectDelivery | null> {
  const q = query(collection(db, 'projectDeliveries'), where('projectId', '==', projectId));
  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    startDate: data.startDate?.toDate(),
    deliveryDate: data.deliveryDate?.toDate(),
    warrantyEndDate: data.warrantyEndDate?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as ProjectDelivery;
}

export async function deliverProject(deliveryId: string, notes: string, deliverables: string[]): Promise<void> {
  const deliveryDate = new Date();
  const warrantyEndDate = new Date();
  warrantyEndDate.setDate(warrantyEndDate.getDate() + 30);

  const deliveryNotes = `
## ✅ Projeto Entregue!

Parabéns! Seu projeto foi entregue com sucesso.

### 📋 Detalhes da Entrega:
${deliverables.map(d => `- ${d}`).join('\n')}

### 🛡️ Garantia de 30 Dias
Seu período de garantia começou em **${deliveryDate.toLocaleDateString('pt-BR')}** e termina em **${warrantyEndDate.toLocaleDateString('pt-BR')}**.

### O que está incluído na garantia:
- Correção de bugs críticos
- Ajustes de layout
- Problemas de funcionamento

### Como solicitar suporte:
1. Acesse seu dashboard
2. Clique em "Suporte" ou "Tickets"
3. Descreva o problema

### Observações:
${notes || 'Nenhuma observação adicional.'}

### Próximos Passos:
1. Teste o projeto fornecido
2. Reporte qualquer problema em até 7 dias
3. Após aprovação, o período de garantia正式开始

**Data de Entrega:** ${deliveryDate.toLocaleDateString('pt-BR')}
**Fim da Garantia:** ${warrantyEndDate.toLocaleDateString('pt-BR')}
  `.trim();

  const docRef = doc(db, 'projectDeliveries', deliveryId);
  await updateDoc(docRef, {
    deliveryDate,
    warrantyEndDate,
    status: 'warranty_active',
    deliveryNotes,
    deliverables,
    updatedAt: new Date(),
  });
}

export async function updateWarrantyStatus(projectId: string): Promise<void> {
  const delivery = await getProjectDelivery(projectId);
  if (!delivery || !delivery.deliveryDate) return;

  const now = new Date();
  const warrantyEnd = delivery.warrantyEndDate || new Date();
  
  let newStatus: ProjectDelivery['status'] = delivery.status;
  
  if (now > warrantyEnd) {
    newStatus = 'warranty_expired';
  } else if (delivery.deliveryDate) {
    newStatus = 'warranty_active';
  }

  if (newStatus !== delivery.status) {
    const docRef = doc(db, 'projectDeliveries', delivery.id!);
    await updateDoc(docRef, { status: newStatus, updatedAt: new Date() });
  }
}

export function getWarrantyDaysRemaining(warrantyEndDate: Date | undefined): number {
  if (!warrantyEndDate) return 0;
  
  const now = new Date();
  const diff = warrantyEndDate.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function getWarrantyProgress(deliveryDate: Date | undefined, warrantyEndDate: Date | undefined): number {
  if (!deliveryDate || !warrantyEndDate) return 0;
  
  const totalDays = 30;
  const now = new Date();
  const elapsed = now.getTime() - deliveryDate.getTime();
  const daysElapsed = Math.floor(elapsed / (1000 * 60 * 60 * 24));
  
  return Math.min(100, Math.max(0, (daysElapsed / totalDays) * 100));
}