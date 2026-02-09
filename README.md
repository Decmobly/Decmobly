# Decmobly - Marcenaria em Manaus 🪚✨

Este é o repositório do ecossistema digital da **Decmobly**, uma marcenaria especializada em projetos sob medida em Manaus/AM. O projeto engloba um site institucional de alto padrão para os clientes e um Painel Administrativo robusto para a gestão de conteúdo.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando as tecnologias mais modernas do mercado para garantir performance e escalabilidade:

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
- **Banco de Dados:** [Supabase](https://supabase.com/) (PostgreSQL)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autenticação:** [NextAuth.js](https://next-auth.js.org/)
- **Armazenamento de Imagens:** [Vercel Blob](https://vercel.com/storage/blob)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) / [Shadcn/ui](https://ui.shadcn.com/)

## 🛠️ Funcionalidades

### Site Público (Vitrine)
- **Portfólio Dinâmico:** Galeria de projetos realizados com filtros por categoria (Cozinhas, Quartos, Escritórios, etc.).
- **Vitrine de Projetos:** Destaque para os trabalhos mais recentes e luxuosos.
- **Área de Contato:** Integração para leads via formulário ou redirecionamento para WhatsApp.
- **SEO Local:** Otimizado para buscas em Manaus e região.

### Painel Gestor (Dashboard Administrativo)
- **Gestão de Projetos:** CRUD completo para adicionar, editar e remover projetos do portfólio.
- **Upload de Imagens:** Integração direta com Vercel Blob para fotos em alta resolução.
- **Autenticação Segura:** Acesso restrito via NextAuth para a equipe da Decmobly gerenciar o conteúdo.

## 🗄️ Estrutura do Banco de Dados (Prisma Schema)

O modelo de dados foi desenhado para suportar o crescimento do portfólio e a gestão segura dos acessos.

### Modelos Principais:

- **User**: Armazena as credenciais dos administradores para acesso ao Painel Gestor (NextAuth).
- **Project**: Contém as informações de cada projeto da marcenaria (Título, descrição, categoria).
- **Image**: Tabela relacionada aos projetos para permitir que um único projeto tenha múltiplas fotos (Galeria), utilizando os URLs gerados pelo Vercel Blob.
- **Category**: Permite organizar os projetos (ex: "Cozinhas", "Dormitórios", "Áreas Gourmet").

## 📦 Como rodar o projeto

1. **Instale as dependências:**
   ```bash
   npm intall
2. **Configure as variáveis de ambiente (.env): Crie um arquivo .env na raiz do projeto e adicione as chaves necessárias:**
   ```bash
   DATABASE_URL="url_do_supabase"
   NEXTAUTH_SECRET="secret_key"
   BLOB_READ_WRITE_TOKEN="token_vercel_blob"
3. **Execute as migrações do Prisma:**
   ```bash
   npx prisma migrate dev
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
## Estrutura de Pastas

- **/app: Rotas e páginas da aplicação.**
- **/components: Componentes reutilizáveis (UI e Business).**
- **/lib: Configurações de bibliotecas (Prisma client, Supabase, etc).**
- **/prisma: Esquema do banco de dados e migrações.**
#

**Desenvolvido por Gustavo Levenhagen | [LEV BRANDS](https://levbrands.com.br/)**
