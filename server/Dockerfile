# PRODUCTION DOCKERFILE
FROM node:20-slim AS builder

# Instala openssl, necessário para o Prisma Engine no Debian Slim
RUN apt-get update -y && apt-get install -y openssl

WORKDIR /app

# Injeta uma URL via build-arg ou env se necessário. 
# Usamos um valor dummy por padrão para o 'prisma generate' não falhar no build.
ARG DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"
ENV DATABASE_URL=$DATABASE_URL

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npm run build

FROM node:20-slim

WORKDIR /app

# Instala openssl também na imagem final de execução
RUN apt-get update -y && apt-get install -y openssl

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
