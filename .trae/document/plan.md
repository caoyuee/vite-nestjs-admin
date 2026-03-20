# NestJS 重构计划

## 项目概述

将 koajs_backend 项目重构为 NestJS 框架，保持原有功能和 API 接口不变。

## 源项目分析

### 技术栈 (KoaJS)
- 框架: Koa 3.x + @koa/router
- ORM: TypeORM 0.3.x
- 数据库: MySQL
- 缓存: Redis (ioredis)
- 认证: JWT (koa-jwt + jsonwebtoken)
- 日志: Winston
- 文件上传: koa-body

### 功能模块
1. **用户模块**: 登录、用户管理、日志管理
2. **菜单模块**: 菜单 CRUD、菜单树
3. **角色模块**: 角色 CRUD、角色授权
4. **权限模块**: 权限查询
5. **文件上传**: 静态资源上传

### API 路由前缀
- `/api/system` - 主要 API
- `/api/upload` - 文件上传
- `/swagger` - API 文档

---

## 重构目标

### 目标技术栈 (NestJS)
- 框架: NestJS 11.x
- ORM: TypeORM (复用现有实体)
- 数据库: MySQL
- 缓存: Redis (@nestjs/cache-manager + cache-manager-ioredis)
- 认证: @nestjs/jwt + @nestjs/passport
- 日志: NestJS 内置 Logger + winston
- 文件上传: @nestjs/platform-express + multer

---

## 目录结构规划

```
nestjs_backend/
├── src/
│   ├── common/                    # 公共模块
│   │   ├── decorators/           # 自定义装饰器
│   │   │   └── current-user.decorator.ts
│   │   ├── filters/              # 异常过滤器
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/               # 守卫
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interceptors/         # 拦截器
│   │   │   └── response.interceptor.ts
│   │   ├── pipes/                # 管道
│   │   │   └── validation.pipe.ts
│   │   └── interfaces/           # 公共接口
│   │       └── response.interface.ts
│   │
│   ├── config/                   # 配置模块
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   └── upload.config.ts
│   │
│   ├── entities/                 # TypeORM 实体 (复用 koajs)
│   │   ├── user.entity.ts
│   │   ├── menu.entity.ts
│   │   ├── role.entity.ts
│   │   ├── auth.entity.ts
│   │   ├── dictionary.entity.ts
│   │   └── personnel.entity.ts
│   │
│   ├── modules/                  # 功能模块
│   │   ├── auth/                 # 认证模块
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── strategies/
│   │   │   │   └── jwt.strategy.ts
│   │   │   └── dto/
│   │   │       ├── login.dto.ts
│   │   │       └── login-response.dto.ts
│   │   │
│   │   ├── user/                 # 用户模块
│   │   │   ├── user.controller.ts
│   │   │   ├── user.service.ts
│   │   │   ├── user.module.ts
│   │   │   └── dto/
│   │   │       ├── create-user.dto.ts
│   │   │       ├── update-user.dto.ts
│   │   │       ├── user-list-query.dto.ts
│   │   │       └── reset-password.dto.ts
│   │   │
│   │   ├── menu/                 # 菜单模块
│   │   │   ├── menu.controller.ts
│   │   │   ├── menu.service.ts
│   │   │   ├── menu.module.ts
│   │   │   └── dto/
│   │   │       ├── create-menu.dto.ts
│   │   │       ├── update-menu.dto.ts
│   │   │       └── menu-list-query.dto.ts
│   │   │
│   │   ├── role/                 # 角色模块
│   │   │   ├── role.controller.ts
│   │   │   ├── role.service.ts
│   │   │   ├── role.module.ts
│   │   │   └── dto/
│   │   │       ├── create-role.dto.ts
│   │   │       ├── role-list-query.dto.ts
│   │   │       └── role-permission.dto.ts
│   │   │
│   │   ├── auth-permission/      # 权限模块
│   │   │   ├── auth-permission.controller.ts
│   │   │   ├── auth-permission.service.ts
│   │   │   ├── auth-permission.module.ts
│   │   │   └── dto/
│   │   │       └── auth-query.dto.ts
│   │   │
│   │   ├── log/                  # 日志模块
│   │   │   ├── log.controller.ts
│   │   │   ├── log.service.ts
│   │   │   ├── log.module.ts
│   │   │   └── dto/
│   │   │       ├── log-query.dto.ts
│   │   │       └── clear-log.dto.ts
│   │   │
│   │   └── upload/               # 文件上传模块
│   │       ├── upload.controller.ts
│   │       ├── upload.service.ts
│   │       ├── upload.module.ts
│   │       └── upload.config.ts
│   │
│   ├── utils/                    # 工具函数
│   │   ├── app-error.ts
│   │   ├── menu-tree.util.ts
│   │   └── auth-extract.util.ts
│   │
│   ├── app.module.ts             # 根模块
│   └── main.ts                   # 入口文件
│
├── logs/                         # 日志目录
├── resource/                     # 静态资源目录
├── test/                         # 测试文件
├── .env                          # 环境变量
├── nest-cli.json
├── package.json
├── tsconfig.json
└── tsconfig.build.json
```

---

## 任务清单

### 阶段一：基础设施搭建

#### 1.1 配置模块
- [ ] 安装必要依赖包
- [ ] 创建数据库配置 (database.config.ts)
- [ ] 创建 Redis 配置 (redis.config.ts)
- [ ] 创建 JWT 配置 (jwt.config.ts)
- [ ] 创建文件上传配置 (upload.config.ts)

#### 1.2 公共模块
- [ ] 创建统一响应格式 (response.interceptor.ts)
- [ ] 创建异常过滤器 (http-exception.filter.ts)
- [ ] 创建自定义错误类 (app-error.ts)
- [ ] 创建 JWT 认证守卫 (jwt-auth.guard.ts)
- [ ] 创建当前用户装饰器 (current-user.decorator.ts)

#### 1.3 实体迁移
- [ ] 迁移 User 实体
- [ ] 迁移 Menu 实体
- [ ] 迁移 Role 实体
- [ ] 迁移 Auth 实体
- [ ] 迁移 Dictionary 实体
- [ ] 迁移 Personnel 实体

### 阶段二：核心模块开发

#### 2.1 认证模块 (Auth)
- [ ] 创建 AuthModule
- [ ] 实现 JWT Strategy
- [ ] 实现登录接口 POST /api/system/user/login
- [ ] 实现退出接口 POST /api/system/user/logout
- [ ] 实现 Token 验证逻辑

#### 2.2 用户模块 (User)
- [ ] 创建 UserModule
- [ ] 实现用户信息接口 GET /api/system/user/userInfo
- [ ] 实现创建用户接口 POST /api/system/user/addUser
- [ ] 实现编辑用户接口 PUT /api/system/user/editUser
- [ ] 实现删除用户接口 DELETE /api/system/user/deleteUser/:id
- [ ] 实现用户列表接口 GET /api/system/user/userList
- [ ] 实现重置密码接口 PUT /api/system/user/ResetPwd

#### 2.3 菜单模块 (Menu)
- [ ] 创建 MenuModule
- [ ] 实现新增菜单接口 POST /api/system/user/addMenu
- [ ] 实现编辑菜单接口 PUT /api/system/user/editMenu
- [ ] 实现删除菜单接口 DELETE /api/system/user/deleteMenu/:id
- [ ] 实现用户菜单接口 GET /api/system/user/menuList
- [ ] 实现所有菜单接口 GET /api/system/user/allMenuList

#### 2.4 角色模块 (Role)
- [ ] 创建 RoleModule
- [ ] 实现新增角色接口 POST /api/system/user/addRole
- [ ] 实现角色列表接口 GET /api/system/user/getRoleList
- [ ] 实现角色信息接口 GET /api/system/user/getRoleInfo
- [ ] 实现删除角色接口 DELETE /api/system/user/deleteRole
- [ ] 实现角色授权接口 POST /api/system/user/putRolePermission

#### 2.5 权限模块 (AuthPermission)
- [ ] 创建 AuthPermissionModule
- [ ] 实现权限列表接口 GET /api/system/user/getAuthBtns

### 阶段三：扩展功能开发

#### 3.1 日志模块 (Log)
- [ ] 创建 LogModule
- [ ] 实现 Winston 日志集成
- [ ] 实现日志查询接口 GET /api/system/user/logs
- [ ] 实现日志清理接口 DELETE /api/system/user/logs

#### 3.2 文件上传模块 (Upload)
- [ ] 创建 UploadModule
- [ ] 实现文件上传接口 POST /api/upload/images/avatar
- [ ] 配置静态资源服务

#### 3.3 API 文档
- [ ] 集成 Swagger (@nestjs/swagger)
- [ ] 配置 API 文档路由 /swagger/docs

### 阶段四：测试与优化

#### 4.1 单元测试
- [ ] 用户服务测试
- [ ] 菜单服务测试
- [ ] 角色服务测试

#### 4.2 集成测试
- [ ] API 接口测试
- [ ] 认证流程测试

#### 4.3 优化
- [ ] 代码规范检查
- [ ] 性能优化
- [ ] 文档完善

---

## API 接口对照表

| KoaJS 路由 | NestJS 路由 | 方法 | 说明 |
|-----------|-------------|------|------|
| /api/system/user/login | /api/system/user/login | POST | 用户登录 |
| /api/system/user/logout | /api/system/user/logout | POST | 退出登录 |
| /api/system/user/userInfo | /api/system/user/userInfo | GET | 获取用户信息 |
| /api/system/user/addUser | /api/system/user/addUser | POST | 创建用户 |
| /api/system/user/editUser | /api/system/user/editUser | PUT | 编辑用户 |
| /api/system/user/deleteUser/:id | /api/system/user/deleteUser/:id | DELETE | 删除用户 |
| /api/system/user/userList | /api/system/user/userList | GET | 用户列表 |
| /api/system/user/ResetPwd | /api/system/user/ResetPwd | PUT | 重置密码 |
| /api/system/user/logs | /api/system/user/logs | GET | 获取日志 |
| /api/system/user/logs | /api/system/user/logs | DELETE | 清空日志 |
| /api/system/user/addMenu | /api/system/user/addMenu | POST | 新增菜单 |
| /api/system/user/editMenu | /api/system/user/editMenu | PUT | 编辑菜单 |
| /api/system/user/deleteMenu/:id | /api/system/user/deleteMenu/:id | DELETE | 删除菜单 |
| /api/system/user/menuList | /api/system/user/menuList | GET | 用户菜单 |
| /api/system/user/allMenuList | /api/system/user/allMenuList | GET | 所有菜单 |
| /api/system/user/addRole | /api/system/user/addRole | POST | 新增角色 |
| /api/system/user/getRoleList | /api/system/user/getRoleList | GET | 角色列表 |
| /api/system/user/getRoleInfo | /api/system/user/getRoleInfo | GET | 角色信息 |
| /api/system/user/deleteRole | /api/system/user/deleteRole | DELETE | 删除角色 |
| /api/system/user/putRolePermission | /api/system/user/putRolePermission | POST | 角色授权 |
| /api/system/user/getAuthBtns | /api/system/user/getAuthBtns | GET | 权限列表 |
| /api/upload/images/avatar | /api/upload/images/avatar | POST | 文件上传 |

---

## 依赖包清单

### 生产依赖
```json
{
  "@nestjs/common": "^11.0.1",
  "@nestjs/core": "^11.0.1",
  "@nestjs/platform-express": "^11.0.1",
  "@nestjs/typeorm": "^10.0.0",
  "@nestjs/jwt": "^10.2.0",
  "@nestjs/passport": "^10.0.3",
  "@nestjs/config": "^3.2.0",
  "@nestjs/swagger": "^7.3.0",
  "@nestjs/serve-static": "^4.0.0",
  "typeorm": "^0.3.28",
  "mysql2": "^3.15.3",
  "passport": "^0.7.0",
  "passport-jwt": "^4.0.1",
  "bcryptjs": "^3.0.3",
  "ioredis": "^5.8.2",
  "class-validator": "^0.14.1",
  "class-transformer": "^0.5.1",
  "winston": "^3.19.0",
  "winston-daily-rotate-file": "^5.0.0",
  "dayjs": "^1.11.19",
  "reflect-metadata": "^0.2.2",
  "rxjs": "^7.8.1"
}
```

### 开发依赖
```json
{
  "@nestjs/cli": "^11.0.0",
  "@nestjs/schematics": "^11.0.0",
  "@nestjs/testing": "^11.0.1",
  "@types/express": "^5.0.0",
  "@types/jest": "^30.0.0",
  "@types/node": "^22.10.7",
  "@types/passport-jwt": "^4.0.1",
  "@types/bcryptjs": "^2.4.6",
  "@types/multer": "^1.4.12",
  "typescript": "^5.7.3",
  "jest": "^30.0.0",
  "ts-jest": "^29.2.5",
  "source-map-support": "^0.5.21",
  "supertest": "^7.0.0"
}
```

---

## 执行顺序

1. **阶段一**：基础设施搭建（配置、公共模块、实体迁移）
2. **阶段二**：核心模块开发（认证、用户、菜单、角色、权限）
3. **阶段三**：扩展功能开发（日志、文件上传、API文档）
4. **阶段四**：测试与优化

预计总工作量：约 50-60 个任务项

---

*计划创建时间: 2026-03-20*
