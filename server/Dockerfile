# Build context is the monorepo root (see docker-compose.yml), because
# this is an npm workspaces project — the server's dependency tree is
# only resolvable together with the root package-lock.json. All three
# workspace package.json files must be present for `npm ci` to match
# the lockfile, even though this image only runs the server.

FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json
RUN npm ci
COPY server server
RUN npm run build --workspace=server

FROM node:20-alpine AS prod-deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY server/package.json server/package.json
COPY client/package.json client/package.json
RUN npm ci --omit=dev

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder /app/server/dist ./server/dist
COPY server/package.json server/package.json

EXPOSE 5000
CMD ["node", "server/dist/server.js"]
