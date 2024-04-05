FROM node:20-alpine AS node
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM node AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json  pnpm-lock.yaml pnpm-workspace.yaml ./
COPY ./frontend/package.json ./frontend/package.json
COPY ./backend/package.json ./backend/package.json
RUN --mount=type=cache,id=pnpm,target=/pnpm/store  pnpm i --frozen-lockfile

FROM node AS builder
WORKDIR /app
COPY --from=deps /app/frontend/node_modules ./frontend/node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./
COPY tsconfig.base.json ./tsconfig.base.json
COPY .eslintrc.json ./.eslintrc.json
COPY ./frontend ./frontend
COPY ./backend ./backend

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
COPY --from=builder /app/frontend/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/frontend/.next/static ./.next/static
USER nextjs
CMD ["node", "server.js"]
