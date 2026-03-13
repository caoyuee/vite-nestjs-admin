import {Redis}  from "ioredis";
//创建redis实例
const redisOptions={
    host: process.env.REDIS_HOST||'localhost',//Redis 服务地址（默认 localhost）
    port: Number(process.env.REDIS_PORT)||6379,//端口（默认 6379）
    password: process.env.REDIS_PASSWORD||'',//密码（若 Redis 配置了认证）
    db: 0,//数据库编号（默认 0，Redis 支持 0-15 共 16 个库）
    connectTimeout: 10000, // 连接超时时间（毫秒，默认 10000）
    maxRetriesPerRequest:3//重连次数（默认 3）
}

const redis = new Redis(redisOptions);

export default redis;