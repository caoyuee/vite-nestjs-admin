/**
 * @file database.config.ts
 * @description 数据库配置文件
 *
 * TypeORM 概念说明（类似于前端的 ORM 库，如 Prisma）：
 * - TypeORM 是一个 ORM（对象关系映射）框架
 * - 它让我们用 TypeScript 类来操作数据库，而不是写 SQL 语句
 * - Entity（实体）= 数据库表的类表示
 * - Repository（仓库）= 操作实体的工具类
 *
 * 类比前端：
 * - Entity 类似于 Vue 的 data model
 * - Repository 类似于 API 请求函数封装
 */

import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

/**
 * 获取数据库配置
 *
 * @description
 * 这是一个工厂函数，用于创建数据库连接配置
 * 使用 ConfigService 从环境变量中读取配置值
 *
 * @param {ConfigService} configService - NestJS 配置服务，用于读取环境变量
 * @returns {TypeOrmModuleOptions} TypeORM 数据库配置对象
 *
 * @example
 * // 在 app.module.ts 中使用
 * TypeOrmModule.forRootAsync({
 *   imports: [ConfigModule],
 *   useFactory: getDatabaseConfig,
 *   inject: [ConfigService],
 * })
 */
export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  // 数据库类型
  type: 'mysql',

  // 数据库主机地址
  // configService.get() 类似于 process.env，但带有类型支持和默认值
  host: configService.get<string>('DB_HOST', 'localhost'),

  // 数据库端口号
  port: configService.get<number>('DB_PORT', 3306),

  // 数据库用户名
  username: configService.get<string>('DB_USER', 'root'),

  // 数据库密码
  password: configService.get<string>('DB_PASSWORD', ''),

  // 数据库名称
  database: configService.get<string>('DB_NAME', 'koajs-sql'),

  // synchronize: 是否自动同步实体定义到数据库表结构
  // true - 开发环境使用，自动创建/更新表结构
  // false - 生产环境使用，避免数据丢失
  // 类似于 Prisma 的 prisma migrate dev
  synchronize: configService.get<string>('NODE_ENV') !== 'production',

  // logging: 是否打印 SQL 查询日志
  // 开发环境开启，方便调试 SQL 语句
  logging: configService.get<string>('NODE_ENV') === 'development',

  // entities: 实体文件路径
  // __dirname 是当前文件所在目录
  // 这个配置告诉 TypeORM 去哪里找实体类
  entities: [__dirname + '/../entities/*.{ts,js}'],
});
