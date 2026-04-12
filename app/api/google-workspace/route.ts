import { NextResponse } from 'next/server';

interface GoogleWorkspaceConfig {
  customerId: string;
  domain: string;
  email: string;
  services: {
    gmail: boolean;
    drive: boolean;
    calendar: boolean;
    meet: boolean;
  };
  users: WorkspaceUser[];
  createdAt: Date;
}

interface WorkspaceUser {
  email: string;
  name: string;
  role: 'admin' | 'user';
  quota: number;
}

const configs: Map<string, GoogleWorkspaceConfig> = new Map();

async function createWorkspaceAccount(domain: string, email: string): Promise<GoogleWorkspaceConfig> {
  const config: GoogleWorkspaceConfig = {
    customerId: `cust-${Date.now()}`,
    domain,
    email,
    services: {
      gmail: true,
      drive: true,
      calendar: true,
      meet: true,
    },
    users: [
      { email, name: 'Admin', role: 'admin', quota: 30 },
    ],
    createdAt: new Date(),
  };
  
  configs.set(domain, config);
  return config;
}

async function addWorkspaceUser(domain: string, name: string): Promise<WorkspaceUser> {
  const config = configs.get(domain);
  if (!config) throw new Error('Workspace não encontrado');
  
  const user: WorkspaceUser = {
    email: `${name.toLowerCase().replace(/\s+/g, '.')}@${domain}`,
    name,
    role: 'user',
    quota: 30,
  };
  
  config.users.push(user);
  configs.set(domain, config);
  
  return user;
}

async function getWorkspaceConfig(domain: string): Promise<GoogleWorkspaceConfig | null> {
  return configs.get(domain) || null;
}

async function setupGmailForwarding(userEmail: string, forwardTo: string): Promise<boolean> {
  console.log(`Setup forwarding: ${userEmail} -> ${forwardTo}`);
  return true;
}

async function createSharedDrive(name: string, users: string[]): Promise<string> {
  console.log(`Creating shared drive: ${name} for ${users.join(', ')}`);
  return `drive-${Date.now()}`;
}

export async function POST(request: Request) {
  try {
    const { action, domain, email, name, forwardTo, driveName, userEmails } = await request.json();
    
    if (action === 'create') {
      const config = await createWorkspaceAccount(domain, email);
      return NextResponse.json({ success: true, config });
    }
    
    if (action === 'addUser') {
      const user = await addWorkspaceUser(domain, name);
      return NextResponse.json({ success: true, user });
    }
    
    if (action === 'forward') {
      const success = await setupGmailForwarding(email, forwardTo);
      return NextResponse.json({ success });
    }
    
    if (action === 'drive') {
      const driveId = await createSharedDrive(driveName, userEmails);
      return NextResponse.json({ success: true, driveId });
    }
    
    const config = await getWorkspaceConfig(domain);
    return NextResponse.json({ config });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao configurar Google Workspace' }, { status: 500 });
  }
}