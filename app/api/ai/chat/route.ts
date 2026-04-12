import { NextRequest, NextResponse } from 'next/server';
import { aiGenerator } from '@/lib/ai-content-generator';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const context = `Você é o assistente virtual da ESTUDIOK, uma agência digital brasileira especializada em:
- Criação de sites institucionais e landing pages
- Desenvolvimento de apps mobile (iOS/Android)
- Sistemas web e ERPs
- E-commerces
- Marketing digital e SEO

Seu tom deve ser:
- Profissional mas amigável
- всегда em português brasileiro
- Focado em converter visitantes em clientes
- Informativo sobre serviços, preços e prazos

Responda de forma clara e concisa. Se o usuário quiser fazer orçamento, direcione para /orcamento.`;

    const result = await aiGenerator.generateContent({
      prompt: `${context}\n\nUsuário: ${message}\n\nResponda de forma útil e conversacional:`,
      maxTokens: 500,
      temperature: 0.7
    });

    if (result.success) {
      return NextResponse.json({ response: result.content });
    } else {
      return NextResponse.json({ 
        response: getFallbackResponse(message) 
      }, { status: 200 });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({ 
      response: 'Desculpe, algo deu errado. Tente novamente ou entre em contato pelo WhatsApp.' 
    }, { status: 200 });
  }
}

function getFallbackResponse(message: string): string {
  const lower = message.toLowerCase();
  
  if (lower.includes('orçamento')) {
    return 'Ótimo! Faça seu orçamento online: https://estudiok.com.br/orçamento';
  }
  
  if (lower.includes('site') || lower.includes('website')) {
    return 'Criamos sites modernos com SEO e painel administrativo. Veja nosso portfólio!';
  }
  
  if (lower.includes('app') || lower.includes('aplicativo')) {
    return 'Desenvolvemos apps para iOS e Android. Solicite um orçamento!';
  }
  
  return 'Como posso ajudar? Acesse /orcamento para uma proposta!';
}