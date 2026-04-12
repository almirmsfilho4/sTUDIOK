import { NextRequest, NextResponse } from 'next/server';
import { aiGenerator } from '@/lib/ai-content-generator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    let result: any;

    switch (action) {
      case 'blog':
        result = await aiGenerator.generateBlogPost(
          params.topic || '',
          params.keywords || []
        );
        break;

      case 'social':
        result = await aiGenerator.generateSocialPost(
          params.platform || 'linkedin',
          params.topic || '',
          params.tone || 'professional'
        );
        break;

      case 'video':
        result = await aiGenerator.generateVideoScript(
          params.topic || '',
          params.duration || 'medium'
        );
        break;

      case 'caption':
        result = await aiGenerator.generateCaption(
          params.description || '',
          params.platform || 'instagram'
        );
        break;

      case 'hashtags':
        result = await aiGenerator.generateHashtags(
          params.topic || '',
          params.count || 10
        );
        break;

      case 'custom':
        result = await aiGenerator.generateContent({
          prompt: params.prompt,
          maxTokens: params.maxTokens || 1024,
          temperature: params.temperature || 0.7,
          model: params.model
        });
        break;

      case 'images':
        result = await aiGenerator.generateImages(
          params.prompt || params.topic || '',
          params.count || 4
        );
        break;

      case 'package':
        result = await aiGenerator.generateContentPackage(
          params.type || 'social',
          params.topic || '',
          params.platform || 'linkedin'
        );
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    if (result.success) {
      const isImageResult = 'images' in (result as any);
      const isPackageResult = 'text' in (result as any);
      
      if (isImageResult) {
        return NextResponse.json({
          success: true,
          images: (result as any).images,
          model: result.model
        });
      }
      
      if (isPackageResult) {
        return NextResponse.json({
          success: true,
          content: (result as any).text?.content,
          images: (result as any).images?.images,
          hashtags: (result as any).hashtags?.content,
          model: result.model
        });
      }
      
      return NextResponse.json({
        success: true,
        content: result.content,
        model: result.model,
        usage: result.usage
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error('AI Content error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function GET() {
    const models = aiGenerator.getAvailableModels();
  return NextResponse.json({
    status: 'ready',
    actions: {
      blog: 'Gera artigo de blog completo (topic, keywords opcional)',
      social: 'Gera post para redes sociais (topic, platform, tone)',
      video: 'Gera roteiro de vídeo (topic, duration)',
      caption: 'Gera legenda para imagem (description, platform)',
      hashtags: 'Gera hashtags (topic, count opcional)',
      custom: 'Geração customizada (prompt, maxTokens, temperature, model opcional)',
      images: 'Gera imagens com Gemini (prompt/topic, count opcional)',
      package: 'Gera pacote completo: texto + imagens + hashtags (type, topic, platform)'
    },
    availableModels: models,
    platforms: ['linkedin', 'instagram', 'facebook', 'twitter'],
    tones: ['professional', 'casual', 'persuasive'],
    durations: ['short', 'medium', 'long']
  });
}