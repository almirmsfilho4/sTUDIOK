# 🎯 Guia Passo a Passo - Configurar Admin no Firebase

## 📋 Pré-requisitos
1. Acesso ao Gmail: almir.msfilho@hotmail.com
2. Projeto Firebase: studiok-saas

## 🔧 Passo 1: Acessar o Firebase Console
1. **Abra o navegador** e vá para: https://console.firebase.google.com/
2. **Faça login** com: almir.msfilho@hotmail.com
3. **Selecione o projeto**: `studiok-saas`

## 🔧 Passo 2: Acessar o Firestore Database
1. No menu lateral esquerdo, clique em **"Firestore Database"**
2. Aguarde carregar a interface do banco de dados

## 🔧 Passo 3: Criar a Collection "users" (se não existir)
1. Se não houver collections, clique em **"Start collection"**
2. No campo "Collection ID", digite: `users`
3. Clique em **"Next"**

## 🔧 Passo 4: Criar o Documento do Admin
1. Clique em **"Add document"**
2. No campo "Document ID", digite EXATAMENTE: `rR8auYyDzeU257qHW4VS60q15Mg2`
3. Clique em **"Next"**

## 🔧 Passo 5: Adicionar os Campos
Adicione os seguintes campos (clique em "Add field" para cada um):

### 📊 Campo 1: uid
- **Field name**: `uid`
- **Type**: `string`  
- **Value**: `rR8auYyDzeU257qHW4VS60q15Mg2`

### 📧 Campo 2: email
- **Field name**: `email`
- **Type**: `string`
- **Value**: `almir.msfilho@hotmail.com`

### 👤 Campo 3: name
- **Field name**: `name`
- **Type**: `string`
- **Value**: `Almir Filho`

### ⚡ Campo 4: role
- **Field name**: `role`
- **Type**: `string`
- **Value**: `admin`

### ⏰ Campo 5: createdAt
- **Field name**: `createdAt`
- **Type**: `timestamp`
- **Value**: Clique no ícone de relógio → "Now"

### 🔄 Campo 6: updatedAt
- **Field name**: `updatedAt`
- **Type**: `timestamp`
- **Value**: Clique no ícone de relógio → "Now"

## 🔧 Passo 6: Salvar e Verificar
1. Clique em **"Save"**
2. Verifique se o documento aparece na lista
3. Confirme que todos os campos estão corretos

## ✅ Verificação Final
O documento deve ter esta estrutura:
```json
{
  "uid": "rR8auYyDzeU257qHW4VS60q15Mg2",
  "email": "almir.msfilho@hotmail.com", 
  "name": "Almir Filho",
  "role": "admin",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 🚀 Testar o Acesso Admin
1. Acesse: https://studiok-saas-kpa00d1cn-almirs-projects-99168cbe.vercel.app
2. Faça login com: almir.msfilho@hotmail.com
3. Acesse: `/admin`
4. Verifique se o painel carrega corretamente

## 🆘 Solução de Problemas

### ❌ Documento não aparece
- Verifique se o ID do documento está exato
- Confirme que está no projeto correto: studiok-saas

### ❌ Acesso negado no painel
- Verifique se o campo "role" é exatamente "admin" (minúsculo)
- Confirme todos os campos obrigatórios

### ❌ Erro de permissão
- As regras de segurança estão funcionando (isso é bom!)
- Siga exatamente os passos acima

## 📞 Suporte
Se encontrar problemas:
1. Verifique print da tela do Firebase Console
2. Confirme os valores dos campos
3. Teste o login após criar o documento

---

## 🎉 PRONTO PARA USAR!
Após seguir esses passos, você terá:
- ✅ Acesso completo ao painel admin
- ✅ Controle total sobre usuários e projetos  
- ✅ Todas as funcionalidades liberadas
- ✅ Sistema 100% operacional