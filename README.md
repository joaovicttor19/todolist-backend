# API de Lista de Tarefas (Todolist)

<div align="center">
  <img src="https://nestjs.com/img/logo-small.svg" alt="NestJS" width="80" />
  <img src="https://raw.githubusercontent.com/remojansen/logo.ts/master/ts.png" alt="TypeScript" width="80" />
  <img src="https://www.postgresql.org/media/img/about/press/elephant.png" alt="PostgreSQL" width="80" />
  <img src="https://sequelize.org/img/logo.svg" alt="Sequelize" width="80" />
</div>

<br />

Esta é uma API RESTful para um sistema de lista de tarefas (todolist), desenvolvida com NestJS. Ela permite que os usuários se registrem, façam login e gerenciem suas tarefas e tags associadas.

## ✨ Funcionalidades

*   **Autenticação de Usuários**: Sistema completo de registro e login com tokens JWT (JSON Web Tokens).
*   **Gerenciamento de Tarefas**: CRUD completo (Criar, Ler, Atualizar, Deletar) para tarefas, com escopo por usuário.
*   **Gerenciamento de Tags**: CRUD completo para tags, permitindo categorizar as tarefas.
*   **Relacionamento Tarefa-Tag**: Associação de múltiplas tags a múltiplas tarefas (relação N:N).
*   **Validação de Dados**: Utilização de `class-validator` e `class-transformer` para garantir a integridade dos dados de entrada.
*   **Filtros**: Capacidade de filtrar tarefas por status e, futuramente, por tags.

## 🛠️ Tecnologias Utilizadas

*   **Framework**: [NestJS](https://nestjs.com/)
*   **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
*   **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
*   **ORM**: [Sequelize](https://sequelize.org/) com `sequelize-typescript`
*   **Autenticação**: [Passport.js](http://www.passportjs.org/) com estratégias `passport-jwt`
*   **Validação**: `class-validator`, `class-transformer`
*   **Variáveis de Ambiente**: `@nestjs/config`, `dotenv`

## ⚙️ Pré-requisitos

Antes de começar, você precisará ter as seguintes ferramentas instaladas em sua máquina:

*   [Node.js](https://nodejs.org/en/) (versão 16 ou superior)
*   [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
*   [Docker](https://www.docker.com/) (recomendado para rodar o PostgreSQL) ou uma instância local do PostgreSQL.

## 🚀 Instalação e Execução

Siga os passos abaixo para configurar e executar o projeto em seu ambiente local.

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/joaovicttor19/todolist-backend
    cd todolist-backend
    ```

2.  **Instale as dependências:**

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente:**

    Crie uma cópia do arquivo de exemplo `.env.example` e renomeie para `.env`. Em seguida, preencha com suas credenciais.

    ```bash
    cp .env.example .env
    ```

    Seu arquivo `.env` deve se parecer com isto:

    ```
    PORT=3000

    DB_HOST=localhost
    DB_PORT=5432
    DB_USER=postgres
    DB_PASSWORD=postgres
    DB_NAME=todolist

    JWT_SECRET=super_secret_key
    JWT_EXPIRES_IN=1d

    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=postgres
    POSTGRES_DB=todolist

    ```

4.  **Inicie o banco de dados:**

    Se estiver usando Docker, você pode iniciar um container PostgreSQL com o seguinte comando:

    ```bash
    docker compose up -d
    ```

5.  **Inicie a aplicação:**

    ```bash
    npm run start:dev
    ```

    A API estará disponível em `http://localhost:3000/api`.

## Endpoints da API

Todos os endpoints que exigem autenticação devem incluir o token JWT no cabeçalho `Authorization` como `Bearer <token>`.

### Autenticação (`/auth`)

| Método | Rota             | Descrição                               |
| :----- | :--------------- | :---------------------------------------- |
| `POST` | `/register`      | Registra um novo usuário.                 |
| `POST` | `/login`         | Autentica um usuário e retorna um token.  |

### Tarefas (`/tasks`)

*   **Autenticação**: Obrigatória para todos os endpoints.

| Método   | Rota    | Descrição                                               |
| :------- | :------ | :-------------------------------------------------------- |
| `POST`   | `/`     | Cria uma nova tarefa.                                     |
| `GET`    | `/`     | Lista todas as tarefas do usuário, com opção de filtro por status.   |
| `GET`    | `/by-tags` | Lista tarefas filtradas por nome de tags (query param `tags`). |
| `GET`    | `/:id`  | Obtém os detalhes de uma tarefa específica.               |
| `PATCH`  | `/:id`  | Atualiza uma tarefa existente.                            |
| `DELETE` | `/:id`  | Remove uma tarefa.                                        |

### Tags (`/tags`)

*   **Autenticação**: Obrigatória para todos os endpoints.

| Método   | Rota    | Descrição                                           |
| :------- | :------ | :---------------------------------------------------- |
| `POST`   | `/`     | Cria uma nova tag.                                    |
| `GET`    | `/`     | Lista todas as tags do usuário.                       |
| `GET`    | `/:id`  | Obtém os detalhes de uma tag específica.              |
| `PATCH`  | `/:id`  | Atualiza uma tag existente.                           |
| `DELETE` | `/:id`  | Remove uma tag.                                       |

## 🗂️ Estrutura do Banco de Dados

A API utiliza três modelos principais:

*   **User**: Armazena as informações dos usuários (email e senha).
    *   Um usuário pode ter várias tarefas (`1:N`).
    *   Um usuário pode ter várias tags (`1:N`).
*   **Task**: Representa uma tarefa, contendo título, status, prioridade e descrição.
    *   Pertence a um único usuário (`N:1`).
    *   Pode ter várias tags (`N:N`).
*   **Tag**: Representa uma categoria para as tarefas, com nome e cor.
    *   Pertence a um único usuário (`N:1`).
    *   Pode estar associada a várias tarefas (`N:N`).

A relação `N:N` entre `Task` e `Tag` é gerenciada por uma tabela de junção chamada `TaskTag`.
