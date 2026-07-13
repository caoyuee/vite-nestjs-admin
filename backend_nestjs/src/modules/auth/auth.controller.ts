/**
 * @file auth.controller.ts
 * @description 认证控制器 - 处理登录、登出等认证相关的 HTTP 请求
 *
 * Controller 概念说明：
 * - Controller（控制器）负责处理 HTTP 请求
 * - 类似于 Vue Router 的路由处理函数
 * - 使用装饰器定义路由（@Get, @Post, @Put, @Delete）
 *
 * 类比前端：
 * - 类似于 Vue Router 的路由配置
 * - 类似于 Axios 拦截器中的请求处理
 * - @Controller('api/system/user') 类似于路由前缀
 *
 * 装饰器说明：
 * - @Controller(): 定义控制器和路由前缀
 * - @Post(): 定义 POST 请求处理方法
 * - @Body(): 获取请求体数据
 * - @UseGuards(): 使用守卫（权限验证）
 */

import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CaptchaService } from './captcha.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';

/**
 * 认证控制器
 *
 * @class AuthController
 *
 * @description
 * 处理认证相关的 HTTP 请求：
 * - POST /api/system/user/login - 用户登录
 * - POST /api/system/user/logout - 用户登出
 *
 * 路由前缀：/api/system/user
 * 所有方法的路由都会加上这个前缀
 */
@ApiTags('认证') // Swagger 文档分组标签
@Controller('api/system/user') // 定义路由前缀
@UseInterceptors(ClassSerializerInterceptor) // 自动序列化响应（过滤敏感字段）
export class AuthController {
  /**
   * 构造函数 - 依赖注入
   *
   * @param {AuthService} authService - 认证服务
   *
   * NestJS 会自动创建 AuthService 实例并注入
   * 类似于 Vue 的依赖注入，但更强大
   */
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  /**
   * 获取登录验证码
   */
  @Public()
  @Get('captcha')
  @ApiOperation({ summary: '获取登录验证码' })
  getCaptcha() {
    return this.captchaService.generateCaptcha();
  }

  /**
   * 用户登录
   *
   * @description
   * 处理 POST /api/system/user/login 请求
   *
   * @Public() 标记为公开接口，不需要 JWT 认证
   * 因为登录接口本身就没有 token
   *
   * @param {LoginDto} loginDto - 登录参数（用户名、密码）
   * @returns 登录结果，包含 JWT token
   *
   * @example
   * // 请求
   * POST /api/system/user/login
   * Body: { "username": "admin", "password": "123456" }
   *
   * // 响应
   * {
   *   "code": 200,
   *   "message": "success",
   *   "data": { "token": "eyJhbGciOiJIUzI1NiIs..." }
   * }
   */
  @Public() // 标记为公开接口，跳过 JWT 认证
  @Post('login') // 定义 POST 路由：/api/system/user/login
  @ApiOperation({ summary: '用户登录' }) // Swagger 文档描述
  async login(@Body() loginDto: LoginDto) {
    // @Body() 获取请求体并自动转换为 LoginDto
    return this.authService.login(loginDto);
  }

  /**
   * 用户登出
   *
   * @description
   * 处理 POST /api/system/user/logout 请求
   *
   * @UseGuards(JwtAuthGuard) 使用 JWT 认证守卫
   * 只有携带有效 token 的请求才能访问此接口
   *
   * @param {JwtPayload} user - 当前登录用户信息（由 @CurrentUser 装饰器注入）
   * @returns 登出结果
   *
   * @example
   * // 请求
   * POST /api/system/user/logout
   * Headers: { "Authorization": "Bearer <token>" }
   *
   * // 响应
   * {
   *   "code": 200,
   *   "message": "退出成功",
   *   "data": null
   * }
   */
  @UseGuards(JwtAuthGuard) // 使用 JWT 守卫，验证 token
  @Post('logout') // 定义 POST 路由：/api/system/user/logout
  @ApiOperation({ summary: '退出登录' }) // Swagger 文档描述
  @ApiBearerAuth() // Swagger 文档标记需要 Bearer Token
  async logout(@CurrentUser() user: JwtPayload) {
    // @CurrentUser() 获取当前登录用户信息
    // user.sub 是用户 ID
    return this.authService.logout(user.sub);
  }
}

/**
 * 语义化认证控制器
 *
 * @class SystemAuthController
 * @description 按统一接口契约暴露 `/api/system/auth` 认证接口。
 */
@ApiTags('认证')
@Controller('api/system/auth')
@UseInterceptors(ClassSerializerInterceptor)
export class SystemAuthController {
  /**
   * 构造函数
   *
   * @param authService - 认证业务服务
   */
  constructor(
    private readonly authService: AuthService,
    private readonly captchaService: CaptchaService,
  ) {}

  /**
   * 获取登录验证码
   */
  @Public()
  @Get('captcha')
  @ApiOperation({ summary: '获取登录验证码' })
  getCaptcha() {
    return this.captchaService.generateCaptcha();
  }

  /**
   * 用户登录
   */
  @Public()
  @Post('login')
  @ApiOperation({ summary: '用户登录' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  /**
   * 用户退出登录
   */
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @ApiOperation({ summary: '退出登录' })
  @ApiBearerAuth()
  async logout(@CurrentUser() user: JwtPayload) {
    return this.authService.logout(user.sub);
  }
}
