/**
 * @file jwt.strategy.ts
 * @description JWT 策略 - 定义如何验证 JWT token
 *
 * Passport 策略概念说明：
 * - Passport 是 Node.js 的认证中间件
 * - Strategy（策略）定义了认证的具体实现
 * - JwtStrategy 是 Passport 的 JWT 认证策略
 *
 * 类比前端：
 * - 类似于 Axios 拦截器中验证 token 的逻辑
 * - 类似于路由守卫中验证用户身份的逻辑
 * - 每次请求都会执行 validate 方法
 *
 * 工作流程：
 * 1. 请求进入，携带 Authorization: Bearer <token>
 * 2. JwtStrategy 从 header 中提取 token
 * 3. 验证 token 签名和过期时间
 * 4. 调用 validate 方法，将 payload 转换为用户对象
 * 5. 将用户对象挂载到 request.user
 */

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { JwtPayload } from '../../../common/interfaces/response.interface';

/**
 * JWT 认证策略
 *
 * @class JwtStrategy
 * @extends PassportStrategy(Strategy)
 *
 * @description
 * 继承 PassportStrategy(Strategy) 创建自定义的 JWT 策略
 * - Strategy 是 passport-jwt 提供的 JWT 策略类
 * - PassportStrategy 是 NestJS 的包装器
 *
 * 这个策略会：
 * 1. 从请求头中提取 JWT token
 * 2. 验证 token 的签名和过期时间
 * 3. 调用 validate 方法处理 payload
 */
@Injectable() // 标记为可注入的服务
export class JwtStrategy extends PassportStrategy(Strategy) {
  /**
   * 构造函数 - 配置 JWT 策略
   *
   * @param {ConfigService} configService - 配置服务，用于读取环境变量
   *
   * super() 调用父类构造函数，传入 JWT 配置：
   * - jwtFromRequest: 从哪里提取 token
   * - ignoreExpiration: 是否忽略过期检查
   * - secretOrKey: 用于验证签名的密钥
   */
  constructor(private readonly configService: ConfigService) {
    super({
      /**
       * jwtFromRequest: 指定从哪里提取 JWT token
       *
       * ExtractJwt.fromAuthHeaderAsBearerToken() 表示：
       * 从 Authorization 请求头中提取 Bearer token
       *
       * 例如：Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
       * 会提取 eyJhbGciOiJIUzI1NiIs... 这部分
       */
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),

      /**
       * ignoreExpiration: 是否忽略 token 过期检查
       *
       * false 表示不忽略，会检查 token 是否过期
       * 如果 token 过期，会自动返回 401 Unauthorized
       */
      ignoreExpiration: false,

      /**
       * secretOrKey: JWT 签名密钥
       *
       * 用于验证 token 签名是否正确
       * 必须与生成 token 时使用的密钥一致
       *
       * 从环境变量 JWT_SECRET 读取，如果没有则使用默认值
       */
      secretOrKey: configService.get<string>('JWT_SECRET', '256257282931'),
    });
  }

  /**
   * 验证并转换 payload
   *
   * @description
   * 这个方法在 token 验证成功后自动调用
   * 接收 token 的 payload（解码后的数据）
   * 返回的对象会被挂载到 request.user
   *
   * @param {JwtPayload} payload - JWT token 的 payload 部分
   * @returns {object} 用户信息对象，会被挂载到 request.user
   *
   * @example
   * // token payload
   * {
   *   sub: '1',
   *   username: 'admin',
   *   roles: ['admin'],
   *   iat: 1704067200,
   *   exp: 1704672000
   * }
   *
   * // validate 返回值
   * {
   *   sub: '1',
   *   username: 'admin',
   *   roles: ['admin']
   * }
   *
   * // 然后在 Controller 中可以通过 @CurrentUser() 获取
   */
  async validate(payload: JwtPayload) {
    // 返回用户信息对象
    // 这个对象会被 Passport 挂载到 request.user
    // 然后可以通过 @CurrentUser() 装饰器获取
    return {
      sub: payload.sub, // 用户 ID
      username: payload.username, // 用户名
      roles: payload.roles, // 角色列表
    };
  }
}
