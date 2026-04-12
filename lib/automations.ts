export interface AutomationMessage {
  type: string;
  subject: string;
  content: string;
  delay: number;
}

export const AUTOMATIONS = {
  welcome: {
    type: 'welcome',
    subject: 'Bem-vindo à ESTUDIOK! 🎉',
    content: `
Olá! Bem-vindo à ESTUDIOK!

Somos especializados em criar soluções digitais personalizadas para o seu negócio.

O que temos disponível:
✅ Sites institucionais modernos
✅ Apps mobile
✅ Sistemas web
✅ E-commerces
✅ Landing pages de alta conversão

💡 Dica: Faça seu orçamento online em poucos minutos e receba uma proposta personalizada!

Clique aqui para fazer seu orçamento: /orcamento

Precisa de ajuda? Nosso chatbot está disponível 24/7 para tirar suas dúvidas!

Atenciosamente,
Equipe ESTUDIOK
    `.trim(),
    delay: 0,
  },

  quoteCreated: {
    type: 'quote_created',
    subject: 'Seu orçamento está pronto! 💰',
    content: `
Olá! Seu orçamento foi gerado com sucesso!

Detalhes do projeto:
- Tipo: {projectType}
- Complexidade: {complexity}
- Prazo estimado: {days} dias
- Valor: R$ {price}

🎯 Próximos passos:
1. Revise os detalhes do seu orçamento
2. Clique em "Aceitar Orçamento" para continuar
3. Efetue o pagamento da entrada (30% ou 50%)
4. Começamos imediatamente!

O que está incluído:
✓ Código fonte completo
✓ Hospedagem inicial (primeiro ano)
✓ Suporte dedicado
✓ Manual de uso

Tem alguma dúvida? Responda esta mensagem ou fale com nosso chatbot!

Atenciosamente,
Equipe ESTUDIOK
    `.trim(),
    delay: 0,
  },

  paymentConfirmed: {
    type: 'payment_confirmed',
    subject: 'Pagamento confirmado! 🚀',
    content: `
🎉 Pagamento confirmado!

Olá! Recebemos o pagamento do seu projeto. Vamos começar!

📋 Resumo do projeto:
- Projeto: {projectName}
- Valor total: R$ {totalPrice}
- Entrada paga: R$ {paidAmount}

⏰ Próximos passos:
1. Em até 24h, você receberá o contrato assinado
2. Em até 48h, iniciaremos o desenvolvimento
3. Você receberá acesso ao painel de acompanhamento

📊 Acompanhe tudo em:
{dashboardUrl}

Tem alguma dúvida? Estamos aqui para ajudar!

Atenciosamente,
Equipe ESTUDIOK
    `.trim(),
    delay: 0,
  },

  projectStarted: {
    type: 'project_started',
    subject: 'Projeto iniciado! 👨‍💻',
    content: `
🚀 Seu projeto está em desenvolvimento!

Olá! Damos início oficial ao desenvolvimento do seu projeto.

📦 O que foi definido:
- Projeto: {projectName}
- Prazo: {deadline}
- Funcionalidades: {features}

📊 Acompanhe o progresso:
Acesse seu painel para ver o andamento em tempo real.

💬 Comunicação:
Todas as mensagens sobre o projeto serão enviadas através do painel do cliente.

Em breve, enviaremos a primeira prévia do projeto!

Atenciosamente,
Equipe ESTUDIOK
    `.trim(),
    delay: 0,
  },

  progress25: {
    type: 'progress_25',
    subject: 'Projeto: 25% concluído 📈',
    content: `
📊 Atualização do projeto: {projectName}

Olá! Seu projeto já está 25% concluído!

✅ O que já foi feito:
- Estrutura base criada
- Design aprovado
- Componentes principais desenvolvidos

⏭️ Próximos passos:
- Implementação de funcionalidades
- Integrações necessárias

Acompanhe tudo no seu painel: {dashboardUrl}

Dúvidas? Estamos à disposição!

Atenciosamente,
Equipe ESTUDIOK
    `.trim(),
    delay: 0,
  },

  progress50: {
    type: 'progress_50',
    subject: 'Projeto: 50% concluído 🎯',
    content: `
📊 Atualização do projeto: {projectName}

Olá! Metade do caminho percorrido! 🎉

✅ O que já foi feito:
- Funcionalidades principais implementadas
- Design completo
- Primeiros testes realizados

⏭️ Próximos passos:
- Testes finais
- Ajustes e refinamentos
- Revisão final

Acompanhe tudo no seu painel: {dashboardUrl}

Estamos no caminho certo para entregar um projeto excelente!

Atenciosamente,
Equipe ESTUDIOK
    `.trim(),
    delay: 0,
  },

  progress75: {
    type: 'progress_75',
    subject: 'Projeto: 75% quase pronto! 🔥',
    content: `
📊 Atualização do projeto: {projectName}

Olá! Quase lá! 🎉

✅ O que já foi feito:
- Todas as funcionalidades implementadas
- Design finalocado
- Testes em andamento

⏭️ Próximos passos:
- Testes finais
- Documentação
- Deploy e lançamento

Acompanhe tudo no seu painel: {dashboardUrl}

Em breve você terá seu projeto pronto!

Atenciosamente,
Equipe ESTUDIOK
    `.trim(),
    delay: 0,
  },

  projectCompleted: {
    type: 'project_completed',
    subject: 'Projeto concluído! 🎉',
    content: `
🎉 PARABÉNS! Seu projeto está pronto!

Olá! É com grande satisfação que informamos que seu projeto foi concluído com sucesso!

📦 Projeto: {projectName}
✅ Status: Concluído
📊 Progresso: 100%

🔗 Links importantes:
- Acesse seu projeto: {projectUrl}
- Painel administrativo: {adminUrl}
- Documentação: {docsUrl}

📋 Próximos passos:
1. Acesse e teste o projeto
2. Nos envie seu feedback
3. Solicite ajustes se necessário
4. Configure a manutenção (opcional)

💬 Suporte:
Estamos disponíveis para tirar suas dúvidas pelos próximos 30 dias.

O que achou do resultado? Responda com sua avaliação!

Atenciosamente,
Equipe ESTUDIOK
    `.trim(),
    delay: 0,
  },

  reminder: {
    type: 'reminder',
    subject: 'Seu orçamento está te esperando! ⏰',
    content: `
Olá! Notamos que você iniciou um orçamento mas ainda não finalizou.

💡 Seu projeto personalizado:
- Tipo: {projectType}
- Valor estimado: R$ {price}

🎯 Não perca a chance de ter um projeto moderno e profissional!

O que está incluído:
✓ Código fonte completo
✓ Design exclusivo
✓ Suporte dedicado
✓ Entrega no prazo

Clique para continuar: {quoteUrl}

Tem dúvidas? Nosso chatbot pode ajudar!

Atenciosamente,
Equipe ESTUDIOK
    `.trim(),
    delay: 24 * 60 * 60 * 1000,
  },
};

export function getAutomationMessage(type: string, variables: Record<string, string> = {}): AutomationMessage | null {
  const template = AUTOMATIONS[type as keyof typeof AUTOMATIONS];
  if (!template) return null;

  let content = template.content;
  Object.entries(variables).forEach(([key, value]) => {
    content = content.replace(new RegExp(`{${key}}`, 'g'), value);
  });

  return {
    ...template,
    content,
  };
}