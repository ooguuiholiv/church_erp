# Gemini Context - Church ERP

Veja o [AGENTS.md](./agents.md) para o guia completo de contribuição (arquitetura, comandos, regras).

## Quick Reference

```bash
npm install        # Instalação
npm run dev        # Servidor de desenvolvimento
npm run build      # Build de produção
npm run lint       # Verificação de linting
```

## Diretrizes Críticas para a IA

- **Estética Premium:** Nunca entregue um design básico. Use Tailwind CSS com foco em variáveis de tema, sombras suaves e micro-animações.
- **Tecnologias:** Next.js (Frontend), NestJS (Backend) e PostgreSQL (DB) são obrigatórios.
- **Sem Placeholders:** Utilize imagens reais e dados realísticos em todos os componentes.
- **Mobile-First:** Garanta que todas as interfaces funcionem perfeitamente em dispositivos móveis.
- **Lógica de Negócio:** Mantenha a lógica de domínio no Backend (NestJS Services/Entities).

## Lembrete de Arquitetura
A separação clara entre o cliente (Next.js) e o servidor (NestJS) é fundamental. O status de uma pessoa é mutável e deve ser processado no backend com validações rigorosas.
