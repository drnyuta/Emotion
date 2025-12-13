# ---------- Build stage ----------
FROM node:20-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src ./src
COPY tsconfig.json ./
RUN npm run build

# ---------- Production stage ----------
FROM node:20-slim AS production
WORKDIR /app
RUN useradd -ms /bin/bash nodeuser
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --only=production
USER nodeuser
EXPOSE 5000
CMD ["node", "dist/server.js"]