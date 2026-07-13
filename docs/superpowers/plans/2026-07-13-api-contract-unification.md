# API Contract Unification Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 固定前后端接口契约规则，并把现有前后端接口迁移到统一规则下。

**Architecture:** 后端保留旧 Controller 路径作为兼容入口，同时新增语义化 REST 路由；前端 API 封装统一切到新路由。缺失的角色编辑、视频上传和演示用户接口由后端补齐。

**Tech Stack:** Vue 3、Axios、NestJS 11、TypeORM、class-validator、Multer。

## Global Constraints

- 统一使用 pnpm，禁止使用 npm 或 yarn。
- 不擅自新增依赖。
- 后端 JSON 响应格式固定为 `{ code: number; message: string; data: T | null }`。
- 分页响应固定为 `{ list: T[]; total: number; pageNum: number; pageSize: number }`。
- 新增或修改代码使用中文 JSDoc 或中文注释说明关键逻辑。

---

### Task 1: 固定接口规则文档

**Files:**
- Create: `docs/API_CONTRACT_RULES.md`

**Interfaces:**
- Produces: 项目后续接口设计的统一规则。

- [x] **Step 1: 写入接口规则文档**

创建 `docs/API_CONTRACT_RULES.md`，包含路由分组、HTTP 方法、参数位置、分页契约、响应格式、命名规则、兼容策略和新增接口要求。

### Task 2: 后端补齐语义化 REST 接口

**Files:**
- Modify: `backend_nestjs/src/modules/auth/auth.controller.ts`
- Modify: `backend_nestjs/src/modules/auth/auth.module.ts`
- Modify: `backend_nestjs/src/modules/user/user.controller.ts`
- Modify: `backend_nestjs/src/modules/user/user.service.ts`
- Modify: `backend_nestjs/src/modules/menu/menu.controller.ts`
- Modify: `backend_nestjs/src/modules/menu/menu.service.ts`
- Modify: `backend_nestjs/src/modules/role/role.controller.ts`
- Modify: `backend_nestjs/src/modules/role/role.service.ts`
- Create: `backend_nestjs/src/modules/role/dto/update-role.dto.ts`
- Modify: `backend_nestjs/src/modules/upload/upload.controller.ts`
- Modify: `backend_nestjs/src/modules/auth-permission/auth-permission.controller.ts`
- Modify: `backend_nestjs/src/modules/log/log.controller.ts`
- Modify: `backend_nestjs/src/modules/dictionary/dictionary.controller.ts`

**Interfaces:**
- Produces: `/api/system/auth`、`/api/system/users`、`/api/system/menus`、`/api/system/roles`、`/api/system/permissions`、`/api/system/logs`、`/api/system/dictionaries`、`/api/upload/files/video`。

- [x] **Step 1: 新增新路由 Controller 或方法**
- [x] **Step 2: 保留旧路由兼容入口**
- [x] **Step 3: 补齐分页响应 `pageNum/pageSize`**
- [x] **Step 4: 补齐角色编辑和视频上传**

### Task 3: 新增演示用户后端接口

**Files:**
- Create: `backend_nestjs/src/modules/demo-user/demo-user.module.ts`
- Create: `backend_nestjs/src/modules/demo-user/demo-user.controller.ts`
- Create: `backend_nestjs/src/modules/demo-user/demo-user.service.ts`
- Modify: `backend_nestjs/src/app.module.ts`

**Interfaces:**
- Produces: `/api/system/demo/users` 相关演示接口，供 ProTable 和组件示例页使用。

- [x] **Step 1: 新建演示用户模块**
- [x] **Step 2: 返回符合前端类型的演示用户、部门、角色和字典数据**
- [x] **Step 3: 支持导入、导出、删除、状态切换等示例动作**

### Task 4: 前端 API 封装迁移

**Files:**
- Modify: `fronted_vite/src/api/interface/index.ts`
- Modify: `fronted_vite/src/api/modules/login.ts`
- Modify: `fronted_vite/src/api/modules/system.ts`
- Modify: `fronted_vite/src/api/modules/upload.ts`
- Modify: `fronted_vite/src/api/modules/user.ts`
- Modify: `fronted_vite/src/views/system/roleManage/components/AuthDrawer.vue`

**Interfaces:**
- Consumes: Task 2 和 Task 3 产生的新后端接口。

- [x] **Step 1: 修正统一响应和分页类型**
- [x] **Step 2: 将真实后台接口切到语义化路径**
- [x] **Step 3: 将演示页面接口切到 `/system/demo/users`**
- [x] **Step 4: 修正权限类型参数为 `button`**

### Task 5: 验证

**Files:**
- No code changes.

**Interfaces:**
- Consumes: 全部前后端修改。

- [x] **Step 1: 运行后端构建**

Run: `pnpm build` in `backend_nestjs`

- [x] **Step 2: 运行前端构建**

Run: `pnpm build` in `fronted_vite`

- [x] **Step 3: 汇总仍需人工联调的接口**

说明需要真实 MySQL/Redis 数据才能完整验证的登录、菜单和权限链路。
