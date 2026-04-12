'use client';

import { useState } from 'react';

const API_ENDPOINTS = [
  {
    category: 'Leads',
    endpoints: [
      { method: 'POST', path: '/api/leads', description: 'Criar novo lead', body: { name: 'string', email: 'string', phone: 'string', service: 'string' } },
      { method: 'GET', path: '/api/leads', description: 'Listar todos os leads' },
      { method: 'GET', path: '/api/leads/[id]', description: 'Buscar lead por ID' },
      { method: 'PUT', path: '/api/leads/[id]', description: 'Atualizar lead', body: { status: 'string' } },
      { method: 'DELETE', path: '/api/leads/[id]', description: 'Excluir lead' },
    ],
  },
  {
    category: 'Projetos',
    endpoints: [
      { method: 'POST', path: '/api/projects', description: 'Criar novo projeto', body: { name: 'string', type: 'string', price: 'number' } },
      { method: 'GET', path: '/api/projects', description: 'Listar projetos' },
      { method: 'GET', path: '/api/projects/[id]', description: 'Detalhes do projeto' },
      { method: 'PUT', path: '/api/projects/[id]', description: 'Atualizar projeto', body: { status: 'string', progress: 'number' } },
    ],
  },
  {
    category: 'Autenticação',
    endpoints: [
      { method: 'POST', path: '/api/auth/register', description: 'Cadastrar usuário', body: { email: 'string', password: 'string', name: 'string' } },
      { method: 'POST', path: '/api/auth/login', description: 'Login', body: { email: 'string', password: 'string' } },
      { method: 'POST', path: '/api/auth/logout', description: 'Logout' },
      { method: 'POST', path: '/api/auth/reset-password', description: 'Resetar senha', body: { email: 'string' } },
    ],
  },
  {
    category: 'Pagamentos',
    endpoints: [
      { method: 'POST', path: '/api/payments/create', description: 'Criar pagamento', body: { projectId: 'string', amount: 'number' } },
      { method: 'GET', path: '/api/payments/[id]', description: 'Verificar status' },
      { method: 'POST', path: '/api/payments/webhook', description: 'Webhook Mercado Pago' },
    ],
  },
  {
    category: 'Email',
    endpoints: [
      { method: 'POST', path: '/api/email/send', description: 'Enviar email', body: { to: 'string', subject: 'string', html: 'string' } },
      { method: 'POST', path: '/api/email/template', description: 'Enviar com template', body: { to: 'string', template: 'string', data: 'object' } },
    ],
  },
  {
    category: 'Relatórios',
    endpoints: [
      { method: 'GET', path: '/api/relatorios/semanal', description: 'Relatório semanal' },
      { method: 'GET', path: '/api/relatorios/financeiro', description: 'Relatório financeiro' },
      { method: 'POST', path: '/api/relatorios/auto', description: 'Gerar relatório automático' },
    ],
  },
  {
    category: 'API Pública',
    endpoints: [
      { method: 'GET', path: '/api/public?endpoint=projects', description: 'Listar projetos públicos' },
      { method: 'GET', path: '/api/public?endpoint=portfolio', description: 'Listar portfólio' },
      { method: 'GET', path: '/api/public?endpoint=stats', description: 'Estatísticas gerais' },
      { method: 'POST', path: '/api/public?endpoint=lead', description: 'Criar lead via API', body: { name: 'string', email: 'string', service: 'string' } },
    ],
  },
];

export default function ApiDocsPage() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-500/20 text-green-500';
      case 'POST': return 'bg-blue-500/20 text-blue-500';
      case 'PUT': return 'bg-yellow-500/20 text-yellow-500';
      case 'DELETE': return 'bg-red-500/20 text-red-500';
      default: return 'bg-gray-500/20 text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-[#00D4FF] mb-2">API Documentation</h1>
        <p className="text-gray-400 mb-8">ESTUDIOK API v1.0 - Base URL: https://estudiak.com/api</p>

        <div className="mb-8 p-4 bg-[#1A1A1A] rounded-xl border border-[#242424]">
          <h2 className="font-semibold mb-2">Autenticação</h2>
          <p className="text-gray-400 text-sm">
            A API usa API Key via query parameter. Adicione <code className="bg-[#0A0A0A] px-2 py-1 rounded">?api_key=SUA_CHAVE</code> em todas as requisições.
          </p>
        </div>

        {API_ENDPOINTS.map((category) => (
          <div key={category.category} className="mb-4">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
              className="w-full flex items-center justify-between p-4 bg-[#1A1A1A] rounded-xl border border-[#242424] hover:border-[#00D4FF] transition-colors"
            >
              <h3 className="font-semibold">{category.category}</h3>
              <svg className={`w-5 h-5 transition-transform ${expandedCategory === category.category ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {expandedCategory === category.category && (
              <div className="mt-2 space-y-2">
                {category.endpoints.map((endpoint, index) => (
                  <div key={index} className="p-4 bg-[#0A0A0A] rounded-lg border border-[#242424]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <code className="text-sm text-[#00D4FF]">{endpoint.path}</code>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{endpoint.description}</p>
                    {endpoint.body && (
                      <div className="mt-2">
                        <p className="text-xs text-gray-500 mb-1">Body:</p>
                        <pre className="text-xs bg-[#1A1A1A] p-2 rounded overflow-x-auto">
                          {JSON.stringify(endpoint.body, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-8 p-4 bg-[#1A1A1A] rounded-xl border border-[#242424]">
          <h2 className="font-semibold mb-2">Códigos de Resposta</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-green-500">200 - OK</div>
            <div className="text-blue-500">201 - Created</div>
            <div className="text-yellow-500">400 - Bad Request</div>
            <div className="text-red-500">401 - Unauthorized</div>
            <div className="text-yellow-500">404 - Not Found</div>
            <div className="text-red-500">500 - Server Error</div>
          </div>
        </div>
      </div>
    </div>
  );
}