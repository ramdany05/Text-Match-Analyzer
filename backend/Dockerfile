# ============================================================
# Stage 1: Builder
# Install dependencies dan compile TypeScript ke JavaScript
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files terlebih dahulu untuk memanfaatkan Docker layer cache
COPY package*.json ./

# Paksa NODE_ENV=development agar devDependencies (termasuk TypeScript) terinstall
ENV NODE_ENV=development

# Install semua dependencies (termasuk devDependencies)
RUN npm ci

# Copy seluruh source code
COPY . .

# Compile TypeScript ke JavaScript menggunakan npx tsc
RUN npx tsc


# ============================================================
# Stage 2: Production
# Hanya copy hasil build dan production dependencies
# ============================================================
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Copy package files
COPY package*.json ./

# Install production dependencies saja
RUN npm ci --omit=dev

# Copy hasil build dari stage sebelumnya
COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["node", "dist/src/server.js"]
