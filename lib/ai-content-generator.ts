export interface AIResponse {
  success: boolean;
  content?: string;
  error?: string;
  model?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ImageGenerationResult {
  success: boolean;
  images?: string[];
  error?: string;
  model?: string;
}

export interface GenerateContentParams {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

class AIContentGenerator {
  private apis: Map<string, string> = new Map();
  private currentApi: string = 'groq';

  constructor() {
    this.apis.set('groq', process.env.GROQ_API_KEY || '');
    this.apis.set('openai', process.env.OPENAI_API_KEY || '');
    this.apis.set('anthropic', process.env.ANTHROPIC_API_KEY || '');
    this.apis.set('gemini', process.env.GEMINI_API_KEY || '');
    this.apis.set('nvidia', process.env.NVIDIA_API_KEY || '');
    this.apis.set('mistral', process.env.MISTRAL_API_KEY || '');
    this.apis.set('openrouter', process.env.OPENROUTER_API_KEY || '');
    this.apis.set('bytez', process.env.BYTEZ_API_KEY || '');
  }

  async generateContent(params: GenerateContentParams): Promise<AIResponse> {
    const { prompt, maxTokens = 1024, temperature = 0.7, model } = params;
    
    let result: AIResponse = { success: false, error: 'No AI available' };

    if (model) {
      switch (model) {
        case 'llama':
        case 'mistral':
        case 'mixtral':
          result = await this.generateWithGroq(prompt, model, maxTokens, temperature);
          break;
        case 'gpt':
          result = await this.generateWithOpenAI(prompt, maxTokens, temperature);
          break;
        case 'claude':
          result = await this.generateWithAnthropic(prompt, maxTokens, temperature);
          break;
        case 'gemini':
          result = await this.generateWithGemini(prompt, maxTokens, temperature);
          break;
        case 'nvidia':
        case 'nemotron':
          result = await this.generateWithNvidia(prompt, maxTokens, temperature);
          break;
        case 'mistral':
          result = await this.generateWithMistral(prompt, maxTokens, temperature);
          break;
        case 'openrouter':
        case 'deepseek':
        case 'qwen':
        case 'command':
          result = await this.generateWithOpenRouter(prompt, model, maxTokens, temperature);
          break;
        case 'bytez':
          result = await this.generateWithBytez(prompt, maxTokens, temperature);
          break;
        default:
          result = await this.generateWithGroq(prompt, 'mixtral-8x7b-32768', maxTokens, temperature);
      }
    } else {
      result = await this.generateWithGroq(prompt, 'mixtral-8x7b-32768', maxTokens, temperature);
    }

    return result;
  }

  private async generateWithGroq(prompt: string, model: string, maxTokens: number, temperature: number): Promise<AIResponse> {
    const apiKey = this.apis.get('groq');
    if (!apiKey) {
      return { success: false, error: 'GROQ API key not configured' };
    }

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: 'Você é um especialista em marketing digital e criação de conteúdo para negócios brasileiros. Responda sempre em português brasileiro de forma profissional e engaging.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Groq error: ${error}` };
      }

      const data = await response.json();
      return {
        success: true,
        content: data.choices[0].message.content,
        model: data.model,
        usage: data.usage,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async generateWithOpenAI(prompt: string, maxTokens: number, temperature: number): Promise<AIResponse> {
    const apiKey = this.apis.get('openai');
    if (!apiKey) {
      return { success: false, error: 'OpenAI API key not configured' };
    }

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'Você é um especialista em marketing digital e criação de conteúdo para negócios brasileiros. Responda sempre em português brasileiro de forma profissional e engaging.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: maxTokens,
          temperature,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `OpenAI error: ${error}` };
      }

      const data = await response.json();
      return {
        success: true,
        content: data.choices[0].message.content,
        model: data.model,
        usage: data.usage,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  private async generateWithAnthropic(prompt: string, maxTokens: number, temperature: number): Promise<AIResponse> {
    const apiKey = this.apis.get('anthropic');
    if (!apiKey) {
      return { success: false, error: 'Anthropic API key not configured' };
    }

    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: maxTokens,
          temperature,
          system: 'Você é um especialista em marketing digital e criação de conteúdo para negócios brasileiros. Responda sempre em português brasileiro de forma profissional e engaging.',
          messages: [{ role: 'user', content: prompt }],
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Anthropic error: ${error}` };
      }

      const data = await response.json();
      return {
        success: true,
        content: data.content[0].text,
        model: data.model,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async generateBlogPost(topic: string, keywords: string[] = []): Promise<AIResponse> {
    const keywordsText = keywords.length > 0 ? `\nPalavras-chave: ${keywords.join(', ')}` : '';
    const prompt = `Gere um artigo de blog completo e profissional sobre "${topic}".${keywordsText}

O artigo deve ter:
- Título atrativo e otimizado para SEO
- Introdução envolvente que resolva uma dor do leitor
- pelo menos 3 seções com subtítulos (H2)
- Conclusão com call-to-action
- Tom profissional mas acessível
- Aproximadamente 800-1200 palavras
- Em português brasileiro`;

    return this.generateContent({ prompt, maxTokens: 2048, temperature: 0.7 });
  }

  async generateSocialPost(platform: 'linkedin' | 'instagram' | 'facebook' | 'twitter', topic: string, tone: 'professional' | 'casual' | 'persuasive' = 'professional'): Promise<AIResponse> {
    const platformGuidelines: Record<string, string> = {
      linkedin: 'Use formato de texto longo, com linhas de quebra. Inclua hashtags relevantes no final. Tom profissional e inspirador.',
      instagram: 'Use emojis estratégicamente. Frases curtas e impactantes. Hashtags variadas no final. Cara ou Reel.',
      facebook: 'Linguagem conversacional. Frases de tamanho médio. Hashtags locais funcionam bem.',
      twitter: 'Máximo 280 caracteres. Frase super direta. Hashtags limitadas.',
    };

    const prompt = `Gere um post para ${platform} sobre "${topic}". 

Diretivas do ${platform}: ${platformGuidelines[platform]}
Tom: ${tone}

O post deve:
- Ser engajante e chamar atenção nos primeiros segundos
- Ter um hook forte
- Conter valor real para o leitor
- Terminates com pergunta ou call-to-action para comentários
- Em português brasileiro`;

    const maxTokens = platform === 'twitter' ? 300 : platform === 'instagram' ? 600 : 800;
    return this.generateContent({ prompt, maxTokens, temperature: 0.8 });
  }

  async generateVideoScript(topic: string, duration: 'short' | 'medium' | 'long' = 'medium'): Promise<AIResponse> {
    const durationConfig = {
      short: '15-60 segundos (Reels, Shorts)',
      medium: '1-3 minutos',
      long: '5-10 minutos',
    };

    const prompt = `Gere um roteiro de vídeo profissional sobre "${topic}".

Duração: ${durationConfig[duration]}

O roteiro deve ter:
- Hook nos primeiros 3 segundos (frase que paralisa o espectador)
- Estrutura clara com início, meio e fim
- pontos principais organizados
- Calls-to-action ao final
- Sugestão de palavras de transição entre pontos
- Inclua indicações de [PAUSA], [MÚSICA], [TEXTO NA TELA] quando apropriado
- Em português brasileiro
- Tom energetico e envolvente`;

    const maxTokens = duration === 'short' ? 800 : duration === 'medium' ? 1500 : 3000;
    return this.generateContent({ prompt, maxTokens, temperature: 0.8 });
  }

  async generateCaption(imageDescription: string, platform: 'instagram' | 'facebook' | 'linkedin' = 'instagram'): Promise<AIResponse> {
    const prompt = `Gere uma legenda engajante para uma imagem que mostra: "${imageDescription}"

Plataforma: ${platform}
Inclua:
- Hook criativo
- Descrição que complemente a imagem
- Hashtags relevantes (mínimo 5, máximo 15)
- Em português brasileiro`;

    return this.generateContent({ prompt, maxTokens: 500, temperature: 0.8 });
  }

  async generateHashtags(topic: string, count: number = 10): Promise<AIResponse> {
    const prompt = `Gere ${count} hashtags relevantes e populares para o tema "${topic}". 
Inclua uma mistura de:
- Hashtags genéricas do nicho
- Hashtags de alto volume
- Hashtags de cauda longa (mais específicas)
- Hashtags de localização (#brasil, #sp) se apropriado

Retorne apenas as hashtags separadas por espaços, sem texto adicional.`;

    return this.generateContent({ prompt, maxTokens: 200, temperature: 0.6 });
  }

  async generateContentPackage(
    type: 'blog' | 'social' | 'video',
    topic: string,
    platform: 'linkedin' | 'instagram' | 'facebook' | 'twitter' = 'linkedin'
  ): Promise<{ text?: AIResponse; images?: ImageGenerationResult; hashtags?: AIResponse }> {
    const results: any = {};

    if (type === 'blog') {
      results.text = await this.generateBlogPost(topic);
    } else if (type === 'social') {
      results.text = await this.generateSocialPost(platform, topic);
      results.hashtags = await this.generateHashtags(topic);
    } else if (type === 'video') {
      results.text = await this.generateVideoScript(topic);
    }

    results.images = await this.generateImages(topic, 4);

    return results;
  }

  getAvailableModels(): string[] {
    const available: string[] = [];
    if (this.apis.get('groq')) available.push('mixtral-8x7b-32768 (Groq - Rápido)', 'llama-3.1-70b-versatile (Groq)', 'gemma-7b-it (Groq)');
    if (this.apis.get('openai')) available.push('gpt-3.5-turbo (OpenAI)');
    if (this.apis.get('anthropic')) available.push('claude-3-haiku (Anthropic)');
    if (this.apis.get('mistral')) available.push('mistral-small (Mistral)');
    if (this.apis.get('nvidia')) available.push('nemotron-70b (NVIDIA)');
    if (this.apis.get('openrouter')) available.push('deepseek-chat (OpenRouter)', 'qwen-2.5 (OpenRouter)', 'command-r-plus (OpenRouter)');
    if (this.apis.get('bytez')) available.push('Multiple Models (Bytez - Grátis)');
    return available;
  }

  async generateImages(prompt: string, count: number = 4): Promise<ImageGenerationResult> {
    const geminiKey = this.apis.get('gemini');
    const nvidiaKey = this.apis.get('nvidia');

    if (geminiKey) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${geminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: `Create ${count} detailed image generation prompts for: "${prompt}". Return JSON array with ${count} prompts, 50-100 words each, in Portuguese, with visual details, lighting, style.`
                }]
              }],
              generationConfig: { temperature: 0.8, maxOutputTokens: 2048 }
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (content) {
            const prompts = JSON.parse(content);
            
            const imageUrls: string[] = [];
            for (const imgPrompt of prompts.slice(0, count)) {
              imageUrls.push(`https://image.pollinations.ai/prompt/${encodeURIComponent(imgPrompt)}?width=512&height=512&nologo=true`);
            }
            
            return { success: true, images: imageUrls, model: 'gemini-2.0-flash-exp' };
          }
        }
      } catch (error) {
        console.error('Gemini image error:', error);
      }
    }

    if (nvidiaKey) {
      try {
        const response = await fetch(
          'https://api.nvcf.nvidia.com/v2/nvidia/faas/protected-api-endpoint',
          {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${nvidiaKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt,
              num_images: count
            }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          return { success: true, images: data.images || [], model: 'nvidia-nim' };
        }
      } catch (error) {
        console.error('NVIDIA image error:', error);
      }
    }

    return { 
      success: true, 
      images: [
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true`,
        `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt + ' estilo profissional')}/?width=512&height=512&nologo=true`
      ], 
      model: 'pollinations-free' 
    };
  }

  async generateWithGemini(prompt: string, maxTokens: number, temperature: number): Promise<AIResponse> {
    const apiKey = this.apis.get('gemini');
    if (!apiKey) {
      return { success: false, error: 'GEMINI API key not configured' };
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature,
              maxOutputTokens: maxTokens,
            }
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Gemini error: ${error}` };
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (content) {
        return { success: true, content, model: 'gemini-2.0-flash' };
      }
      return { success: false, error: 'No content returned' };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async generateWithNvidia(prompt: string, maxTokens: number, temperature: number): Promise<AIResponse> {
    const apiKey = this.apis.get('nvidia');
    if (!apiKey) {
      return { success: false, error: 'NVIDIA API key not configured' };
    }

    try {
      const response = await fetch(
        'https://api.nvcf.nvidia.com/v2/nvidia/faas/protected-api-endpoint',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'nvidia/llama-3.1-nemotron-70b-instruct',
            messages: [
              { role: 'system', content: 'Você é um especialista em marketing digital brasileiro. Responda em português.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: maxTokens,
            temperature
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `NVIDIA error: ${error}` };
      }

      const data = await response.json();
      return {
        success: true,
        content: data.choices?.[0]?.message?.content || '',
        model: 'nvidia-nemotron',
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async generateWithMistral(prompt: string, maxTokens: number, temperature: number): Promise<AIResponse> {
    const apiKey = this.apis.get('mistral');
    if (!apiKey) {
      return { success: false, error: 'MISTRAL API key not configured' };
    }

    try {
      const response = await fetch(
        'https://api.mistral.ai/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'mistral-small-latest',
            messages: [
              { role: 'system', content: 'Você é um especialista em marketing digital brasileiro. Responda em português de forma profissional.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: maxTokens,
            temperature
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Mistral error: ${error}` };
      }

      const data = await response.json();
      return {
        success: true,
        content: data.choices?.[0]?.message?.content || '',
        model: 'mistral-small',
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async generateWithOpenRouter(prompt: string, model: string, maxTokens: number, temperature: number): Promise<AIResponse> {
    const apiKey = this.apis.get('openrouter');
    if (!apiKey) {
      return { success: false, error: 'OPENROUTER API key not configured' };
    }

    const modelMap: Record<string, string> = {
      'deepseek': 'deepseek/deepseek-chat',
      'qwen': 'qwen/qwen-2.5-72b-instruct',
      'command': 'cohere/command-r-plus',
      'default': 'deepseek/deepseek-chat'
    };

    const selectedModel = modelMap[model] || modelMap['default'];

    try {
      const response = await fetch(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://estudiok.com.br',
            'X-Title': 'ESTUDIOK'
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: 'system', content: 'Você é um especialista em marketing digital brasileiro. Responda em português de forma profissional e engajante.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: maxTokens,
            temperature
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `OpenRouter error: ${error}` };
      }

      const data = await response.json();
      return {
        success: true,
        content: data.choices?.[0]?.message?.content || '',
        model: data.model || selectedModel,
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }

  async generateWithBytez(prompt: string, maxTokens: number, temperature: number): Promise<AIResponse> {
    const apiKey = this.apis.get('bytez');
    if (!apiKey) {
      return { success: false, error: 'BYTEZ API key not configured' };
    }

    try {
      const response = await fetch(
        'https://api.bytez.io/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [
              { role: 'system', content: 'Você é um especialista em marketing digital brasileiro. Responda em português de forma profissional.' },
              { role: 'user', content: prompt }
            ],
            max_tokens: maxTokens,
            temperature
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Bytez error: ${error}` };
      }

      const data = await response.json();
      return {
        success: true,
        content: data.choices?.[0]?.message?.content || '',
        model: 'gpt-4o-bytez',
      };
    } catch (error) {
      return { success: false, error: String(error) };
    }
  }
}

export const aiGenerator = new AIContentGenerator();
export default AIContentGenerator;