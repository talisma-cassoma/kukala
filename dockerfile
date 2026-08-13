# ==========================================
# Estágio 1: Base com Node.js e Corepack (pnpm)
# ==========================================
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /app

# Copiar apenas os arquivos de dependências
COPY package.json pnpm-lock.yaml ./

# ==========================================
# Estágio 2: Instalação das Dependências
# ==========================================
FROM base AS deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# ==========================================
# Estágio 3: Compilação (Build)
# ==========================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Argumento para passar a URL do Supabase no build
ARG PUBLIC_SUPABASE_URL
ENV PUBLIC_SUPABASE_URL=$PUBLIC_SUPABASE_URL

ENV NODE_ENV=production
RUN pnpm run build

# ==========================================
# Estágio 4: Execução em Produção
# ==========================================
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

# Copiar os arquivos gerados do build de produção
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 4321

# Executa o servidor Node do Astro
CMD ["node", "./dist/server/entry.mjs"]