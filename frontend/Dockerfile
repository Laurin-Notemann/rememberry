FROM node:20-alpine AS node
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM node AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY pnpm-lock.yaml ./
RUN  corepack enable pnpm && pnpm fetch

COPY . ./

RUN pnpm install -r --offline

ARG APP_ENV
ARG FRONTEND_HOST
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_BACKEND_HOST
ARG NEXT_PUBLIC_BACKEND_PORT
ENV APP_ENV ${APP_ENV}
ENV FRONTEND_HOST ${FRONTEND_HOST}
ENV NEXT_PUBLIC_APP_ENV ${NEXT_PUBLIC_APP_ENV}
ENV NEXT_PUBLIC_BACKEND_HOST ${NEXT_PUBLIC_BACKEND_HOST}
ENV NEXT_PUBLIC_BACKEND_PORT ${NEXT_PUBLIC_BACKEND_PORT}

ENV NEXT_TELEMETRY_DISABLED 1

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm run frontend build

FROM node AS runner

WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./frontend/.next/static
COPY --from=builder /app/frontend/public ./frontend/public

USER nextjs
CMD ["node", "frontend/server.js"]
