import { NextResponse } from 'next/server';
import { db } from '@/app/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

interface WebhookConfig {
  id: string;
  name: string;
  url: string;
  events: string[];
  active: boolean;
}

interface LeadData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

async function sendSlackNotification(data: LeadData, webhookUrl: string): Promise<boolean> {
  try {
    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '🎉 Novo Lead!',
            emoji: true,
          },
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*Nome:*\n${data.name}`,
            },
            {
              type: 'mrkdwn',
              text: `*Email:*\n${data.email}`,
            },
            {
              type: 'mrkdwn',
              text: `*Serviço:*\n${data.service || 'Não especificado'}`,
            },
            {
              type: 'mrkdwn',
              text: `*Origem:*\n${data.utmSource || data.source || 'Direto'}`,
            },
          ],
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Ver no Admin',
                emoji: true,
              },
              url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://estudiok.com.br'}/admin?tab=leads`,
            },
          ],
        },
      ],
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    });

    return response.ok;
  } catch (error) {
    console.error('Slack webhook error:', error);
    return false;
  }
}

async function sendDiscordNotification(data: LeadData, webhookUrl: string): Promise<boolean> {
  try {
    const embed = {
      title: '🎉 Novo Lead!',
      color: 0x00D4FF,
      fields: [
        { name: 'Nome', value: data.name, inline: true },
        { name: 'Email', value: data.email, inline: true },
        { name: 'Serviço', value: data.service || 'Não especificado', inline: true },
        { name: 'Origem', value: data.utmSource || data.source || 'Direto', inline: true },
      ],
      footer: { text: 'ESTUDIOK - Agência Digital' },
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });

    return response.ok;
  } catch (error) {
    console.error('Discord webhook error:', error);
    return false;
  }
}

async function getWebhookConfigs(): Promise<WebhookConfig[]> {
  const q = query(collection(db, 'webhookConfigs'), where('active', '==', true));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  })) as WebhookConfig[];
}

async function notifyNewLead(leadData: LeadData): Promise<void> {
  const webhooks = await getWebhookConfigs();
  
  for (const webhook of webhooks) {
    if (!webhook.events.includes('new_lead')) continue;
    
    if (webhook.url.includes('slack.com')) {
      await sendSlackNotification(leadData, webhook.url);
    } else if (webhook.url.includes('discord.com')) {
      await sendDiscordNotification(leadData, webhook.url);
    }
  }
}

export async function POST(request: Request) {
  try {
    const { type, url, name, events } = await request.json();
    
    if (!url || !name || !events?.length) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }
    
    const docRef = await addDoc(collection(db, 'webhookConfigs'), {
      name,
      url,
      events,
      active: true,
      createdAt: new Date(),
    });
    
    return NextResponse.json({ success: true, id: docRef.id });
  } catch (error) {
    console.error('Webhook config error:', error);
    return NextResponse.json({ error: 'Erro ao configurar webhook' }, { status: 500 });
  }
}