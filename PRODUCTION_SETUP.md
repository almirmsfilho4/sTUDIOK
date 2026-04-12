# 🚀 Configuração de Produção - ESTUDIOK

## ✅ Status Atual

### ✅ Concluído
- **Firebase Project**: `studiok-saas` ✅
- **Firebase Rules**: Implantadas ✅
- **Vercel Deploy**: https://studiok-saas-n6nbb2ymh-almirs-projects-99168cbe.vercel.app ✅
- **Variáveis de Ambiente**: Configuradas ✅

### 🔄 Pendente
- **Mercado Pago**: Chaves reais necessárias
- **Resend Email**: API Key real necessária
- **Firebase Auth**: Habilitar Email/Password
- **Firebase Storage**: Configurar
- **Primeiro Usuário Admin**: Configurar

## 🔧 Variáveis Configuradas

### Firebase (Configuradas)
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDkY37OLdt9W8vBdWcQi1Ivz0Tn_FaA2B4
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=studiok-saas.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=studiok-saas
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=134175965723
NEXT_PUBLIC_FIREBASE_APP_ID=1:134175965723:web:c1bcf1de6cc7abb1416ebe
```

### Mercado Pago (Placeholders)
```env
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MERCADOPAGO_ACCESS_TOKEN=TEST-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
MERCADOPAGO_WEBHOOK_SECRET=your_webhook_secret_here
```

### Email (Placeholders)
```env
RESEND_API_KEY=re_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_SUPPORT_EMAIL=support@estudiok.com
```

## 🚀 Próximos Passos Críticos

### 1. Configurar Firebase Console
1. Acesse: https://console.firebase.google.com/project/studiok-saas/overview
2. **Authentication** → Habilitar Email/Password
3. **Firestore Database** → Verificar se está ativo
4. **Storage** → Configurar regras e habilitar

### 2. Configurar Mercado Pago
1. Acesse: https://www.mercadopago.com.br/developers
2. Criar aplicação
3. Obter chaves reais:
   - Public Key: `APP_USR-...`
   - Access Token: `APP_USR-...`
   - Webhook Secret
4. Atualizar variáveis no Vercel

### 3. Configurar Resend
1. Acesse: https://resend.com
2. Criar conta
3. Obter API Key real
4. Configurar domínio de email
5. Atualizar variável no Vercel

### 4. Primeiro Usuário Admin
1. Acessar: https://studiok-saas-n6nbb2ymh-almirs-projects-99168cbe.vercel.app
2. Fazer cadastro com: `almir.msfilho@hotmail.com`
3. No Firestore: Editar `users/{userId} → role: "admin"`

## 🔗 URLs Importantes

- **Produção**: https://studiok-saas-n6nbb2ymh-almirs-projects-99168cbe.vercel.app
- **Firebase Console**: https://console.firebase.google.com/project/studiok-saas/overview
- **Vercel Dashboard**: https://vercel.com/almirs-projects-99168cbe/studiok-saas
- **Mercado Pago**: https://www.mercadopago.com.br/developers
- **Resend**: https://resend.com

## 🛠️ Comandos Úteis

### Verificar Variáveis
```bash
vercel env ls
```

### Atualizar Variável
```bash
vercel env rm NOME_DA_VARIAVEL --yes
vercel env add NOME_DA_VARIAVEL production --value "novo_valor"
```

### Novo Deploy
```bash
vercel --prod
```

### Firebase Rules
```bash
firebase deploy --only firestore:rules
```

## 🎯 Testes de Verificação

1. **✅ Aplicação**: Carrega sem erros
2. **✅ Firebase**: Conexão estabelecida
3. **🔴 Auth**: Configurar Email/Password
4. **🔴 Pagamentos**: Configurar Mercado Pago
5. **🔴 Email**: Configurar Resend
6. **🔴 Admin**: Promover primeiro usuário

## 📞 Suporte

Para issues técnicas:
- Firebase: https://firebase.google.com/support
- Vercel: https://vercel.com/support
- Mercado Pago: https://www.mercadopago.com.br/developers/es/support

---

**✨ A plataforma está 80% configurada!**

Complete os serviços externos e comece a operar! 🚀