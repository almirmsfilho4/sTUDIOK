# Configuração de Analytics e Eventos de Conversão

## Variáveis de Ambiente Necessárias

Configure no Vercel Dashboard (.env.local para desenvolvimento):

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXXXX
NEXT_PUBLIC_HOTJAR_ID=XXXXXXX
```

## Eventos de Conversão Rastreados

### 1. Orçamento Iniciado (`trackOrcamentoStarted`)
- **Onde**: Página `/orcamento` (passo 1)
- **Parâmetros**: `serviceType`, `estimatedValue`
- **Propósito**: Rastrear interessados que começam o processo de orçamento

### 2. Página de Agradecimento (`trackThankYouPage`)
- **Onde**: `/orcamento/agradecimento`
- **Parâmetros**: `clientName`, `projectType`, `estimatedValue`
- **Propósito**: Confirmar recebimento do orçamento

### 3. Formulário de Lead (`trackLeadFormSubmit`)
- **Onde**: Qualquer formulário de captura de lead
- **Parâmetros**: `formType`, `leadData`
- **Propósito**: Rastrear novos leads capturados

### 4. Pagamento Completo (`trackPaymentComplete`)
- **Onde**: Após checkout bem-sucedido
- **Parâmetros**: `paymentId`, `amount`, `planType`
- **Propósito**: Rastrear conversões (vendas)

### 5. Agendamento Calendly (`trackCalendlyBooking`)
- **Onde**: Página `/agendar` após enviar formulário
- **Parâmetros**: `clientName`, `appointmentType`
- **Propósito**: Rastrear agendamentos de consultoria

### 6. Click no WhatsApp (`trackWhatsAppClick`)
- **Onde**: Botões WhatsApp em todo o site
- **Parâmetros**: `source` (página origem)
- **Propósito**: Rastrear engajamento direto

## Implementação nos Componentes

### MarketingScripts.tsx
Componente principal que inicializa todos os scripts de analytics. Incluído no `layout.tsx`.

### Funções Disponíveis

```typescript
// Importar no topo do arquivo
import { 
  trackOrcamentoStarted, 
  trackThankYouPage,
  trackLeadFormSubmit,
  trackPaymentComplete,
  trackCalendlyBooking,
  trackWhatsAppClick 
} from '@/components/MarketingScripts';

// Exemplo de uso
trackLeadFormSubmit('contact_form', {
  name: 'João Silva',
  email: 'joao@email.com',
  phone: '(11) 99999-9999',
  company: 'Empresa XYZ'
});
```

## Dashboard do Google Analytics 4

### Eventos Principais para Configurar no GA4
1. **generate_lead** - Formulários preenchidos
2. **purchase** - Pagamentos completos
3. **begin_checkout** - Início do checkout
4. **schedule** - Agendamentos
5. **whatsapp_click** - Cliques no WhatsApp

### Configuração de Conversões no GA4
1. Acesse Google Analytics Console
2. Vá para "Configuração" > "Eventos"
3. Marque como conversão:
   - `generate_lead`
   - `purchase`
   - `schedule`
   - `begin_checkout`

### Meta Pixel (Facebook)
- Eventos automáticos configurados
- Mapeamento automático para eventos do Facebook
- Rastreamento de leads, checkout e compras

## Relatórios Recomendados

### 1. Funil de Conversão
```
Orçamento Iniciado → Orçamento Enviado → Agendamento → Checkout → Compra
```

### 2. ROI por Canal
- Google Ads (`NEXT_PUBLIC_GOOGLE_ADS_ID`)
- Meta Ads (`NEXT_PUBLIC_META_PIXEL_ID`)
- Tráfego Orgânico

### 3. Performance por Página
- Páginas com mais conversões
- Taxa de rejeição por página
- Tempo médio de sessão

## Solução de Problemas

### Scripts Não Carregando
1. Verifique variáveis de ambiente no Vercel
2. Confirme IDs nas plataformas respectivas
3. Use "View Page Source" para verificar scripts no HTML

### Eventos Não Sendo Rastreados
1. Verifique console do navegador para erros
2. Use Google Tag Assistant extension
3. Teste no ambiente de produção

### Dados Duplicados
1. Verifique implementação duplicada
2. Confirme se há múltiplos pixels/tags
3. Use modo de depuração do GA4

## Manutenção
- Atualizar IDs quando necessário
- Adicionar novos eventos conforme novas funcionalidades
- Revisar relatórios mensalmente
- Otimizar configurações baseado em performance