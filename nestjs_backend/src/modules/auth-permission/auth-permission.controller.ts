/**
 * 权限控制器
 *
 * 【业务说明】
 * 提供权限数据的查询接口
 * 主要用于管理后台的权限配置
 *
 * 【类比前端】
 * 这些接口用于：
 * - 权限管理页面：展示所有权限
 * - 角色授权页面：选择要分配的权限
 */

import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthPermissionService } from './auth-permission.service';
import { AuthQueryDto } from './dto/auth-query.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

/**
 * 权限控制器类
 *
 * @ApiTags('权限') - Swagger 文档分组
 * @Controller('api/system/user') - 路由前缀
 */
@ApiTags('权限')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AuthPermissionController {
  /**
   * 构造函数 - 依赖注入权限服务
   */
  constructor(private readonly authPermissionService: AuthPermissionService) {}

  /**
   * 获取权限按钮列表
   *
   * @Get('getAuthBtns') - 路由：GET /api/system/user/getAuthBtns
   *
   * 【业务场景】
   * 获取系统中的所有权限配置
   * 用于角色授权页面，展示可选择的权限列表
   */
  @Get('getAuthBtns')
  @ApiOperation({ summary: '获取权限按钮列表' })
  async getAuthBtns(@Query() query: AuthQueryDto) {
    return this.authPermissionService.getAuthBtns(query);
  }
}
