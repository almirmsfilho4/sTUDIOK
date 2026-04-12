'use client';

import { useState, useEffect } from 'react';
import { IARotationManager } from '@/lib/ia-rotation-manager';

interface APITestResult {
  provider: string;
  status: 'success' | 'error' | 'testing';
  responseTime: number;
  error?: string;
  content?: string;
}

export default function APIStatusPage() {
  const [testResults, setTestResults] = useState<APITestResult[]>([]);
  const [testing, setTesting] = useState(false);
  const [stats, setStats] = useState<any>(null);
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = () => {
    const manager = IARotationManager.getInstance();
    setStats(manager.getStats());
  };
  
  const testAllAPIs = async () => {
    setTesting(true);
    setTestResults([]);
    
    const manager = IARotationManager.getInstance();
    const testPrompt = 'Gere um título curto de marketing sobre criação de sites em português brasileiro.';
    
    const providers = [
      'huggingface',
      'zai',
      'openrouter',
      'groq',
      'nvidia',
      'mistral',
      'bytez',
      'gemini',
      'marketing-ai',
      'ollama-like'
    ];
    
    for (const provider of providers) {
      const startTime = Date.now();
      
      setTestResults(prev => [
        ...prev,
        { provider, status: 'testing', responseTime: 0 }
      ]);
      
      try {
        const result = await manager.generateContent({
          type: 'text',
          prompt: testPrompt,
          options: { provider }
        });
        
        const responseTime = Date.now() - startTime;
        
        setTestResults(prev => prev.map(r => 
          r.provider === provider 
            ? { 
                provider, 
                status: 'success', 
                responseTime,
                content: result.data.content?.slice(0, 100) || 'Sem conteúdo'
              }
            : r
        ));
      } catch (error: any) {
        const responseTime = Date.now() - startTime;
        
        setTestResults(prev => prev.map(r => 
          r.provider === provider 
            ? { 
                provider, 
                status: 'error', 
                responseTime,
                error: error.message || 'Erro desconhecido'
              }
            : r
        ));
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    setTesting(false);
    loadStats();
  };
  
  const resetProvider = (provider: string) => {
    const manager = IARotationManager.getInstance();
    manager.resetModel(provider);
    loadStats();
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'error': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'testing': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'testing': return '🔄';
      default: return '❓';
    }
  };
  
  const successCount = testResults.filter(r => r.status === 'success').length;
  const errorCount = testResults.filter(r => r.status === 'error').length;
  const successRate = testResults.length > 0 
    ? Math.round((successCount / testResults.length) * 100) 
    : 0;
  
  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Status das APIs de IA</h1>
          <p className="text-gray-400">
            Sistema de rotação automática entre múltiplas APIs gratuitas de IA
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="text-2xl font-bold text-[#00D4FF]">{stats?.totalModels || 0}</div>
            <div className="text-gray-400">APIs Configuradas</div>
          </div>
          
          <div className="card">
            <div className="text-2xl font-bold text-green-400">{stats?.enabledModels || 0}</div>
            <div className="text-gray-400">APIs Ativas</div>
          </div>
          
          <div className="card">
            <div className="text-2xl font-bold">{stats?.successRate || 0}%</div>
            <div className="text-gray-400">Taxa de Sucesso</div>
          </div>
        </div>
        
        <div className="card mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Testar Todas as APIs</h2>
            <button
              onClick={testAllAPIs}
              disabled={testing}
              className="btn-primary px-6 py-2 disabled:opacity-50"
            >
              {testing ? 'Testando...' : 'Executar Teste Completo'}
            </button>
          </div>
          
          {testResults.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>{successCount} funcionando</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>{errorCount} com erro</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span>{successRate}% taxa de sucesso</span>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {testResults.map((result, index) => (
                  <div 
                    key={index}
                    className={`border rounded-lg p-4 ${getStatusColor(result.status)}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{result.provider}</div>
                      <div className="text-sm">
                        {getStatusIcon(result.status)} {result.responseTime}ms
                      </div>
                    </div>
                    
                    <div className="text-sm mb-2">
                      {result.status === 'success' && (
                        <div className="truncate">{result.content}</div>
                      )}
                      {result.status === 'error' && (
                        <div className="text-red-300">{result.error}</div>
                      )}
                      {result.status === 'testing' && (
                        <div className="text-yellow-300">Testando...</div>
                      )}
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        onClick={() => resetProvider(result.provider)}
                        className="text-xs text-gray-400 hover:text-[#00D4FF]"
                      >
                        Resetar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-400">
            <p className="mb-2">✅ Sistema de rotação automática:</p>
            <ul className="space-y-1 ml-4">
              <li>• Usa a API com menor carga primeiro</li>
              <li>• Alterna automaticamente quando uma API atinge limite</li>
              <li>• Desativa temporariamente APIs com erro de rate limit</li>
              <li>• Prioriza APIs mais confiáveis e rápidas</li>
              <li>• Suporte a 10+ APIs de IA gratuitas</li>
            </ul>
          </div>
        </div>
        
        {stats && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Estatísticas do Sistema</h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#242424]">
                    <th className="text-left py-2 px-4">API</th>
                    <th className="text-left py-2 px-4">Status</th>
                    <th className="text-left py-2 px-4">Requests/min</th>
                    <th className="text-left py-2 px-4">Limite</th>
                    <th className="text-left py-2 px-4">Carga</th>
                    <th className="text-left py-2 px-4">Prioridade</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.modelStats?.map((model: any, index: number) => (
                    <tr key={index} className="border-b border-[#242424]/50">
                      <td className="py-2 px-4">{model.provider}</td>
                      <td className="py-2 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          model.enabled 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {model.enabled ? 'Ativa' : 'Desativada'}
                        </span>
                      </td>
                      <td className="py-2 px-4">{model.requestsThisMinute}</td>
                      <td className="py-2 px-4">{model.rateLimit}</td>
                      <td className="py-2 px-4">{model.load}</td>
                      <td className="py-2 px-4">
                        <span className="px-2 py-1 bg-[#00D4FF]/20 text-[#00D4FF] rounded-full text-xs">
                          {model.priority}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 pt-4 border-t border-[#242424]">
              <h3 className="font-bold mb-2">Histórico de Requests (últimos 20)</h3>
              <div className="space-y-2">
                {stats.recentRequests?.map((req: any, index: number) => (
                  <div 
                    key={index}
                    className={`text-sm p-2 rounded ${req.success ? 'bg-green-500/10' : 'bg-red-500/10'}`}
                  >
                    <div className="flex justify-between">
                      <span>{req.provider} - {req.type}</span>
                      <span className={`${req.success ? 'text-green-400' : 'text-red-400'}`}>
                        {req.success ? '✅' : '❌'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400">
                      {new Date(req.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 text-sm text-gray-500">
          <p>💡 O sistema gerencia automaticamente 10 APIs de IA gratuitas, alternando entre elas conforme limites e disponibilidade.</p>
        </div>
      </div>
    </div>
  );
}