# AGENTS.md - AI Agent 项目指南

> 本文档为 AI 编码代理提供项目入门指南，包含项目结构、技术栈、开发规范和工作流程。

***

## 项目概述

这是一个**全栈 Monorepo 项目**，包含 Vue 3 前端和 NestJS 后端两个子项目。

| 子项目 | 目录                | 技术栈                         | 说明             |
| --- | ----------------- | --------------------------- | -------------- |
| 前端  | `fronted_vite/`   | Vue 3 + Vite + Element Plus | 管理后台前端         |
| 后端  | `backend_nestjs/` | NestJS + TypeORM + MySQL    | RESTful API 服务 |

***

## 技术栈详情

### 前端 (fronted\_vite)

| 技术           | 版本            | 用途       |
| ------------ | ------------- | -------- |
| Vue          | 3.5+          | 前端框架     |
| Vite         | rolldown-vite | 构建工具     |
| Pinia        | 3.0+          | 状态管理     |
| Element Plus | 2.11+         | UI 组件库   |
| Vue Router   | 4.x           | 路由管理     |
| Axios        | 1.x           | HTTP 客户端 |
| ECharts      | 6.0+          | 图表库      |
| SCSS         | -             | CSS 预处理器 |

### 后端 (backend\_nestjs)

| 技术      | 版本              | 用途     |
| ------- | --------------- | ------ |
| NestJS  | 11.x            | 后端框架   |
| TypeORM | 0.3.x           | ORM 框架 |
| MySQL   | -               | 关系型数据库 |
| Redis   | ioredis         | 缓存服务   |
| JWT     | @nestjs/jwt     | 身份认证   |
| Winston | 3.x             | 日志系统   |
| Swagger | @nestjs/swagger | API 文档 |

***

## 项目结构

```
front_backend_vite_nestjs/
├── .trae/                      # Trae IDE 配置目录
│   ├── plans/                  # 开发计划文档
│   ├── rules/                  # 代码规范文档
│   │   └── code-rules.md       # 详细代码规范（必读）
│   └── specs/                  # 功能规格说明
├── fronted_vite/               # 前端项目
│   ├── src/
│   │   ├── api/               # API 接口封装
│   │   ├── assets/            # 静态资源
│   │   ├── components/        # 公共组件
│   │   ├── directives/        # 自定义指令
│   │   ├── enums/             # 枚举定义
│   │   ├── hooks/             # 组合式函数
│   │   ├── languages/         # 国际化
│   │   ├── layouts/           # 布局组件
│   │   ├── routers/           # 路由配置
│   │   ├── stores/            # Pinia 状态管理
│   │   ├── styles/            # 全局样式
│   │   ├── utils/             # 工具函数
│   │   └── views/             # 页面视图
│   ├── build/                  # 构建配置
│   └── public/                 # 公共资源
├── backend_nestjs/             # 后端项目
│   ├── src/
│   │   ├── common/            # 公共模块
│   │   │   ├── decorators/    # 自定义装饰器
│   │   │   ├── filters/       # 异常过滤器
│   │   │   ├── guards/        # 守卫
│   │   │   ├── interceptors/  # 拦截器
│   │   │   └── services/      # 公共服务
│   │   ├── config/            # 配置文件
│   │   ├── entities/          # TypeORM 实体
│   │   ├── modules/           # 功能模块
│   │   │   ├── auth/          # 认证模块
│   │   │   ├── user/          # 用户模块
│   │   │   ├── menu/          # 菜单模块
│   │   │   ├── role/          # 角色模块
│   │   │   ├── log/           # 日志模块
│   │   │   ├── upload/        # 上传模块
│   │   │   └── dictionary/    # 字典模块
│   │   ├── utils/             # 工具函数
│   │   ├── app.module.ts      # 根模块
│   │   └── main.ts            # 入口文件
│   └── test/                   # 测试文件
└── docker-compose.yml          # Docker 编排配置
```

***

## 开发环境设置

### 前置要求

- Node.js 18+
- pnpm 10.20.0+
- MySQL 8.0+
- Redis 6.0+

### 安装依赖

```bash
# 前端
cd fronted_vite
pnpm install

# 后端
cd backend_nestjs
pnpm install
```

### 启动开发服务

```bash
# 前端开发服务 (默认端口 5173)
cd fronted_vite
pnpm dev

# 后端开发服务 (默认端口 3000)
cd backend_nestjs
pnpm start:dev
```

### 构建生产版本

```bash
# 前端构建
cd fronted_vite
pnpm build

# 后端构建
cd backend_nestjs
pnpm build
```

***

## 代码规范

> **重要**: 详细代码规范请查阅 [.trae/rules/code-rules.md](.trae/rules/code-rules.md)

### 核心原则

1. **代码结构清晰** - 遵循设计模式最佳实践，考虑长远维护
2. **逻辑严谨整洁** - 容易理解和维护，避免过度设计
3. **工程化优先** - 以安全正常使用为主，越简单越可控
4. **组件化设计** - 考虑组件复用性

### 设计原则

- 开闭原则（OCP）
- 单一职责原则（SRP）
- 里氏代换原则（LSP）
- 依赖倒转原则（DIP）
- 接口隔离原则（ISP）
- 合成/聚合复用原则（CARP）
- 最少知识原则（LKP）

### 代码编写八荣八耻

| 耻    | 荣    |
| ---- | ---- |
| 暗猜接口 | 认真查阅 |
| 模糊执行 | 寻求确认 |
| 盲想业务 | 人类确认 |
| 创造接口 | 复用现有 |
| 跳过验证 | 主动测试 |
| 破坏架构 | 遵循规范 |
| 假装理解 | 诚实无知 |
| 盲目修改 | 谨慎重构 |

### 注释规范

**所有代码必须添加中文注释**，使用 JSDoc 格式：

```typescript
/**
 * 获取用户列表数据
 *
 * @description 分页查询用户列表，支持按用户名、姓名、邮箱、电话、状态筛选
 * @param {UserListQueryDto} query - 查询参数对象
 * @returns {Promise<UserListResponse>} 用户列表响应
 */
async getUserList(query: UserListQueryDto) {
  // 实现逻辑...
}
```

### 命名规范

| 类型            | 命名方式           | 示例                     |
| ------------- | -------------- | ---------------------- |
| 目录            | kebab-case     | `user-manage/`         |
| TypeScript 文件 | camelCase      | `userService.ts`       |
| Vue 组件        | PascalCase     | `LoginForm.vue`        |
| 类型定义文件        | camelCase      | `index.d.ts`           |
| 配置文件          | kebab-case     | `vite.config.ts`       |
| 测试文件          | 原文件名 + `.spec` | `auth.service.spec.ts` |

***

## API 规范

### 后端 API 路由前缀

- `/api/system/*` - 系统 API
- `/api/upload/*` - 文件上传 API
- `/swagger/docs` - Swagger API 文档

### 统一响应格式

```typescript
{
  "code": 200,           // HTTP 状态码
  "message": "success",  // 响应消息
  "data": { ... }        // 响应数据
}
```

### 认证方式

- 使用 JWT Bearer Token 认证
- 公开接口使用 `@Public()` 装饰器标记

***

## 测试规范

### 后端测试

```bash
# 运行单元测试
cd backend_nestjs
pnpm test

# 运行 e2e 测试
pnpm test:e2e

# 测试覆盖率
pnpm test:cov
```

### 测试文件命名

- 单元测试: `*.spec.ts`
- E2E 测试: `*.e2e-spec.ts`

***

## Git 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>
```

### Type 类型

| 类型         | 描述      |
| ---------- | ------- |
| `feat`     | 新功能     |
| `fix`      | Bug 修复  |
| `docs`     | 文档更新    |
| `style`    | 代码格式调整  |
| `refactor` | 代码重构    |
| `perf`     | 性能优化    |
| `test`     | 测试相关    |
| `chore`    | 构建/工具相关 |

### Scope 范围

| 范围         | 描述        |
| ---------- | --------- |
| `frontend` | 前端项目      |
| `nestjs`   | NestJS 后端 |
| `shared`   | 共享代码      |

### 示例

```bash
feat(frontend): 添加用户头像上传功能
fix(nestjs): 修复登录 Token 过期问题
docs(shared): 更新项目文档
```

***

## 常见开发场景

### 场景 1: 新增后端模块

1. 在 `backend_nestjs/src/modules/` 下创建模块目录
2. 创建必要文件: `xxx.module.ts`, `xxx.controller.ts`, `xxx.service.ts`
3. 在 `dto/` 目录下创建 DTO 文件
4. 在 `app.module.ts` 中导入新模块
5. 添加中文注释和 Swagger 文档

### 场景 2: 新增前端页面

1. 在 `fronted_vite/src/views/` 下创建页面目录
2. 创建 `index.vue` 组件文件
3. 在 `routers/modules/` 中添加路由配置
4. 在 `api/modules/` 中添加 API 接口
5. 如需状态管理，在 `stores/modules/` 中添加 store

### 场景 3: 代码质量检查

```bash
# 前端检查
cd fronted_vite
pnpm run format        # Prettier 格式化
pnpm run lint          # ESLint 检查

# 后端检查
cd backend_nestjs
pnpm run format        # Prettier 格式化
pnpm run lint          # ESLint 检查
pnpm run build         # TypeScript 类型检查
```

***

## 重要文件索引

| 文件                                 | 用途            |
| ---------------------------------- | ------------- |
| `.trae/rules/code-rules.md`        | 详细代码规范（必读）    |
| `fronted_vite/vite.config.ts`      | Vite 配置       |
| `fronted_vite/src/main.ts`         | 前端入口          |
| `backend_nestjs/src/main.ts`       | 后端入口          |
| `backend_nestjs/src/app.module.ts` | NestJS 根模块    |
| `backend_nestjs/tsconfig.json`     | TypeScript 配置 |

***

## 注意事项

1. **包管理器**: 统一使用 pnpm，禁止使用 npm 或 yarn
2. **路径别名**: 前端使用 `@/` 作为 `src/` 目录别名
3. **环境变量**: 前端使用 `.env.*` 文件，后端使用 `.env` 文件
4. **API 文档**: 后端 Swagger 文档地址 `/swagger/docs`
5. **敏感信息**: 禁止提交密钥、密码等敏感信息到代码仓库
6. **依赖规范**:不允许擅自新增依赖，需明确告知依赖的作用，由老板来确定是否安装依赖

***

*文档更新时间: 2026-03-23*
