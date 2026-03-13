import koaJWT from "koa-jwt";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { Context, Next } from "koa";
import redis from "./REDIS.conf.ts";
import type { JwtPayload } from "../types/User.d.ts";

/**
 * 获取当前环境
 * development: 开发环境
 * production: 生产环境
 * test: 测试环境
 */
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * 是否启用JWT认证
 * 开发环境(development)不启用，生产环境(production)和测试环境(test)启用
 */
const isJWTAuthEnabled = NODE_ENV !== "development";

console.log(`[JWT] 当前环境: ${NODE_ENV}, JWT认证: ${isJWTAuthEnabled ? "启用" : "禁用"}`);

/**
 * 配置token签名
 *
 * @type {SignOptions}
 */
const signOptions: SignOptions = {
  expiresIn: "7d", // 7天过期
};

/**
 * jwt密钥
 *
 * @type {*}
 */
const JWT_SECRET = process.env.JWT_SECRET || "256257282931";

/**
 * 登陆时生成token
 *
 * @param {JwtPayload} payload  JWT payload数据
 * @param {?SignOptions} [options]   配置信息
 * @returns {string} JWT token
 */

export const signToken = (payload: JwtPayload, options?: SignOptions): string => {
  return jwt.sign(payload, JWT_SECRET, { ...signOptions, ...options });
};

/**
 * 验证token配置
 *
 * @type {{ secret: any; debug: boolean; isRevoked: (ctx: Context, payload: any, token: string) => unknown; key: string; }}
 */
const jwtConfig = {
  secret: JWT_SECRET,
  debug: true, // 开启debug可以看到准确的错误信息
  isRevoked: async (_ctx: Context, payload: JwtPayload, token: string) => {
    const storedToken = await redis.get(`token_${payload.sub}`);
    console.log("鉴权结果：", storedToken === token);
    return storedToken !== token; // 如果Redis中的token与请求中的token不一致，则视为已注销
  },
  key: "user", // 将解码后的用户信息存储在 ctx.state.user 中
};

/**
 * token白名单配置
 *
 * @type {{ path: {}; }}
 */
const unlessOptions = {
  path: [
    "/api/system/user/login",
    "/api/system/user/addUser",
    "/swagger/docs",// swagger文档路径
    /\/^\/resource\/upload\/.*/,
  ], // 设置不需要验证token的路径
};

/**
 * 验证token中间件
 * 根据环境变量决定是否启用JWT认证
 * - development: 不启用JWT认证（用于本地开发调试）
 * - production/test: 启用JWT认证
 *
 * @type {*}
 */
export const JWT = isJWTAuthEnabled
  ? koaJWT(jwtConfig).unless(unlessOptions)
  : async (ctx: Context, next: Next) => {
      // 开发环境：不做JWT验证，但解析token并存入ctx（如果存在的话）
      const authHeader = ctx.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.slice(7);
          const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
          ctx.state.user = decoded;
        } catch (err) {
          // token无效时忽略，继续处理请求
          console.log("[JWT] Token解析失败（开发环境忽略）:", err instanceof Error ? err.message : 'unknown');
        }
      }
      await next();
    };
