import { collection, addDoc, getDocs, updateDoc, doc, query, where, serverTimestamp } from 'firebase/firestore';
import { db } from '@/app/firebase';

export interface Contract {
  id: string;
  projectId?: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientDoc: string;
  type: 'project' | 'retainer' | 'nda' | 'service';
  title: string;
  content: string;
  value: number;
  status: 'draft' | 'sent' | 'signed' | 'cancelled' | 'expired';
  signatures: ContractSignature[];
  expiresAt?: Date;
  signedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContractSignature {
  signerName: string;
  signerEmail: string;
  signerRole: 'client' | 'admin';
  signedAt?: Date;
  signature?: string;
  ipAddress?: string;
}

const CONTRACT_TEMPLATES = {
  project: (data: any) => `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: ${data.clientName}, ${data.clientDoc}
CONTRATADA: ESTUDIOK MEI - CNPJ: XX.XXX.XXX/XXXX-XX

OBJETO: Prestação de serviços de ${data.serviceDescription || 'desenvolvimento web'}

VALOR: R$ ${data.value?.toLocaleString('pt-BR') || '0,00'}

PRAZO: ${data.deadline || '30 dias'}

CLÁUSULAS:
1. O contratante compromete-se a fornecer todos os materiais necessários.
2. A contratada compromete-se a entregar o projeto conforme especificação.
3. Pagamento conforme acordo estabelecido.
4. Garantia de 30 dias após a entrega.
5. Este contrato pode ser rescindido por qualquer das partes com antecedência de 5 dias.

${data.clientName}
${new Date().toLocaleDateString('pt-BR')}
  `.trim(),
  
  retainer: (data: any) => `
CONTRATO DE RETENÇÃO MENSAL

CONTRATANTE: ${data.clientName}
CONTRATADA: ESTUDIOK MEI

SERVIÇOS INCLUÍDOS:
- Manutenção do site
- Atualizações de conteúdo
- Suporte técnico prioritário
- Hospedagem inclusa

VALOR MENSAL: R$ ${data.value?.toLocaleString('pt-BR') || '0,00'}

VIGÊNCIA: ${data.duration || '12 meses'}

${data.clientName}
${new Date().toLocaleDateString('pt-BR')}
  `.trim(),
  
  nda: (data: any) => `
ACORDO DE CONFIDENCIALIDADE (NDA)

PARTES: ${data.clientName} e ESTUDIOK MEI

OBJETO:保密协议 para projetos de desenvolvimento

COMPROMISSOS:
- Todas as informações compartilhadas são confidenciais
- Não serão divulgadas a terceiros
- Uso exclusivo para execução do projeto

VIGÊNCIA: 2 anos após assinatura

${data.clientName}
${new Date().toLocaleDateString('pt-BR')}
  `.trim(),
  
  service: (data: any) => `
CONTRATO DE SERVIÇOS

CONTRATANTE: ${data.clientName} - ${data.clientDoc}
PRESTADOR: ESTUDIOK MEI

SERVIÇO: ${data.serviceDescription}

VALOR: R$ ${data.value?.toLocaleString('pt-BR') || '0,00'}

FORMA DE PAGAMENTO: ${data.paymentMethod || 'À vista'}

PRAZO DE EXECUÇÃO: ${data.deadline || '15 dias'}

${data.clientName}
${new Date().toLocaleDateString('pt-BR')}
  `.trim(),
};

export async function createContract(contract: Omit<Contract, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
  const content = CONTRACT_TEMPLATES[contract.type]?.(contract) || contract.content;
  
  const docRef = await addDoc(collection(db, 'contracts'), {
    ...contract,
    content,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  
  return docRef.id;
}

export async function getContracts(clientId?: string): Promise<Contract[]> {
  let q;
  if (clientId) {
    q = query(collection(db, 'contracts'), where('clientId', '==', clientId));
  } else {
    q = query(collection(db, 'contracts'));
  }
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    createdAt: doc.data().createdAt?.toDate(),
    updatedAt: doc.data().updatedAt?.toDate(),
    expiresAt: doc.data().expiresAt?.toDate(),
    signedAt: doc.data().signedAt?.toDate(),
  } as Contract));
}

export async function getContractById(contractId: string): Promise<Contract | null> {
  const snapshot = await getDocs(query(collection(db, 'contracts'), where('__name__', '==', contractId)));
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  if (!doc) return null;
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    createdAt: data.createdAt?.toDate(),
    updatedAt: data.updatedAt?.toDate(),
    expiresAt: data.expiresAt?.toDate(),
    signedAt: data.signedAt?.toDate(),
  } as Contract;
}

export async function signContract(contractId: string, signature: ContractSignature): Promise<void> {
  const contract = await getContractById(contractId);
  if (!contract) throw new Error('Contract not found');
  
  const newSignatures = [...contract.signatures, { ...signature, signedAt: new Date() }];
  
  const allSigned = newSignatures.length >= 2 || 
    (contract.type === 'nda' && newSignatures.length >= 1);
  
  await updateDoc(doc(db, 'contracts', contractId), {
    signatures: newSignatures,
    status: allSigned ? 'signed' : 'sent',
    signedAt: allSigned ? new Date() : null,
    updatedAt: new Date(),
  });
}

export async function updateContractStatus(contractId: string, status: Contract['status']): Promise<void> {
  await updateDoc(doc(db, 'contracts', contractId), {
    status,
    updatedAt: new Date(),
  });
}

export function generateContractPDF(contract: Contract): string {
  const printContent = `
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #00D4FF; text-align: center; }
        pre { white-space: pre-wrap; font-family: Arial, sans-serif; line-height: 1.6; }
        .signature { margin-top: 60px; border-top: 1px solid #000; padding-top: 10px; }
        .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <h1>ESTUDIOK - Contrato</h1>
      <pre>${contract.content}</pre>
      <div class="signature">
        <p>Assinatura do Cliente:</p>
        <p>${contract.signatures.find(s => s.signerRole === 'client')?.signature || '_________________________'}</p>
        <p>${contract.clientName}</p>
        <p>${new Date().toLocaleDateString('pt-BR')}</p>
      </div>
      <div class="footer">
        <p>ESTUDIOK MEI - CNPJ: XX.XXX.XXX/XXXX-XX</p>
        <p>Este documento foi gerado automaticamente</p>
      </div>
    </body>
    </html>
  `;
  
  return printContent;
}