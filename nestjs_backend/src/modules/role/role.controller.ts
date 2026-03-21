/**
 * 角色控制器
 *
 * 【业务说明】
 * 角色管理相关的 API 接口：
 * - 创建角色
 * - 获取角色列表
 * - 获取当前用户的角色权限信息
 * - 删除角色
 * - 为角色授权
 *
 * 【类比前端】
 * 这些接口对应角色管理页面的功能：
 * - 角色列表页：增删改查角色
 * - 角色授权页：配置角色的菜单和按钮权限
 */

import {
  Controller,
  Get,      // 处理 GET 请求
  Post,     // 处理 POST 请求
  Delete,   // 处理 DELETE 请求
  Body,     // 获取请求体
  Query,    // 获取查询参数
  UseGuards, // 使用守卫
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleListQueryDto } from './dto/role-list-query.dto';
import { RolePermissionDto } from './dto/role-permission.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';

/**
 * 角色控制器类
 *
 * @ApiTags('角色') - Swagger 文档分组
 * @Controller('api/system/user') - 路由前缀
 * @UseGuards(JwtAuthGuard) - JWT 认证
 */
@ApiTags('角色')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RoleController {
  /**
   * 构造函数 - 依赖注入角色服务
   */
  constructor(private readonly roleService: RoleService) {}

  /**
   * 新增角色
   *
   * @Post('addRole') - 路由：POST /api/system/user/addRole
   */
  @Post('addRole')
  @ApiOperation({ summary: '新增角色' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.createRole(createRoleDto);
  }

  /**
   * 获取角色列表
   *
   * @Get('getRoleList') - 路由：GET /api/system/user/getRoleList
   * 支持分页和筛选
   */
  @Get('getRoleList')
  @ApiOperation({ summary: '获取角色列表' })
  async getRoleList(@Query() query: RoleListQueryDto) {
    return this.roleService.getRoleList(query);
  }

  /**
   * 获取当前用户的角色权限信息
   *
   * @Get('getRoleInfo') - 路由：GET /api/system/user/getRoleInfo
   * @CurrentUser() user - 从 JWT 中获取当前用户信息
   *
   * 【业务场景】
   * 用户登录后，前端需要知道用户有哪些权限
   * 这个接口返回用户的菜单权限、按钮权限、表格权限
   * 前端根据这些权限控制页面元素的显示/隐藏
   */
  @Get('getRoleInfo')
  @ApiOperation({ summary: '获取角色授权信息' })
  async getRoleInfo(@CurrentUser() user: JwtPayload) {
    // user.sub 是用户 ID
    return this.roleService.getRoleInfo(user.sub);
  }

  /**
   * 删除角色
   *
   * @Delete('deleteRole') - 路由：DELETE /api/system/user/deleteRole?id=xxx
   * @Query('id') id - 从查询参数获取角色 ID
   */
  @Delete('deleteRole')
  @ApiOperation({ summary: '删除角色' })
  async deleteRole(@Query('id') id: string) {
    return this.roleService.deleteRole(id);
  }

  /**
   * 角色授权
   *
   * @Post('putRolePermission') - 路由：POST /api/system/user/putRolePermission
   *
   * 【业务场景】
   * 为角色分配权限：
   * - useMenus: 可访问的菜单 ID 列表
   * - useProTable: 表格权限标识符列表
   * - authButton: 按钮权限标识符列表
   */
  @Post('putRolePermission')
  @ApiOperation({ summary: '角色授权' })
  async setRolePermission(@Body() rolePermissionDto: RolePermissionDto) {
    return this.roleService.setRolePermission(rolePermissionDto);
  }
}
