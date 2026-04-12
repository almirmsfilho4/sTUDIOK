import { emailService } from './email-service';

export interface EmailSequence {
  id: string;
  name: string;
  description: string;
  triggers: string[];
  emails: EmailTemplate[];
  enabled: boolean;
}

export interface EmailTemplate {
  id: string;
  subject: string;
  delay: number; // hours after trigger
  content: string;
}

export const EMAIL_SEQUENCES: EmailSequence[] = [
  {
    id: 'welcome_sequence',
    name: 'Sequência de Boas-Vindas',
    description: 'Email de boas-vindas para novos clientes',
    triggers: ['user_created'],
    emails: [
      {
        id: 'welcome_1',
        subject: '🎉 Bem-vindo à ESTUDIOK! Sua jornada começa aqui',
        delay: 0,
        content: `Olá {name}!

É um prazer ter você conosco! Na ESTUDIOK, transformamos suas ideias em soluções digitais incríveis.

✨ O que podemos fazer por você:
• Sites modernos e responsivos
• Apps mobile nativos
• Sistemas web personalizados
• E-commerces de alta conversão

💡 Próximos passos:
1. Faça seu orçamento em /orcamento
2. Converse com nosso chatbot para tirar dúvidas
3. Acompanhe tudo pelo seu painel em /dashboard

Estamos aqui para ajudar!
Equipe ESTUDIOK`
      },
      {
        id: 'welcome_2', 
        subject: '🚀 Dica: Como tirar o máximo proveito da ESTUDIOK',
        delay: 24,
        content: `Olá {name}!

Esperamos que esteja se adaptando bem! Aqui vai uma dica valiosa:

🎯 Prepare-se para seu orçamento:
• Defina claramente seus objetivos
• Liste as funcionalidades principais
• Pense no público-alvo
• Colete exemplos de referência

📊 Isso ajuda nosso time a:
• Entender suas necessidades
• Criar propostas mais precisas
• Entregar resultados mais rápidos

Precisa de ajuda? Nosso chatbot está disponível 24/7!

Equipe ESTUDIOK`
      }
    ],
    enabled: true
  },
  {
    id: 'quote_abandoned',
    name: 'Orçamento Abandonado',
    description: 'Recuperação de leads que não finalizaram orçamento',
    triggers: ['quote_abandoned'],
    emails: [
      {
        id: 'abandoned_1',
        subject: '⏰ Seu orçamento está te esperando!',
        delay: 2,
        content: `Olá {name}!

Vimos que você começou um orçamento mas não finalizou. Tem alguma dúvida?

💡 Seu projeto estimado:
• Tipo: {project_type}
• Valor: R$ {project_price}
• Prazo: {project_days} dias

🎯 O que está incluso:
✓ Código fonte completo
✓ Design exclusivo
✓ Hospedagem inicial
✓ Suporte dedicado

Clique para continuar: {quote_url}

Equipe ESTUDIOK`
      },
      {
        id: 'abandoned_2',
        subject: '🎁 Oferta especial para você finalizar!',
        delay: 48,
        content: `Olá {name}!

Preparamos uma oferta especial para você finalizar seu orçamento:

✨ 10% de desconto na entrada!
✨ Revisão gratuita de UX
✨ Domínio grátis por 1 ano

💰 Valor com desconto: R$ {discounted_price}
⏰ Válido por 48 horas

Não perca esta oportunidade! 
{quote_url}

Equipe ESTUDIOK`
      }
    ],
    enabled: true
  },
  {
    id: 'project_progress',
    name: 'Acompanhamento de Projeto',
    description: 'Atualizações automáticas durante o desenvolvimento',
    triggers: ['project_started', 'progress_25', 'progress_50', 'progress_75', 'project_completed'],
    emails: [
      {
        id: 'progress_25',
        subject: '📈 Seu projeto está 25% concluído!',
        delay: 0,
        content: `Olá {name}!

Ótimas notícias! Seu projeto "{project_name}" já está 25% concluído 🎉

✅ O que já foi feito:
• Estrutura base criada
• Design aprovado
• Componentes principais desenvolvidos

⏭️ Próximos passos:
• Implementação de funcionalidades
• Integrações necessárias

Acompanhe tudo em: {dashboard_url}

Equipe ESTUDIOK`
      },
      {
        id: 'progress_50',
        subject: '🎯 Metade do caminho percorrido! 50% concluído',
        delay: 0,
        content: `Olá {name}!

Metade do caminho já foi percorrido! Seu projeto "{project_name}" está 50% concluído 🎉

✅ O que já foi feito:
• Funcionalidades principais implementadas
• Design completo
• Primeiros testes realizados

⏭️ Próximos passos:
• Testes finais
• Ajustes e refinamentos
• Revisão final

Acompanhe em: {dashboard_url}

Equipe ESTUDIOK`
      },
      {
        id: 'progress_75',
        subject: '🔥 Quase lá! Seu projeto está 75% pronto',
        delay: 0,
        content: `Olá {name}!

Quase lá! Seu projeto "{project_name}" está 75% concluído 🎉

✅ O que já foi feito:
• Todas as funcionalidades implementadas
• Design finalocado
• Testes em andamento

⏭️ Próximos passos:
• Testes finais
• Documentação
• Deploy e lançamento

Acompanhe em: {dashboard_url}

Em breve você terá seu projeto pronto!

Equipe ESTUDIOK`
      },
      {
        id: 'project_completed',
        subject: '🎉 PARABÉNS! Seu projeto está pronto!',
        delay: 0,
        content: `Olá {name}!

É com grande satisfação que informamos: seu projeto "{project_name}" foi concluído com sucesso! 🎊

📦 Detalhes:
• Status: Concluído ✅
• Progresso: 100% 📊
• Entrega: No prazo ⏰

🔗 Links importantes:
• Acesse seu projeto: {project_url}
• Painel administrativo: {admin_url}
• Documentação: {docs_url}

📋 Próximos passos:
1. Teste todas as funcionalidades
2. Nos envie seu feedback
3. Solicite ajustes se necessário

💬 Suporte:
Estamos disponíveis pelos próximos 30 dias para tirar dúvidas!

Obrigado por confiar na ESTUDIOK! 🚀

Equipe ESTUDIOK`
      }
    ],
    enabled: true
  },
  {
    id: 'payment_reminder',
    name: 'Lembretes de Pagamento',
    description: 'Lembretes para pagamentos pendentes',
    triggers: ['payment_pending'],
    emails: [
      {
        id: 'reminder_1',
        subject: '💳 Pagamento pendente - {project_name}',
        delay: 24,
        content: `Olá {name}!

Identificamos um pagamento pendente para o projeto "{project_name}".

💰 Valor: R$ {amount}
📅 Vencimento: {due_date}

🔗 Link para pagamento: {payment_url}

💡 Dúvidas? Responda este email!

Equipe ESTUDIOK`
      },
      {
        id: 'reminder_2',
        subject: '⏰ Último aviso: Pagamento em atraso',
        delay: 72,
        content: `Olá {name}!

Seu pagamento para o projeto "{project_name}" está em atraso.

⚠️ Valor: R$ {amount}
📅 Vencido em: {due_date}

Para evitar a suspensão do projeto, efetue o pagamento:
{payment_url}

Precisa de ajuda? Estamos à disposição!

Equipe ESTUDIOK`
      }
    ],
    enabled: true
  }
];

export class EmailAutomationService {
  static async triggerSequence(
    sequenceId: string, 
    recipientEmail: string,
    variables: Record<string, string> = {}
  ) {
    const sequence = EMAIL_SEQUENCES.find(s => s.id === sequenceId && s.enabled);
    
    if (!sequence) {
      console.warn(`Sequência ${sequenceId} não encontrada ou desabilitada`);
      return;
    }

    for (const emailTemplate of sequence.emails) {
      await this.scheduleEmail(emailTemplate, recipientEmail, variables);
    }
  }

  private static async scheduleEmail(
    template: EmailTemplate,
    recipientEmail: string,
    variables: Record<string, string>
  ) {
    // Substituir variáveis no conteúdo
    let content = template.content;
    let subject = template.subject;
    
    Object.entries(variables).forEach(([key, value]) => {
      content = content.replace(new RegExp(`{${key}}`, 'g'), value);
      subject = subject.replace(new RegExp(`{${key}}`, 'g'), value);
    });

    // Agendar email com delay
    setTimeout(async () => {
      try {
        await emailService.sendEmail({
          to: recipientEmail,
          subject,
          html: content.replace(/\n/g, '<br>')
        });
        
        console.log(`✅ Email enviado: ${subject} para ${recipientEmail}`);
      } catch (error) {
        console.error(`❌ Erro ao enviar email: ${subject}`, error);
      }
    }, template.delay * 60 * 60 * 1000); // Converter horas para milissegundos
  }

  static async triggerAutomation(
    triggerType: string,
    recipientEmail: string,
    variables: Record<string, string> = {}
  ) {
    const sequences = EMAIL_SEQUENCES.filter(
      sequence => sequence.enabled && sequence.triggers.includes(triggerType)
    );

    for (const sequence of sequences) {
      await this.triggerSequence(sequence.id, recipientEmail, variables);
    }
  }
}

// Triggers disponíveis
export const TRIGGERS = {
  USER_CREATED: 'user_created',
  QUOTE_ABANDONED: 'quote_abandoned',
  PROJECT_STARTED: 'project_started',
  PROGRESS_25: 'progress_25',
  PROGRESS_50: 'progress_50',
  PROGRESS_75: 'progress_75',
  PROJECT_COMPLETED: 'project_completed',
  PAYMENT_PENDING: 'payment_pending',
  PAYMENT_CONFIRMED: 'payment_confirmed'
};