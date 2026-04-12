import { NextResponse } from 'next/server';

interface DeployConfig {
 projectId: string;
 projectName: string;
 repoUrl?: string;
 branch: string;
 framework: 'nextjs' | 'react' | 'vue' | 'astro' | 'plain';
 status: 'pending' | 'building' | 'ready' | 'error';
 url?: string;
 buildLogs: string[];
 createdAt: Date;
 deployedAt?: Date;
}

const deploys: Map<string, DeployConfig> = new Map();

async function triggerDeploy(projectId: string, projectName: string, config: {
 repoUrl?: string;
 branch?: string;
 framework?: string;
}): Promise<DeployConfig> {
  const deploy: DeployConfig = {
    projectId,
    projectName,
    repoUrl: config.repoUrl,
    branch: config.branch || 'main',
    framework: config.framework as DeployConfig['framework'] || 'nextjs',
    status: 'building',
    buildLogs: ['Iniciando build...'],
    createdAt: new Date(),
  };
  
  deploys.set(projectId, deploy);
  
  const logs = [
    'Iniciando build...',
    'Instalando dependências...',
    'Compilando código...',
    'Otimizando assets...',
    ' Fazendo deploy...',
    'Deploy concluído!',
  ];
  
for (let i = 0; i < logs.length; i++) {
  await new Promise(r => setTimeout(r, 2000));
  const current = deploys.get(projectId);
  const log = logs[i];
  if (current && log) {
   deploys.set(projectId, {
    ...current,
    buildLogs: [...current.buildLogs, log],
   });
  }
 }
  
  const final = deploys.get(projectId);
  if (final) {
    deploys.set(projectId, {
      ...final,
      status: 'ready',
      url: `https://${projectName.toLowerCase().replace(/\s+/g, '-')}.vercel.app`,
      deployedAt: new Date(),
    });
  }
  
return deploys.get(projectId)!;
}

async function getDeployStatus(projectId: string): Promise<DeployConfig | null> {
 return deploys.get(projectId) || null;
}

async function rollbackDeploy(projectId: string): Promise<boolean> {
  const existing = deploys.get(projectId);
  if (!existing || existing.status !== 'ready') return false;
  
  deploys.set(projectId, {
    ...existing,
    status: 'building',
    buildLogs: [' Fazendo rollback...', 'Deploy revertido!'],
  });
  
  await new Promise(r => setTimeout(r, 3000));
  
  const current = deploys.get(projectId);
  if (current) {
    deploys.set(projectId, {
      ...current,
      status: 'ready',
    });
  }
  
  return true;
}

export async function POST(request: Request) {
  try {
    const { action, projectId, projectName, config } = await request.json();
    
    if (action === 'deploy') {
      const result = await triggerDeploy(projectId, projectName, config || {});
      return NextResponse.json({ success: true, deploy: result });
    }
    
    if (action === 'rollback') {
      const success = await rollbackDeploy(projectId);
      return NextResponse.json({ success });
    }
    
    const status = await getDeployStatus(projectId);
    return NextResponse.json({ deploy: status });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no deploy' }, { status: 500 });
  }
}