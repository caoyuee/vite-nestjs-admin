# 项目代码规范

本文档定义了 `koajs-fronted-backend` 项目的统一代码编写规范，涵盖前端（Vue 3 + Vite）、KoaJS 后端和 NestJS 后端三个子项目。

---

## 目录

1. [通用规范](#通用规范)
2. [前端项目规范 (koajs-fronted-vite)](#前端项目规范-koajs-fronted-vite)
3. [KoaJS 后端规范 (koajs_backend)](#koajs-后端规范-koajs_backend)
4. [NestJS 后端规范 (nestjs_backend)](#nestjs-后端规范-nestjs_backend)
5. [Git 提交规范](#git-提交规范)
6. [文件命名规范](#文件命名规范)
7. [目录结构规范](#目录结构规范)

---

## 通用规范

### 包管理器

- **统一使用 pnpm** 作为包管理器
- 版本要求：`pnpm@10.20.0` 或更高

### TypeScript 配置

所有项目必须遵循以下 TypeScript 基础配置：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "sourceMap": true
  }
}
```

### 代码格式化 (Prettier)

统一使用以下 Prettier 配置：

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "endOfLine": "lf"
}
```

### ESLint 规则

#### TypeScript 文件通用规则

```javascript
{
  "no-console": "warn",
  "no-unused-vars": "off",
  "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
  "@typescript-eslint/explicit-module-boundary-types": "off",
  "@typescript-eslint/no-explicit-any": "off"
}
```

### 注释规范

**重要：所有代码块必须添加中文注释，提高代码可读性。**

#### 函数注释

使用 JSDoc 格式，必须包含中文功能描述：

```typescript
/**
 * 获取用户列表数据
 *
 * @param {UserListQueryDto} query - 查询参数对象
 * @returns {Promise<{ code: number; message: string; data: UserList }>} 用户列表响应
 * @throws {BadRequestException} 当查询参数无效时抛出
 * @example
 * // 调用示例
 * const result = await userService.getUserList({ pageNum: 1, pageSize: 10 });
 */
async getUserList(query: UserListQueryDto) {
  // 实现逻辑...
}
```

#### 类方法注释

```typescript
/**
 * 创建新用户
 *
 * @public
 * @static
 * @async
 * @param {CreateUserDto} createUserDto - 用户创建参数
 * @returns {Promise<{ code: number; message: string; data: null }>} 创建结果
 */
public static async createUser(createUserDto: CreateUserDto) {
  // 实现逻辑...
}
```

#### 代码块注释

所有代码块（if/else、for 循环、switch 等）必须添加中文注释：

```typescript
// 判断用户是否存在
if (existingUser) {
  throw new BadRequestException('用户已存在，请直接登录');
}

// 遍历用户列表，过滤掉已删除的用户
for (const user of users) {
  if (!user.deleteTime) {
    validUsers.push(user);
  }
}

// 根据状态执行不同操作
switch (status) {
  case 'active':
    // 处理激活状态
    handleActive();
    break;
  case 'inactive':
    // 处理非激活状态
    handleInactive();
    break;
  default:
    // 处理未知状态
    handleUnknown();
}
```

#### 变量和常量注释

重要变量和常量应添加中文注释：

```typescript
// 用户默认角色列表
const defaultRoles: string[] = [];

// Token 过期时间（7天，单位：秒）
const TOKEN_EXPIRE_TIME = 7 * 24 * 60 * 60;

// 数据库连接配置
const dbConfig: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  // ...
};
```

#### 行内注释

复杂逻辑应添加行内中文注释：

```typescript
const result = await this.userRepository.findAndCount({
  where,           // 查询条件
  skip: (pageNum - 1) * pageSize,  // 跳过记录数
  take: pageSize,  // 每页记录数
  order: { createTime: 'DESC' },   // 按创建时间倒序
});
```

---

## 前端项目规范 (koajs-fronted-vite)

### 技术栈

- **框架**: Vue 3.5+
- **构建工具**: Vite (rolldown-vite)
- **状态管理**: Pinia
- **UI 框架**: Element Plus
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **CSS 预处理器**: SCSS
- **图表库**: ECharts

### Vue 组件规范

#### 组件结构

Vue 单文件组件 (SFC) 必须按以下顺序组织：

```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts" name="ComponentName">
// 脚本内容
</script>

<style scoped lang="scss">
// 样式内容
</style>
```

#### 组件命名

- **PascalCase**: 组件文件名和 `name` 属性使用 PascalCase
- 示例：`LoginForm.vue`、`SwitchDark.vue`

```vue
<script setup lang="ts" name="LoginForm">
// 正确 ✓
</script>
```

#### Script Setup 规范

```vue
<script setup lang="ts" name="ComponentName">
// 1. 导入语句
import { ref, computed, onMounted } from 'vue';
import type { SomeType } from '@/types';
import ComponentA from '@/components/ComponentA.vue';

// 2. Props 定义
interface Props {
  title: string;
  count?: number;
}
const props = withDefaults(defineProps<Props>(), {
  count: 0,
});

// 3. Emits 定义
const emit = defineEmits<{
  (e: 'update', value: string): void;
  (e: 'close'): void;
}>();

// 4. 响应式状态
const loading = ref(false);
const dataList = ref<DataType[]>([]);

// 5. 计算属性
const filteredList = computed(() => dataList.value.filter(...));

// 6. 方法
const handleClick = () => {
  emit('update', 'value');
};

// 7. 生命周期钩子
onMounted(() => {
  fetchData();
});
</script>
```

### 路径别名

使用 `@/` 作为 `src/` 目录的别名：

```typescript
// 正确 ✓
import { useAuthStore } from '@/stores/modules/auth';
import ComponentA from '@/components/ComponentA.vue';

// 错误 ✗
import { useAuthStore } from '../../../stores/modules/auth';
```

### API 模块规范

#### API 文件结构

```typescript
// src/api/modules/example.ts
import type { Example } from '@/api/interface/index';
import { PORT1 } from '@/api/config/servicePort';
import http from '@/api';

/**
 * @name 示例模块
 */

// 获取列表
export const getListApi = (params: Example.QueryParams) => {
  return http.get<Example.ListItem[]>(PORT1 + '/example/list', params);
};

// 创建项目
export const createItemApi = (data: Example.CreateParams) => {
  return http.post<Example.Item>(PORT1 + '/example/create', data);
};
```

#### 接口类型定义

```typescript
// src/api/interface/index.ts
export namespace Example {
  // 查询参数
  export interface QueryParams {
    page: number;
    pageSize: number;
    keyword?: string;
  }

  // 列表项
  export interface ListItem {
    id: number;
    name: string;
    status: number;
    createTime: string;
  }

  // 创建参数
  export interface CreateParams {
    name: string;
    description?: string;
  }
}
```

### Pinia Store 规范

```typescript
// src/stores/modules/example.ts
import { defineStore } from 'pinia';
import type { ExampleState } from '@/stores/interface';

export const useExampleStore = defineStore('example-store', {
  state: (): ExampleState => ({
    dataList: [],
    loading: false,
    currentId: null,
  }),

  getters: {
    dataListGet: (state) => state.dataList,
    isLoading: (state) => state.loading,
  },

  actions: {
    async fetchDataList() {
      this.loading = true;
      try {
        const { data } = await getListApi({});
        this.dataList = data;
      } finally {
        this.loading = false;
      }
    },

    setCurrentId(id: number) {
      this.currentId = id;
    },
  },
});
```

### 样式规范

#### SCSS 模块化

```scss
// 组件样式使用 scoped
<style scoped lang="scss">
@use "./index.scss";

.container {
  display: flex;
  align-items: center;
}
</style>
```

#### 全局样式变量

```scss
// src/styles/var.scss
$primary-color: #409eff;
$success-color: #67c23a;
$warning-color: #e6a23c;
$danger-color: #f56c6c;
$info-color: #909399;

$font-size-base: 14px;
$border-radius-base: 4px;
```

---

## KoaJS 后端规范 (koajs_backend)

### 技术栈

- **框架**: Koa 3.x
- **路由**: @koa/router
- **ORM**: TypeORM 0.3.x
- **数据库**: MySQL
- **缓存**: Redis (ioredis)
- **认证**: JWT (koa-jwt)
- **日志**: Winston

### 目录结构

```
koajs_backend/
├── src/
│   ├── config/          # 配置文件
│   │   ├── DB.conf.ts
│   │   ├── JWT.conf.ts
│   │   └── REDIS.conf.ts
│   ├── controllers/     # 控制器
│   ├── entity/          # TypeORM 实体
│   ├── service/         # 业务逻辑
│   ├── middleware/      # 中间件
│   ├── types/           # 类型定义
│   └── index.ts         # 入口文件
├── logs/                # 日志目录
└── dist/                # 编译输出
```

### 控制器规范

```typescript
// src/controllers/example.ts
import type { RouterContext } from '@koa/router';
import type { ExampleQuery } from '../types/Example.d.ts';
import ExampleService from '../service/ExampleService.ts';

export default class ExampleController {
  /**
   * 获取列表
   *
   * @public
   * @static
   * @async
   * @param {RouterContext} ctx
   * @returns {Promise<void>}
   */
  public static async getList(ctx: RouterContext): Promise<void> {
    const query = ctx.request.query as unknown as ExampleQuery;
    const result = await ExampleService.getList(query);
    ctx.body = result;
  }

  /**
   * 创建项目
   *
   * @public
   * @static
   * @async
   * @param {RouterContext} ctx
   * @returns {Promise<void>}
   */
  public static async create(ctx: RouterContext): Promise<void> {
    const data = ctx.request.body;
    const result = await ExampleService.create(data);
    ctx.body = result;
  }
}
```

### Entity 实体规范

```typescript
// src/entity/Example.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('example_table')
export class Example extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, comment: '名称' })
  name: string;

  @Column({ type: 'int', default: 0, comment: '排序' })
  sort: number;

  @Column({ type: 'int', default: 1, comment: '状态：1启用 0禁用' })
  status: number;

  @Column({ type: 'json', nullable: true, comment: '扩展信息' })
  detail: Record<string, unknown> | null;

  @CreateDateColumn({ name: 'create_time', nullable: true })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime: Date | null;

  @DeleteDateColumn({
    name: 'delete_time',
    type: 'timestamp',
    nullable: true,
    comment: '软删除时间戳，NULL表示未删除',
  })
  deleteTime: Date | null;
}
```

### 路由规范

```typescript
// src/routes/example.ts
import Router from '@koa/router';
import ExampleController from '../controllers/example.ts';
import { authMiddleware } from '../middleware/auth.ts';

const router = new Router({ prefix: '/api/example' });

// 需要认证的路由
router.get('/list', authMiddleware, ExampleController.getList);
router.post('/create', authMiddleware, ExampleController.create);

// 公开路由
router.get('/public', ExampleController.getPublicData);

export default router;
```

### 配置文件规范

```typescript
// src/config/DB.conf.ts
import type { DataSourceOptions } from 'typeorm';

export const dbConfig: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'test',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/entity/**/*.ts'],
};
```

---

## NestJS 后端规范 (nestjs_backend)

### 技术栈

- **框架**: NestJS 11.x
- **语言**: TypeScript
- **测试**: Jest

### 目录结构

```
nestjs_backend/
├── src/
│   ├── modules/         # 功能模块
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   └── dto/
│   │   └── user/
│   ├── common/          # 公共模块
│   │   ├── decorators/
│   │   ├── filters/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── pipes/
│   ├── config/          # 配置
│   └── main.ts          # 入口
├── test/                # 测试文件
└── dist/                # 编译输出
```

### 模块规范

```typescript
// src/modules/example/example.module.ts
import { Module } from '@nestjs/common';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';

@Module({
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {}
```

### 控制器规范

```typescript
// src/modules/example/example.controller.ts
import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ExampleService } from './example.service';
import { CreateExampleDto } from './dto/create-example.dto';

@Controller('example')
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) {}

  @Get()
  findAll(@Query() query: QueryDto) {
    return this.exampleService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exampleService.findOne(+id);
  }

  @Post()
  create(@Body() createExampleDto: CreateExampleDto) {
    return this.exampleService.create(createExampleDto);
  }
}
```

### Service 规范

```typescript
// src/modules/example/example.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Example } from './entities/example.entity';
import { CreateExampleDto } from './dto/create-example.dto';

@Injectable()
export class ExampleService {
  constructor(
    @InjectRepository(Example)
    private readonly exampleRepository: Repository<Example>,
  ) {}

  async findAll(query: QueryDto) {
    const { page = 1, pageSize = 10 } = query;
    const [list, total] = await this.exampleRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { list, total, page, pageSize };
  }

  async findOne(id: number) {
    const item = await this.exampleRepository.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Example #${id} not found`);
    }
    return item;
  }

  async create(createExampleDto: CreateExampleDto) {
    const item = this.exampleRepository.create(createExampleDto);
    return this.exampleRepository.save(item);
  }
}
```

### DTO 规范

```typescript
// src/modules/example/dto/create-example.dto.ts
import { IsString, IsOptional, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExampleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  sort?: number;
}

export class QueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize?: number = 10;
}
```

### 主入口规范

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // 启用 CORS
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
```

---

## Git 提交规范

### Commit Message 格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| 类型 | 描述 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档更新 |
| `style` | 代码格式调整（不影响功能） |
| `refactor` | 代码重构 |
| `perf` | 性能优化 |
| `test` | 测试相关 |
| `chore` | 构建/工具相关 |
| `ci` | CI/CD 配置变更 |
| `revert` | 回滚提交 |

### Scope 范围

| 范围 | 描述 |
|------|------|
| `frontend` | 前端项目 |
| `koajs` | KoaJS 后端 |
| `nestjs` | NestJS 后端 |
| `shared` | 共享代码 |

### 示例

```bash
# 新功能
feat(frontend): 添加用户头像上传功能

# Bug 修复
fix(koajs): 修复 JWT token 过期时间计算错误

# 文档更新
docs(nestjs): 更新 API 接口文档

# 代码重构
refactor(frontend): 重构登录组件状态管理
```

### 分支命名规范

```
feature/<scope>-<description>   # 功能分支
bugfix/<scope>-<description>    # Bug 修复分支
hotfix/<scope>-<description>    # 紧急修复分支
release/<version>               # 发布分支
```

示例：
- `feature/frontend-user-profile`
- `bugfix/koajs-auth-token`
- `hotfix/nestjs-security-patch`
- `release/v1.2.0`

---

## 文件命名规范

### 通用规则

| 类型 | 命名方式 | 示例 |
|------|----------|------|
| 目录 | kebab-case | `user-manage/` |
| TypeScript 文件 | camelCase | `userService.ts` |
| Vue 组件 | PascalCase | `LoginForm.vue` |
| 类型定义文件 | camelCase | `index.d.ts` |
| 配置文件 | kebab-case | `vite.config.ts` |
| 样式文件 | kebab-case | `index.scss` |
| 测试文件 | 原文件名 + `.spec` | `auth.service.spec.ts` |

### 特殊文件

| 文件名 | 用途 |
|--------|------|
| `index.ts` | 模块入口/导出文件 |
| `*.d.ts` | TypeScript 类型声明 |
| `*.interface.ts` | 接口类型定义 |
| `*.dto.ts` | NestJS 数据传输对象 |
| `*.entity.ts` | TypeORM 实体定义 |

---

## 目录结构规范

### 前端项目目录

```
koajs-fronted-vite/src/
├── api/                 # API 接口
│   ├── config/         # API 配置
│   ├── helper/         # 辅助函数
│   ├── interface/      # 接口类型定义
│   └── modules/        # API 模块
├── assets/             # 静态资源
├── components/         # 公共组件
├── config/             # 项目配置
├── directives/         # 自定义指令
├── enums/              # 枚举定义
├── hooks/              # 组合式函数
├── languages/          # 国际化
├── layouts/            # 布局组件
├── routers/            # 路由配置
├── stores/             # Pinia 状态管理
├── styles/             # 全局样式
├── typings/            # 类型声明
├── utils/              # 工具函数
└── views/              # 页面视图
```

### 后端项目目录

```
backend/src/
├── config/             # 配置文件
├── controllers/        # 控制器 (KoaJS) / 模块控制器 (NestJS)
├── entity/             # 实体定义 (KoaJS)
├── modules/            # 功能模块 (NestJS)
├── service/            # 业务逻辑 (KoaJS)
├── middleware/         # 中间件 (KoaJS)
├── common/             # 公共模块 (NestJS)
├── types/              # 类型定义 (KoaJS)
└── dto/                # 数据传输对象 (NestJS)
```

---

## 开发流程规范

### 开发前准备

1. 从 `main` 分支拉取最新代码
2. 创建功能分支或修复分支
3. 确保本地开发环境正常

### 开发中

1. 遵循本文档的代码规范
2. 编写必要的单元测试
3. 保持提交粒度适中，一个提交解决一个问题
4. 提交前运行 lint 和 type-check

### 代码质量检查流程

**重要：每次代码修改后必须执行以下检查流程**

#### 检查顺序

1. **Prettier 格式化**（优先执行）
2. **TypeScript 类型检查**
3. **ESLint 检查**

#### Prettier 优先原则

当 ESLint 和 Prettier 格式化规则产生冲突时：

- **优先使用 Prettier 的格式化结果**
- 禁用 ESLint 中与 Prettier 冲突的格式化规则
- 使用 `eslint-config-prettier` 关闭 ESLint 中不必要的格式化规则

#### 各项目检查命令

```bash
# 前端项目 (koajs-fronted-vite)
cd koajs-fronted-vite
pnpm run format        # Prettier 格式化
pnpm run type-check    # TypeScript 类型检查
pnpm run lint          # ESLint 检查

# KoaJS 后端 (koajs_backend)
cd koajs_backend
pnpm run format        # Prettier 格式化
pnpm run type-check    # TypeScript 类型检查
pnpm run lint          # ESLint 检查

# NestJS 后端 (nestjs_backend)
cd nestjs_backend
pnpm run format        # Prettier 格式化（如未配置，使用 npx prettier --write "src/**/*.ts"）
pnpm run build         # TypeScript 类型检查（编译时检查）
pnpm run lint          # ESLint 检查
```

#### TypeScript 类型检查要求

- 每次代码修改后必须执行类型检查
- 确保无类型错误后方可提交
- 使用 `tsc --noEmit` 进行纯类型检查（不生成输出文件）

```bash
# 类型检查命令
npx tsc --noEmit
```

#### ESLint 与 Prettier 冲突处理配置

在 `.eslintrc.js` 或 `eslint.config.js` 中添加：

```javascript
// .eslintrc.js (传统配置)
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // 必须放在最后，关闭与 Prettier 冲突的规则
  ],
};

// eslint.config.js (Flat Config)
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig, // 必须放在最后
);
```

### 提交代码

```bash
# 前端项目
cd koajs-fronted-vite
pnpm run build

# KoaJS 后端
cd koajs_backend
pnpm run lint
pnpm run type-check

# NestJS 后端
cd nestjs_backend
pnpm run lint
pnpm run test
```

### 代码审查

- 确保代码符合规范
- 检查是否有安全风险
- 验证功能是否正常
- 检查测试覆盖率

---

## 工具配置参考

### VS Code 推荐配置

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

### VS Code 推荐扩展

- ESLint
- Prettier - Code formatter
- Vue - Official (Vue Language Features, TypeScript Vue Plugin)
- SCSS IntelliSense

---

## 附录：从 KoaJS 迁移到 NestJS 的注意事项

### 架构差异

| KoaJS | NestJS |
|-------|--------|
| 控制器类 + 路由注册 | Controller 装饰器 + 模块注册 |
| Service 类 | @Injectable() 装饰的服务 |
| 中间件函数 | Guards / Interceptors / Pipes |
| ctx.body = result | return result |

### 常用迁移对照

```typescript
// KoaJS 控制器
export default class UserController {
  public static async getList(ctx: RouterContext): Promise<void> {
    const result = await UserService.getList();
    ctx.body = result;
  }
}

// NestJS 控制器
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('list')
  async getList() {
    return this.userService.getList();
  }
}
```

### TypeORM 实体兼容

KoaJS 和 NestJS 都使用 TypeORM，实体定义可以直接复用：

```typescript
// 两个后端项目可共享相同的实体定义
@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;
}
```

---

*最后更新: 2026-03-20*
