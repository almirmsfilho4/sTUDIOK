import { NextRequest, NextResponse } from 'next/server';
import { getDocuments, createDocument } from '@/lib/firebase-services';
import { aiGenerator } from '@/lib/ai-content-generator';

export async function GET(request: NextRequest) {
  try {
    const schedulers = await getDocuments('content_schedulers');
    const activeSchedulers = schedulers.filter((s: any) => s.enabled);

    const results = [];

    for (const scheduler of activeSchedulers) {
      const s = scheduler as any;
      const lastRun = s.lastRun ? new Date(s.lastRun) : null;
      const now = new Date();
      let shouldRun = false;

      if (s.schedule === 'daily') {
        if (!lastRun || (now.getTime() - lastRun.getTime()) > 24 * 60 * 60 * 1000) {
          shouldRun = true;
        }
      } else if (s.schedule === 'weekly') {
        if (!lastRun || (now.getTime() - lastRun.getTime()) > 7 * 24 * 60 * 60 * 1000) {
          shouldRun = true;
        }
      } else if (s.schedule === 'monthly') {
        if (!lastRun || now.getMonth() !== lastRun.getMonth()) {
          shouldRun = true;
        }
      }

      if (shouldRun) {
        let content = '';
        let published = false;

        try {
          switch (s.type) {
            case 'blog':
              const blogResult = await aiGenerator.generateBlogPost(
                s.topic,
                s.keywords || []
              );
              if (blogResult.success) {
                const title = s.topic;
                await createDocument('articles', {
                  title,
                  slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                  excerpt: blogResult.content?.substring(0, 200) || '',
                  content: blogResult.content || '',
                  category: 'marketing',
                  tags: s.keywords || ['marketing', 'estudiok', 'auto-generated'],
                  author: 'ESTUDIOK AI',
                  status: 'published',
                  views: 0,
                  image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
                  createdAt: new Date(),
                  publishedAt: new Date(),
                  source: 'auto-generated',
                });
                content = blogResult.content || '';
                published = true;
              }
              break;

            case 'social':
              const socialResult = await aiGenerator.generateSocialPost(
                (s.platform as any) || 'linkedin',
                s.topic,
                'professional'
              );
              if (socialResult.success) {
                await createDocument('social_posts', {
                  content: socialResult.content || '',
                  platform: s.platform || 'linkedin',
                  topic: s.topic,
                  status: 'published',
                  createdAt: new Date(),
                  source: 'auto-generated',
                });
                content = socialResult.content || '';
                published = true;
              }
              break;

            case 'hashtags':
              const hashtagsResult = await aiGenerator.generateHashtags(s.topic, 10);
              if (hashtagsResult.success) {
                await createDocument('hashtags_generated', {
                  tags: hashtagsResult.content || '',
                  topic: s.topic,
                  createdAt: new Date(),
                });
                content = hashtagsResult.content || '';
                published = true;
              }
              break;

            case 'video':
              const videoResult = await aiGenerator.generateVideoScript(s.topic, 'medium');
              if (videoResult.success) {
                await createDocument('video_scripts', {
                  script: videoResult.content || '',
                  topic: s.topic,
                  duration: 'medium',
                  createdAt: new Date(),
                  source: 'auto-generated',
                });
                content = videoResult.content || '';
                published = true;
              }
              break;
          }

          if (published) {
            await createDocument('content_schedulers', {
              ...(s as any),
              lastRun: new Date().toISOString(),
            });
          }
        } catch (err) {
          console.error(`Error running scheduler ${s.id}:`, err);
        }

        results.push({
          scheduler: s.name,
          type: s.type,
          published,
          content: content.substring(0, 100) + '...',
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error('Auto content generation error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}