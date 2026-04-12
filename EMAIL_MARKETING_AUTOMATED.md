# Sistema de Email Marketing Automatizado

## Arquitetura

### 1. Serviço de Email (`/lib/email-service.ts`)
- Cliente Resend API configurado
- Templates HTML responsivos
- Suporte a personalização com `{{nome}}`, `{{email}}`, etc.
- Sistema de fallback para desenvolvimento

### 2. Automações de Email (`/lib/email-automations.ts`)
- Sequências de email pré-configuradas
- Gatilhos automáticos baseados em eventos
- Templates de texto e HTML
- Sistema de atraso (delay)

### 3. API de Automação (`/app/api/automations/email/route.ts`)
- Endpoint para disparar emails automáticos
- Suporte a múltiplos templates
- Validação de dados de entrada

### 4. API de Sequência (`/app/api/automations/email-sequence/route.ts`)
- Sequências completas de nurture
- Email drip campaigns
- Personalização avançada

## Sequências Disponíveis

### 1. Boas-Vindas (`welcome_sequence`)
- **Gatilho**: `user_created` (novo cadastro)
- **Emails**:
  - Email 1: Bem-vindo (imediatamente)
  - Email 2: Dicas (24h depois)

### 2. Orçamento Abandonado (`quote_abandoned`)
- **Gatilho**: `quote_abandoned` (orçamento não finalizado)
- **Emails**:
  - Email 1: Lembrete (2h depois)
  - Email 2: Oferta especial (24h depois)
  - Email 3: Última chance (48h depois)

### 3. Nurturing de Leads (`nurturing_sequence`)
- **Gatilho**: `lead_captured` (formulário preenchido)
- **Emails**:
  - Email 1: Confirmação (imediatamente)
  - Email 2: Conteúdo relevante (3 dias depois)
  - Email 3: Case de sucesso (7 dias depois)
  - Email 4: Reengajamento (14 dias depois)

### 4. Pós-Venda (`post_purchase`)
- **Gatilho**: `payment_confirmed` (pagamento aprovado)
- **Emails**:
  - Email 1: Obrigado (imediatamente)
  - Email 2: Onboarding (1 dia depois)
  - Email 3: Suporte (3 dias depois)
  - Email 4: Feedback (7 dias depois)

## Implementação nos Componentes

### Enviar Email de Boas-Vindas
```typescript
import { sendAutomatedEmail } from '@/lib/email-automations';

await sendAutomatedEmail('welcome_sequence', {
  name: 'João Silva',
  email: 'joao@email.com',
  project_type: 'site',
  project_price: 1500,
  project_days: 15
});
```

### Trigger de Orçamento Abandonado
```typescript
// Quando usuário abandona orçamento
await sendAutomatedEmail('quote_abandoned', {
  name: formData.name,
  email: formData.email,
  project_type: formData.projectType,
  project_price: calculatedPrice,
  project_days: estimatedDays,
  quote_url: `https://estudiok.com.br/orcamento`
});
```

## Templates HTML

### Localização
- `/lib/email-templates/` - Templates HTML customizados
- `/app/api/automations/email/route.ts` - Templates embutidos

### Personalização
Use `{{variavel}}` para dados dinâmicos:
```html
<h1>Olá {{name}}!</h1>
<p>Seu orçamento de {{project_type}} está pronto.</p>
<p>Valor: R$ {{project_price}}</p>
<p>Prazo: {{project_days}} dias</p>
```

## Configuração de Variáveis de Ambiente

```env
# Resend API
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=contato@estudiok.com.br
RESEND_FROM_NAME=ESTUDIOK

# URL do Site (para links)
NEXT_PUBLIC_SITE_URL=https://estudiok.com.br
```

## Dashboard de Controle

### Acesso Admin
- URL: `/admin/marketing/email-automations`
- Visualizar sequências ativas
- Ativar/desativar sequências
- Ver estatísticas de envio
- Configurar templates

### Métricas Monitoradas
- Taxa de abertura
- Taxa de clique
- Conversões por sequência
- ROI por campanha

## Monitoramento

### Logs
- Console do navegador para debugging
- Dashboard do Resend para entregabilidade
- Google Analytics para tracking

### Alertas
- Falhas de envio
- Taxas de bounce altas
- Spam reports
- Unsubscribes

## Otimização

### 1. Timing de Envio
- Melhores horários: 10h-12h, 15h-17h
- Evitar finais de semana
- Considerar fuso horário do lead

### 2. Personalização
- Usar nome do lead
- Referenciar tipo de projeto
- Incluir dados específicos

### 3. Testes A/B
- Testar diferentes subject lines
- Variar timing de envio
- Experimentar diferentes CTAs

## Solução de Problemas

### Emails Não Chegando
1. Verificar `RESEND_API_KEY`
2. Checar email do remetente aprovado no Resend
3. Verificar spam folder
4. Testar com diferentes provedores

### Personalização Quebrada
1. Validar dados de entrada
2. Verificar nomes das variáveis
3. Testar com dados simples

### Alta Taxa de Bounce
1. Validar lista de emails
2. Verificar reputação do domínio
3. Implementar double opt-in

## Próximas Funcionalidades

### 1. Segmentação Avançada
- Baseado em comportamento
- Por tipo de projeto
- Por valor do ticket

### 2. Automação Visual
- Editor drag-and-drop
- Workflow builder
- Testes A/B integrados

### 3. Integrações
- CRM (HubSpot, Salesforce)
- Analytics (GA4, Mixpanel)
- Chat (Intercom, Drift)