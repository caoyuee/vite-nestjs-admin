/**
 * @file public.decorator.ts
 * @description 公开接口装饰器 - 用于标记不需要 JWT 认证的接口
 *
 * 认证概念说明：
 * - 默认情况下，所有接口都需要 JWT 认证
 * - 但有些接口需要公开访问，如：登录、注册、公开文章等
 * - 使用 @Public() 装饰器标记这些公开接口
 *
 * 类比前端：
 * - 类似于 Vue Router 中的 meta: { requiresAuth: false }
 * - 标记某些路由不需要登录就能访问
 */

import { SetMetadata } from '@nestjs/common';

/**
 * 公开接口元数据的键名
 * 用于在 Guard 中判断接口是否公开
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 公开接口装饰器
 *
 * @description
 * 将接口标记为公开访问，不需要 JWT 认证
 *
 * 工作原理：
 * 1. @Public() 使用 SetMetadata 在路由处理函数上添加元数据
 * 2. JwtAuthGuard 检查这个元数据，如果存在则跳过认证
 * 3. 这样就可以在不修改 Guard 的情况下灵活控制认证
 *
 * @returns {MethodDecorator & ClassDecorator} 装饰器函数
 *
 * @example
 * // 在 Controller 方法上使用 - 单个接口公开
 * @Public()
 * @Post('login')
 * login(@Body() loginDto: LoginDto) {
 *   return this.authService.login(loginDto);
 * }
 *
 * @example
 * // 在 Controller 类上使用 - 整个控制器公开
 * @Public()
 * @Controller('public')
 * export class PublicController {
 *   @Get('info')
 *   getInfo() {
 *     return { message: '这是公开信息' };
 *   }
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
