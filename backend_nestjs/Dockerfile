FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

COPY . .
RUN pnpm build:bundle

FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/dist-bundle ./dist-bundle

RUN mkdir -p resource/upload

EXPOSE 3000

CMD ["node", "dist-bundle/main.js"]
