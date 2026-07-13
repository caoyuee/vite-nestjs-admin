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
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import type { JwtPayload } from '../interfaces/response.interface';

/**
 * JWT 认证守卫
 *
 * @class JwtAuthGuard
 * @extends AuthGuard('jwt')
 *
 * @description
 * 继承 Passport 的 AuthGuard('jwt')，自动调用 JwtStrategy 验证 token
 *
 * 工作流程：
 * 1. AuthGuard('jwt') 从请求头提取 token
 * 2. 调用 JwtStrategy 验证 token
 * 3. JwtStrategy.validate() 的返回值被设置到 request.user
 * 4. 如果验证失败，自动抛出 UnauthorizedException
 *
 * 使用方式：
 * 1. 全局使用：在 AppModule 中注册为 APP_GUARD
 * 2. 局部使用：@UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  /**
   * 构造函数
   *
   * @param {Reflector} reflector - 用于读取装饰器元数据
   * Reflector 可以读取 @Public() 等装饰器设置的元数据
   */
  constructor(private reflector: Reflector) {
    super();
  }

  /**
   * 守卫核心方法
   *
   * @param {ExecutionContext} context - 执行上下文
   * @returns {boolean | Promise<boolean>} true 表示允许继续
   *
   * @throws {UnauthorizedException} 当用户未登录时抛出
   */
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  /**
   * 处理认证失败的情况
   *
   * @description
   * 重写 handleRequest 方法，自定义错误处理
   *
   * @param err - 错误对象
   * @param user - 用户信息（验证成功时）
   * @param info - 附加信息
   * @returns 用户信息
   */
  handleRequest<TUser = JwtPayload>(
    err: Error | null,
    user: TUser | false | null,
    _info: unknown,
  ): TUser {
    if (err) {
      throw err;
    }

    if (!user) {
      throw new UnauthorizedException('未授权，请先登录');
    }

    return user;
  }
}
