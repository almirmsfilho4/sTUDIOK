# Guia Visual - Configuração do Admin no Firebase

## Passo 1: Acessar o Firebase Console
1. Vá para: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Selecione o projeto **"studiok-saas"**

## Passo 2: Acessar o Firestore Database
1. No menu lateral esquerdo, clique em **"Firestore Database"**
2. Aguarde carregar a interface do banco de dados

## Passo 3: Criar a Collection "users"
1. Clique no botão **"Start collection"**
2. No campo "Collection ID", digite: `users`
3. Clique em **"Next"**

## Passo 4: Criar o Documento do Admin
1. No campo "Document ID", digite: `rR8auYyDzeU257qHW4VS60q15Mg2`
2. Adicione os seguintes campos:

| Campo | Tipo | Valor |
|-------|------|--------|
| uid | string | rR8auYyDzeU257qHW4VS60q15Mg2 |
| email | string | almir.msfilho@hotmail.com |
| name | string | Almir Filho |
| role | string | admin |
| createdAt | timestamp | Clique no ícone de relógio → "Now" |
| updatedAt | timestamp | Clique no ícone de relógio → "Now" |

3. Clique em **"Save"**

## Passo 5: Verificar a Criação
1. Você deve ver o documento na lista
2. O documento deve ter os campos configurados
3. O campo "role" deve ser "admin"

## Passo 6: Testar no Sistema
1. Acesse: https://studiok-saas-n6nbb2ymh-almirs-projects-99168cbe.vercel.app
2. Faça login com: almir.msfilho@hotmail.com
3. Acesse: /admin
4. Verifique se o painel admin carrega corretamente

## 📸 Imagem de Referência

Após criar, deve aparecer assim na lista:

```
users/ ─┬─ rR8auYyDzeU257qHW4VS60q15Mg2
        └─ (outros usuários...)
```

## ⚠️ Importante

- Certifique-se que o **ID do documento** está EXATAMENTE: `rR8auYyDzeU257qHW4VS60q15Mg2`
- O campo **role** deve ser exatamente `admin` (minúsculo)
- Use timestamps atuais para `createdAt` e `updatedAt`

## 🆘 Em Caso de Dúvidas

Se encontrar problemas:
1. Verifique se está no projeto correto: "studiok-saas"
2. Confirme que o ID do documento está exato
3. Verifique se todos os campos foram preenchidos
4. Teste o login após criar o documento