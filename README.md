# 🏛️ Neves & Costa Advocacia - Site Moderno

**"Do Seu Direito, A Gente Cuida"**

Site moderno e completo para o escritório de advocacia Neves & Costa, desenvolvido com as melhores tecnologias do mercado. Advocacia 100% digital do Extremo Sul da Bahia para todo o Brasil.

## ✨ Funcionalidades

### 🎯 Principais Recursos

- **Design Moderno e Responsivo**: Interface elegante que se adapta perfeitamente a todos os dispositivos
- **Blog Integrado com Sistema de Comentários**: Publique artigos jurídicos e permita interação com os leitores
- **Sistema de Avaliações de Clientes**: Colete e exiba feedback dos clientes de forma profissional
- **Áreas de Atuação**: Apresentação clara e organizada das especialidades do escritório
- **Formulário de Contato**: Captura de leads com formulário intuitivo
- **Navegação Suave**: Experiência de usuário fluida com scroll suave e animações

### 📄 Páginas

1. **Home** (`/`)
   - Hero section impactante com estatísticas
   - Seção "Sobre o Escritório"
   - Áreas de Atuação com ícones modernos
   - Sistema de Avaliações interativo
   - Formulário de Contato completo

2. **Blog** (`/blog`)
   - Listagem de artigos jurídicos
   - Filtro por categorias
   - Cards com preview dos artigos

3. **Post do Blog** (`/blog/[slug]`)
   - Artigo completo com formatação rica
   - Sistema de comentários
   - Possibilidade de responder comentários
   - Compartilhamento de conhecimento

## 🛠️ Tecnologias Utilizadas

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática para maior segurança
- **Tailwind CSS** - Estilização moderna e responsiva
- **Lucide React** - Ícones modernos e consistentes
- **React Hooks** - Gerenciamento de estado eficiente

## 🚀 Como Executar o Projeto

### Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn

### Instalação

1. **Clone ou navegue até o diretório do projeto**
   ```bash
   cd C:\Users\jhona\CascadeProjects\nevesecosta-site
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

4. **Abra o navegador**
   ```
   http://localhost:3000
   ```

### Scripts Disponíveis

```bash
npm run dev      # Inicia o servidor de desenvolvimento
npm run build    # Cria a build de produção
npm start        # Inicia o servidor de produção
npm run lint     # Executa o linter
```

## 📁 Estrutura do Projeto

```
nevesecosta-site/
├── src/
│   ├── app/
│   │   ├── blog/
│   │   │   ├── [slug]/
│   │   │   │   └── page.tsx      # Página individual do post
│   │   │   └── page.tsx          # Listagem do blog
│   │   ├── layout.tsx            # Layout principal
│   │   ├── page.tsx              # Página inicial
│   │   └── globals.css           # Estilos globais
│   ├── components/
│   │   ├── Header.tsx            # Cabeçalho com navegação
│   │   ├── Footer.tsx            # Rodapé
│   │   ├── Hero.tsx              # Seção hero
│   │   ├── About.tsx             # Sobre o escritório
│   │   ├── PracticeAreas.tsx    # Áreas de atuação
│   │   ├── Reviews.tsx           # Sistema de avaliações
│   │   └── Contact.tsx           # Formulário de contato
│   ├── data/
│   │   └── blogPosts.ts          # Dados dos posts do blog
│   └── lib/
│       └── utils.ts              # Funções utilitárias
├── public/                       # Arquivos estáticos
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## 🎨 Personalização

### Cores

As cores principais podem ser alteradas em `tailwind.config.ts`:

```typescript
colors: {
  primary: { ... },  // Azul principal
  gold: { ... },     // Dourado/amarelo
}
```

### Conteúdo

1. **Informações do Escritório**: Edite os componentes em `src/components/`
2. **Posts do Blog**: Adicione/edite em `src/data/blogPosts.ts`
3. **Áreas de Atuação**: Modifique o array em `src/components/PracticeAreas.tsx`
4. **Avaliações**: Edite os dados iniciais em `src/components/Reviews.tsx`

### Imagens

- As imagens atualmente usam placeholders do Unsplash
- Substitua as URLs pelas suas próprias imagens
- Adicione imagens em `public/` e referencie como `/nome-da-imagem.jpg`

## 🔧 Próximos Passos para Produção

### Backend e Banco de Dados

Para tornar o site totalmente funcional em produção, você precisará:

1. **Integrar com um Backend**
   - API para salvar comentários do blog
   - API para salvar avaliações de clientes
   - API para processar formulário de contato

2. **Banco de Dados**
   - Sugestões: PostgreSQL, MongoDB, Supabase, Firebase
   - Armazene posts, comentários, avaliações e mensagens de contato

3. **Sistema de Email**
   - Integre com serviços como SendGrid, Mailgun ou AWS SES
   - Envie notificações de novos contatos

4. **CMS (Opcional)**
   - Considere integrar com Strapi, Sanity ou Contentful
   - Facilita a gestão de conteúdo sem código

### SEO e Performance

1. **Otimização de Imagens**
   - Use o componente `Image` do Next.js
   - Comprima imagens antes do upload

2. **Meta Tags**
   - Adicione meta tags específicas para cada página
   - Configure Open Graph para compartilhamento em redes sociais

3. **Analytics**
   - Integre Google Analytics ou similar
   - Monitore o comportamento dos visitantes

### Deploy

Opções recomendadas:

1. **Vercel** (Recomendado para Next.js)
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
3. **AWS Amplify**
4. **DigitalOcean App Platform**

## 📝 Licença

Este projeto foi desenvolvido para uso do escritório Neves & Costa Advocacia.

## 🤝 Suporte

Para dúvidas ou suporte, entre em contato através do email: contato@nevesecosta.com.br

---

**Desenvolvido com ❤️ para Neves & Costa Advocacia**
