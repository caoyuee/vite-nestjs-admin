/**
 * @file auth.module.ts
 * @description 认证模块 - 负责用户登录、登出和 JWT 认证
 *
 * 模块概念说明：
 * - 模块（Module）是 NestJS 组织代码的基本单元
 * - 类似于 Vue 的组件，但用于后端
 * - 每个模块包含相关的 Controller、Service、Provider 等
 *
 * 类比前端：
 * - 类似于 Vue 的组件模块化
 * - 类似于一个功能模块（如 user 模块、order 模块）
 * - imports 类似于 Vue 组件的 components 导入
 * - providers 类似于 Vue 组件的 setup 返回的数据和方法
 * - exports 类似于 Vue 组件的 expose
 */

import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// 导入本模块的 Controller 和 Service
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

// 导入需要的实体
import { User } from '../../entities/user.entity';

// 导入配置
import { getJwtConfig } from '../../config/jwt.config';
import { REDIS_CLIENT, createRedisClient } from '../../config/redis.config';

/**
 * 认证模块
 *
 * @class AuthModule
 *
 * @description
 * 认证模块负责：
 * 1. 用户登录验证
 * 2. JWT token 生成和验证
 * 3. 用户登出（清除 token）
 *
 * 模块组成：
 * - AuthController: 处理登录/登出请求
 * - AuthService: 业务逻辑（验证密码、生成 token）
 * - JwtStrategy: JWT 验证策略
 * - Redis: 存储 token 实现主动失效
 */
@Module({
  /**
   * imports: 导入其他模块
   *
   * - TypeOrmModule.forFeature([User]): 注册 User 实体
   *   类似于 Vue 组件中导入子组件
   *
   * - PassportModule: 认证框架
   *   defaultStrategy: 'jwt' 表示默认使用 JWT 认证
   *
   * - JwtModule: JWT 功能模块
   *   registerAsync 表示异步配置（从环境变量读取密钥）
   */
  imports: [
    // 注册 User 实体，使其可以在本模块中使用 Repository
    TypeOrmModule.forFeature([User]),

    // Passport 是 Node.js 认证中间件
    // defaultStrategy: 'jwt' 设置默认策略为 JWT
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // JWT 模块配置
    // registerAsync 用于异步配置，可以注入 ConfigService
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: getJwtConfig, // 配置工厂函数
      inject: [ConfigService], // 注入配置服务
    }),
  ],

  /**
   * controllers: 注册控制器
   *
   * 控制器负责处理 HTTP 请求
   * 类似于 Vue Router 的路由处理函数
   */
  controllers: [AuthController],

  /**
   * providers: 注册服务提供者
   *
   * providers 是可以被注入的服务
   * 类似于 Vue 的 provide/inject
   *
   * - AuthService: 认证业务逻辑
   * - JwtStrategy: JWT 验证策略
   * - REDIS_CLIENT: Redis 客户端（自定义 Provider）
   */
  providers: [
    AuthService,
    JwtStrategy,
    // 自定义 Provider：Redis 客户端
    // provide: 提供令牌（类似 Vue 的 provide key）
    // useFactory: 工厂函数，创建 Provider 实例
    {
      provide: REDIS_CLIENT,
      useFactory: createRedisClient,
    },
  ],

  /**
   * exports: 导出服务
   *
   * 导出后，其他模块导入 AuthModule 时可以使用这些服务
   * 类似于 Vue 组件的 expose
   */
  exports: [AuthService, JwtStrategy, REDIS_CLIENT],
})
export class AuthModule {}
