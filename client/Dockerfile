# Build context is the monorepo root (see docker-compose.yml) — same
# npm workspaces reasoning as server/Dockerfile.

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY client/package.json client/package.json
COPY server/package.json server/package.json
RUN npm ci
COPY client client
RUN npm run build --workspace=client

FROM nginx:alpine AS production
COPY --from=builder /app/client/dist /usr/share/nginx/html
COPY client/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
