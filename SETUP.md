# ESTUDIOK - Guia de Configuração e Deploy

## 🚀 Quick Start

### 1. Configurar Firebase

Acesse https://console.firebase.google.com e crie um novo projeto.

#### Authentication
1. Vá em **Authentication** > **Sign-in method**
2. Ative **Email/Password**
3. Configure:
   - Email/Password: Ativado

#### Firestore Database
1. Vá em **Firestore Database** > **Criar banco de dados**
2. Escolha localização: **southamerica-east1** (São Paulo)
3. Inicie em modo de produção
4. Configure regras de segurança:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários só acessam seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Admin pode acessar tudo
    match /users/{userId} {
      allow read, write: if request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Projetos - usuários acessam seus próprios projetos
    match /projects/{projectId} {
      allow read: if request.auth != null && resource.data.user_id == request.auth.uid;
      allow create: if request.auth != null;
      allow update: if request.auth != null && (resource.data.user_id == request.auth.uid || get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Citações (Quotes)
    match /quotes/{quoteId} {
      allow read: if request.auth != null;
      allow create: if true;
      allow update: if request.auth != null;
    }
    
    // Mensagens
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
    
    // Arquivos
    match /files/{fileId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

#### Storage
1. Vá em **Storage** > **Começar**
2. Configure regras:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /projects/{projectId}/{fileName} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# Credenciais Firebase (obtenha no console do Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=seu-projeto.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=seu-projeto-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=seu-projeto.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:...

# URL do site
NEXT_PUBLIC_SITE_URL=https://seu-dominio.vercel.app
```

### 3. Criar Usuário Admin

1. Faça cadastro normal em https://seu-site.vercel.app/cadastro
2. Acesse o Firestore Console > Firestore Database
3. Vá na coleção `users`
4. Encontre seu usuário e edite o campo `role` para `"admin"`

### 4. Deploy na Vercel

1. Crie uma conta em https://vercel.com
2. Clique em "New Project"
3. Importe seu repositório do GitHub
4. Configure as variáveis de ambiente
5. Clique em "Deploy"

### 5. Configurar Domínio Personalizado (Opcional)

1. Na Vercel, vá em Settings > Domains
2. Adicione seu domínio
3. Configure os DNS conforme instruído

## 📦 Estrutura do Projeto

```
STUDIOK/
├── app/
│   ├── firebase.ts          # Configuração Firebase client
│   ├── globals.css          # Estilos globais
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Landing page
│   ├── login/               # Página de login
│   ├── cadastro/            # Página de cadastro
│   ├── orcamento/           # Sistema de orçamento
│   ├── dashboard/           # Área do cliente
│   │   ├── page.tsx         # Dashboard principal
│   │   ├── projetos/        # Lista de projetos
│   │   └── mensagens/       # Mensagens
│   ├── admin/               # Painel admin
│   └── checkout/            # Checkout de pagamento
├── components/
│   ├── Navbar.tsx           # Navegação
│   └── Chatbot.tsx          # Chatbot IA
├── contexts/
│   └── AuthContext.tsx      # Context de autenticação
├── lib/
│   ├── firebase-services.ts # Funções Firebase
│   ├── pricing.ts           # Lógica de preços
│   └── automations.ts       # Mensagens automáticas
├── contexts/
│   └── AuthContext.tsx
└── package.json
```

## 🔧 Comandos

```bash
# Instalar dependências
npm install

# Development
npm run dev

# Build
npm run build

# Start production
npm run start
```

## ✨ Funcionalidades Incluídas

- ✅ Landing page moderna e responsiva
- ✅ Sistema de orçamento automático (quiz 5 etapas)
- ✅ Autenticação Firebase (login/cadastro)
- ✅ Chatbot com IA (baseado em regras)
- ✅ Dashboard do cliente com projetos
- ✅ Sistema de mensagens por projeto
- ✅ Upload de arquivos
- ✅ Painel Admin completo
- ✅ Checkout com integração payment (mock)
- ✅ Criação automática de projetos
- ✅ Automações de mensagens
- ✅ Design tech/moderno (dark mode)
- ✅ Totalmente responsivo

## 📝 Notas

- O sistema de pagamento está em modo mock (simulação)
- Para produção, integre com Mercado Pago ou Stripe
- O chatbot usa respostas baseadas em regras
- Para IA avançada, integre com OpenAI API

## 📄 Licença

MIT © 2024 ESTUDIOK