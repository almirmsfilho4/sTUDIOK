interface IAModel {
  provider: string;
  name: string;
  type: 'text' | 'image' | 'chat';
  apiKey: string;
  baseUrl: string;
  rateLimit: number;
  requestsThisMinute: number;
  lastRequestTime: number;
  enabled: boolean;
  priority: number;
}

interface IARequest {
  type: 'text' | 'image' | 'chat';
  prompt: string;
  options?: any;
}

interface IAResponse {
  success: boolean;
  data: any;
  provider: string;
  tokensUsed: number;
}

export class IARotationManager {
  private static instance: IARotationManager;
  private models: IAModel[] = [];
  private requestHistory: Array<{
    timestamp: number;
    provider: string;
    type: string;
    success: boolean;
  }> = [];
  private maxHistory = 1000;
  
  private constructor() {
    this.initializeModels();
    this.startCleanupInterval();
  }
  
  static getInstance(): IARotationManager {
    if (!IARotationManager.instance) {
      IARotationManager.instance = new IARotationManager();
    }
    return IARotationManager.instance;
  }
  
  private initializeModels() {
    const models: Partial<IAModel>[] = [
      {
        provider: 'zai',
        name: 'zai-pro',
        type: 'text',
      apiKey: process.env.NEXT_PUBLIC_ZAI_API_KEY || '',
      baseUrl: process.env.NEXT_PUBLIC_ZAI_API_BASE || 'https://api.z.ai/v1',
        rateLimit: 40,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 12
      },
      {
        provider: 'huggingface',
        name: 'llama-3.3-70b',
        type: 'text',
        apiKey: process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY || '',
        baseUrl: process.env.NEXT_PUBLIC_HUGGINGFACE_API_BASE || 'https://api-inference.huggingface.co',
        rateLimit: 30,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 11
      },
      {
        provider: 'groq',
        name: 'mixtral-8x7b',
        type: 'text',
        apiKey: process.env.GROQ_API_KEY || process.env.NEXT_PUBLIC_IA_API_KEY_2 || '',
        baseUrl: process.env.NEXT_PUBLIC_IA_API_BASE_2 || 'https://api.groq.com/openai/v1',
        rateLimit: 35,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 10
      },
      {
        provider: 'openrouter',
        name: 'claude-3.5-sonnet',
        type: 'text',
      apiKey: process.env.OPENROUTER_API_KEY || process.env.NEXT_PUBLIC_IA_API_KEY_5 || '',
      baseUrl: process.env.NEXT_PUBLIC_IA_API_BASE_5 || 'https://openrouter.ai/api/v1',
        rateLimit: 25,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 9
      },
      {
        provider: 'nvidia',
        name: 'llama-3.3-70b',
        type: 'text',
        apiKey: process.env.NVIDIA_API_KEY || process.env.NEXT_PUBLIC_IA_API_KEY_4 || '',
        baseUrl: process.env.NEXT_PUBLIC_IA_API_BASE_4 || 'https://integrate.api.nvidia.com/v1',
        rateLimit: 20,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 8
      },
      {
        provider: 'mistral',
        name: 'mistral-large',
        type: 'text',
        apiKey: process.env.MISTRAL_API_KEY || process.env.NEXT_PUBLIC_IA_API_KEY_3 || '',
        baseUrl: process.env.NEXT_PUBLIC_IA_API_BASE_3 || 'https://api.mistral.ai/v1',
        rateLimit: 25,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 7
      },
      {
        provider: 'bytez',
        name: 'gemma-7b',
        type: 'text',
        apiKey: process.env.BYTEZ_API_KEY || process.env.NEXT_PUBLIC_IA_API_KEY_6 || '',
        baseUrl: process.env.NEXT_PUBLIC_IA_API_BASE_6 || 'https://api.bytez.com/v1',
        rateLimit: 10,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 6
      },
      {
        provider: 'gemini',
        name: 'gemini-pro',
        type: 'text',
        apiKey: process.env.GEMINI_API_KEY || '',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
        rateLimit: 60,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 5
      },
      {
        provider: 'marketing-ai',
        name: 'marketing-content-generator',
        type: 'text',
      apiKey: process.env.NEXT_PUBLIC_IA_API_KEY_1 || '',
      baseUrl: process.env.NEXT_PUBLIC_IA_API_BASE_1 || 'https://api.ia-gratuita.com/v1',
        rateLimit: 100,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 4
      },
      {
        provider: 'ollama-like',
        name: 'llama-3.1-8b',
        type: 'text',
      apiKey: process.env.NEXT_PUBLIC_IA_API_KEY_9 || '',
      baseUrl: process.env.NEXT_PUBLIC_IA_API_BASE_9 || 'https://api.ollama-like.com/v1',
        rateLimit: 35,
        requestsThisMinute: 0,
        lastRequestTime: 0,
        enabled: true,
        priority: 3
      }
    ];
    
    this.models = models.filter(model => 
      model.apiKey && model.apiKey !== 'undefined' && model.apiKey.length > 10
    ).map(model => model as IAModel);
    
    console.log(`IARotationManager initialized with ${this.models.length} active models`);
  }
  
  private startCleanupInterval() {
    setInterval(() => {
      this.cleanupHistory();
      this.resetRateLimits();
    }, 60000);
  }
  
  private cleanupHistory() {
    const now = Date.now();
    const cutoff = now - (24 * 60 * 60 * 1000);
    
    this.requestHistory = this.requestHistory.filter(
      record => record.timestamp > cutoff
    );
    
    if (this.requestHistory.length > this.maxHistory) {
      this.requestHistory = this.requestHistory.slice(-this.maxHistory);
    }
  }
  
  private resetRateLimits() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    for (const model of this.models) {
      if (model.lastRequestTime < oneMinuteAgo) {
        model.requestsThisMinute = 0;
      }
    }
  }
  
  private getAvailableModels(type: 'text' | 'image' | 'chat'): IAModel[] {
    const now = Date.now();
    return this.models
      .filter(model => 
        model.enabled && 
        model.type === type &&
        model.requestsThisMinute < model.rateLimit &&
        (now - model.lastRequestTime) > 1000
      )
      .sort((a, b) => {
        const priorityDiff = b.priority - a.priority;
        if (priorityDiff !== 0) return priorityDiff;
        
        const loadA = a.requestsThisMinute / a.rateLimit;
        const loadB = b.requestsThisMinute / b.rateLimit;
        return loadA - loadB;
      });
  }
  
  private async tryRequestWithModel(model: IAModel, request: IARequest): Promise<IAResponse> {
    const now = Date.now();
    model.lastRequestTime = now;
    model.requestsThisMinute++;
    
    try {
      let data: any;
      
      switch (model.provider) {
        case 'groq':
          data = await this.makeGroqRequest(model, request);
          break;
        case 'nvidia':
          data = await this.makeNvidiaRequest(model, request);
          break;
        case 'mistral':
          data = await this.makeMistralRequest(model, request);
          break;
        case 'openrouter':
          data = await this.makeOpenRouterRequest(model, request);
          break;
        case 'bytez':
          data = await this.makeBytezRequest(model, request);
          break;
        case 'gemini':
          data = await this.makeGeminiRequest(model, request);
          break;
        case 'marketing-ai':
          data = await this.makeMarketingAIRequest(model, request);
          break;
        case 'zai':
          data = await this.makeZAIRequest(model, request);
          break;
        case 'ollama-like':
          data = await this.makeOllamaLikeRequest(model, request);
          break;
        default:
          throw new Error(`Unsupported provider: ${model.provider}`);
      }
      
      this.recordRequest(true, model.provider, request.type);
      
      return {
        success: true,
        data,
        provider: model.provider,
        tokensUsed: data.tokensUsed || 100
      };
    } catch (error: any) {
      console.error(`Error with ${model.provider}:`, error.message);
      
      if (error.message.includes('rate limit') || error.message.includes('quota') || error.message.includes('429')) {
        model.enabled = false;
        setTimeout(() => {
          model.enabled = true;
          console.log(`Re-enabling ${model.provider} after cooldown`);
        }, 5 * 60 * 1000);
      }
      
      this.recordRequest(false, model.provider, request.type);
      throw error;
    }
  }
  
  private async makeGroqRequest(model: IAModel, request: IARequest) {
    const response = await fetch(`${model.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [{ role: 'user', content: request.prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Groq API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content,
      tokensUsed: data.usage?.total_tokens || 0
    };
  }
  
  private async makeMarketingAIRequest(model: IAModel, request: IARequest) {
    const response = await fetch(`${model.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: request.prompt,
        type: request.type,
        options: request.options
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Marketing AI API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return {
      content: data.content || data.text || data.result,
      tokensUsed: data.tokens_used || 100
    };
  }
  
  private async makeNvidiaRequest(model: IAModel, request: IARequest) {
    const response = await fetch(`${model.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta/llama-3.3-70b-instruct',
        messages: [{ role: 'user', content: request.prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`NVIDIA API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content,
      tokensUsed: data.usage?.total_tokens || 0
    };
  }
  
  private async makeMistralRequest(model: IAModel, request: IARequest) {
    const response = await fetch(`${model.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: request.prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content,
      tokensUsed: data.usage?.total_tokens || 0
    };
  }
  
  private async makeOpenRouterRequest(model: IAModel, request: IARequest) {
    const response = await fetch(`${model.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://estudiok.com.br',
        'X-Title': 'ESTUDIOK Marketing Generator'
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [{ role: 'user', content: request.prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content,
      tokensUsed: data.usage?.total_tokens || 0
    };
  }
  
  private async makeBytezRequest(model: IAModel, request: IARequest) {
    const response = await fetch(`${model.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemma-7b',
        messages: [{ role: 'user', content: request.prompt }],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Bytez API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content,
      tokensUsed: data.usage?.total_tokens || 0
    };
  }
  
  private async makeGeminiRequest(model: IAModel, request: IARequest) {
    const response = await fetch(`${model.baseUrl}/models/gemini-pro:generateContent?key=${model.apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: request.prompt }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return {
      content: data.candidates[0]?.content?.parts[0]?.text,
      tokensUsed: data.usageMetadata?.totalTokenCount || 0
    };
  }
  
  private async makeZAIRequest(model: IAModel, request: IARequest) {
    const response = await fetch(`${model.baseUrl}/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'zai-pro',
        prompt: request.prompt,
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 0.9,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
        stream: false
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Z.AI API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return {
      content: data.choices[0]?.text || data.text || data.result,
      tokensUsed: data.usage?.total_tokens || data.tokens_used || 100
    };
  }
  
  private async makeOllamaLikeRequest(model: IAModel, request: IARequest) {
    const response = await fetch(`${model.baseUrl}/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${model.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.1',
        prompt: request.prompt,
        stream: false,
        options: {
          num_predict: 1000,
          temperature: 0.7,
          top_p: 0.9,
          repeat_penalty: 1.1
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama-like API error: ${response.status} ${await response.text()}`);
    }
    
    const data = await response.json();
    return {
      content: data.response || data.text || data.result,
      tokensUsed: data.tokens || 100
    };
  }
  
  private recordRequest(success: boolean, provider: string, type: string) {
    this.requestHistory.push({
      timestamp: Date.now(),
      provider,
      type,
      success
    });
  }
  
  async generateContent(request: IARequest): Promise<IAResponse> {
    const availableModels = this.getAvailableModels(request.type);
    
    if (availableModels.length === 0) {
      throw new Error('No available AI models at the moment. Please try again later.');
    }
    
    let lastError: Error | null = null;
    
    for (const model of availableModels.slice(0, 3)) {
      try {
        return await this.tryRequestWithModel(model, request);
      } catch (error: any) {
        lastError = error;
        continue;
      }
    }
    
    throw lastError || new Error('Failed to generate content with all available models');
  }
  
  getStats() {
    const stats = {
      totalModels: this.models.length,
      enabledModels: this.models.filter(m => m.enabled).length,
      totalRequests: this.requestHistory.length,
      successRate: 0,
      recentRequests: this.requestHistory.slice(-20),
      modelStats: this.models.map(model => ({
        provider: model.provider,
        enabled: model.enabled,
        requestsThisMinute: model.requestsThisMinute,
        rateLimit: model.rateLimit,
        load: (model.requestsThisMinute / model.rateLimit * 100).toFixed(1) + '%',
        priority: model.priority
      }))
    };
    
    if (this.requestHistory.length > 0) {
      const successful = this.requestHistory.filter(r => r.success).length;
      stats.successRate = Math.round((successful / this.requestHistory.length) * 100);
    }
    
    return stats;
  }
  
  resetModel(provider: string) {
    const model = this.models.find(m => m.provider === provider);
    if (model) {
      model.enabled = true;
      model.requestsThisMinute = 0;
      model.lastRequestTime = 0;
    }
  }
}