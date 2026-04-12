'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getDocuments, createDocument, updateDocument } from '@/lib/firebase-services';
import PremiumIcon from '@/components/PremiumIcon';

interface Contract {
  id: string;
  projectId: string;
  userId: string;
  title: string;
  content: string;
  status: 'draft' | 'pending_signature' | 'signed' | 'rejected';
  createdAt: any;
  signedAt?: any;
}

interface Project {
  id: string;
  name: string;
  user_id: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

const CONTRACT_TEMPLATES = {
  basico: {
    title: 'Contrato de Prestação de Serviços',
    content: `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS

CONTRATANTE: [CLIENTE_NOME]
CONTRATADA: ESTUDIOK SOLUÇÕES DIGITAIS LTDA

1. DO OBJETO
O presente contrato tem por objeto a prestação de serviços de desenvolvimento de [PROJETO_NOME], conforme especificações acordadas entre as partes.

2. DO VALOR
O valor total dos serviços é de R$ [VALOR], payable according to the agreed payment schedule.

3. DO PRAZO
O prazo para entrega é de [PRAZO] dias, starting from the signing of this contract.

4. DAS OBRIGAÇÕES DA CONTRATADA
- Entregar o projeto conforme especificações
- Realizar até 2 rounds de revisões
- Fornecer suporte por 30 dias após entrega

5. DAS OBRIGAÇÕES DO CONTRATANTE
- Fornecer materiais necessários
- Efetuar pagamentos nas datas acordadas
- Comunicar feedback em até 5 dias úteis

6. DA RESCISÃO
Em caso de rescisão, o cliente será responsável pelos serviços já prestados.

7. DO ACEITE
Ao assinar este contrato, ambas as partes concordam com os termos aqui estabelecidos.
    `.trim()
  },
  completo: {
    title: 'Contrato Completo de Desenvolvimento',
    content: `
CONTRATO DE PRESTAÇÃO DE SERVIÇOS DE DESENVOLVIMENTO

CONTRATANTE: [CLIENTE_NOME]
CONTRATADA: ESTUDIOK SOLUÇÕES DIGITAIS LTDA
CNPJ: 00.000.000/0001-00

1. DO OBJETO DO CONTRATO
1.1. Este contrato regula a prestação de serviços de desenvolvimento, design e implementação de soluções digitais pela CONTRATADA ao CONTRATANTE.

2. ESPECIFICAÇÃO DOS SERVIÇOS
2.1. Projeto: [PROJETO_NOME]
2.2. Tipo: [TIPO_PROJETO]
2.3. Funcionalidades: [FUNCIONALIDADES]
2.4. Prazo de entrega: [PRAZO] dias

3. VALOR E FORMA DE PAGAMENTO
3.1. Valor total: R$ [VALOR]
3.2. Entrada: R$ [ENTRADA] (30%)
3.3. Parcelas: [PARCELAS]
3.4. O não pagamento caracteriza inadimplência.

4. DIREITOS E OBRIGAÇÕES
4.1. CONTRATADA deve entregar projeto funcional
4.2. CONTRATANTE deve fornecer conteúdo e acesso necessários
4.3. Suporte incluso por 30 dias após entrega
4.4. Alterações adicionais serão cobradas à parte

5. PROPRIEDADE INTELECTUAL
5.1. Após pagamento total, o código pertence ao CLIENTE
5.2. A ESTUDIOK pode utilizar o projeto em portfólio

6. GARANTIA
6.1. 30 dias de garantia para correções de bugs
6.2. Não inclui novas funcionalidades

7. CONFIDENCIALIDADE
7.1. Ambas as partes se comprometem a manter sigilo

8. FORO
8.1. Foro da cidade de São Paulo, SP

ASSINATURAS

_____________________
CONTRATANTE

_____________________
ESTUDIOK
    `.trim()
  }
};

export default function ContratosPage() {
  const router = useRouter();
  const { user, userData, loading: authLoading } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<'basico' | 'completo'>('basico');
  const [customContent, setCustomContent] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || userData?.role !== 'admin')) {
      router.push('/login');
    }
  }, [user, userData, authLoading, router]);

  useEffect(() => {
    if (user && userData?.role === 'admin') {
      loadData();
    }
  }, [user, userData]);

  const loadData = async () => {
    try {
      const [contractsData, projectsData, usersData] = await Promise.all([
        getDocuments('contracts'),
        getDocuments('projects'),
        getDocuments('users'),
      ]);
      setContracts(contractsData as Contract[]);
      setProjects(projectsData as Project[]);
      setUsers(usersData as User[]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContract = async () => {
    if (!selectedProject) return;
    
    setCreating(true);
    try {
      const project = projects.find(p => p.id === selectedProject);
      const projectUser = users.find(u => u.id === project?.user_id);
      const template = CONTRACT_TEMPLATES[selectedTemplate];
      
      let content = template.content
        .replace('[CLIENTE_NOME]', projectUser?.name || 'Cliente')
        .replace('[PROJETO_NOME]', project?.name || 'Projeto')
        .replace('[VALOR]', (project as any)?.price?.toLocaleString('pt-BR') || '0')
        .replace('[PRAZO]', '30');

      await createDocument('contracts', {
        projectId: selectedProject,
        userId: project?.user_id,
        title: template.title,
        content: customContent || content,
        status: 'draft',
        createdAt: new Date(),
      });

      alert('Contrato criado com sucesso!');
      setShowCreateModal(false);
      loadData();
    } catch (error) {
      console.error('Error creating contract:', error);
      alert('Erro ao criar contrato');
    } finally {
      setCreating(false);
    }
  };

  const getProjectName = (projectId: string) => {
    const p = projects.find(proj => proj.id === projectId);
    return p?.name || 'Projeto';
  };

  const getUserName = (userId: string) => {
    const u = users.find(usr => usr.id === userId);
    return u?.name || 'Cliente';
  };

  const pendingContracts = contracts.filter(c => c.status === 'pending_signature');
  const signedContracts = contracts.filter(c => c.status === 'signed');

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#00D4FF] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <header className="border-b border-[#1A1A1A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <a href="/admin" className="flex items-center gap-2">
                <img src="/logo.png" alt="ESTUDIOK" className="w-20 h-20 object-contain" />
              </a>
              <div>
                <h1 className="text-xl font-bold">Contratos Digitais</h1>
                <p className="text-sm text-gray-400">Gerencie contratos de projetos</p>
              </div>
            </div>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <PremiumIcon name="add" size={18} />
              Novo Contrato
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Total de Contratos</p>
            <p className="text-3xl font-bold">{contracts.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Aguardando Assinatura</p>
            <p className="text-3xl font-bold text-yellow-500">{pendingContracts.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-400 text-sm">Assinados</p>
            <p className="text-3xl font-bold text-green-500">{signedContracts.length}</p>
          </div>
        </div>

        {/* Contracts List */}
        <div className="card">
          <h2 className="text-lg font-bold mb-4">Todos os Contratos</h2>
          
          {contracts.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <PremiumIcon name="file" size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum contrato encontrado</p>
              <button 
                onClick={() => setShowCreateModal(true)}
                className="text-[#00D4FF] hover:underline mt-2"
              >
                Criar primeiro contrato
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#242424]">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Projeto</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Cliente</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Título</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {contracts.map((contract) => (
                    <tr key={contract.id} className="border-b border-[#242424]">
                      <td className="py-3 px-4">{getProjectName(contract.projectId)}</td>
                      <td className="py-3 px-4">{getUserName(contract.userId)}</td>
                      <td className="py-3 px-4">{contract.title}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          contract.status === 'signed' ? 'bg-green-500/20 text-green-500' :
                          contract.status === 'pending_signature' ? 'bg-yellow-500/20 text-yellow-500' :
                          contract.status === 'rejected' ? 'bg-red-500/20 text-red-500' :
                          'bg-gray-500/20 text-gray-500'
                        }`}>
                          {contract.status === 'signed' ? 'Assinado' : 
                           contract.status === 'pending_signature' ? 'Aguardando' :
                           contract.status === 'rejected' ? 'Rejeitado' : 'Rascunho'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-[#00D4FF] text-sm hover:underline">
                          Ver / Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Criar Contrato</h2>
            
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm block mb-2">Selecionar Projeto</label>
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white"
                >
                  <option value="">Selecione um projeto</option>
                  {projects.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Modelo de Contrato</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedTemplate('basico')}
                    className={`p-3 rounded-xl border-2 text-center ${
                      selectedTemplate === 'basico' 
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10' 
                        : 'border-[#242424]'
                    }`}
                  >
                    <span className="block text-sm font-bold">Básico</span>
                    <span className="text-xs text-gray-400">Simple terms</span>
                  </button>
                  <button
                    onClick={() => setSelectedTemplate('completo')}
                    className={`p-3 rounded-xl border-2 text-center ${
                      selectedTemplate === 'completo' 
                        ? 'border-[#00D4FF] bg-[#00D4FF]/10' 
                        : 'border-[#242424]'
                    }`}
                  >
                    <span className="block text-sm font-bold">Completo</span>
                    <span className="text-xs text-gray-400">Detailed terms</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-sm block mb-2">Conteúdo Personalizado (opcional)</label>
                <textarea
                  value={customContent}
                  onChange={(e) => setCustomContent(e.target.value)}
                  placeholder="Deixe vazio para usar o modelo padrão"
                  className="w-full bg-[#050505] border border-[#242424] rounded-xl p-3 text-white h-32"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 py-3 rounded-xl border border-[#242424] text-gray-400"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateContract}
                disabled={!selectedProject || creating}
                className="flex-1 btn-primary"
              >
                {creating ? 'Criando...' : 'Criar Contrato'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}