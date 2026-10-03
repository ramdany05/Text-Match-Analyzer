# ============================================================
# Stage 1: Builder
# Install dependencies dan build React app menjadi static files
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files untuk memanfaatkan Docker layer cache
COPY package*.json ./

# Install semua dependencies
RUN npm ci

# Copy source code
COPY . .

# Build React app (menghasilkan folder dist/)
# VITE_API_URL di-set saat build time via ARG
ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=${VITE_API_URL}

RUN npm run build


# ============================================================
# Stage 2: Production
# Serve static files menggunakan Nginx yang ringan
# ============================================================
FROM nginx:alpine AS production

# Copy konfigurasi Nginx kustom (handle SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy hasil build React dari stage sebelumnya
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
