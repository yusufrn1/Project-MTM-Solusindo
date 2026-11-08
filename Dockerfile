FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build npm run db:generate
RUN npm run build

FROM builder AS migrate
CMD ["./node_modules/.bin/prisma", "migrate", "deploy"]

FROM node:22-alpine AS runner
ENV NODE_ENV=production HOSTNAME=0.0.0.0 PORT=3000
RUN addgroup -S -g 10001 nextjs && adduser -S -u 10001 -G nextjs nextjs
WORKDIR /app
COPY --from=builder --chown=10001:10001 /app/.next/standalone ./
COPY --from=builder --chown=10001:10001 /app/.next/static ./.next/static
COPY --from=builder --chown=10001:10001 /app/public ./public
COPY --from=builder --chown=10001:10001 /app/generated/prisma ./generated/prisma
USER 10001:10001
EXPOSE 3000
CMD ["node", "server.js"]