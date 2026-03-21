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

export const createRedisClient = (): Redis => {
  const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: 0,
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      if (times > 3) {
        console.error('❌ Redis 连接重试次数超过限制');
        return null;
      }
      const delay = Math.min(times * 100, 2000);
      console.warn(`⚠️  Redis 连接失败，${delay}ms 后重试 (第 ${times} 次)`);
      return delay;
    },
  });

  redis.on('connect', () => {
    console.log('✅ Redis 连接成功');
    console.log(
      `   - 主机: ${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`,
    );
  });

  redis.on('error', (error) => {
    console.error('❌ Redis 连接错误:', error.message);
  });

  redis.on('close', () => {
    console.warn('⚠️  Redis 连接已关闭');
  });

  redis.on('reconnecting', () => {
    console.log('🔄 Redis 正在重新连接...');
  });

  return redis;
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
