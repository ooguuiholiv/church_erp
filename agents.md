# Church ERP - Guia do Agente (e Humanos)

> Guia de contribuição para o Church ERP. Focado em manter a qualidade premium e a consistência arquitetural.

## 📌 Visão Geral do Projeto
O **Church ERP** é uma plataforma de gestão integrada projetada para modernizar a administração eclesiástica. O foco inicial é a gestão de pessoas (jornada do membro) e o controle financeiro rigoroso, tudo envolto em uma interface de altíssimo nível (Premium).

## 💻 Comandos

```bash
# Instalação de dependências
npm install

# Rodar servidor de desenvolvimento
npm run dev

# Build de produção
npm run build

# Verificação de linting
npm run lint
```

## 🛠️ Módulos de Business Logic

### 1. Módulo de Pessoas (Coração do Sistema)
Gerencia o ciclo de vida e engajamento:
- **Classificação Dinâmica:** `Visitante` → `Amigo` → `Participante` → `Membro`.
- **Regra:** O status muda conforme a interação e frequência (rastreável por histórico).

### 2. Módulo de Finanças
Gestão de fluxo de caixa e planejamento:
- **Receitas:** Categorizadas (Dízimos, Ofertas, Doações).
- **Despesas:** Categorizadas (Operacionais, Ministérios, Manutenção).
- **Categorização:** Árvore de contas dinâmica e customizável.

## 🚀 Tecnologias e Arquitetura

### Stack Tecnológica
- **Frontend:** Next.js (App Router).
- **Backend:** NestJS (Node.js framework).
- **Banco de Dados:** PostgreSQL.
- **ORM:** (A definir - Ex: Prisma ou TypeORM).
- **UI/Estilização:** Tailwind CSS + Shadcn UI.

### Estrutura de Pastas (Monorepo/Projeto)
```
/client       # Frontend Next.js (App Router)
/server       # Backend NestJS (API)
/infra        # Configurações de Docker/PostgreSQL
/docs         # Documentação e diagramas
```

## 🎨 Diretrizes de Design (Premium)
- **Estética:** Clean, Glassmorphism moderado, sombras suaves e tipografia moderna (Inter/Outfit).
- **Cores:** Paletas sofisticadas (evitar cores puras), modo escuro por padrão.
- **Interatividade:** Micro-animações e transições suaves entre estados.

## ✅ Do & Don't

### Do (Faça)
- Use **Tailwind CSS** para toda a estilização.
- Siga os padrões do **Shadcn UI** para consistência.
- Mantenha funções de lógica de negócio em `/lib` ou `/services`.
- Use imagens de alta qualidade e textos realistas.
- Garanta que o app seja **Mobile-First**.

### Don't (Não faça)
- Não use cores primárias básicas (Red-500, Blue-500) sem ajuste de paleta.
- Não entregue componentes sem estados de `hover` ou `active`.
- Não ignore a acessibilidade ao criar componentes personalizados.
- Não adicione bibliotecas pesadas sem necessidade comprovada.

## 📋 Checklist de Entrega
- [ ] O design segue o padrão "Premium"?
- [ ] O componente é responsivo?
- [ ] A lógica de mudança de status (Pessoas) está clara?
- [ ] O Tailwind foi usado corretamente com variáveis de tema?
