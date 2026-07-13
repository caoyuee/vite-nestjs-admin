# 项目代码规范

本文档定义了 `front_backend_vite_nestjs` 项目的统一代码编写规范，涵盖前端（Vue 3 + Vite）和 NestJS 后端 2 个子项目。

***

## 目录

1. [通用规范](#通用规范)
2. [前端项目规范 (fronted_vite)](#前端项目规范-fronted_vite)
3. [NestJS 后端规范 (nestjs_backend)](#nestjs-后端规范-nestjs_backend)
4. [Git 提交规范](#git-提交规范)
5. [文件命名规范](#文件命名规范)
6. [目录结构规范](#目录结构规范)

***

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
 * @description 分页查询用户列表，支持按用户名、姓名、邮箱、电话、状态筛选
 * @param {UserListQueryDto} query - 查询参数对象
 * @returns {Promise<{ code: number; message: string; data: { list: User[], total: number } }>} 用户列表响应
 * @throws {NotFoundException} 当查询参数无效时抛出
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
 * @description 创建新用户的流程：1. 检查用户名是否已存在 2. 创建用户实体 3. 加密密码 4. 保存到数据库
 * @param {CreateUserDto} createUserDto - 用户创建参数
 * @returns {Promise<{ code: number; message: string; data: null }>} 创建结果
 * @throws {BadRequestException} 用户已存在或创建失败
 */
async createUser(createUserDto: CreateUserDto) {
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
  where,                              // 查询条件
  skip: (pageNum - 1) * pageSize,     // 跳过记录数
  take: pageSize,                     // 每页记录数
  order: { createTime: 'DESC' },      // 按创建时间倒序
});
```

***

## 前端项目规范 (fronted_vite)

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

***

## NestJS 后端规范 (nestjs_backend)

### 技术栈

- **框架**: NestJS 11.x
- **ORM**: TypeORM 0.3.x
- **数据库**: MySQL
- **缓存**: Redis (ioredis)
- **认证**: @nestjs/jwt + @nestjs/passport + passport-jwt
- **日志**: Winston + winston-daily-rotate-file
- **验证**: class-validator + class-transformer
- **API 文档**: @nestjs/swagger
- **测试**: Jest

### 目录结构

```
nestjs_backend/
├── src/
│   ├── common/              # 公共模块
│   │   ├── decorators/      # 自定义装饰器
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── filters/         # 异常过滤器
│   │   │   └── http-exception.filter.ts
│   │   ├── guards/          # 守卫
│   │   │   └── jwt-auth.guard.ts
│   │   ├── interceptors/    # 拦截器
│   │   │   ├── http-logging.interceptor.ts
│   │   │   └── response.interceptor.ts
│   │   ├── interfaces/      # 公共接口
│   │   │   └── response.interface.ts
│   │   └── services/        # 公共服务
│   │       └── logger.service.ts
│   ├── config/              # 配置文件
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── redis.config.ts
│   │   └── upload.config.ts
│   ├── entities/            # TypeORM 实体
│   │   ├── user.entity.ts
│   │   ├── menu.entity.ts
│   │   ├── role.entity.ts
│   │   ├── auth.entity.ts
│   │   ├── dictionary.entity.ts
│   │   └── personnel.entity.ts
│   ├── modules/             # 功能模块
│   │   ├── auth/            # 认证模块
│   │   ├── user/            # 用户模块
│   │   ├── menu/            # 菜单模块
│   │   ├── role/            # 角色模块
│   │   ├── auth-permission/ # 权限模块
│   │   ├── log/             # 日志模块
│   │   ├── upload/          # 上传模块
│   │   └── dictionary/      # 字典模块
│   ├── utils/               # 工具函数
│   │   ├── menu-tree.util.ts
│   │   └── index.ts
│   ├── app.module.ts        # 根模块
│   └── main.ts              # 入口文件
├── test/                    # 测试文件
└── dist/                    # 编译输出
```

### 模块规范

每个功能模块应包含以下文件：

```
module-name/
├── dto/                     # 数据传输对象
│   ├── create-xxx.dto.ts
│   ├── update-xxx.dto.ts
│   └── xxx-list-query.dto.ts
├── xxx.controller.ts        # 控制器
├── xxx.service.ts           # 服务
└── xxx.module.ts            # 模块定义
```

#### 模块定义

```typescript
// src/modules/example/example.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExampleController } from './example.controller';
import { ExampleService } from './example.service';
import { Example } from '../../entities/example.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Example])],
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule {}
```

### 控制器规范

```typescript
// src/modules/user/user.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';

/**
 * 用户控制器
 *
 * @class UserController
 * @description 处理用户管理相关的所有 HTTP 请求，路由前缀：/api/system/user
 */
@ApiTags('用户')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前登录用户信息
   *
   * @description GET /api/system/user/userInfo，返回当前登录用户的详细信息
   * @param user - 当前登录用户（由 @CurrentUser 装饰器注入）
   */
  @Get('userInfo')
  @ApiOperation({ summary: '获取当前用户信息' })
  async getUserInfo(@CurrentUser() user: JwtPayload) {
    return this.userService.getUserInfo(user.sub);
  }

  /**
   * 创建新用户
   *
   * @description POST /api/system/user/addUser，创建新用户（注册）
   * @Public() 标记为公开接口，不需要认证
   * @param createUserDto - 用户创建参数
   */
  @Public()
  @Post('addUser')
  @ApiOperation({ summary: '创建新用户' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * 获取用户列表
   *
   * @description GET /api/system/user/userList，分页查询用户列表
   * @param query - 查询参数（分页、筛选条件）
   */
  @Get('userList')
  @ApiOperation({ summary: '获取用户列表' })
  async getUserList(@Query() query: UserListQueryDto) {
    return this.userService.getUserList(query);
  }
}
```

### Service 规范

```typescript
// src/modules/user/user.service.ts
import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';

/**
 * 用户服务
 *
 * @class UserService
 * @description 处理用户管理相关的所有业务逻辑
 */
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 获取用户信息
   *
   * @description 根据用户 ID 查询用户详细信息，返回的用户信息不包含密码字段
   * @param userId - 用户 ID
   * @returns 用户信息响应
   * @throws {NotFoundException} 用户不存在
   */
  async getUserInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: Number(userId) },
    });

    if (!user) {
      throw new NotFoundException('用户不存在');
    }

    const { password: _password, ...userInfo } = user;

    return {
      code: 200,
      message: 'success',
      data: userInfo,
    };
  }

  /**
   * 创建新用户
   *
   * @description 创建新用户的流程：1. 检查用户名是否已存在 2. 创建用户实体 3. 加密密码 4. 保存到数据库
   * @param createUserDto - 用户创建参数
   * @returns 创建结果响应
   * @throws {BadRequestException} 用户已存在或创建失败
   */
  async createUser(createUserDto: CreateUserDto) {
    // 步骤 1：检查用户名是否已存在
    const existingUser = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUser) {
      throw new BadRequestException('用户已存在，请直接登录');
    }

    // 步骤 2：创建用户实体
    const user = new User();
    user.name = createUserDto.name;
    user.username = createUserDto.username;
    user.status = createUserDto.status ?? true;

    // 步骤 3：加密密码
    const saltRounds = process.env.BCRYPT_SALT ? parseInt(process.env.BCRYPT_SALT) : 10;
    user.password = bcrypt.hashSync(createUserDto.password, saltRounds);

    // 步骤 4：保存到数据库
    const result = await this.userRepository.save(user);
    if (!result) {
      throw new BadRequestException('创建用户失败');
    }

    return {
      code: 201,
      message: '创建成功,请登陆',
      data: null,
    };
  }

  /**
   * 获取用户列表
   *
   * @description 分页查询用户列表，支持按用户名、姓名、邮箱、电话、状态筛选
   * @param query - 查询参数
   * @returns 用户列表响应
   */
  async getUserList(query: UserListQueryDto) {
    const { pageNum = 1, pageSize = 10, ...filters } = query;

    // 构建查询条件
    const where: any = {};
    if (filters.username) where.username = filters.username;
    if (filters.name) where.name = filters.name;
    if (filters.status !== undefined) where.status = filters.status;

    // 执行分页查询
    const [users, total] = await this.userRepository.findAndCount({
      where,
      skip: (pageNum - 1) * pageSize,
      take: pageSize,
      order: { createTime: 'DESC' },
    });

    // 移除密码字段
    const userList = users.map((user) => {
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });

    return {
      code: 200,
      message: 'success',
      data: { list: userList, total },
    };
  }
}
```

### DTO 规范

```typescript
// src/modules/user/dto/create-user.dto.ts
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 创建用户的 DTO 类
 *
 * @description 当前端发送 POST 请求创建用户时，请求体的数据会被映射到这个类
 * NestJS 会自动验证数据是否符合装饰器的规则
 */
export class CreateUserDto {
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  @ApiProperty({ description: '姓名' })
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: '电话' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string;

  @ApiPropertyOptional({ description: '状态', default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({ description: '角色ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  roles?: string[];
}
```

### Entity 实体规范

```typescript
// src/entities/user.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

/**
 * 用户实体类
 *
 * @class User
 * @extends BaseEntity
 * @description 对应数据库中的 user 表，继承 BaseEntity 可以获得内置方法
 */
@Entity('user')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column('simple-array', { nullable: true })
  roles: string[];

  @CreateDateColumn({ name: 'create_time', nullable: true })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime: Date;

  @DeleteDateColumn({
    name: 'delete_time',
    type: 'timestamp',
    nullable: true,
    comment: '记录删除时间戳,NULL表示未删除',
  })
  deleteTime: Date | null;
}
```

### 全局过滤器规范

```typescript
// src/common/filters/http-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

/**
 * 全局异常过滤器
 *
 * @class HttpExceptionFilter
 * @description 捕获所有类型的异常，统一返回标准格式的错误响应
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ApiResponse<null> = {
      code: statusCode,
      message,
      data: null,
    };

    response.status(statusCode).json(errorResponse);
  }
}
```

### 全局拦截器规范

```typescript
// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponse } from '../interfaces/response.interface';

/**
 * 响应拦截器
 *
 * @class ResponseInterceptor
 * @description 将所有响应数据包装成统一格式
 */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'code' in data) {
          return data;
        }

        return {
          code: 200,
          message: 'success',
          data: data ?? null,
        };
      }),
    );
  }
}
```

### 自定义装饰器规范

#### @CurrentUser 装饰器

```typescript
// src/common/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 获取当前登录用户的装饰器
 *
 * @description 从请求对象中提取当前登录用户信息
 * @example
 * async getUserInfo(@CurrentUser() user: JwtPayload) {
 *   return this.userService.getUserInfo(user.sub);
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

#### @Public 装饰器

```typescript
// src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

/**
 * 标记接口为公开访问的装饰器
 *
 * @description 使用此装饰器的接口不需要 JWT 认证
 * @example
 * @Public()
 * @Post('login')
 * async login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(loginDto);
 * }
 */
export const Public = () => SetMetadata('isPublic', true);
```

### JWT 认证守卫规范

```typescript
// src/common/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * JWT 认证守卫
 *
 * @class JwtAuthGuard
 * @description 验证请求中的 JWT Token，保护需要认证的接口
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 检查是否标记为公开接口
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
```

### 主入口规范

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // 启用 CORS
  app.enableCors();

  // 配置 Swagger API 文档
  const config = new DocumentBuilder()
    .setTitle('NestJS Backend API')
    .setDescription('NestJS 的后端 API 文档')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger/docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 NestJS 应用启动成功！`);
  console.log(`📡 服务地址: http://localhost:${port}`);
  console.log(`📚 API 文档: http://localhost:${port}/swagger/docs`);
}
void bootstrap();
```

***

## Git 提交规范

### Commit Message 格式

遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

| 类型         | 描述            |
| ---------- | ------------- |
| `feat`     | 新功能           |
| `fix`      | Bug 修复        |
| `docs`     | 文档更新          |
| `style`    | 代码格式调整（不影响功能） |
| `refactor` | 代码重构          |
| `perf`     | 性能优化          |
| `test`     | 测试相关          |
| `chore`    | 构建/工具相关       |
| `ci`       | CI/CD 配置变更    |
| `revert`   | 回滚提交          |

### Scope 范围

| 范围         | 描述        |
| ---------- | --------- |
| `frontend` | 前端项目 (fronted_vite) |
| `nestjs`   | NestJS 后端 (nestjs_backend) |
| `shared`   | 共享代码      |

### 示例

```bash
# 新功能
feat(frontend): 添加用户头像上传功能

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
- `hotfix/nestjs-security-patch`
- `release/v1.2.0`

***

## 文件命名规范

### 通用规则

| 类型            | 命名方式           | 示例                     |
| ------------- | -------------- | ---------------------- |
| 目录            | kebab-case     | `user-manage/`         |
| TypeScript 文件 | camelCase      | `userService.ts`       |
| Vue 组件        | PascalCase     | `LoginForm.vue`        |
| 类型定义文件        | camelCase      | `index.d.ts`           |
| 配置文件          | kebab-case     | `vite.config.ts`       |
| 样式文件          | kebab-case     | `index.scss`           |
| 测试文件          | 原文件名 + `.spec` | `auth.service.spec.ts` |

### 特殊文件

| 文件名              | 用途              |
| ---------------- | --------------- |
| `index.ts`       | 模块入口/导出文件       |
| `*.d.ts`         | TypeScript 类型声明 |
| `*.interface.ts` | 接口类型定义          |
| `*.dto.ts`       | NestJS 数据传输对象   |
| `*.entity.ts`    | TypeORM 实体定义    |

***

## 目录结构规范

### 前端项目目录

```
fronted_vite/src/
├── api/                 # API 接口
│   ├── config/         # API 配置
│   ├── helper/         # 辅助函数
│   ├── interface/      # 接口类型定义
│   └── modules/        # API 模块
├── assets/            # 静态资源
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

### NestJS 后端目录

```
nestjs_backend/src/
├── common/             # 公共模块
│   ├── decorators/    # 自定义装饰器
│   ├── filters/       # 异常过滤器
│   ├── guards/        # 守卫
│   ├── interceptors/  # 拦截器
│   ├── interfaces/    # 公共接口
│   └── services/      # 公共服务
├── config/             # 配置文件
├── entities/           # TypeORM 实体
├── modules/            # 功能模块
│   ├── auth/          # 认证模块
│   ├── user/          # 用户模块
│   ├── menu/          # 菜单模块
│   ├── role/          # 角色模块
│   ├── auth-permission/ # 权限模块
│   ├── log/           # 日志模块
│   ├── upload/        # 上传模块
│   └── dictionary/    # 字典模块
├── utils/              # 工具函数
├── app.module.ts       # 根模块
└── main.ts             # 入口文件
```

***

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
# 前端项目 (fronted_vite)
cd fronted_vite
pnpm run format        # Prettier 格式化
pnpm run type-check    # TypeScript 类型检查
pnpm run lint          # ESLint 检查

# NestJS 后端 (nestjs_backend)
cd nestjs_backend
pnpm run format        # Prettier 格式化
pnpm run build         # TypeScript 类型检查（编译时检查）
pnpm run lint          # ESLint 检查
pnpm run test          # 运行测试
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
cd fronted_vite
pnpm run build

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

***

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
***
