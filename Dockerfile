FROM node:20-alpine as base

RUN apk update && apk add bash
RUN npm install --global corepack@latest

FROM base as deps

WORKDIR  /europay
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm i --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS builder
WORKDIR /europay
COPY --from=deps /europay/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1

RUN \
  if [ -f pnpm-lock.yaml ]; then pnpm build; \
  elif [ -f package-lock.json ]; then npm run build; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base AS runner
WORKDIR /europay

ENV NODE_ENV=production
# ENV DATABASE_URL=postgres://postgres:5432/europayv5_db
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/europay_db?schema=public&pool_timeout=0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=deps /europay/node_modules ./node_modules

COPY --from=builder /europay/start.sh ./
COPY --from=builder /europay/package.json ./
COPY --from=builder /europay/public ./public
COPY --from=builder /europay/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /europay/.next ./.next

RUN npx prisma generate

EXPOSE 3000

# # SHELL ["/bin/bash", "-o", "pipefail", "-c"]
# CMD ["./start.sh"]
CMD ["sh", "-c", "npx prisma db push && pnpm start"]
# SHELL ["/bin/bash", "-c"]
