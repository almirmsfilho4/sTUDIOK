import { NextResponse } from 'next/server';

interface SSLConfig {
  domain: string;
  provider: 'letsencrypt' | 'cloudflare' | 'aws';
  status: 'pending' | 'provisioning' | 'active' | 'expired';
  certExpiry?: Date;
  createdAt: Date;
}

const sslConfigs: Map<string, SSLConfig> = new Map();

async function requestSSL(domain: string, provider: string = 'letsencrypt'): Promise<SSLConfig> {
  const config: SSLConfig = {
    domain,
    provider: provider as SSLConfig['provider'],
    status: 'provisioning',
    createdAt: new Date(),
  };
  
  sslConfigs.set(domain, config);
  
  setTimeout(() => {
    const existing = sslConfigs.get(domain);
    if (existing) {
      sslConfigs.set(domain, {
        ...existing,
        status: 'active',
        certExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
    }
  }, 5000);
  
  return config;
}

async function getSSLStatus(domain: string): Promise<SSLConfig | null> {
  return sslConfigs.get(domain) || null;
}

async function renewSSL(domain: string): Promise<boolean> {
  const existing = sslConfigs.get(domain);
  if (!existing || existing.status !== 'active') return false;
  
  sslConfigs.set(domain, {
    ...existing,
    status: 'provisioning',
  });
  
  setTimeout(() => {
    const current = sslConfigs.get(domain);
    if (current) {
      sslConfigs.set(domain, {
        ...current,
        status: 'active',
        certExpiry: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      });
    }
  }, 3000);
  
  return true;
}

async function deleteSSL(domain: string): Promise<boolean> {
  return sslConfigs.delete(domain);
}

export async function POST(request: Request) {
  try {
    const { domain, action, provider } = await request.json();
    
    if (action === 'request') {
      const config = await requestSSL(domain, provider);
      return NextResponse.json({ success: true, config });
    }
    
    if (action === 'renew') {
      const success = await renewSSL(domain);
      return NextResponse.json({ success });
    }
    
    if (action === 'delete') {
      const success = await deleteSSL(domain);
      return NextResponse.json({ success });
    }
    
    const status = await getSSLStatus(domain);
    return NextResponse.json({ status });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao gerenciar SSL' }, { status: 500 });
  }
}