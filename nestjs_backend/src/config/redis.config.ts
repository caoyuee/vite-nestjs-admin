/**
 * @file redis.config.ts
 * @description Redis 缓存配置文件
 *
 * Redis 概念说明：
 * - Redis 是一个内存数据库，常用于缓存、会话存储
 * - 比 MySQL 快很多，因为数据存储在内存中
 * - 本项目中用于存储 JWT token，实现 token 的主动失效（登出）
 *
 * 类比前端：
 * - Redis 类似于浏览器的 localStorage，但是是服务器端的
 * - 可以设置过期时间，类似于 cookie 的 max-age
 * - 支持多种数据结构：字符串、列表、哈希等
 */

import Redis from 'ioredis';

/**
 * 创建 Redis 客户端
 *
 * @description
 * 创建并返回一个 Redis 连接实例
 * ioredis 是 Node.js 中最流行的 Redis 客户端
 *
 * @returns {Redis} Redis 客户端实例
 *
 * @example
 * // 使用方式
 * const redis = createRedisClient();
 * await redis.set('key', 'value', 'EX', 3600); // 设置 1 小时过期
 * const value = await redis.get('key');
 */
export const createRedisClient = (): Redis => {
  return new Redis({
    // Redis 服务器地址
    host: process.env.REDIS_HOST || 'localhost',

    // Redis 服务器端口
    port: parseInt(process.env.REDIS_PORT || '6379', 10),

    // Redis 密码（如果有）
    password: process.env.REDIS_PASSWORD || '',

    // 数据库编号
    // Redis 默认有 16 个数据库（0-15），可以用来隔离不同用途的数据
    db: 0,

    // 连接超时时间（毫秒）
    connectTimeout: 10000,

    // 每次请求最大重试次数
    maxRetriesPerRequest: 3,
  });
};

/**
 * Redis 客户端注入令牌
 *
 * @description
 * 这是 NestJS 依赖注入系统使用的令牌（token）
 * 用于在其他地方通过 @Inject() 装饰器注入 Redis 客户端
 *
 * @example
 * // 在服务中注入 Redis 客户端
 * constructor(
 *   @Inject(REDIS_CLIENT) private readonly redis: Redis
 * ) {}
 */
export const REDIS_CLIENT = 'REDIS_CLIENT';
