# Church ERP

Sistema de Gestão Integrada para Igrejas.

## Estrutura do Projeto

- **`/client`**: Frontend Next.js (App Router). Estilização com Tailwind CSS e Shadcn UI.
- **`/server`**: Backend NestJS (API). Autenticação JWT e Prisma ORM.
- **`/infra`**: Configurações de infraestrutura (Docker, Bancos de Dados).
- **`/docs`**: Documentação técnica e manuais.

## Como Executar Localmente

### Pré-requisitos
- Node.js 18+
- Docker & Docker Compose

### 1. Iniciar o Banco de Dados
```bash
cd infra
docker-compose up -d
```

### 2. Iniciar o Backend
```bash
cd server
npm install
npm run dev
```

### 3. Iniciar o Frontend
```bash
cd client
npm install
npm run dev
```
