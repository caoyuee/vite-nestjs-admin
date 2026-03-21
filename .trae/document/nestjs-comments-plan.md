# NestJS Backend 代码注释添加计划

## 项目概述

为 nestjs_backend 目录下的所有 TypeScript 文件添加中文注释，遵循项目规则中定义的注释规范。

## 文件统计

| 类别 | 文件数 |
|------|--------|
| 配置文件 (config/) | 4 |
| 公共模块 (common/) | 7 |
| 实体文件 (entities/) | 7 |
| 认证模块 (modules/auth/) | 5 |
| 用户模块 (modules/user/) | 6 |
| 菜单模块 (modules/menu/) | 5 |
| 角色模块 (modules/role/) | 5 |
| 权限模块 (modules/auth-permission/) | 4 |
| 日志模块 (modules/log/) | 4 |
| 上传模块 (modules/upload/) | 2 |
| 工具函数 (utils/) | 2 |
| 入口文件 | 2 |
| **总计** | **53** |

---

## 任务清单

### 阶段一：配置和入口文件

- [ ] Task 1.1: 添加 main.ts 注释
- [ ] Task 1.2: 添加 app.module.ts 注释
- [ ] Task 1.3: 添加 config/ 目录文件注释
  - [ ] database.config.ts
  - [ ] jwt.config.ts
  - [ ] redis.config.ts
  - [ ] upload.config.ts

### 阶段二：公共模块

- [ ] Task 2.1: 添加 common/decorators/ 注释
  - [ ] current-user.decorator.ts
  - [ ] public.decorator.ts
- [ ] Task 2.2: 添加 common/filters/ 注释
  - [ ] http-exception.filter.ts
- [ ] Task 2.3: 添加 common/guards/ 注释
  - [ ] jwt-auth.guard.ts
- [ ] Task 2.4: 添加 common/interceptors/ 注释
  - [ ] response.interceptor.ts
- [ ] Task 2.5: 添加 common/interfaces/ 注释
  - [ ] response.interface.ts

### 阶段三：实体文件

- [ ] Task 3.1: 添加 entities/ 注释
  - [ ] user.entity.ts
  - [ ] menu.entity.ts
  - [ ] role.entity.ts
  - [ ] auth.entity.ts
  - [ ] dictionary.entity.ts
  - [ ] personnel.entity.ts
  - [ ] index.ts

### 阶段四：认证模块

- [ ] Task 4.1: 添加 auth.module.ts 注释
- [ ] Task 4.2: 添加 auth.controller.ts 注释
- [ ] Task 4.3: 添加 auth.service.ts 注释
- [ ] Task 4.4: 添加 strategies/jwt.strategy.ts 注释
- [ ] Task 4.5: 添加 dto/ 注释
  - [ ] login.dto.ts
  - [ ] login-response.dto.ts

### 阶段五：用户模块

- [ ] Task 5.1: 添加 user.module.ts 注释
- [ ] Task 5.2: 添加 user.controller.ts 注释
- [ ] Task 5.3: 添加 user.service.ts 注释
- [ ] Task 5.4: 添加 dto/ 注释
  - [ ] create-user.dto.ts
  - [ ] update-user.dto.ts
  - [ ] user-list-query.dto.ts
  - [ ] reset-password.dto.ts

### 阶段六：菜单模块

- [ ] Task 6.1: 添加 menu.module.ts 注释
- [ ] Task 6.2: 添加 menu.controller.ts 注释
- [ ] Task 6.3: 添加 menu.service.ts 注释
- [ ] Task 6.4: 添加 dto/ 注释
  - [ ] create-menu.dto.ts
  - [ ] update-menu.dto.ts
  - [ ] menu-list-query.dto.ts

### 阶段七：角色模块

- [ ] Task 7.1: 添加 role.module.ts 注释
- [ ] Task 7.2: 添加 role.controller.ts 注释
- [ ] Task 7.3: 添加 role.service.ts 注释
- [ ] Task 7.4: 添加 dto/ 注释
  - [ ] create-role.dto.ts
  - [ ] role-list-query.dto.ts
  - [ ] role-permission.dto.ts

### 阶段八：权限模块

- [ ] Task 8.1: 添加 auth-permission.module.ts 注释
- [ ] Task 8.2: 添加 auth-permission.controller.ts 注释
- [ ] Task 8.3: 添加 auth-permission.service.ts 注释
- [ ] Task 8.4: 添加 dto/auth-query.dto.ts 注释

### 阶段九：日志模块

- [ ] Task 9.1: 添加 log.module.ts 注释
- [ ] Task 9.2: 添加 log.controller.ts 注释
- [ ] Task 9.3: 添加 log.service.ts 注释
- [ ] Task 9.4: 添加 dto/ 注释
  - [ ] log-query.dto.ts
  - [ ] clear-log.dto.ts

### 阶段十：上传模块

- [ ] Task 10.1: 添加 upload.module.ts 注释
- [ ] Task 10.2: 添加 upload.controller.ts 注释

### 阶段十一：工具函数

- [ ] Task 11.1: 添加 utils/menu-tree.util.ts 注释
- [ ] Task 11.2: 添加 utils/index.ts 注释

---

## 注释规范

### 文件头注释

每个文件开头应添加文件说明注释：

```typescript
/**
 * @file 文件名称
 * @description 文件功能描述
 * @module 模块名称（可选）
 */
```

### 类注释

```typescript
/**
 * 类功能描述
 *
 * @class 类名
 * @description 详细描述
 */
```

### 方法注释

```typescript
/**
 * 方法功能描述
 *
 * @param {类型} 参数名 - 参数描述
 * @returns {类型} 返回值描述
 * @throws {异常类型} 异常描述
 */
```

### 属性注释

```typescript
/** 属性描述 */
@property
```

---

## 执行顺序

1. 阶段一：配置和入口文件（基础）
2. 阶段二：公共模块（被其他模块依赖）
3. 阶段三：实体文件（数据模型）
4. 阶段四至十：各功能模块（可并行）
5. 阶段十一：工具函数

---

*计划创建时间: 2026-03-21*
