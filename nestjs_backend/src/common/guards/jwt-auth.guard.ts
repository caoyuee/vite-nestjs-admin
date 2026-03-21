/**
 * @file jwt-auth.guard.ts
 * @description JWT 认证守卫 - 保护需要登录才能访问的接口
 *
 * 守卫概念说明：
 * - 守卫（Guard）用于判断请求是否有权限继续执行
 * - 返回 true 表示允许继续，返回 false 或抛出异常表示拒绝
 * - 类似于 Vue Router 的导航守卫 beforeEach
 *
 * 类比前端：
 * - 类似于 Vue Router 的路由守卫 router.beforeEach
 * - 类似于 Axios 请求拦截器中检查 token
 * - 在请求到达 Controller 之前进行权限验证
 *
 * 执行顺序：
 * 1. 请求进入
 * 2. 中间件处理
 * 3. 守卫判断（当前文件）
 * 4. 拦截器处理
 * 5. 管道处理
 * 6. Controller 处理
 */

import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { JwtPayload } from '../interfaces/response.interface';

/**
 * JWT 认证守卫
 *
 * @class JwtAuthGuard
 * @implements {CanActivate}
 *
 * @description
 * 检查请求是否携带有效的 JWT token
 *
 * 注意：
 * - 这个守卫只检查 request.user 是否存在
 * - JWT token 的验证由 JwtStrategy 完成
 * - JwtStrategy 验证成功后会设置 request.user
 *
 * 使用方式：
 * 1. 全局使用：在 AppModule 中注册为 APP_GUARD
 * 2. 局部使用：@UseGuards(JwtAuthGuard)
 */
@Injectable() // @Injectable() 表示这是一个可以被依赖注入的服务
export class JwtAuthGuard implements CanActivate {
  /**
   * 构造函数
   *
   * @param {Reflector} reflector - 用于读取装饰器元数据
   * Reflector 可以读取 @Public() 等装饰器设置的元数据
   */
  constructor(private reflector: Reflector) {}

  /**
   * 守卫核心方法
   *
   * @param {ExecutionContext} context - 执行上下文
   * @returns {boolean} true 表示允许继续，false 或异常表示拒绝
   *
   * @throws {UnauthorizedException} 当用户未登录时抛出
   */
  canActivate(context: ExecutionContext): boolean {
    // 检查是否标记为公开接口
    // getAllAndOverride 会查找方法级和类级的装饰器
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(), // 获取当前处理方法（Controller 方法）
      context.getClass(), // 获取当前类（Controller 类）
    ]);

    // 如果是公开接口，直接放行
    if (isPublic) {
      return true;
    }

    // 获取 HTTP 请求对象
    const request = context.switchToHttp().getRequest();

    // 从请求中获取用户信息
    // request.user 是由 JwtStrategy 验证成功后设置的
    const user = request.user as JwtPayload;

    // 如果没有用户信息，说明未登录或 token 无效
    if (!user) {
      throw new UnauthorizedException('未授权，请先登录');
    }

    // 有用户信息，允许继续执行
    return true;
  }
}
