# NestJS Admin Backend

`backend_nestjs` 是本仓库的后台 API 服务，配套前端为 `../fronted_vite`。服务提供认证、用户、菜单、角色、权限、日志、字典、上传和 ProTable 演示数据等后台管理接口。

## 技术栈

- NestJS 11
- TypeScript 6
- TypeORM 0.3
- MySQL 8
- Redis / ioredis
- JWT / Passport
- Swagger
- Winston + daily rotate file
- class-validator / class-transformer
- Jest
- Webpack bundle 构建

## 环境要求

- Node.js 18+
- pnpm 10.20.0+
- MySQL 8.0+
- Redis 6.0+

本项目统一使用 `pnpm`，不要使用 `npm` 或 `yarn`。

## 本地依赖服务

可以使用根目录的 `docker-compose.yml` 启动 MySQL 和 Redis：

```bash
cd ..
docker compose up -d db redis
```

默认服务端口：

- MySQL：`localhost:3306`
- Redis：`localhost:6379`
- NestJS：`localhost:3000`

## 安装

```bash
cd backend_nestjs
pnpm install
```

## 环境变量

项目当前包含：

- `.env.development`
- `.env.production`

主要变量：

| 变量 | 说明 |
| --- | --- |
| `NODE_ENV` | 运行环境，开发环境通常为 `development` |
| `PORT` | HTTP 服务端口，默认 `3000` |
| `DB_HOST` | MySQL 主机 |
| `DB_PORT` | MySQL 端口 |
| `DB_USER` | MySQL 用户名 |
| `DB_PASSWORD` | MySQL 密码 |
| `DB_NAME` | MySQL 数据库名 |
| `JWT_SECRET` | JWT 签名密钥 |
| `REDIS_HOST` | Redis 主机 |
| `REDIS_PORT` | Redis 端口 |
| `REDIS_PASSWORD` | Redis 密码，可为空 |

生产部署前请替换数据库密码和 `JWT_SECRET`，不要沿用本地示例值。

## 启动

```bash
pnpm start:dev
```

`start`、`start:dev` 和 `build` 都会先执行：

```bash
pnpm check
```

也就是先跑 TypeScript 与 ESLint 检查，再启动或构建。

启动成功后：

- API 服务：`http://localhost:3000`
- Swagger 文档：`http://localhost:3000/swagger/docs`
- 静态资源：`http://localhost:3000/resource`

## 常用命令

```bash
pnpm check         # TypeScript + ESLint 检查
pnpm lint          # ESLint 自动修复
pnpm format        # Prettier 格式化
pnpm start         # 检查并启动
pnpm start:dev     # 检查并 watch 启动
pnpm start:debug   # 检查并 debug watch 启动
pnpm build         # 检查并构建到 dist/
pnpm build:bundle  # 检查并通过 webpack 构建到 dist-bundle/
pnpm start:prod    # 运行 dist/main
pnpm start:bundle  # 运行 dist-bundle/main.js
pnpm test          # Jest 单元测试
pnpm test:e2e      # e2e 测试
pnpm test:cov      # 覆盖率
```

## 目录结构

```text
backend_nestjs/
├── src/
│   ├── common/             # 装饰器、过滤器、守卫、拦截器、公共服务
│   ├── config/             # MySQL、Redis 等配置
│   ├── entities/           # TypeORM 实体
│   ├── modules/
│   │   ├── auth/           # 登录、登出、JWT 策略
│   │   ├── auth-permission/# 权限查询
│   │   ├── demo-user/      # ProTable 演示用户数据接口
│   │   ├── dictionary/     # 字典管理
│   │   ├── log/            # HTTP 日志查询和清理
│   │   ├── menu/           # 菜单管理
│   │   ├── role/           # 角色管理和授权
│   │   ├── upload/         # 文件上传
│   │   └── user/           # 系统用户管理
│   ├── utils/              # 工具函数
│   ├── app.module.ts       # 根模块
│   └── main.ts             # 应用入口和 Swagger 配置
├── test/                   # e2e 测试
├── resource/               # 上传和静态资源目录
├── Dockerfile              # 后端容器构建
├── webpack.config.js       # bundle 构建配置
└── package.json            # 脚本和依赖
```

## API 分组

当前主要路由分组如下：

| 业务域 | 路由前缀 |
| --- | --- |
| 认证 | `/api/system/auth` |
| 当前用户 | `/api/system/users/me` |
| 用户账号 | `/api/system/users` |
| 菜单 | `/api/system/menus` |
| 角色 | `/api/system/roles` |
| 权限 | `/api/system/permissions` |
| 日志 | `/api/system/logs` |
| 字典 | `/api/system/dictionaries` |
| 演示用户 | `/api/system/demo/users` |
| 上传 | `/api/upload` |
| 静态资源 | `/resource` |

更完整的接口约定请看根目录 `docs/API_CONTRACT_RULES.md`。

## 响应格式

全局响应拦截器会把 JSON 接口包装为：

```ts
{
  code: number;
  message: string;
  data: T | null;
}
```

分页接口的 `data` 统一为：

```ts
{
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
```

全局异常过滤器会把异常转换为同样结构，便于前端统一处理业务错误。

## 数据库与同步

TypeORM 配置位于 `src/config/database.config.ts`：

- 数据库类型：MySQL
- 实体目录：`src/entities/*.{ts,js}`
- `NODE_ENV !== "production"` 时启用 `synchronize`
- `NODE_ENV === "development"` 时启用 SQL 日志

生产环境不要依赖 `synchronize` 做表结构迁移，应使用正式迁移流程或人工变更 SQL。

## Docker

根目录 `docker-compose.yml` 包含 MySQL、Redis、后端和前端服务：

```bash
cd ..
docker compose up -d
```

容器端口：

- 前端：`http://localhost:8080`
- 后端：`http://localhost:3000`
- Swagger：`http://localhost:3000/swagger/docs`
