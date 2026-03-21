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

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 3306),
  username: configService.get<string>('DB_USER', 'root'),
  password: configService.get<string>('DB_PASSWORD', ''),
  database: configService.get<string>('DB_NAME', 'koajs-sql'),
  synchronize: configService.get<string>('NODE_ENV') !== 'production',
  logging: configService.get<string>('NODE_ENV') === 'development',
  entities: [__dirname + '/../entities/*.{ts,js}'],

  poolSize: 10,
  extra: {
    connectionLimit: 10,
  },
});
