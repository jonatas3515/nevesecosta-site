# 🚀 Guia Completo: Como Hospedar seu Site Grátis

## 🎯 **Melhores Opções Gratuitas para Next.js**

### **1. Vercel (RECOMENDADO) ⭐⭐⭐⭐⭐**

#### **Por que é a melhor opção**:
- ✅ **Criada pela equipe do Next.js**
- ✅ **Deploy automático** do GitHub
- ✅ **Domínio personalizado gratuito**
- ✅ **SSL automático**
- ✅ **CDN global**
- ✅ **Zero configuração**

#### **Como fazer**:

##### **Passo 1: Preparar o código**
```bash
# No seu projeto
git init
git add .
git commit -m "Primeiro commit"
```

##### **Passo 2: Subir para GitHub**
1. ✅ Crie repositório no GitHub: https://github.com/new
2. ✅ Nome sugerido: `nevesecosta-site`
3. ✅ Deixe público ou privado
4. ✅ Execute:
```bash
git remote add origin https://github.com/SEU_USUARIO/nevesecosta-site.git
git branch -M main
git push -u origin main
```

##### **Passo 3: Deploy na Vercel**
1. ✅ Acesse: https://vercel.com
2. ✅ Faça login com GitHub
3. ✅ Clique "New Project"
4. ✅ Selecione seu repositório
5. ✅ Clique "Deploy"
6. ✅ **Pronto!** Site no ar em 2 minutos

##### **Passo 4: Conectar seu domínio**
1. ✅ No painel Vercel → "Domains"
2. ✅ Adicione: `nevesecosta.com.br`
3. ✅ Configure DNS (explicado abaixo)

---

### **2. Netlify ⭐⭐⭐⭐**

#### **Vantagens**:
- ✅ **Formulários gratuitos** (perfeito para contato)
- ✅ **Deploy automático**
- ✅ **Domínio personalizado**
- ✅ **SSL gratuito**

#### **Como fazer**:
1. ✅ Acesse: https://netlify.com
2. ✅ Login com GitHub
3. ✅ "New site from Git"
4. ✅ Selecione repositório
5. ✅ Build command: `npm run build`
6. ✅ Publish directory: `out` ou `.next`
7. ✅ Deploy!

---

### **3. GitHub Pages ⭐⭐⭐**

#### **Limitações**:
- ❌ **Só sites estáticos** (precisa exportar)
- ❌ **Sem server-side features**

#### **Como fazer**:
1. ✅ Adicione no `next.config.js`:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
```

2. ✅ No GitHub → Settings → Pages
3. ✅ Source: "GitHub Actions"
4. ✅ Crie `.github/workflows/deploy.yml`

---

## 🏆 **RECOMENDAÇÃO: Use a Vercel**

### **Por que Vercel é perfeita para você**:
- 🚀 **Next.js nativo**: Zero configuração
- 📧 **Formulários funcionam**: Seu sistema de contato vai funcionar
- 🌐 **Domínio próprio**: Fácil de conectar
- 🔄 **Auto-deploy**: Cada push atualiza o site
- 📊 **Analytics gratuito**: Veja visitantes
- 🔒 **SSL automático**: Site seguro (HTTPS)

## 📋 **Passo a Passo Completo - Vercel**

### **Preparação (5 minutos)**

#### **1. Instalar Git (se não tiver)**:
- Download: https://git-scm.com/download/windows
- Instale com configurações padrão

#### **2. Criar conta GitHub (se não tiver)**:
- Acesse: https://github.com
- Crie conta gratuita

#### **3. Preparar projeto**:
```bash
# No terminal, dentro da pasta do projeto:
cd C:\Users\jhona\CascadeProjects\nevesecosta-site

# Inicializar Git
git init

# Adicionar arquivos
git add .

# Primeiro commit
git commit -m "Site Neves & Costa - versão inicial"
```

### **Upload para GitHub (3 minutos)**

#### **1. Criar repositório**:
- Acesse: https://github.com/new
- Nome: `nevesecosta-site`
- Descrição: "Site oficial do escritório Neves & Costa Advocacia"
- Público ou Privado (sua escolha)
- **NÃO** marque "Add README"
- Clique "Create repository"

#### **2. Conectar e enviar**:
```bash
# Conectar ao GitHub (substitua SEU_USUARIO)
git remote add origin https://github.com/SEU_USUARIO/nevesecosta-site.git

# Enviar código
git branch -M main
git push -u origin main
```

### **Deploy na Vercel (2 minutos)**

#### **1. Criar conta Vercel**:
- Acesse: https://vercel.com
- Clique "Sign Up"
- Escolha "Continue with GitHub"
- Autorize a conexão

#### **2. Fazer deploy**:
- Clique "New Project"
- Encontre `nevesecosta-site`
- Clique "Import"
- **Não mude nada** nas configurações
- Clique "Deploy"
- ⏳ Aguarde 1-2 minutos
- ✅ **Site no ar!**

### **Conectar Domínio (10 minutos)**

#### **1. Na Vercel**:
- Vá no seu projeto
- Clique "Domains"
- Digite: `nevesecosta.com.br`
- Clique "Add"

#### **2. Configurar DNS**:
A Vercel vai mostrar registros DNS para adicionar:

```
Tipo: A
Nome: @
Valor: 76.76.19.61

Tipo: CNAME  
Nome: www
Valor: cname.vercel-dns.com
```

#### **3. No seu provedor de domínio**:
- Acesse painel do seu domínio
- Vá em "DNS" ou "Zona DNS"
- Adicione os registros acima
- Salve as alterações

#### **4. Aguardar propagação**:
- ⏳ **Tempo**: 5 minutos a 24 horas
- 🔍 **Teste**: Acesse seu domínio
- ✅ **Funcionando**: Site aparece com SSL

## 🔄 **Workflow Futuro**

### **Para atualizar o site**:
```bash
# Fazer alterações no código
# Salvar arquivos

# Enviar atualizações
git add .
git commit -m "Descrição da alteração"
git push

# ✅ Site atualiza automaticamente em 1-2 minutos!
```

### **Para adicionar novo post no blog**:
1. ✅ Edite `src/data/blogPosts.ts`
2. ✅ Adicione novo post
3. ✅ Salve arquivo
4. ✅ Execute:
```bash
git add .
git commit -m "Novo post: [título do post]"
git push
```
5. ✅ **Post online em 2 minutos!**

## 💰 **Custos**

### **Vercel - Plano Hobby (Gratuito)**:
- ✅ **Sites ilimitados**
- ✅ **100GB bandwidth/mês**
- ✅ **Domínio personalizado**
- ✅ **SSL automático**
- ✅ **Suficiente para 99% dos sites**

### **Quando pagar**:
- 📈 **Mais de 100GB/mês**: $20/mês (muito tráfego)
- 👥 **Equipe**: $20/mês (múltiplos usuários)
- 🚀 **Recursos avançados**: Analytics, etc.

## 🆘 **Resolução de Problemas**

### **Erro: "Command not found: git"**
```bash
# Instalar Git:
# https://git-scm.com/download/windows
# Reiniciar terminal após instalação
```

### **Erro: "Permission denied"**
```bash
# Configurar Git:
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```

### **Erro: "Build failed"**
```bash
# Verificar se o projeto roda local:
npm run build

# Se der erro, corrigir antes do deploy
```

### **Domínio não funciona**:
- ⏳ **Aguardar**: DNS pode demorar até 24h
- 🔍 **Verificar**: Registros DNS estão corretos
- 📞 **Contatar**: Suporte do provedor de domínio

## 📱 **Alternativas Rápidas**

### **Se tiver pressa**:

#### **Opção 1: Vercel CLI**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy direto
vercel

# Seguir instruções
```

#### **Opção 2: Drag & Drop**
1. ✅ Execute: `npm run build`
2. ✅ Compacte pasta `.next` em ZIP
3. ✅ Acesse: https://netlify.com
4. ✅ Arraste ZIP para a página
5. ✅ **Site no ar!**

## ✅ **Checklist Final**

### **Antes do Deploy**:
- [ ] Site funciona local (`npm run dev`)
- [ ] Todos os links funcionam
- [ ] Imagens carregam
- [ ] Formulário de contato testado
- [ ] Blog posts aparecem

### **Após Deploy**:
- [ ] Site abre no domínio
- [ ] SSL funcionando (HTTPS)
- [ ] Formulários funcionam
- [ ] Mobile responsivo
- [ ] Velocidade boa

### **Configurações Extras**:
- [ ] Google Analytics
- [ ] Google Search Console
- [ ] Favicon configurado
- [ ] Meta tags SEO

---

## 🎯 **Resumo Executivo**

### **Melhor opção**: Vercel
### **Tempo total**: 20 minutos
### **Custo**: R$ 0,00
### **Resultado**: Site profissional no ar

### **Próximos passos**:
1. 🔧 **Configurar EmailJS** (para formulário funcionar)
2. 📊 **Adicionar Analytics**
3. 📝 **Criar mais posts**
4. 🚀 **Divulgar o site**

**Seu site estará no ar, profissional e gratuito!** ✨
