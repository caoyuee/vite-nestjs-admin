FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY . .

RUN corepack enable && pnpm install
RUN pnpm run build

FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
