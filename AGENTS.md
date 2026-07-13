# AGENTS.md - AI 编码代理项目规则

> 本文件是本仓库给 AI 编码代理和后来维护者读取的项目级规则入口。
> 人类项目介绍请看根目录 `readme.md`；接口细则请看 `docs/API_CONTRACT_RULES.md`。

## 规则来源

本文件整合以下来源，并抽象成可执行规则：

- `.agents/rules/code-rules.md`：原项目代码规范和示例。
- `.agents/rules/superpowers-zh.md`：设计先行、调试先找根因、完成前验证等协作原则。
- `.agents/skills/*`：AI 工作流方法论，仅抽取适合项目协作的部分。
- `docs/API_CONTRACT_RULES.md`：前后端接口契约。
- `docs/superpowers/plans/2026-07-13-api-contract-unification.md`：接口统一实施计划和约束。
- `.codex/`：当前为空；统一以根目录 `AGENTS.md` 作为 Codex/AI 代理规则入口。

当规则冲突时，优先级为：

1. 用户当前明确指令。
2. `docs/API_CONTRACT_RULES.md` 中的接口契约。
3. 本文件。
4. `.agents/rules/code-rules.md` 中更细的示例规则。

## 项目定位

这是一个前后端一体的后台管理项目。

| 子项目 | 目录 | 技术栈 | 说明 |
| --- | --- | --- | --- |
| 前端 | `fronted_vite/` | Vue 3、Vite/rolldown-vite、Pinia、Element Plus、Vue Router、Axios、ECharts | 管理后台界面 |
| 后端 | `backend_nestjs/` | NestJS 11、TypeORM、MySQL、Redis、JWT、Swagger、Winston | RESTful API 服务 |

## 工作方式

- 先读现有代码和文档，再改代码。不要暗猜接口、目录、类型或业务语义。
- 新增或修改功能前，先确认已有模块是否能复用；确需新增模块时，保持边界清晰。
- 遇到 bug 时先定位根因，再修改。不要用多处试探性改动掩盖问题。
- 完成前必须运行和变更范围匹配的验证命令，并在回复中说明命令和结果。
- 工作区可能已有他人改动，不得回滚或覆盖与任务无关的修改。
- 不允许擅自新增依赖。确需新增依赖时，先说明用途、影响和替代方案，由用户确认。
- 统一使用 `pnpm`，禁止使用 `npm` 或 `yarn`。

## 目录边界

### 前端 `fronted_vite/`

- `src/api/`：Axios 实例、接口封装和接口类型。
- `src/components/`：可复用公共组件。
- `src/views/`：页面视图。
- `src/routers/`：路由配置。
- `src/stores/`：Pinia 状态。
- `src/styles/`：全局样式。
- `src/utils/`：通用工具函数。

### 后端 `backend_nestjs/`

- `src/common/`：装饰器、过滤器、守卫、拦截器、公共服务。
- `src/config/`：数据库、JWT、Redis、上传等配置。
- `src/entities/`：TypeORM 实体。
- `src/modules/`：业务模块，每个模块保持 controller/service/dto/module 边界。
- `src/utils/`：通用工具函数。

### 文档和规则

- `readme.md`：项目介绍、启动方式和文档索引，写给人看。
- `AGENTS.md`：AI 编码代理必须读取的项目规则。
- `docs/API_CONTRACT_RULES.md`：接口契约唯一细则来源。
- `.agents/rules/code-rules.md`：更细的代码规范示例。

## 接口契约

新增或修改接口必须先遵守 `docs/API_CONTRACT_RULES.md`。

### 路由分组

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

### HTTP 方法

- 列表：`GET /resource`
- 详情：`GET /resource/:id`
- 新增：`POST /resource`
- 编辑：`PUT /resource/:id`
- 删除：`DELETE /resource/:id`
- 特殊动作：`POST /resource/:id/action` 或 `PUT /resource/:id/action`

当前登录用户相关接口不从前端传用户 ID，统一从 JWT 中读取。

### 请求参数

- 分页参数和筛选条件放 `@Query()`。
- 新增和编辑数据放 `@Body()`。
- 资源 ID 放 `@Param('id')`。
- 当前用户通过 `@CurrentUser()` 获取。
- 上传文件使用 `multipart/form-data` 的 `file` 字段。

### 响应格式

所有 JSON 接口统一返回：

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

前端 API 类型和后端 DTO/返回值必须同步更新，不允许前端调用不存在的后端接口。

## 前端规则

- Vue 组件使用 `<script setup lang="ts" name="ComponentName">`。
- 组件文件使用 PascalCase，例如 `LoginForm.vue`。
- 前端路径别名使用 `@/` 指向 `src/`，避免深层相对路径。
- API 封装放在 `src/api/modules/`，类型放在 `src/api/interface/`。
- API 函数命名使用明确动作，如 `getRoleList`、`createRole`、`updateRole`、`deleteRole`。
- 业务错误提示优先展示后端返回的 `message`，没有业务消息时再使用通用状态码提示。
- Pinia store 只保存跨页面共享状态；局部页面状态留在组件或组合式函数里。
- 样式优先使用已有变量、布局和 Element Plus 规范，不随意引入新的视觉体系。
- 图表、地图、WebGL 等页面优先复用已有工具和依赖，不手写可由成熟库处理的底层逻辑。

## 后端规则

- 新增业务模块放在 `backend_nestjs/src/modules/<module>/`。
- 常规模块结构为 `dto/`、`*.controller.ts`、`*.service.ts`、`*.module.ts`。
- Controller 只处理路由、参数、认证和 Swagger 描述；业务逻辑放 Service。
- DTO 使用 `class-validator` 和 Swagger 装饰器描述输入。
- 实体放在 `src/entities/`，字段类型要和数据库语义一致。
- 公开接口必须显式使用 `@Public()`。
- 当前用户必须通过 JWT 和 `@CurrentUser()` 获取，避免信任前端传入的用户 ID。
- 异常使用 NestJS 标准异常类，由全局过滤器统一转换为 `{ code, message, data }`。
- 新增服务依赖必须在对应 Module 中注册和导出，不要依赖隐式注入。

## TypeScript 和类型规则

- 前后端 TypeScript 版本保持一致。
- 新代码默认写明确类型，优先使用 interface/type/泛型描述数据结构。
- 不新增无意义的 `any`。历史 `any` 能就地收敛时顺手处理，不能安全判断时保留并说明原因。
- 对第三方库缺失类型时，优先寻找已有类型声明或局部声明，不用大面积 `any` 放开。
- API 类型以实际后端语义为准，不能为了前端方便改错后端契约。
- `unknown` 优先于 `any` 用于外部输入，再通过类型保护收窄。

## 注释和命名

- 复杂业务、公共函数、Controller、Service、DTO、实体需要中文 JSDoc 或中文注释说明语义。
- 注释解释“为什么”和业务约束，不写无价值的逐行翻译。
- 目录使用 kebab-case。
- Vue 组件使用 PascalCase。
- TypeScript 普通文件遵循项目现有命名风格；新增文件优先使用 kebab-case 或与同目录一致。
- 测试文件使用 `*.spec.ts` 或 `*.e2e-spec.ts`。

## 质量检查

前端启动和打包必须先通过 TS 与 ESLint 检查：

```bash
cd fronted_vite
pnpm check
pnpm build
```

后端启动和打包必须先通过 TS 与 ESLint 检查：

```bash
cd backend_nestjs
pnpm check
pnpm build
```

当前脚本已经把检查接入 `dev`、`start`、`start:dev` 和 `build`。修改脚本时不得移除这些检查。

## 测试要求

- 修 bug 时优先补最小回归测试；无法自动化时说明人工验证步骤。
- 后端业务逻辑变更优先补 Jest 单元测试。
- 接口契约变更要同时检查前端 API 类型、后端 DTO、Controller 路由和响应格式。
- 登录、权限、菜单、上传等链路依赖数据库或 Redis 时，至少运行构建检查，并说明未覆盖的人工联调项。

## Git 规则

提交格式：

```text
<type>(<scope>): <subject>
```

常用类型：

- `feat`：新功能
- `fix`：问题修复
- `docs`：文档
- `style`：格式
- `refactor`：重构
- `perf`：性能
- `test`：测试
- `chore`：构建或工具

常用范围：

- `frontend`
- `nestjs`
- `shared`
- `docs`

提交前确认：

- 工作区只包含本次任务相关变更。
- 已运行必要检查。
- 不包含密钥、密码、Token、数据库真实凭据。

## 禁止事项

- 禁止暗猜接口或新增与后端不一致的前端 API。
- 禁止跳过 TS/ESLint 检查后宣称完成。
- 禁止为了通过类型检查扩大 `any`。
- 禁止无确认新增依赖。
- 禁止回滚他人未说明的改动。
- 禁止提交敏感信息。

*更新时间：2026-07-13*
