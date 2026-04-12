export const emailTemplates = {
  welcome: {
    name: 'Boas-vindas',
    subject: '🚀 Bem-vindo à ESTUDIOK!',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background: linear-gradient(135deg, #00D4FF, #7B2CBF); padding: 40px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">Olá {{nome}}!</h1>
  </div>
  <div style="padding: 40px; background: white;">
    <p style="font-size: 18px; line-height: 1.6;">Que bom ter você conosco!</p>
    <p style="font-size: 16px; line-height: 1.6;">Estamos prontos para transformar seu negócio com estratégias digitais de alta performance.</p>
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <h3 style="margin-top: 0; color: #7B2CBF;">Próximos passos:</h3>
      <ul style="padding-left: 20px; line-height: 2;">
        <li>Conheça nossos serviços</li>
        <li>Agende uma consultoria gratuita</li>
        <li>Solicite um orçamento personalizado</li>
      </ul>
    </div>
    <a href="https://estudiok.com.br/agendar" style="background: #00D4FF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Agendar Consultoria</a>
  </div>
  <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>ESTUDIOK - Marketing Digital & Automação</p>
  </div>
</div>`,
  },
  promotion: {
    name: 'Promoção Especial',
    subject: '🔥 Oferta Imperdível: 30% OFF em Sites Premium',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background: linear-gradient(135deg, #FF006E, #FF4D00); padding: 40px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 32px;">{{nome}}, não perca!</h1>
    <p style="color: white; font-size: 20px; margin: 10px 0;">30% OFF em Sites Premium</p>
  </div>
  <div style="padding: 40px; background: white;">
    <p style="font-size: 18px; line-height: 1.6;">Oi {{nome}},</p>
    <p style="font-size: 16px; line-height: 1.6;">Estamos com uma promoção exclusiva por tempo limitado!</p>
    <div style="background: #fff3f0; border-left: 4px solid #FF006E; padding: 20px; margin: 30px 0;">
      <h3 style="margin-top: 0; color: #FF006E;">O que está incluído:</h3>
      <ul style="padding-left: 20px; line-height: 2;">
        <li>Design exclusivo e responsivo</li>
        <li>Otimização SEO completa</li>
        <li>Integração com WhatsApp</li>
        <li>3 meses de suporte gratuito</li>
      </ul>
    </div>
    <p style="font-size: 24px; color: #FF006E; font-weight: bold; text-align: center;">De R$ 4.997 por R$ 3.497</p>
    <p style="text-align: center; color: #666;">Ou 12x de R$ 291,42 sem juros</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://estudiok.com.br/checkout" style="background: #FF006E; color: white; padding: 18px 40px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 18px;">Quero Aproveitar Agora</a>
    </div>
    <p style="text-align: center; color: #999; font-size: 14px;">Válido até 20/04/2026 ou enquanto durarem os estoques.</p>
  </div>
</div>`,
  },
  newsletter: {
    name: 'Newsletter Mensal',
    subject: '📊 Newsletter ESTUDIOK - Tendências de Abril',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background: #0A0A0A; padding: 40px; text-align: center;">
    <h1 style="color: #00D4FF; margin: 0; font-size: 24px;">ESTUDIOK Newsletter</h1>
    <p style="color: #888; margin: 10px 0;">Tendências e Insights de Abril</p>
  </div>
  <div style="padding: 40px; background: white;">
    <p style="font-size: 18px; line-height: 1.6;">Olá {{nome}},</p>
    <p style="font-size: 16px; line-height: 1.6;">Separamos as principais tendências de marketing digital deste mês para você.</p>
    
    <div style="margin: 30px 0;">
      <h3 style="color: #7B2CBF; border-bottom: 2px solid #7B2CBF; padding-bottom: 10px;">🚀 Inteligência Artificial no Marketing</h3>
      <p style="line-height: 1.8;">A IA está revolucionando a forma como criamos conteúdo e interagimos com clientes. Descubra como implementar no seu negócio.</p>
    </div>
    
    <div style="margin: 30px 0;">
      <h3 style="color: #7B2CBF; border-bottom: 2px solid #7B2CBF; padding-bottom: 10px;">📱 Otimização Mobile-First</h3>
      <p style="line-height: 1.8;">Com mais de 70% do tráfego vindo de dispositivos móveis, ter um site otimizado para mobile não é mais opcional.</p>
    </div>
    
    <div style="margin: 30px 0;">
      <h3 style="color: #7B2CBF; border-bottom: 2px solid #7B2CBF; padding-bottom: 10px;">🎯 Personalização em Escala</h3>
      <p style="line-height: 1.8;">Clientes esperam experiências personalizadas. Aprenda a segmentar sua audiência de forma eficiente.</p>
    </div>
    
    <div style="background: linear-gradient(135deg, #00D4FF, #7B2CBF); padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0;">
      <h3 style="color: white; margin-top: 0;">Quer implementar essas estratégias?</h3>
      <p style="color: white; margin-bottom: 20px;">Agende uma consultoria gratuita com nossos especialistas.</p>
      <a href="https://estudiok.com.br/agendar" style="background: white; color: #7B2CBF; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Agendar Agora</a>
    </div>
  </div>
  <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666;">
    <p>© 2026 ESTUDIOK. Todos os direitos reservados.</p>
    <p><a href="https://estudiok.com.br/unsubscribe" style="color: #999;">Cancelar inscrição</a></p>
  </div>
</div>`,
  },
  reengagement: {
    name: 'Reengajamento',
    subject: '⏰ Sentimos sua falta, {{nome}}!',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background: linear-gradient(135deg, #7B2CBF, #00D4FF); padding: 40px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 28px;">{{nome}}, sentimos sua falta!</h1>
  </div>
  <div style="padding: 40px; background: white;">
    <p style="font-size: 18px; line-height: 1.6;">Olá {{nome}},</p>
    <p style="font-size: 16px; line-height: 1.6;">Percebemos que faz um tempo que você não visita a ESTUDIOK. Temos novidades incríveis esperando por você!</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
      <h3 style="margin-top: 0; color: #7B2CBF;">O que mudou desde a última vez:</h3>
      <ul style="padding-left: 20px; line-height: 2;">
        <li>✨ Nova plataforma de automação de marketing</li>
        <li>🎨 Templates exclusivos para landing pages</li>
        <li>🤖 Integração avançada com IA</li>
        <li>📊 Dashboard de analytics em tempo real</li>
      </ul>
    </div>
    
    <p style="font-size: 16px; line-height: 1.6;">Como forma de agradecer pela sua confiança, preparamos um cupom exclusivo de <strong>20% OFF</strong> em qualquer serviço!</p>
    
    <div style="background: linear-gradient(135deg, #00D4FF, #7B2CBF); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
      <p style="color: white; margin: 0; font-size: 14px;">Use o código:</p>
      <p style="color: white; margin: 10px 0; font-size: 32px; font-weight: bold; letter-spacing: 4px;">VOLTEI20</p>
    </div>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://estudiok.com.br/orcamento?cupom=VOLTEI20" style="background: #7B2CBF; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Quero Minha Oferta</a>
    </div>
    
    <p style="font-size: 14px; color: #666; text-align: center;">Válido por 7 dias. Não acumulativo com outras promoções.</p>
  </div>
</div>`,
  },
  caseStudy: {
    name: 'Caso de Sucesso',
    subject: '📈 Como uma loja aumentou 180% as vendas em 90 dias',
    body: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background: linear-gradient(135deg, #059669, #00D4FF); padding: 40px; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 26px;">Case de Sucesso: E-commerce Moda</h1>
    <p style="color: white; font-size: 18px; margin: 10px 0;">+180% em vendas em apenas 90 dias</p>
  </div>
  <div style="padding: 40px; background: white;">
    <p style="font-size: 18px; line-height: 1.6;">Oi {{nome}},</p>
    <p style="font-size: 16px; line-height: 1.6;">Queremos compartilhar um case incrível de um cliente nosso que transformou seu negócio.</p>
    
    <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 20px; margin: 30px 0;">
      <h3 style="margin-top: 0; color: #059669;">O Desafio</h3>
      <p style="line-height: 1.8;">Uma loja de moda feminina com 3 anos de mercado estava estagnada em R$ 15.000/mês em vendas online.</p>
    </div>
    
    <div style="background: #fefce8; border-left: 4px solid #eab308; padding: 20px; margin: 30px 0;">
      <h3 style="margin-top: 0; color: #ca8a04;">A Estratégia</h3>
      <ul style="padding-left: 20px; line-height: 2;">
        <li>Redesign completo do e-commerce</li>
        <li>Implementação de funil de vendas automatizado</li>
        <li>Campanhas de remarketing segmentadas</li>
        <li>Otimização de checkout (menos etapas)</li>
      </ul>
    </div>
    
    <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; border-radius: 8px; text-align: center; margin: 30px 0;">
      <h3 style="color: white; margin-top: 0;">O Resultado em 90 dias</h3>
      <div style="display: flex; justify-content: space-around; flex-wrap: wrap; margin-top: 20px;">
        <div style="text-align: center; margin: 10px;">
          <p style="color: white; font-size: 36px; font-weight: bold; margin: 0;">R$ 42K</p>
          <p style="color: rgba(255,255,255,0.8); font-size: 14px;">Faturamento/mês</p>
        </div>
        <div style="text-align: center; margin: 10px;">
          <p style="color: white; font-size: 36px; font-weight: bold; margin: 0;">+180%</p>
          <p style="color: rgba(255,255,255,0.8); font-size: 14px;">Crescimento</p>
        </div>
        <div style="text-align: center; margin: 10px;">
          <p style="color: white; font-size: 36px; font-weight: bold; margin: 0;">3.2%</p>
          <p style="color: rgba(255,255,255,0.8); font-size: 14px;">Taxa de Conversão</p>
        </div>
      </div>
    </div>
    
    <p style="font-size: 16px; line-height: 1.6;">Quer resultados assim para o seu negócio?</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://estudiok.com.br/agendar" style="background: #059669; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Agendar Consultoria Gratuita</a>
    </div>
  </div>
</div>`,
  },
};

export type EmailTemplateKey = keyof typeof emailTemplates;
