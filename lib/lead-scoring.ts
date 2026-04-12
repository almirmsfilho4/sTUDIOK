import { getDocuments, createDocument } from './firebase-services';

export interface LeadScore {
  id?: string;
  userId: string;
  email: string;
  name: string;
  score: number;
  lastActivity: Date;
  stage: 'cold' | 'warm' | 'hot' | 'customer';
  interests: string[];
  interactions: {
    type: string;
    description: string;
    points: number;
    date: Date;
  }[];
}

const SCORING_RULES = {
  page_visit: {
    'home': 1,
    'orcamento': 5,
    'planos': 10,
    'cursos': 3,
    'blog': 2,
  },
  action: {
    'newsletter_signup': 15,
    'orcamento_started': 20,
    'orcamento_completed': 50,
    'login': 10,
    'cadastro': 25,
    'support_ticket': 15,
    'download': 5,
  },
  engagement: {
    'email_opened': 5,
    'email_clicked': 10,
    'recovery_email_clicked': 25,
    'return_visit': 8,
  },
};

const STAGE_THRESHOLDS = {
  cold: 0,
  warm: 30,
  hot: 80,
  customer: 150,
};

export async function trackLeadActivity(
  userId: string,
  email: string,
  name: string,
  activityType: string,
  pageOrDescription?: string
) {
  try {
    const leads = await getDocuments('leads');
    let lead = (leads as any[]).find(l => l.userId === userId || l.email === email);

    const points = calculatePoints(activityType, pageOrDescription);
    
    const newInteraction = {
      type: activityType,
      description: pageOrDescription || activityType,
      points,
      date: new Date(),
    };

    if (lead) {
      const newScore = (lead.score || 0) + points;
      const newStage = determineStage(newScore);
      
      await import('@/lib/firebase-services').then(m => 
        m.updateDocument('leads', lead.id, {
          score: newScore,
          lastActivity: new Date(),
          stage: newStage,
          interactions: [...(lead.interactions || []), newInteraction],
        })
      );
    } else {
      const newScore = points;
      const newStage = determineStage(newScore);
      
      await createDocument('leads', {
        userId,
        email,
        name,
        score: newScore,
        lastActivity: new Date(),
        stage: newStage,
        interests: [],
        interactions: [newInteraction],
        createdAt: new Date(),
      });
    }
  } catch (error) {
    console.error('Error tracking lead activity:', error);
  }
}

function calculatePoints(activityType: string, pageOrDescription?: string): number {
  const category = activityType.includes('page_') ? 'page_visit' : 
                   activityType.includes('email_') ? 'engagement' : 'action';
  
  const rules = SCORING_RULES[category];
  const key = pageOrDescription || activityType;
  
  return rules[key as keyof typeof rules] || 1;
}

function determineStage(score: number): 'cold' | 'warm' | 'hot' | 'customer' {
  if (score >= STAGE_THRESHOLDS.customer) return 'customer';
  if (score >= STAGE_THRESHOLDS.hot) return 'hot';
  if (score >= STAGE_THRESHOLDS.warm) return 'warm';
  return 'cold';
}

export function getStageColor(stage: string): string {
  const colors = {
    cold: '#6B7280',
    warm: '#F59E0B',
    hot: '#EF4444',
    customer: '#10B981',
  };
  return colors[stage as keyof typeof colors] || colors.cold;
}

export function getStageLabel(stage: string): string {
  const labels = {
    cold: 'Frio',
    warm: 'Morno',
    hot: 'Quente',
    customer: 'Cliente',
  };
  return labels[stage as keyof typeof labels] || 'Desconhecido';
}

export async function getHotLeads(): Promise<LeadScore[]> {
  const leads = await getDocuments('leads');
  return (leads as any[])
    .filter(l => l.score >= STAGE_THRESHOLDS.hot && l.stage !== 'customer')
    .sort((a, b) => b.score - a.score);
}

export async function sendWelcomeSequence(userId: string, email: string, name: string) {
  const emails = [
    {
      delay: 0,
      subject: '👋 Bem-vindo à ESTUDIOK!',
      template: 'welcome_1',
    },
    {
      delay: 1,
      subject: '💡 O que esperar da ESTUDIOK',
      template: 'welcome_2',
    },
    {
      delay: 3,
      subject: '🎁 Oferta especial para novos usuários',
      template: 'welcome_3',
    },
  ];

  for (const emailConfig of emails) {
    const scheduledDate = new Date();
    scheduledDate.setDate(scheduledDate.getDate() + emailConfig.delay);

    await createDocument('email_queue', {
      userId,
      email,
      name,
      type: 'welcome',
      template: emailConfig.template,
      subject: emailConfig.subject,
      scheduledFor: scheduledDate,
      status: 'pending',
    });
  }
}

export async function processEmailQueue() {
  const queue = await getDocuments('email_queue');
  const now = new Date();

  const pendingEmails = (queue as any[]).filter(
    e => e.status === 'pending' && 
         e.scheduledFor?.toDate?.() <= now
  );

  for (const email of pendingEmails) {
    try {
      await sendQueuedEmail(email);
      
      await import('@/lib/firebase-services').then(m =>
        m.updateDocument('email_queue', email.id, { status: 'sent', sentAt: new Date() })
      );
    } catch (error) {
      console.error('Error sending queued email:', error);
      await import('@/lib/firebase-services').then(m =>
        m.updateDocument('email_queue', email.id, { status: 'failed', error: String(error) })
      );
    }
  }
}

async function sendQueuedEmail(emailData: any) {
  const templates: Record<string, { subject: string; html: string }> = {
    welcome_1: {
      subject: '👋 Bem-vindo à ESTUDIOK!',
      html: `
        <h1>Olá, ${emailData.name}! Seja muito bem-vindo! 🎉</h1>
        <p>Estamos muito felizes em ter você conosco.</p>
        <p>Somos especializados em criar sites, apps e sistemas que transformam negócios.</p>
        <p><strong>Seu próximo passo:</strong> <a href="https://estudiok.com/orcamento">Solicite um orçamento</a> e receba uma proposta personalizada em até 24h!</p>
      `,
    },
    welcome_2: {
      subject: '💡 O que esperar da ESTUDIOK',
      html: `
        <h1>Olá, ${emailData.name}!</h1>
        <p>Você sabe o que nos diferencia?</p>
        <ul>
          <li>🚀 <strong>Entrega rápida</strong> - Seu projeto pronto em até 48h</li>
          <li>💎 <strong>Design exclusivo</strong> - Sem Templates</li>
          <li>📈 <strong>SEO otimizado</strong> - Seu site bem posicionado no Google</li>
          <li>🎯 <strong>Conversion focused</strong> - Focado em resultados</li>
        </ul>
        <p><a href="https://estudiok.com/portfolio">Veja nosso portfólio</a> e se inspire!</p>
      `,
    },
    welcome_3: {
      subject: '🎁 Oferta especial para novos usuários',
      html: `
        <h1>🎁 Oferta exclusiva para você, ${emailData.name}!</h1>
        <p>Como agradecimento por confiar na ESTUDIOK, temos uma oferta especial:</p>
        <div style="background: #00D4FF20; padding: 20px; border-radius: 10px; text-align: center;">
          <p style="font-size: 24px; font-weight: bold;">15% DE DESCONTO</p>
          <p>No seu primeiro projeto!</p>
        </div>
        <p>Use o código: <strong>BEMVINDO15</strong></p>
        <p><a href="https://estudiok.com/orcamento">Solicitar orçamento com desconto</a></p>
        <p><em>Esta oferta é válida por 7 dias.</em></p>
      `,
    },
  };

const template = templates[emailData.template];
 if (!template) {
  console.error('Template not found:', emailData.template);
  return;
 }

 await fetch(process.env.NEXT_PUBLIC_SITE_URL + '/api/email/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
   to: emailData.email,
   subject: template.subject,
   html: template.html,
  }),
 });
}