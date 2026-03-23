/**
 * @file jwt.config.ts
 * @description JWT（JSON Web Token）配置文件
 *
 * JWT 概念说明：
 * - JWT 是一种用于身份认证的令牌标准
 * - 用户登录后，服务器生成 JWT 返回给前端
 * - 前端每次请求都携带这个 token，服务器验证 token 来识别用户
 *
 * 类比前端：
 * - JWT 类似于浏览器的 cookie/session，但是无状态的
 * - 前端通常存储在 localStorage 或 cookie 中
 * - 每次请求通过 Authorization header 发送：Bearer <token>
 */

import { JwtModuleOptions } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

/**
 * 获取 JWT 配置
 *
 * @description
 * 这是一个工厂函数，用于创建 JWT 模块配置
 * 返回的配置会被 @nestjs/jwt 模块使用
 *
 * @param {ConfigService} configService - NestJS 配置服务
 * @returns {JwtModuleOptions} JWT 模块配置对象
 *
 * @example
 * // 在 auth.module.ts 中使用
 * JwtModule.registerAsync({
 *   imports: [ConfigModule],
 *   useFactory: getJwtConfig,
 *   inject: [ConfigService],
 * })
 */
export const getJwtConfig = (
  configService: ConfigService,
): JwtModuleOptions => ({
  // secret: JWT 签名密钥
  // 用于签名和验证 token，必须保密！
  // 类似于加密算法的密码，只有服务器知道
  secret: configService.get<string>('JWT_SECRET', '256257282931'),

  // signOptions: 签名选项
  signOptions: {
    // expiresIn: token 过期时间
    // '7d' 表示 7 天后过期
    // 过期后前端需要重新登录获取新 token
    expiresIn: '7d',
  },
});

/**
 * JWT 密钥常量
 *
 * @description
 * 导出一个可以直接使用的密钥常量
 * 用于 JWT Strategy（策略）中验证 token
 *
 * 优先使用环境变量中的密钥，如果没有则使用默认值
 * 生产环境务必通过环境变量设置强密钥！
 */
export const JWT_SECRET = process.env.JWT_SECRET || '256257282931';
