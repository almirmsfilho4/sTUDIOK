# 🚀 Guia de Deploy - ESTUDIOK

## ✅ Deploy Realizado com Sucesso

**URL de Produção:** https://studiok-saas-thdwkscyq-almirs-projects-99168cbe.vercel.app

## 🔧 Variáveis de Ambiente Necessárias

### Firebase Configuration
```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studiok-saas.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studiok-saas
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=134175965723
NEXT_PUBLIC_FIREBASE_APP_ID=1:134175965723:web:c1bcf1de6cc7abb1416ebe
```

### Mercado Pago Configuration
```bash
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
MERCADOPAGO_ACCESS_TOKEN=APP_USR-XXXXXXXXXXXXXX-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret_here
```

### Email Service (Resend)
```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SUPPORT_EMAIL=support@estudiok.com
```

### Analytics
```bash
NEXT_PUBLIC_GA4_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=XXXXXXXXXXXXXXX
```

## 📋 Passos para Configuração Completa

### 1. Configurar Firebase Console
1. Acesse: https://console.firebase.google.com/project/studiok-saas/overview
2. Habilite Authentication → Email/Password
3. Configure Firestore Database
4. Configure Storage
5. As regras de segurança já foram implantadas

### 2. Configurar Mercado Pago
1. Acesse: https://www.mercadopago.com.br/developers
2. Crie aplicação
3. Obtenha as chaves Public Key e Access Token
4. Configure webhooks

### 3. Configurar Resend (Email)
1. Acesse: https://resend.com
2. Crie conta e obtenha API Key
3. Configure domínio de email

### 4. Adicionar Variáveis no Vercel
```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID
vercel env add NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY
vercel env add MERCADOPAGO_ACCESS_TOKEN
vercel env add MERCADOPAGO_WEBHOOK_SECRET
vercel env add RESEND_API_KEY
```

### 5. Primeiro Usuário Admin
1. Faça signup com: almir.msfilho@hotmail.com
2. No Firestore, edite manualmente: `users/{userId} → role: "admin"`

## 🌐 URLs Importantes
- **Produção:** https://studiok-saas-thdwkscyq-almirs-projects-99168cbe.vercel.app
- **Firebase Console:** https://console.firebase.google.com/project/studiok-saas/overview
- **Vercel Dashboard:** https://vercel.com/almirs-projects-99168cbe/studiok-saas

## 📊 Status do Deploy
- ✅ Firebase Rules: Implantadas
- ✅ Vercel Deploy: Em andamento
- 🔄 Variáveis de Ambiente: Pendentes
- 🔄 Serviços Externos: Pendentes

## 🚨 Troubleshooting

### Erro de Build
Se o build falhar, verifique:
1. Todas as variáveis de ambiente estão configuradas
2. Firebase Project está configurado corretamente
3. Dependências instaladas: `npm install`

### Erro de Runtime
Se a aplicação não funcionar:
1. Verifique console do navegador para erros
2. Confirme configuração do Firebase
3. Teste conexão com APIs externas

## 📞 Suporte
Para issues técnicos, abra ticket em: https://github.com/anomalyco/opencode/issues

---

**✨ A plataforma ESTUDIOK está pronta para produção!**

Configure os serviços externos e comece a receber clientes! 🎯