/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/**
 * @file current-user.decorator.ts
 * @description 当前用户装饰器 - 用于从请求中提取当前登录用户信息
 *
 * 装饰器概念说明：
 * - 装饰器是 NestJS 的核心概念，类似于 Vue 的指令
 * - @CurrentUser() 可以在 Controller 方法中直接获取当前登录用户
 * - 类似于 Vue Router 的路由守卫中获取用户信息
 *
 * 类比前端：
 * - 类似于 Vue 的 computed 属性，自动计算并返回值
 * - 类似于 Pinia 的 getter，从 store 中获取用户信息
 * - 在 Controller 中使用：@CurrentUser() user: JwtPayload
 */

import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { JwtPayload } from '../interfaces/response.interface';

/**
 * 当前用户装饰器
 *
 * @description
 * 这是一个自定义参数装饰器，用于从请求对象中提取当前登录用户信息
 *
 * 工作原理：
 * 1. JWT Strategy 验证 token 后，将用户信息挂载到 request.user
 * 2. 这个装饰器从 request.user 中提取用户信息
 * 3. 可以获取完整用户对象，也可以获取单个属性
 *
 * @param {keyof JwtPayload | undefined} data - 要提取的用户属性名（可选）
 * @param {ExecutionContext} ctx - NestJS 执行上下文
 * @returns {JwtPayload | any} 用户信息或指定属性值
 *
 * @example
 * // 获取完整用户信息
 * @Get('profile')
 * getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;
 * }
 *
 * @example
 * // 只获取用户 ID
 * @Get('my-posts')
 * getMyPosts(@CurrentUser('sub') userId: string) {
 *   return this.postService.findByUser(userId);
 * }
 *
 * @example
 * // 只获取用户名
 * @Get('my-name')
 * getMyName(@CurrentUser('username') username: string) {
 *   return { username };
 * }
 */
export const CurrentUser = createParamDecorator(
  /**
   * 装饰器实现函数
   *
   * @param data - 可选的属性名，用于获取用户的特定属性
   * @param ctx - 执行上下文，包含请求和响应信息
   */
  (
    data: keyof JwtPayload | undefined,
    ctx: ExecutionContext,
  ): JwtPayload | any => {
    // 从执行上下文中获取 HTTP 请求对象
    // ExecutionContext 类似于 Vue Router 的 route 对象
    // switchToHttp() 转换为 HTTP 上下文
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.switchToHttp().getRequest();

    // 从请求中获取用户信息
    // request.user 是由 JWT Strategy 验证后设置的
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = request.user as JwtPayload;

    // 如果指定了属性名，返回该属性的值
    if (data) {
      return user?.[data];
    }

    // 否则返回完整的用户对象
    return user;
  },
);
