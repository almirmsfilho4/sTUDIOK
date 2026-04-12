# ESTUDIOK - Agência Digital SaaS

Plataforma SaaS completa para agência digital especializada em criação de sites, apps e sistemas sob medida.

## 🚀 Funcionalidades

- **Landing Page** - Página inicial com exemplos de serviços (preços ocultos para não-logados)
- **Quiz de Orçamento** - Quiz interativo de 6 passos para capturar leads
- **Portal de Conhecimento** - Blog/artigos com categorias
- **Sistema de Tickets** - Suporte ao cliente
- **Webhook Notifications** - Integrações com Slack/Discord
- **Avaliações** - Reviews pós-projeto com ratings
- **Automação de E-mails** - Follow-up automatizado (dias 0, 2, 5)
- **Garantia de 30 dias** - Contagem regressiva após entrega
- **Relatórios** - Relatórios de projeto (impressão)
- **Dashboard Cliente** - Área do cliente com abas
- **Painel Admin** - +10 abas com funcionalidades completas
- **CRM** - Gestão de clientes e pipeline de vendas
- **Contratos Digitais** - Assinatura eletrônica
- **Gamificação** - XP, badges, níveis
- **Programa de Indicação** - Sistema de referrals
- **White Label** - Para agências
- **API Pública** - Endpoints documentados
- **Analytics** - Dashboard de métricas unificado

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Firebase Firestore
- **Autenticação**: Firebase Auth
- **Pagamentos**: Mercado Pago
- **E-mails**: Resend
- **Hospedagem**: Vercel
- **Testes**: Vitest
- **Monitoring**: Sentry (opcional)

## 📋 Pré-requisitos

- Node.js 20+
- npm ou yarn
- Firebase Project configurado
- Conta Vercel (deploy)
- Conta Mercado Pago (produção)
- Conta Resend (e-mails)

## ⚡ Instalação

```bash
# Clone o repositório
git clone https://github.com/almirmsfilho4/sTUDIOK.git

# Entre no diretório
cd STUDIOK

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.local.example .env.local

# Execute o servidor de desenvolvimento
npm run dev
```

## 🔧 Variáveis de Ambiente

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
FIREBASE_ADMIN_PRIVATE_KEY=
FIREBASE_ADMIN_CLIENT_EMAIL=

# Mercado Pago
NEXT_PUBLIC_MERCADO_PAGO_PUBLIC_KEY=
MERCADO_PAGO_ACCESS_TOKEN=

# Resend
RESEND_API_KEY=

# Sentry (opcional)
NEXT_PUBLIC_SENTRY_DSN=

# Google Analytics (opcional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## 📝 Scripts Disponíveis

```bash
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run start      # Servidor de produção
npm run lint       # Verificar ESLint
npm run typecheck  # Verificar TypeScript
npm run test       # Rodar testes (watch mode)
npm run test:run   # Rodar testes (uma vez)
```

## 🧪 Testes

```bash
# Rodar todos os testes
npm run test:run

# Verificar cobertura
npm run test:coverage
```

## 📁 Estrutura de Diretórios

```
├── app/                    # Páginas Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # Painel Admin
│   ├── dashboard/         # Dashboard Cliente
│   └── ...
├── components/            # Componentes React
├── contexts/              # React Contexts
├── lib/                   # Utilitários e serviços
├── __tests__/             # Testes
└── public/                # Arquivos estáticos
```

## 🚢 Deploy

### Vercel (Recomendado)

```bash
# Deploy automático via GitHub Actions
# Configure as variáveis de ambiente no painel Vercel
```

### Manual

```bash
npm run build
npx vercel --prod
```

## 🔐 Segurança

- Rate limiting em APIs
- Headers de segurança (CSP, X-Frame-Options, etc.)
- Validação de input e sanitização
- Proteção CSRF
- Autenticação Firebase
- Two-Factor Auth (opcional)

## 📄 Licença

MIT License - veja LICENSE para detalhes.

## 👤 Autor

ESTUDIOK - Agência Digital
https://estudiok.com.br