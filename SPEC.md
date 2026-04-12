# ESTUDIOK - Sistema SaaS de Automação de Vendas e Projetos

## Visão Geral
- **Nome**: ESTUDIOK
- **Tipo**: SaaS de automação de vendas, atendimento e gestão de projetos
- **Objetivo**: Vender serviços digitais automaticamente sem intervenção humana
- **Público-alvo**: Desenvolvedor freelance que vende sites, apps e sistemas

## Stack Tecnológico
- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB com Mongoose
- **Autenticação**: JWT com cookies seguros
- **Chatbot**: Integração com OpenAI (preparado)
- **Pagamentos**: Mercado Pago SDK (preparado)

## Design System
- **Cores Primárias**: `#000000` (preto), `#00D4FF` (azul neon), `#FFFFFF` (branco)
- **Acentos**: `#FF006E` (rosa neon), `#7B2CBF` (roxo)
- **Tipografia**: Inter (headings), Roboto (body)
- **Estilo**: Tech moderno, minimalista, dark mode por padrão

## Funcionalidades Principais

### 1. Landing Page
- Hero section com headline principal
- Serviços em cards interativos
- Benefícios com ícones
- Portfólio dinâmico
- Depoimentos
- CTA final
- Chatbot flutuante

### 2. Sistema de Orçamento Automático
- Quiz multi-step (5 etapas)
- Cálculo em tempo real
- Preview do preço
- Geração de proposta
- redirecionamento para cadastro

### 3. Autenticação
- Login/Cadastro
- Recuperação de senha (mock)
- JWT com httpOnly cookies
- Proteção de rotas
- Roles: admin, client

### 4. Chatbot com IA
- Interface de chat fixa
- Respostas automáticas baseadas em regras
- Integração preparada para OpenAI
- Fallback para atendimento humano
- Context-aware responses

### 5. Sistema de Pagamento
- Página de checkout
- Seleção de entrada (30%/50%)
- Integração Mercado Pago (mock)
- Webhook preparado
- Confirmação automática

### 6. Criação Automática de Projetos
- Trigger: pagamento confirmado
- Criação automática de projeto
- Status inicial: "Em andamento"
- Progresso: 0%

### 7. Área do Cliente
- Dashboard com métricas
- Lista de projetos
- Progresso visual
- Chat por projeto
- Upload de arquivos

### 8. Painel Admin
- Métricas gerais
- Gestão de clientes
- CRUD de projetos
- Atualização de status
- Upload de arquivos

### 9. Sistema de Mensagens
- Chat em tempo real (polling)
- Por projeto
- Histórico completo
- Notificações

### 10. Automações
- Boas-vindas pós-cadastro
- Follow-up orçamento
- Confirmação de pagamento
- Atualizações de progresso
- Finalização de projeto

## Estrutura de Dados

### User
```
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hash),
  role: String (admin|client),
  avatar: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Project
```
{
  _id: ObjectId,
  user_id: ObjectId,
  name: String,
  description: String,
  status: String (pending|in_progress|review|completed),
  progress: Number (0-100),
  price: Number,
  deadline: Date,
  features: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Message
```
{
  _id: ObjectId,
  project_id: ObjectId,
  sender_id: ObjectId,
  content: String,
  read: Boolean,
  createdAt: Date
}
```

### Quote
```
{
  _id: ObjectId,
  user_id: ObjectId,
  project_type: String,
  features: [String],
  complexity: String,
  deadline: String,
  price: Number,
  status: String (pending|accepted|rejected),
  createdAt: Date
}
```

### File
```
{
  _id: ObjectId,
  project_id: ObjectId,
  name: String,
  url: String,
  type: String,
  uploadedBy: ObjectId,
  createdAt: Date
}
```

## Páginas

1. `/` - Landing Page
2. `/orcamento` - Quiz de orçamento
3. `/login` - Login
4. `/cadastro` - Cadastro
5. `/dashboard` - Dashboard cliente
6. `/dashboard/projetos` - Lista de projetos
7. `/dashboard/projetos/[id]` - Detalhes do projeto
8. `/dashboard/mensagens` - Mensagens
9. `/admin` - Painel admin
10. `/admin/clientes` - Gestão de clientes
11. `/admin/projetos` - Gestão de projetos
12. `/checkout/[quoteId]` - Checkout de pagamento

## Automações Implementadas

1. **Bem-vindas**: Email/text automático após cadastro
2. **Orçamento**: Mensagem incentivando fechamento
3. **Pagamento**: Confirmação instantânea
4. **Projeto**: Notificação de início
5. **Progresso**: Alertas em 25%, 50%, 75%, 100%
6. **Finalização**: Aviso + solicitação de feedback