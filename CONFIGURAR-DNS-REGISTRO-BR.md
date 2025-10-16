# 🌐 Como Configurar DNS no Registro.br

## 📋 **O que a Vercel está pedindo:**

### **Registro mostrado na imagem:**
```
Tipo: UM (equivale ao A)
Nome: @ 
Valor: 216.198.79.1
```

## 🔧 **Passo a Passo no Registro.br**

### **1. Acessar Painel do Registro.br**
1. ✅ Acesse: **https://registro.br**
2. ✅ Clique **"Entrar"**
3. ✅ Faça login com suas credenciais
4. ✅ Selecione o domínio **nevesecosta.com.br**

### **2. Ir para Configuração DNS**
1. ✅ No painel do domínio
2. ✅ Procure por **"DNS"** ou **"Zona DNS"**
3. ✅ Clique em **"Gerenciar DNS"** ou **"Editar Zona"**

### **3. Adicionar Registro A**
1. ✅ Clique **"Adicionar Registro"** ou **"Novo Registro"**
2. ✅ **Tipo**: Selecione **"A"**
3. ✅ **Nome/Host**: Digite **@** (ou deixe vazio)
4. ✅ **Valor/IP**: Digite **216.198.79.1**
5. ✅ **TTL**: Deixe padrão (3600 ou 1h)
6. ✅ Clique **"Salvar"** ou **"Adicionar"**

### **4. Adicionar Registro CNAME para WWW**
1. ✅ Clique **"Adicionar Registro"** novamente
2. ✅ **Tipo**: Selecione **"CNAME"**
3. ✅ **Nome/Host**: Digite **www**
4. ✅ **Valor/Destino**: Digite **cname.vercel-dns.com**
5. ✅ **TTL**: Deixe padrão
6. ✅ Clique **"Salvar"**

## 📋 **Resumo dos Registros a Adicionar**

### **Registro 1 - Domínio Principal:**
```
Tipo: A
Nome: @ (ou vazio)
Valor: 216.198.79.1
TTL: 3600
```

### **Registro 2 - Subdomínio WWW:**
```
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
TTL: 3600
```

## 🖥️ **Interface do Registro.br**

### **O que procurar no painel:**
- 🔍 **"Zona DNS"**
- 🔍 **"Gerenciar DNS"**
- 🔍 **"Configurações DNS"**
- 🔍 **"Editar Registros"**

### **Campos comuns:**
- **Host/Nome**: Onde coloca @ ou www
- **Tipo**: A, CNAME, MX, etc.
- **Valor/Destino**: IP ou domínio
- **TTL**: Tempo de cache (deixe padrão)

## ⏰ **Tempo de Propagação**

### **Após salvar:**
- ⏳ **Mínimo**: 5-15 minutos
- ⏳ **Normal**: 1-4 horas
- ⏳ **Máximo**: 24-48 horas

### **Como testar:**
1. ✅ Aguarde 15 minutos
2. ✅ Acesse: **https://nevesecosta.com.br**
3. ✅ Se não funcionar, aguarde mais tempo

## 🔍 **Verificar se Funcionou**

### **Ferramentas de teste:**
1. ✅ **DNS Checker**: https://dnschecker.org
2. ✅ Digite: **nevesecosta.com.br**
3. ✅ Deve mostrar IP: **216.198.79.1**

### **Teste direto:**
1. ✅ Abra **cmd** (Windows + R → cmd)
2. ✅ Digite: **nslookup nevesecosta.com.br**
3. ✅ Deve retornar: **216.198.79.1**

## ❌ **Problemas Comuns**

### **"Não encontro onde configurar DNS"**
- Procure por: "Zona DNS", "Gerenciar DNS", "Configurações"
- Alguns provedores têm em "Serviços Adicionais"

### **"Registro já existe"**
- Delete o registro antigo primeiro
- Ou edite o existente com os novos valores

### **"Erro de formato"**
- Nome: Use apenas **@** (não nevesecosta.com.br)
- Valor: Use apenas o IP **216.198.79.1**

## 📞 **Se não conseguir encontrar:**

### **Informações para suporte Registro.br:**
- **Domínio**: nevesecosta.com.br
- **Preciso**: Configurar registros DNS
- **Tipo A**: @ → 216.198.79.1
- **Tipo CNAME**: www → cname.vercel-dns.com

### **Telefone Registro.br:**
- **Suporte**: 0800 771 2525
- **Horário**: Segunda a sexta, 8h às 18h

## 🎯 **Checklist**

### **No Registro.br:**
- [ ] Acessei o painel
- [ ] Encontrei configuração DNS
- [ ] Adicionei registro A (@ → 216.198.79.1)
- [ ] Adicionei registro CNAME (www → cname.vercel-dns.com)
- [ ] Salvei as alterações

### **Teste:**
- [ ] Aguardei 15 minutos
- [ ] Testei https://nevesecosta.com.br
- [ ] Testei https://www.nevesecosta.com.br
- [ ] Site carrega com SSL (cadeado verde)

## 🚀 **Após Configurar**

### **Volte na Vercel:**
1. ✅ Acesse seu projeto na Vercel
2. ✅ Vá em **"Domains"**
3. ✅ Deve mostrar **"Valid Configuration"** ✅
4. ✅ **Certificado SSL** será gerado automaticamente

---

**Me avise quando conseguir acessar a configuração DNS no Registro.br, ou se precisar de ajuda para encontrar onde fica!** 🌐
