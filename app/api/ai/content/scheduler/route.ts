import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, createDocument } from '@/lib/firebase-services';
import { aiGenerator } from '@/lib/ai-content-generator';

interface ContentScheduler {
  id: string;
  name: string;
  type: 'blog' | 'social' | 'video' | 'hashtags';
  topic: string;
  keywords?: string[];
  platform?: string;
  schedule: 'daily' | 'weekly' | 'monthly';
  enabled: boolean;
  lastRun?: string;
  createdAt: string;
}

const CONTENT_TEMPLATES = {
  blog: [
    'Como aumentar vendas no meu negócio',
    'Tendências de marketing digital para 2026',
    'Erros que afastam clientes do seu site',
    'Por que sua empresa precisa de um app',
    'Guia completo de SEO para pequeno negócio',
    '5 dicas para criar um site que vende',
    'O futuro do e-commerce no Brasil',
    'Como automatizar vendas com tecnologia',
    'Importância da presença digital',
    'Estratégias de marketing para Startups',
  ],
  social: [
    'Dica rápida de marketing',
    'Você sabia que...',
    'Provavelmente você não sabia',
    'Fato que muitos ignoram',
    'Truque que poucos conhecem',
    '3 erros que custam caro',
    'Resultado que impressiona',
    'Transformação incredivel',
    '案例 de sucesso',
    'Métrica que mudar tudo',
  ],
  hashtags: [
    'marketing digital',
    'empreendedorismo',
    'vendas',
    'negócios',
    'tecnologia',
    'inovaçao',
    'startup',
    'sucesso',
    'motivação',
    'brasil',
  ],
};

async function generateAndPublishContent(scheduler: ContentScheduler) {
  let content = '';
  let title = '';
  let extraData: any = {};

  switch (scheduler.type) {
    case 'blog':
      const blogResult = await aiGenerator.generateBlogPost(
        scheduler.topic,
        scheduler.keywords || []
      );
      if (blogResult.success && blogResult.content) {
        content = blogResult.content;
        const lines = content.split('\n');
        title = lines.find(l => l.startsWith('# '))?.replace('# ', '') || scheduler.topic;
        
        await createDocument('articles', {
          title,
          slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          excerpt: content.substring(0, 200),
          content,
          category: 'marketing',
          tags: scheduler.keywords || ['marketing', 'estudiok'],
          author: 'ESTUDIOK AI',
          status: 'published',
          views: 0,
          image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
          createdAt: new Date(),
          publishedAt: new Date(),
          source: 'auto-generated',
          schedulerId: scheduler.id,
        });
      }
      break;

    case 'social':
      const socialResult = await aiGenerator.generateSocialPost(
        (scheduler.platform as any) || 'linkedin',
        scheduler.topic,
        'professional'
      );
      if (socialResult.success && socialResult.content) {
        content = socialResult.content;
        
        await createDocument('social_posts', {
          content,
          platform: scheduler.platform || 'linkedin',
          topic: scheduler.topic,
          status: 'published',
          createdAt: new Date(),
          source: 'auto-generated',
          schedulerId: scheduler.id,
        });
      }
      break;

    case 'hashtags':
      const hashtagsResult = await aiGenerator.generateHashtags(
        scheduler.topic,
        10
      );
      if (hashtagsResult.success && hashtagsResult.content) {
        content = hashtagsResult.content;
        
        await createDocument('hashtags_generated', {
          tags: content,
          topic: scheduler.topic,
          createdAt: new Date(),
          schedulerId: scheduler.id,
        });
      }
      break;

    case 'video':
      const videoResult = await aiGenerator.generateVideoScript(
        scheduler.topic,
        'medium'
      );
      if (videoResult.success && videoResult.content) {
        content = videoResult.content;
        
        await createDocument('video_scripts', {
          script: content,
          topic: scheduler.topic,
          duration: 'medium',
          createdAt: new Date(),
          source: 'auto-generated',
          schedulerId: scheduler.id,
        });
      }
      break;
  }

  return { content, title, extraData };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, scheduler } = body;

    if (action === 'create-scheduler') {
      const newScheduler: ContentScheduler = {
        id: Date.now().toString(),
        name: scheduler.name,
        type: scheduler.type,
        topic: scheduler.topic,
        keywords: scheduler.keywords,
        platform: scheduler.platform,
        schedule: scheduler.schedule,
        enabled: true,
        createdAt: new Date().toISOString(),
      };

      await createDocument('content_schedulers', newScheduler);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Scheduler criado com sucesso!',
        scheduler: newScheduler
      });
    }

    if (action === 'run-now') {
      const schedulers = await getDocuments('content_schedulers');
      const targetScheduler = schedulers.find((s: any) => s.id === scheduler.id);
      
      if (!targetScheduler) {
        return NextResponse.json({ error: 'Scheduler não encontrado' }, { status: 404 });
      }

      const result = await generateAndPublishContent(targetScheduler as any);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Conteúdo gerado e publicado!',
        result
      });
    }

    if (action === 'toggle') {
      const schedulers = await getDocuments('content_schedulers');
      const targetScheduler = schedulers.find((s: any) => s.id === scheduler.id);
      
      if (targetScheduler) {
        const ts = targetScheduler as any;
        await createDocument('content_schedulers', {
          ...ts,
          enabled: !ts.enabled,
        });
        
        return NextResponse.json({ 
          success: true, 
          message: ts.enabled ? 'Scheduler pausado' : 'Scheduler ativado'
        });
      }
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    console.error('Content scheduler error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const schedulers = await getDocuments('content_schedulers');
    return NextResponse.json({
      status: 'ready',
      schedulers: schedulers,
      availableTypes: ['blog', 'social', 'video', 'hashtags'],
      availableSchedules: ['daily', 'weekly', 'monthly'],
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}