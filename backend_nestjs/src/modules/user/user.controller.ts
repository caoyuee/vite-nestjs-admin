/**
 * @file user.controller.ts
 * @description 用户控制器 - 处理用户管理相关的 HTTP 请求
 *
 * 控制器职责说明：
 * - 获取用户信息
 * - 创建用户
 * - 编辑用户
 * - 删除用户
 * - 用户列表查询
 * - 重置密码
 *
 * 类比前端：
 * - 类似于 Vue Router 的路由配置
 * - 每个 @Get/@Post/@Put/@Delete 装饰器对应一个路由
 */

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserListQueryDto } from './dto/user-list-query.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';

/**
 * 用户控制器
 *
 * @class UserController
 *
 * @description
 * 处理用户管理相关的所有 HTTP 请求
 * 路由前缀：/api/system/user
 *
 * 大部分接口需要 JWT 认证
 */
@ApiTags('用户') // Swagger 文档分组
@Controller('api/system/user') // 路由前缀
@UseGuards(JwtAuthGuard) // 整个控制器使用 JWT 守卫
@ApiBearerAuth() // Swagger 标记需要认证
export class UserController {
  /**
   * 构造函数 - 依赖注入 UserService
   */
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前登录用户信息
   *
   * @description
   * GET /api/system/user/userInfo
   * 返回当前登录用户的详细信息
   *
   * @param user - 当前登录用户（由 @CurrentUser 装饰器注入）
   */
  @Get('userInfo')
  @ApiOperation({ summary: '获取当前用户信息' })
  async getUserInfo(@CurrentUser() user: JwtPayload) {
    return this.userService.getUserInfo(user.sub);
  }

  /**
   * 创建新用户
   *
   * @description
   * POST /api/system/user/addUser
   * 创建新用户（注册）
   *
   * @Public() 标记为公开接口，不需要认证
   * 因为注册时用户还没有账号
   *
   * @param createUserDto - 用户创建参数
   */
  @Public() // 公开接口，不需要认证
  @Post('addUser')
  @ApiOperation({ summary: '创建新用户' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * 编辑用户信息
   *
   * @description
   * PUT /api/system/user/editUser
   * 更新用户信息
   *
   * @param updateUserDto - 用户更新参数
   */
  @Put('editUser')
  @ApiOperation({ summary: '编辑用户信息' })
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  /**
   * 删除用户
   *
   * @description
   * DELETE /api/system/user/deleteUser/:id
   * 软删除用户（不会真正删除记录，只是标记为已删除）
   *
   * @param id - 用户 ID（从 URL 路径参数获取）
   */
  @Delete('deleteUser/:id')
  @ApiOperation({ summary: '删除用户' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  /**
   * 获取用户列表
   *
   * @description
   * GET /api/system/user/userList
   * 分页查询用户列表
   *
   * @param query - 查询参数（分页、筛选条件）
   */
  @Get('userList')
  @ApiOperation({ summary: '获取用户列表' })
  async getUserList(@Query() query: UserListQueryDto) {
    return this.userService.getUserList(query);
  }

  /**
   * 重置密码
   *
   * @description
   * PUT /api/system/user/ResetPwd
   * 用户重置自己的密码
   *
   * @param user - 当前登录用户
   * @param resetPasswordDto - 重置密码参数（旧密码、新密码）
   */
  @Put('ResetPwd')
  @ApiOperation({ summary: '重置密码' })
  async resetPassword(
    @CurrentUser() user: JwtPayload,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(user.sub, resetPasswordDto);
  }
}

/**
 * 语义化用户控制器
 *
 * @class SystemUsersController
 * @description 按统一接口契约暴露 `/api/system/users` 用户资源接口。
 */
@ApiTags('用户')
@Controller('api/system/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SystemUsersController {
  /**
   * 构造函数
   *
   * @param userService - 用户业务服务
   */
  constructor(private readonly userService: UserService) {}

  /**
   * 获取当前登录用户信息
   */
  @Get('me')
  @ApiOperation({ summary: '获取当前用户信息' })
  async getCurrentUserInfo(@CurrentUser() user: JwtPayload) {
    return this.userService.getUserInfo(user.sub);
  }

  /**
   * 获取用户列表
   */
  @Get()
  @ApiOperation({ summary: '获取用户列表' })
  async getUserList(@Query() query: UserListQueryDto) {
    return this.userService.getUserList(query);
  }

  /**
   * 创建用户
   */
  @Post()
  @ApiOperation({ summary: '创建用户' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  /**
   * 编辑用户
   */
  @Put(':id')
  @ApiOperation({ summary: '编辑用户' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Omit<UpdateUserDto, 'id'>,
  ) {
    return this.userService.updateUser({ ...updateUserDto, id });
  }

  /**
   * 删除用户
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除用户' })
  async deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  /**
   * 当前用户重置密码
   */
  @Put('me/reset-password')
  @ApiOperation({ summary: '当前用户重置密码' })
  async resetPassword(
    @CurrentUser() user: JwtPayload,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.userService.resetPassword(user.sub, resetPasswordDto);
  }
}
