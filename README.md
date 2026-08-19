# Gerenciamento de Usuários (Full Stack)

![React](https://img.shields.io/badge/React-19.2-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Vite](https://img.shields.io/badge/Vite-6.4-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-cyan)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-style-black)
![Node.js](https://img.shields.io/badge/Node.js-22-green)
![Express](https://img.shields.io/badge/Express-4.21-green)
![Prisma](https://img.shields.io/badge/Prisma-6.9-gray)
![SQLite](https://img.shields.io/badge/SQLite-local-yellow)

## Descrição

Aplicação web **Full Stack integrada** para cadastro, gerenciamento de usuários, agendamento de atividades e controle administrativo. A pessoa administradora faz login com autenticação JWT real e acessa um ecossistema completo:
- **Dashboard Moderno:** Busca em tempo real com debounce, filtros por status, ordenação dinâmica por colunas, paginação, visualização detalhada, cadastro, edição e exclusão de usuários.
- **Calendário Interativo de Atividades:** Navegação mensal, seleção de datas, visualização de compromissos por dia, criação, edição, alteração de status e exclusão de atividades sincronizadas com o banco SQLite.
- **Sistema de Notificações:** Alertas contextuais sobre atividades do dia, prioridades pendentes e status do sistema com controle de lidas/não lidas.
- **Perfil do Administrador:** Visualização de dados de acesso, atualização de nome/e-mail e alteração segura de senha.
- **Configurações:** Controle de tema (claro/escuro), idioma e preferências de alertas.

## Contexto Acadêmico

**Autora:** Lettícia Sabino  
**Curso:** Desenvolvimento Web Full Stack – Escola Avanti  
**Projeto:** Projeto Individual DFS-2026.2  
**Tema:** Cadastro e Gerenciamento de Usuários

## Funcionalidades

### 1. Autenticação Real com JWT
- Login com validação de credenciais via Zod e React Hook Form.
- Sessão baseada em token JWT persistido com expiração configurada.
- Rotas protegidas no frontend (`ProtectedRoute`) e no backend (`authenticate` middleware).
- Logout no menu de perfil, na barra lateral e nas configurações.

### 2. Gerenciamento de Usuários (CRUD Completo)
- **Barra de busca com debounce:** Busca em tempo real por nome ou e-mail.
- **Filtros por status:** Seleção dinâmica entre Todos, Ativo e Inativo.
- **Tabela responsiva:** Seleção individual e em massa, avatares dinâmicos com iniciais e badges.
- **Modal de Detalhes:** Visualização completa de endereço, telefone, datas e timestamps.
- **Cadastro e Edição:** Validação rigorosa em tempo real (Zod + React Hook Form).
- **Exclusão Segura:** Diálogo de confirmação individual e em lote.

### 3. Calendário Interativo de Atividades
- **Navegação Mensal:** Botões de próximo/anterior e atalho para o dia atual ("Hoje").
- **Identificação Visual:** Marcadores coloridos por prioridade (Alta, Média, Baixa) e status (Pendente, Concluído).
- **Gestão Diária:** Painel lateral exibindo atividades da data selecionada com toggle de conclusão rápida.
- **CRUD de Atividades:** Agendamento, alteração de horários/descrição e exclusão com diálogo de confirmação.

### 4. Sistema de Notificações
- Menu drop-down no Header com contador de não lidas e badge animado.
- Alertas gerados a partir das atividades do dia e itens de alta prioridade.
- Ações para marcar individualmente como lida, marcar todas e link direto para o calendário.

### 5. Perfil e Configurações
- Visualização do perfil de administrador ativo.
- Atualização cadastral de nome e e-mail via endpoint `PUT /api/auth/profile`.
- Fluxo de alteração de senha com validação da senha atual e confirmação.
- Alternância instantânea de tema claro e escuro (`ThemeContext`).

## Tecnologias Utilizadas

### Frontend
- **React 19** + **Vite 6** + **TypeScript 5**
- **Tailwind CSS 3** (layout responsivo e tema escuro/claro)
- **React Router 8** (rotas protegidas e navegação declarativa)
- **Radix UI / shadcn components** (Modais, Selects, Dropdowns, Checkboxes, Tooltips)
- **Axios** (cliente HTTP com interceptors JWT e tratamento de 401)
- **React Hook Form + Zod** (validação de formulários e integridade de tipos)
- **Lucide React** (ícones)
- **React Hot Toast** (notificações visuais)

### Backend
- **Node.js** + **Express 4** + **TypeScript 5**
- **Prisma ORM 6** com banco **SQLite**
- **Zod** (validação de schemas de requisições e query params)
- **bcrypt** (hash de senhas com salt rounds)
- **jsonwebtoken** (emissão e verificação de tokens JWT)
- **Helmet** + **CORS** + **express-rate-limit** (segurança de cabeçalhos e proteção brute-force)

## Arquitetura do Projeto

### Backend (Camadas Limpas)
```
Routes → Controllers → Services → Prisma Client → SQLite (dev.db / test.db)
```

### Frontend (Organização Modular)
```
Pages → Components (UI, Users, Calendar, Layout) → Services (api.ts) → REST API
```

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 20 ou superior)
- npm (versão 9 ou superior)

### 1. Instalar dependências
```bash
npm run install:all
```

### 2. Configurar o banco de dados e executar seed inicial
```bash
npm run setup
```
- **E-mail de acesso:** `admin@gerenciamento.com`
- **Senha de acesso:** `Admin@2026`

### 3. Executar o projeto em desenvolvimento
```bash
npm run dev
```
- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3333

### 4. Executar os testes automatizados
```bash
npm test
```

### 5. Executar lint e build de produção
```bash
npm run lint
npm run build
```

## Documentação dos Endpoints REST

### Base URL: `http://localhost:3333/api`

| Método | Endpoint | Protegido | Descrição |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/login` | Não | Autentica administrador e retorna token JWT |
| `GET` | `/auth/me` | Sim | Retorna perfil do administrador autenticado |
| `PUT` | `/auth/profile` | Sim | Atualiza dados e/ou senha do administrador |
| `GET` | `/users` | Sim | Listagem paginada de usuários com busca e filtros |
| `GET` | `/users/stats` | Sim | Estatísticas do painel (total, ativos, novos, aniversariantes) |
| `GET` | `/users/:id` | Sim | Busca usuário por ID |
| `POST` | `/users` | Sim | Cadastra um novo usuário |
| `PUT` | `/users/:id` | Sim | Atualiza dados cadastrais de um usuário |
| `PATCH` | `/users/:id/status` | Sim | Altera o status (`ACTIVE`/`INACTIVE`) |
| `DELETE` | `/users/:id` | Sim | Remove um usuário do banco de dados |
| `GET` | `/activities` | Sim | Lista atividades (filtros por `date` e `month`) |
| `GET` | `/activities/:id` | Sim | Busca atividade por ID |
| `POST` | `/activities` | Sim | Cadastra uma nova atividade |
| `PUT` | `/activities/:id` | Sim | Atualiza uma atividade |
| `PATCH` | `/activities/:id/status` | Sim | Altera status (`PENDING`/`COMPLETED`/`CANCELLED`) |
| `DELETE` | `/activities/:id` | Sim | Exclui uma atividade do banco de dados |

---

**Autora:** Lettícia Sabino  
**Curso:** Desenvolvimento Web Full Stack – Escola Avanti  
**Projeto:** Projeto Individual DFS-2026.2  
**Licença:** MIT
