import { NextResponse } from 'next/server';
import { IARotationManager } from '@/lib/ia-rotation-manager';

export async function GET() {
  try {
    const manager = IARotationManager.getInstance();
    const stats = manager.getStats();
    
    const testPrompt = 'Gere um título curto para landing page sobre criação de sites em português brasileiro.';
    
    try {
      const result = await manager.generateContent({
        type: 'text',
        prompt: testPrompt
      });
      
      return NextResponse.json({
        success: true,
        message: 'Teste de API bem-sucedido',
        stats,
        testResult: {
          provider: result.provider,
          content: result.data.content,
          tokensUsed: result.tokensUsed
        }
      });
    } catch (error: any) {
      return NextResponse.json({
        success: false,
        message: 'Erro no teste de API',
        stats,
        error: error.message,
        availableAPIs: stats.modelStats.filter((m: any) => m.enabled).length
      }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      message: 'Erro ao inicializar sistema',
      error: error.message
    }, { status: 500 });
  }
}