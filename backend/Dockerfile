FROM oven/bun:1.1.0-alpine AS bun
FROM node:20-alpine AS node
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM node AS deps
WORKDIR /app

COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY backend/package.json ./backend/package.json

RUN --mount=type=cache,id=pnpm,target=/pnpm/store  pnpm --filter=backend -config.-dedupe-peer-dependents=false i --frozen-lockfile

FROM bun AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/package.json .

COPY ./backend ./backend
RUN bun build --target=node --outdir=./backend/dist ./backend/src/index.ts

FROM node AS runner
WORKDIR /app

COPY --from=builder /app/backend/dist ./dist
COPY --from=builder /app/backend/package.json ./dist
CMD ["node", "./dist/index.js"]
