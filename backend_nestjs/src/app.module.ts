/**
 * @file app.module.ts
 * @description 应用根模块 - NestJS 应用的核心配置文件
 *
 * NestJS 模块化概念说明：
 * - Module（模块）：类似于 Vue 的组件，用于组织相关功能
 * - Controller（控制器）：处理 HTTP 请求，类似于 Vue 的路由处理函数
 * - Service（服务）：业务逻辑层，类似于 Vue 的 store/actions
 * - Provider（提供者）：可以被注入的服务，类似于 Vue 的 provide/inject
 *
 * 模块装饰器 @Module() 接收四个属性：
 * - imports: 导入其他模块，获取其导出的 providers
 * - controllers: 注册控制器（处理请求）
 * - providers: 注册服务（业务逻辑）
 * - exports: 导出 providers，供其他模块使用
 */

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// 导入各功能模块
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MenuModule } from './modules/menu/menu.module';
import { RoleModule } from './modules/role/role.module';
import { AuthPermissionModule } from './modules/auth-permission/auth-permission.module';
import { LogModule } from './modules/log/log.module';
import { UploadModule } from './modules/upload/upload.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { DemoUserModule } from './modules/demo-user/demo-user.module';
import { DepartmentModule } from './modules/department/department.module';

// 导入全局过滤器、拦截器、守卫
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';
import { WinstonLoggerService } from './common/services/logger.service';
import { getDatabaseConfig } from './config/database.config';

/**
 * 应用根模块
 *
 * @class AppModule
 * @description
 * 这是整个应用的根模块，负责：
 * 1. 配置数据库连接
 * 2. 导入所有功能模块
 * 3. 注册全局过滤器、拦截器、守卫
 *
 * 类似于 Vue 项目的 App.vue + main.ts 的组合
 */
@Module({
  imports: [
    // ConfigModule: 配置模块，用于读取环境变量
    // isGlobal: true - 设置为全局模块，其他模块无需重复导入
    // envFilePath - 指定环境变量文件路径，按顺序加载，后面的会覆盖前面的
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development', '.env.production'],
    }),

    // TypeOrmModule: 数据库连接模块
    // forRootAsync: 异步配置方式，可以注入 ConfigService 读取环境变量
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig, // 数据库配置工厂函数
      inject: [ConfigService], // 注入配置服务
    }),

    // ServeStaticModule: 静态文件服务模块
    // 类似于 Express 的 express.static 或 Vite 的 public 目录
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'resource'), // 静态文件根目录
      serveRoot: '/resource', // URL 访问路径前缀
    }),

    // 导入各功能模块
    // 每个功能模块包含自己的 Controller、Service、DTO 等
    AuthModule, // 认证模块：登录、登出、JWT 验证
    UserModule, // 用户模块：用户 CRUD
    MenuModule, // 菜单模块：菜单管理
    RoleModule, // 角色模块：角色管理、权限分配
    AuthPermissionModule, // 权限模块：权限查询
    LogModule, // 日志模块：日志查询、清理
    UploadModule, // 上传模块：文件上传
    DictionaryModule, // 字典模块：字典管理
    DemoUserModule, // 演示用户模块：ProTable 和组件示例数据
    DepartmentModule, // 部门模块：组织部门树管理
  ],
  providers: [
    WinstonLoggerService,
    // 全局异常过滤器
    // APP_FILTER 是一个特殊的 token，用于注册全局过滤器
    // 过滤器用于捕获异常并返回统一格式的错误响应
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    // 全局 HTTP 日志拦截器
    // 记录所有 HTTP 请求和响应信息
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    // 全局响应拦截器
    // APP_INTERCEPTOR 用于注册全局拦截器
    // 拦截器用于在响应返回前统一处理数据格式
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
