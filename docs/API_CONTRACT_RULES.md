# 前后端接口契约规则

> 本文档用于固定本项目的前后端接口设计规则。新增或修改接口时，必须先遵守本文档，再编写前端 API 封装和后端 Controller/Service。

## 1. 路由分组

接口按业务域分组，避免把所有功能都挂在 `/user` 下。

| 业务域 | 路由前缀 | 说明 |
| --- | --- | --- |
| 认证 | `/api/system/auth` | 登录、退出登录 |
| 当前用户 | `/api/system/users/me` | 当前登录用户资料、当前用户密码 |
| 用户管理 | `/api/system/users` | 后台用户管理 |
| 菜单 | `/api/system/menus` | 菜单管理、当前用户菜单 |
| 角色 | `/api/system/roles` | 角色管理、角色授权 |
| 权限 | `/api/system/permissions` | 按钮权限、表格权限 |
| 日志 | `/api/system/logs` | 系统日志查询与清理 |
| 字典 | `/api/system/dictionaries` | 字典管理和字典选项 |
| 演示用户 | `/api/system/demo/users` | ProTable 等演示页面使用的数据 |
| 上传 | `/api/upload` | 图片、视频等文件上传 |

## 2. HTTP 方法

资源型接口使用统一 REST 风格。

| 场景 | 方法和路径 |
| --- | --- |
| 列表查询 | `GET /resource` |
| 详情查询 | `GET /resource/:id` |
| 新增 | `POST /resource` |
| 编辑 | `PUT /resource/:id` |
| 删除 | `DELETE /resource/:id` |
| 特殊动作 | `POST /resource/:id/action` 或 `PUT /resource/:id/action` |

当前登录用户相关接口不从前端传用户 ID，统一从 JWT 中读取。

## 3. 参数位置

| 参数类型 | 位置 |
| --- | --- |
| 分页参数 | `@Query()` |
| 搜索筛选 | `@Query()` |
| 新增数据 | `@Body()` |
| 编辑 ID | `@Param('id')` |
| 编辑数据 | `@Body()` |
| 删除 ID | `@Param('id')` |
| 当前用户 | `@CurrentUser()` |
| 上传文件 | `multipart/form-data` 的 `file` 字段 |

## 4. 分页契约

分页请求参数固定为：

```ts
{
  pageNum: number;
  pageSize: number;
}
```

分页响应数据固定为：

```ts
{
  list: T[];
  total: number;
  pageNum: number;
  pageSize: number;
}
```

不分页的列表接口可以直接返回 `T[]`。

## 5. 响应格式

所有 JSON 接口统一响应格式：

```ts
{
  code: number;
  message: string;
  data: T | null;
}
```

成功状态使用 `200`，创建成功可以使用 `201`。前端类型中的 `code` 必须是 `number`。

## 6. 命名规则

- 后端资源路由使用复数名：`users`、`roles`、`menus`、`permissions`。
- 前端 API 函数使用明确动作名：`getRoleList`、`createRole`、`updateRole`、`deleteRole`。
- 不新增大小写混乱的路径，例如 `ResetPwd`；统一使用 `reset-password`。
- 演示页面接口必须挂在 `/api/system/demo/*`，不能混入真实业务接口。

## 7. 兼容策略

本次迁移期间，后端可以保留旧路径作为兼容别名，前端统一切到新路径。后续确认页面稳定后，再移除旧路径。

## 8. 新增接口要求

- 前端 API 封装必须对应真实后端接口。
- 后端没有实现的前端接口，要么新增后端接口，要么删除前端调用。
- 不允许新增依赖；确需新增依赖时必须先说明用途并征得确认。
- 新增 TypeScript 代码遵循项目规范，使用中文 JSDoc 或中文注释说明关键逻辑。
