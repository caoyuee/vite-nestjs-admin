/**
 * @file demo-user.controller.ts
 * @description 演示用户控制器 - 为前端示例页面提供统一语义的演示接口
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { DemoUserService } from './demo-user.service';
import type { DemoUserQuery } from './demo-user.service';

/**
 * 演示用户控制器
 *
 * @class DemoUserController
 * @description 所有接口挂在 `/api/system/demo/users` 下，避免与真实用户管理混淆。
 */
@ApiTags('演示用户')
@Controller('api/system/demo/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DemoUserController {
  /**
   * 构造函数
   *
   * @param demoUserService - 演示用户服务
   */
  constructor(private readonly demoUserService: DemoUserService) {}

  /**
   * 获取演示用户列表
   */
  @Get()
  @ApiOperation({ summary: '获取演示用户列表' })
  getUserList(@Query() query: DemoUserQuery) {
    return this.demoUserService.getUserList(query);
  }

  /**
   * 获取树形演示用户列表
   */
  @Get('tree')
  @ApiOperation({ summary: '获取树形演示用户列表' })
  getUserTreeList(@Query() query: DemoUserQuery) {
    return this.demoUserService.getUserTreeList(query);
  }

  /**
   * 新增演示用户
   */
  @Post()
  @ApiOperation({ summary: '新增演示用户' })
  createUser(@Body() payload: Record<string, unknown>) {
    return this.demoUserService.createUser(payload);
  }

  /**
   * 批量导入演示用户
   */
  @Post('import')
  @ApiOperation({ summary: '批量导入演示用户' })
  importUsers() {
    return this.demoUserService.importUsers();
  }

  /**
   * 导出演示用户数据
   */
  @Post('export')
  @ApiOperation({ summary: '导出演示用户数据' })
  exportUsers() {
    return {
      code: 200,
      message: '导出成功',
      data: 'id,username,email\n1,demo_user_1,demo1@example.com',
    };
  }

  /**
   * 获取用户状态字典
   */
  @Get('status')
  @ApiOperation({ summary: '获取用户状态字典' })
  getStatusOptions() {
    return this.demoUserService.getStatusOptions();
  }

  /**
   * 获取用户性别字典
   */
  @Get('gender')
  @ApiOperation({ summary: '获取用户性别字典' })
  getGenderOptions() {
    return this.demoUserService.getGenderOptions();
  }

  /**
   * 获取部门树
   */
  @Get('departments')
  @ApiOperation({ summary: '获取部门树' })
  getDepartments() {
    return this.demoUserService.getDepartments();
  }

  /**
   * 获取角色字典
   */
  @Get('roles')
  @ApiOperation({ summary: '获取角色字典' })
  getRoles() {
    return this.demoUserService.getRoles();
  }

  /**
   * 编辑演示用户
   */
  @Put(':id')
  @ApiOperation({ summary: '编辑演示用户' })
  updateUser(
    @Param('id') id: string,
    @Body() payload: Record<string, unknown>,
  ) {
    return this.demoUserService.updateUser(id, payload);
  }

  /**
   * 切换演示用户状态
   */
  @Put(':id/status')
  @ApiOperation({ summary: '切换演示用户状态' })
  changeStatus(@Param('id') id: string, @Body() payload: { status: number }) {
    return this.demoUserService.changeStatus(id, payload.status);
  }

  /**
   * 重置演示用户密码
   */
  @Put(':id/reset-password')
  @ApiOperation({ summary: '重置演示用户密码' })
  resetPassword(@Param('id') _id: string) {
    return this.demoUserService.resetPassword();
  }

  /**
   * 删除单个演示用户
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除单个演示用户' })
  deleteUser(@Param('id') id: string) {
    return this.demoUserService.deleteUsers([id]);
  }

  /**
   * 批量删除演示用户
   */
  @Delete()
  @ApiOperation({ summary: '批量删除演示用户' })
  deleteUsers(@Query('ids') ids: string | string[]) {
    const idList = Array.isArray(ids) ? ids : String(ids || '').split(',');
    return this.demoUserService.deleteUsers(idList.filter(Boolean));
  }
}
