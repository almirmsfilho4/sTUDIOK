import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';

export interface ProposalSection {
  id: string;
  type: 'header' | 'intro' | 'scope' | 'timeline' | 'pricing' | 'terms' | 'cta' | 'signature';
  title: string;
  content: string;
  order: number;
}

export interface Proposal {
  id: string;
  quoteId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  projectName: string;
  serviceType: string;
  sections: ProposalSection[];
  totalValue: number;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  validUntil: Date;
  viewedAt?: Date;
  acceptedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposalVersion {
  id: string;
  proposalId: string;
  version: number;
  sections: ProposalSection[];
  totalValue: number;
  createdAt: Date;
}

const DEFAULT_SECTIONS: Omit<ProposalSection, 'id'>[] = [
  { type: 'header', title: 'Proposta Comercial', content: '', order: 0 },
  { type: 'intro', title: 'Introdução', content: '', order: 1 },
  { type: 'scope', title: 'Escopo do Projeto', content: '', order: 2 },
  { type: 'timeline', title: 'Cronograma', content: '', order: 3 },
  { type: 'pricing', title: 'Investimento', content: '', order: 4 },
  { type: 'terms', title: 'Termos e Condições', content: '', order: 5 },
  { type: 'cta', title: 'Próximos Passos', content: '', order: 6 },
];

export async function createProposal(data: {
  quoteId: string;
  clientName: string;
  clientEmail: string;
  clientCompany?: string;
  projectName: string;
  serviceType: string;
  totalValue: number;
  scope?: string;
  timeline?: string;
}): Promise<string> {
  const now = new Date();
  const validUntil = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const sections: ProposalSection[] = DEFAULT_SECTIONS.map((s, i) => ({
    ...s,
    id: `section_${i}`,
    content: getSectionContent(s.type, data),
  }));

  const docRef = await addDoc(collection(db, 'proposals'), {
    quoteId: data.quoteId,
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientCompany: data.clientCompany || '',
    projectName: data.projectName,
    serviceType: data.serviceType,
    sections,
    totalValue: data.totalValue,
    status: 'draft',
    validUntil,
    createdAt: now,
    updatedAt: now,
  });

  await addDoc(collection(db, 'proposalVersions'), {
    proposalId: docRef.id,
    version: 1,
    sections,
    totalValue: data.totalValue,
    createdAt: now,
  });

  return docRef.id;
}

function getSectionContent(type: string, data: any): string {
  switch (type) {
    case 'header':
      return '';
    case 'intro':
      return `Prezado(a) ${data.clientName},

Agradecemos seu interesse em nossos serviços. Esta proposta foi elaborada especificamente para atender às necessidades do projeto "${data.projectName}".

Nossa equipe analisou os requisitos e preparou uma solução personalizada para você.`;
    case 'scope':
      return data.scope || `Escopo do projeto "${data.projectName}":
      
• Desenvolvimento de ${data.serviceType}
• Design profissional e responsivo
• Otimização para busca (SEO básico)
• Compatibilidade com dispositivos móveis
• Suporte técnico por 30 dias após entrega`;
    case 'timeline':
      return data.timeline || `Cronograma estimado:
      
• Semana 1-2: Estrutura e design
• Semana 2-3: Desenvolvimento
• Semana 3-4: Testes e ajustes
• Semana 4: Entrega e treinamento`;
    case 'pricing':
      return `Valor total do projeto: R$ ${data.totalValue?.toLocaleString('pt-BR') || '0,00'}

Formas de pagamento:
• À vista: 10% de desconto
• Parcelado em até 12x no cartão
• Entrada de 50% + conclusão em 50%`;
    case 'terms':
      return `Termos e condições:

• Validade desta proposta: 30 dias
• Garantia: 30 dias após entrega
• Alterações: Até 2 rounds de ajustes inclusos
• Pagamento: Conforme descrito acima
• Propriedade: Todo código e assets são do cliente após pagamento`;
    case 'cta':
      return `Próximos passos:

1. Revise esta proposta
2. Responda confirmando interesse
3. Realize o pagamento da entrada
4. Iniciaremos o projeto imediatamente`;
    default:
      return '';
  }
}

export async function getProposal(proposalId: string): Promise<Proposal | null> {
  const snapshot = await getDocs(query(collection(db, 'proposals'), where('__name__', '==', proposalId)));
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    validUntil: data.validUntil?.toDate(),
    viewedAt: data.viewedAt?.toDate(),
    acceptedAt: data.acceptedAt?.toDate(),
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
  } as Proposal;
}

export async function getProposalsByQuote(quoteId: string): Promise<Proposal[]> {
  const q = query(collection(db, 'proposals'), where('quoteId', '==', quoteId));
  const snapshot = await getDocs(q);

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    validUntil: doc.data().validUntil?.toDate(),
    viewedAt: doc.data().viewedAt?.toDate(),
    acceptedAt: doc.data().acceptedAt?.toDate(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
  } as Proposal));
}

export async function sendProposal(proposalId: string): Promise<void> {
  const proposal = await getProposal(proposalId);
  if (!proposal) return;

  const { Resend } = await import('resend');
  const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

  await resend.emails.send({
    from: 'ESTUDIOK <noreply@estudiak.com>',
    to: proposal.clientEmail,
    subject: `Proposta: ${proposal.projectName} - ESTUDIOK`,
    html: generateProposalHTML(proposal),
  });

  await updateDoc(doc(db, 'proposals', proposalId), {
    status: 'sent',
    updatedAt: new Date(),
  });
}

export async function trackProposalView(proposalId: string): Promise<void> {
  const proposal = await getProposal(proposalId);
  if (!proposal || proposal.viewedAt) return;

  await updateDoc(doc(db, 'proposals', proposalId), {
    status: 'viewed',
    viewedAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function acceptProposal(proposalId: string): Promise<void> {
  await updateDoc(doc(db, 'proposals', proposalId), {
    status: 'accepted',
    acceptedAt: new Date(),
    updatedAt: new Date(),
  });
}

export async function rejectProposal(proposalId: string): Promise<void> {
  await updateDoc(doc(db, 'proposals', proposalId), {
    status: 'rejected',
    updatedAt: new Date(),
  });
}

export async function updateProposalSection(proposalId: string, sectionId: string, content: string): Promise<void> {
  const proposal = await getProposal(proposalId);
  if (!proposal) return;

  const sections = proposal.sections.map(s =>
    s.id === sectionId ? { ...s, content } : s
  );

  await updateDoc(doc(db, 'proposals', proposalId), {
    sections,
    updatedAt: new Date(),
  });
}

export async function createProposalVersion(proposalId: string): Promise<void> {
  const proposal = await getProposal(proposalId);
  if (!proposal) return;

  const versionsSnapshot = await getDocs(query(collection(db, 'proposalVersions'), where('proposalId', '==', proposalId)));
  const newVersion = versionsSnapshot.docs.length + 1;

  await addDoc(collection(db, 'proposalVersions'), {
    proposalId,
    version: newVersion,
    sections: proposal.sections,
    totalValue: proposal.totalValue,
    createdAt: new Date(),
  });
}

function generateProposalHTML(proposal: Proposal): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; background: #0A0A0A; color: #fff; }
    .header { text-align: center; padding: 40px 0; border-bottom: 2px solid #00D4FF; }
    .logo { font-size: 32px; font-weight: bold; color: #00D4FF; }
    .client-info { background: #1A1A1A; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .section { background: #1A1A1A; padding: 20px; border-radius: 10px; margin: 20px 0; }
    .section h2 { color: #00D4FF; margin-top: 0; }
    .price { font-size: 28px; color: #00FF88; font-weight: bold; text-align: center; padding: 20px; background: #0A0A0A; border-radius: 10px; }
    .cta { text-align: center; padding: 30px; }
    .btn { display: inline-block; padding: 15px 40px; background: #00D4FF; color: #000; text-decoration: none; border-radius: 8px; font-weight: bold; }
    .validity { text-align: center; color: #888; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">ESTUDIOK</div>
    <p>Proposta Comercial</p>
  </div>
  
  <div class="client-info">
    <p><strong>Cliente:</strong> ${proposal.clientName}</p>
    <p><strong>Projeto:</strong> ${proposal.projectName}</p>
    <p><strong>Serviço:</strong> ${proposal.serviceType}</p>
  </div>
  
  ${proposal.sections.filter(s => s.type !== 'header').map(section => `
    <div class="section">
      <h2>${section.title}</h2>
      <pre style="white-space: pre-wrap; font-family: inherit; font-size: 14px;">${section.content}</pre>
    </div>
  `).join('')}
  
  <div class="price">
    R$ ${proposal.totalValue.toLocaleString('pt-BR')}
  </div>
  
  <div class="cta">
    <a href="https://estudiak.com/proposal/${proposal.id}/accept" class="btn">Aceitar Proposta</a>
  </div>
  
  <div class="validity">
    Válido até: ${proposal.validUntil.toLocaleDateString('pt-BR')}
  </div>
</body>
</html>
  `.trim();
}

export function generateProposalPDF(proposal: Proposal): string {
  return generateProposalHTML(proposal);
}