# 🔧 Passo a Passo SUPER Detalhado - Preparar o Código

## 📋 **O que você precisa fazer ANTES de tudo**

### **1. Instalar Git no Windows**

#### **O que é Git?**
- É um programa que "versiona" seu código
- Permite enviar código para GitHub
- **OBRIGATÓRIO** para fazer deploy

#### **Como instalar:**

##### **Passo 1.1: Baixar Git**
1. ✅ Abra seu navegador
2. ✅ Acesse: **https://git-scm.com/download/windows**
3. ✅ Clique no botão **"64-bit Git for Windows Setup"**
4. ✅ Aguarde download (arquivo ~50MB)

##### **Passo 1.2: Instalar Git**
1. ✅ Vá na pasta **Downloads**
2. ✅ Clique duas vezes no arquivo **Git-2.xx.x-64-bit.exe**
3. ✅ Clique **"Sim"** (permissão de administrador)
4. ✅ **IMPORTANTE**: Clique **"Next"** em TODAS as telas
   - Não mude nenhuma configuração
   - Use as opções padrão
5. ✅ Na última tela, clique **"Install"**
6. ✅ Aguarde instalação (2-3 minutos)
7. ✅ Clique **"Finish"**

##### **Passo 1.3: Verificar se instalou**
1. ✅ Pressione **Windows + R**
2. ✅ Digite: **cmd**
3. ✅ Pressione **Enter**
4. ✅ No terminal preto, digite: **git --version**
5. ✅ Pressione **Enter**
6. ✅ **Deve aparecer**: `git version 2.xx.x`

**Se aparecer a versão = Git instalado com sucesso!** ✅

---

## 🖥️ **2. Abrir Terminal na Pasta do Projeto**

### **Método 1: Pelo Windows Explorer (MAIS FÁCIL)**

#### **Passo 2.1: Navegar até a pasta**
1. ✅ Abra o **Windows Explorer** (pasta amarela na barra)
2. ✅ Navegue até: **C:\Users\jhona\CascadeProjects\nevesecosta-site**
3. ✅ **Certifique-se** que está na pasta correta
   - Deve ver arquivos como: `package.json`, `src`, `public`, etc.

#### **Passo 2.2: Abrir terminal na pasta**
1. ✅ **Clique na barra de endereço** (onde está escrito o caminho)
2. ✅ **Apague tudo** e digite: **cmd**
3. ✅ Pressione **Enter**
4. ✅ **Terminal abre** já na pasta correta!

### **Método 2: Pelo Menu Iniciar**
1. ✅ Pressione **Windows + R**
2. ✅ Digite: **cmd**
3. ✅ Pressione **Enter**
4. ✅ Digite: **cd C:\Users\jhona\CascadeProjects\nevesecosta-site**
5. ✅ Pressione **Enter**

### **Como saber se está na pasta certa?**
- Digite: **dir**
- Pressione **Enter**
- **Deve listar**: package.json, src, public, etc.

---

## 🚀 **3. Executar Comandos Git**

### **Agora que o terminal está aberto na pasta correta:**

#### **Comando 1: Inicializar Git**
```bash
git init
```
1. ✅ Digite exatamente: **git init**
2. ✅ Pressione **Enter**
3. ✅ **Deve aparecer**: `Initialized empty Git repository`

#### **Comando 2: Configurar Git (PRIMEIRA VEZ)**
```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu@email.com"
```
1. ✅ Digite: **git config --global user.name "Jonatas Costa"**
2. ✅ Pressione **Enter**
3. ✅ Digite: **git config --global user.email "contato@nevesecosta.com.br"**
4. ✅ Pressione **Enter**

#### **Comando 3: Adicionar arquivos**
```bash
git add .
```
1. ✅ Digite exatamente: **git add .**
2. ✅ Pressione **Enter**
3. ✅ **Aguarde** (pode demorar 10-30 segundos)
4. ✅ **Não deve aparecer erro**

#### **Comando 4: Fazer commit**
```bash
git commit -m "Site Neves & Costa - versão inicial"
```
1. ✅ Digite exatamente: **git commit -m "Site Neves & Costa - versão inicial"**
2. ✅ Pressione **Enter**
3. ✅ **Deve aparecer**: várias linhas com arquivos adicionados

---

## 📸 **Screenshots do que você deve ver**

### **Terminal após git init:**
```
C:\Users\jhona\CascadeProjects\nevesecosta-site>git init
Initialized empty Git repository in C:/Users/jhona/CascadeProjects/nevesecosta-site/.git/
```

### **Terminal após git add .:**
```
C:\Users\jhona\CascadeProjects\nevesecosta-site>git add .
(sem mensagem = sucesso)
```

### **Terminal após git commit:**
```
C:\Users\jhona\CascadeProjects\nevesecosta-site>git commit -m "Site Neves & Costa - versão inicial"
[main (root-commit) abc1234] Site Neves & Costa - versão inicial
 50 files changed, 2000 insertions(+)
 create mode 100644 package.json
 create mode 100644 src/app/page.tsx
 ...
```

---

## ❌ **Possíveis Erros e Soluções**

### **Erro: "git não é reconhecido"**
```
'git' não é reconhecido como um comando interno ou externo
```
**Solução:**
- Git não está instalado
- Volte ao **Passo 1** e instale o Git
- Feche e abra o terminal novamente

### **Erro: "fatal: not a git repository"**
```
fatal: not a git repository (or any of the parent directories): .git
```
**Solução:**
- Você não está na pasta correta
- Navegue até: `C:\Users\jhona\CascadeProjects\nevesecosta-site`
- Execute `git init` primeiro

### **Erro: "Please tell me who you are"**
```
Please tell me who you are.
Run
  git config --global user.email "you@example.com"
  git config --global user.name "Your Name"
```
**Solução:**
- Execute os comandos de configuração do **Passo 3**

### **Erro: "nothing to commit"**
```
nothing to commit, working tree clean
```
**Solução:**
- Isso é normal se você já fez commit antes
- Pule para o próximo passo

---

## 🎯 **Checklist - Você completou o Passo 1 quando:**

- [ ] Git instalado (comando `git --version` funciona)
- [ ] Terminal aberto na pasta do projeto
- [ ] Comando `git init` executado com sucesso
- [ ] Comando `git add .` executado sem erro
- [ ] Comando `git commit` executado com sucesso
- [ ] Viu mensagem com arquivos adicionados

---

## 📞 **Se ainda não conseguir**

### **Me diga exatamente:**
1. **Qual passo travou?** (instalação Git, abrir terminal, etc.)
2. **Qual erro apareceu?** (copie a mensagem exata)
3. **O que você vê na tela?** (descreva)

### **Informações úteis:**
- **Sistema**: Windows
- **Pasta do projeto**: `C:\Users\jhona\CascadeProjects\nevesecosta-site`
- **Objetivo**: Preparar código para enviar ao GitHub

---

## 🚀 **Próximo Passo (após completar este)**

### **Depois que conseguir fazer todos os comandos Git:**
1. ✅ **Criar repositório no GitHub**
2. ✅ **Conectar projeto ao GitHub**
3. ✅ **Enviar código**
4. ✅ **Deploy na Vercel**

**Mas primeiro, vamos resolver este Passo 1!** 💪

---

## 🎬 **Resumo Visual do que fazer:**

```
1. Baixar Git → Instalar → Reiniciar terminal
2. Windows Explorer → Navegar para pasta → Clicar na barra → Digite "cmd"
3. Terminal abre → Digite comandos um por um
4. Sucesso = código preparado para GitHub!
```

**Tente seguir este guia e me diga onde travou!** 🔧
