````markdown
# koajs-backend

一个用 TypeScript 编写的基于 Koa 的后端示例工程，包含常见中间件（日志、JWT、Swagger、Redis、TypeORM），适合作为学习或快速原型。

## 主要特性

- Koa + TypeScript
- TypeORM（MySQL）作为 ORM
- Redis（ioredis）用于 session/token 存储
- JWT 鉴权（koa-jwt）
- Swagger 文档/界面（swagger-jsdoc + koa2-swagger-ui）
- 日志（winston）与自定义响应格式

## 先决条件

- Node.js >= 18（推荐）
- pnpm

## 快速开始

1. 克隆仓库并安装依赖：

```bash
pnpm install
```

2. 复制一份示例环境变量文件并编辑（见下方示例）：

```bash
cp .env.example .env
# 编辑 .env 以配置数据库、Redis 与 JWT 密钥
```

3. 本地开发（带 TypeScript 实时重载）：

```bash
pnpm run dev
```

4. 构建并以生产模式运行：

```bash
pnpm run build
pnpm start
```

开发时也可用调试模式：

```bash
pnpm run dev:debug
```

## 可用脚本（package.json）

- `pnpm run dev` — 使用 `tsx` 实时运行 `src/index.ts`（开发）
- `pnpm run dev:debug` — 带 Node inspector 的开发模式
- `pnpm run build` — 构建（当前项目使用 `pkgroll`）
- `pnpm start` — 运行构建产物 `./dist/index.mjs`
- `pnpm run type-check` — TypeScript 类型检查

## 环境变量（.env）

在项目根目录创建 `.env`，下面是常用变量与默认值：

```env
# 服务
PORT=3000

# MySQL（TypeORM）
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=asdzxc123.
DB_NAME=koajs-sql

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your_jwt_secret_here
```

注意：`src/config/DB.conf.ts` 中 `synchronize: true` 会在应用启动时自动同步实体到数据库（会修改表结构），不建议在生产环境开启此选项。

## 配置说明

- 数据库：项目使用 TypeORM，通过 `src/config/DB.conf.ts` 读取环境变量并注册实体（User、Menu、Role）。
- Redis：使用 `ioredis`，用于存储 token（见 `src/config/JWT.conf.ts` 中的 `isRevoked` 检查）。
- JWT：签发函数 `signToken` 在 `src/config/JWT.conf.ts`。鉴权中间件 `JWT` 默认对 `/api/user/login` 和 `/api/user/addUser` 放行（白名单）。

## Swagger 文档

- Swagger JSON：GET http://localhost:3000/swaggerDoc
- Swagger UI（交互页面）：http://localhost:3000/swagger/docs

（`src/config/swagger.conf.ts` 使用 `koa2-swagger-ui` 生成文档，`src/middleware/swagger-ui.ts` 将 UI 挂载在 `/swagger/docs`）

## 路由前缀

项目中路由注册在 `src/routes` 下，主路由前缀在 `src/routes/index.ts` 中管理（默认无全局前缀，API 路径以 `/api/...` 为主）。

## 日志与响应

- 日志：使用自定义 `middleware/logger.ts`（基于 winston）记录请求日志，输出到 `logs/` 目录。
- 响应格式：`src/config/responseManage.conf.ts` 提供统一响应封装 `Response(data, message, code)`。

## 常见问题

- "ES Module" 相关错误：确保 `package.json` 中存在 `"type": "module"`（本项目已配置），或使用 `pnpm run build` 后运行编译产物。
- 端口占用：可通过设置 `PORT` 环境变量改变默认端口 3000。


## Docker 与 本地一键启动

仓库已添加简单的 `Dockerfile`（后端与前端）以及根目录 `docker-compose.yml`，包含 `db`（MySQL）和 `redis` 服务，用于本地一键启动与演示。

快速使用说明：

1. 在 `koajs_backend` 目录下复制环境变量模板：

```bash
cp koajs_backend/.env.example koajs_backend/.env
# 编辑 koajs_backend/.env 根据本地需求调整
```

2. 使用 `docker-compose` 启动所有服务（需要 Docker 与 docker-compose）：

```bash
docker-compose up --build
```

3. 服务启动后：

- 后端: http://localhost:3000
- 前端: http://localhost:8080

注意事项：

- 生产环境请不要使用 `.env` 中的默认密码。将 `synchronize` 关闭并改用 migrations 来管理数据库变更。
- 该 `docker-compose.yml` 仅用于本地快速启动与开发演示，生产环境请按需转换为 Kubernetes / 生产级 Compose 配置并添加备份、持久化与安全策略。


