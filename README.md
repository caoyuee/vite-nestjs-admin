# Vite NestJS Admin

这是一个前后端一体的后台管理项目，包含 Vue 3 前端和 NestJS 后端。项目用于构建管理后台、系统权限、用户角色、菜单、字典、日志、上传和数据展示等常见后台能力。

## 项目结构

```text
.
├── fronted_vite/       # Vue 3 + Vite 管理后台前端
├── backend_nestjs/     # NestJS + TypeORM 后端 API 服务
├── docs/               # 项目文档和接口契约
├── .agents/            # AI 协作规则和技能文档
├── .codex/             # Codex 本地配置目录，当前规则统一放在 AGENTS.md
├── AGENTS.md           # AI 编码代理项目规则入口
└── docker-compose.yml  # MySQL、Redis 等本地服务编排
```

## 技术栈

### 前端

- Vue 3
- Vite / rolldown-vite
- TypeScript
- Pinia
- Vue Router
- Element Plus
- Axios
- ECharts
- SCSS

### 后端

- NestJS 11
- TypeScript
- TypeORM
- MySQL
- Redis / ioredis
- JWT / Passport
- Swagger
- Winston
- Jest

## 环境要求

- Node.js 18+
- pnpm 10.20.0+
- MySQL 8.0+
- Redis 6.0+

本项目统一使用 `pnpm`，不要使用 `npm` 或 `yarn` 安装依赖。

## 安装依赖

```bash
cd fronted_vite
pnpm install

cd ../backend_nestjs
pnpm install
```

## 启动开发环境

启动前端：

```bash
cd fronted_vite
pnpm dev
```

启动后端：

```bash
cd backend_nestjs
pnpm start:dev
```

前端启动和后端启动脚本都会先执行 TypeScript 与 ESLint 检查。

## 构建

构建前端：

```bash
cd fronted_vite
pnpm build
```

构建后端：

```bash
cd backend_nestjs
pnpm build
```

## 常用命令

### 前端

```bash
pnpm check         # TypeScript + ESLint 检查
pnpm lint          # ESLint 自动修复
pnpm format        # Prettier 格式化
pnpm build         # 检查并构建
```

### 后端

```bash
pnpm check         # TypeScript + ESLint 检查
pnpm lint          # ESLint 自动修复
pnpm format        # Prettier 格式化
pnpm test          # Jest 单元测试
pnpm build         # 检查并构建
```

## 接口规范

后端 JSON 接口统一返回：

```ts
{
  code: number;
  message: string;
  data: T | null;
}
```

分页响应统一为：

```ts
{
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
```

接口路由、HTTP 方法、参数位置和前后端契约规则请看：

- `docs/API_CONTRACT_RULES.md`

## 开发规则

AI 编码代理和后来维护者请先阅读：

- `AGENTS.md`

更细的规则来源：

- `.agents/rules/code-rules.md`
- `.agents/rules/superpowers-zh.md`
- `docs/API_CONTRACT_RULES.md`

核心原则：

- 先查阅现有接口和规则，再写代码。
- 前端 API 必须对应真实后端接口。
- 后端没有接口时，按语义补齐后端接口，不在前端伪造契约。
- 新代码尽量避免 `any`，优先写清楚类型。
- 不擅自新增依赖。
- 完成前运行与改动范围匹配的检查命令。

## API 文档

后端启动后可访问 Swagger 文档：

```text
/swagger/docs
```

## Git 提交

提交格式：

```text
<type>(<scope>): <subject>
```

示例：

```text
feat(frontend): 添加登录验证码
fix(nestjs): 修复认证依赖注入
docs(shared): 更新项目规则
```

## 说明

本仓库当前包含较多示例页面、地图、图表和 WebGL 相关能力。修改这些页面时，请优先复用已有依赖和工具，避免引入新的技术栈。
