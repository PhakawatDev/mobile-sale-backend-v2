# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package*.json ./
RUN npm ci

COPY prisma ./prisma
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src

# Build TypeScript -> dist
RUN npm run build

RUN npm prune --omit=dev

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3001

# Prisma บน Alpine
RUN apk add --no-cache libc6-compat openssl

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/dist ./dist

EXPOSE 3001

# ถ้าใช้ Prisma Migrate ตอน start ให้ uncomment บรรทัดนี้
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/server.js"]

CMD ["node", "dist/server.js"]
