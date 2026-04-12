# ESTUDIOK - Plataforma SaaS

## 🚀 Setup Automático

```bash
# 1. Clone o projeto
git clone https://github.com/almirmsfilho4/sTUDIOK.git
cd sTUDIOK

# 2. Execute o setup
./setup.sh
```

## 📋 Setup Manual

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Editar .env.local com suas credenciais:
# - Firebase (FIREBASE_*, NEXT_PUBLIC_FIREBASE_*)
# - Resend (RESEND_API_KEY)
# - Mercado Pago (MERCADO_PAGO_*)
# - Vercel (NEXT_PUBLIC_VERCEL_*)

# Executar em desenvolvimento
npm run dev
```

## 🔧 Comandos Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Servidor produção
npm run lint         # Verificar erros
npm run typecheck    # Verificar tipos
```

## 🐳 Docker

```bash
# Development
docker-compose up

# Production
docker-compose -f docker-compose.prod.yml up -d
```

## 📦 Estrutura

```
sTUDIOK/
├── app/              # Next.js 14 App Router
├── components/       # Componentes React
├── lib/              # Services e utilities
├── contexts/         # React Contexts
├── public/           # Arquivos estáticos
└── ...
```

## 🔒 Variáveis de Ambiente

| Variável | Descrição |
|----------|-----------|
| `FIREBASE_PROJECT_ID` | ID do projeto Firebase |
| `FIREBASE_PRIVATE_KEY` | Chave privada Firebase |
| `FIREBASE_CLIENT_EMAIL` | Email do cliente Firebase |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | API Key pública |
| `RESEND_API_KEY` | API Resend para emails |
| `MERCADO_PAGO_ACCESS_TOKEN` | Token Mercado Pago |

## 📄 Licença

MIT License - © 2024 ESTUDIOK