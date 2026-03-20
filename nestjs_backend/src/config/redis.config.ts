import Redis from 'ioredis';

export const createRedisClient = (): Redis => {
  return new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
    db: 0,
    connectTimeout: 10000,
    maxRetriesPerRequest: 3,
  });
};

export const REDIS_CLIENT = 'REDIS_CLIENT';
