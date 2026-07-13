/**
 * 菜单控制器
 *
 * 【控制器的作用】
 * 控制器负责处理 HTTP 请求，类似于前端的 API 路由处理函数
 * 它接收请求，调用 Service 处理业务逻辑，然后返回响应
 *
 * 【类比前端】
 * - Controller ≈ Vue Router 的路由守卫 + API 处理函数
 * - @Get() ≈ router.get('/path', handler)
 * - @Post() ≈ router.post('/path', handler)
 * - @Body() ≈ ctx.request.body（Koa）或 req.body（Express）
 * - @Query() ≈ ctx.query（Koa）或 req.query（Express）
 */

import {
  Controller,
  Get, // 处理 GET 请求
  Post, // 处理 POST 请求
  Put, // 处理 PUT 请求
  Delete, // 处理 DELETE 请求
  Body, // 获取请求体数据
  Param, // 获取 URL 路径参数
  Query, // 获取 URL 查询参数
  UseGuards, // 使用守卫（中间件）
} from '@nestjs/common';
// Swagger 装饰器，用于生成 API 文档
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { MenuService } from './menu.service';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { MenuListQueryDto } from './dto/menu-list-query.dto';
// JWT 认证守卫，验证用户是否已登录
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
// 当前用户装饰器，获取当前登录用户信息
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';
import { Role } from '../../entities/role.entity';
// InjectRepository 用于注入数据库 Repository
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';

/**
 * 菜单控制器类
 *
 * @ApiTags('菜单') - Swagger 文档分组标签
 * @Controller('api/system/user') - 路由前缀
 *   所有路由都会加上这个前缀，如：/api/system/user/menuList
 *
 * @UseGuards(JwtAuthGuard) - 应用 JWT 认证守卫
 *   所有路由都需要验证 JWT Token
 *
 * @ApiBearerAuth() - Swagger 文档中显示 Authorization 输入框
 */
@ApiTags('菜单')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MenuController {
  /**
   * 构造函数 - 依赖注入
   *
   * @param menuService - 菜单服务，通过依赖注入自动创建实例
   * @param roleRepository - 角色数据库仓库，用于查询角色信息
   *
   * 【依赖注入说明】
   * NestJS 使用依赖注入（DI）模式：
   * - 不需要手动 new MenuService()
   * - 只需要在构造函数中声明，NestJS 会自动注入
   * - 类似于 Vue 的 provide/inject，但更强大
   */
  constructor(
    private readonly menuService: MenuService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 新增菜单
   *
   * @Post('addMenu') - 路由：POST /api/system/user/addMenu
   * @Body() createMenuDto - 获取请求体数据，自动验证并转换为 DTO 对象
   */
  @Post('addMenu')
  @ApiOperation({ summary: '新增菜单' })
  async createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  /**
   * 编辑菜单
   *
   * @Put('editMenu') - 路由：PUT /api/system/user/editMenu
   */
  @Put('editMenu')
  @ApiOperation({ summary: '编辑菜单' })
  async updateMenu(@Body() updateMenuDto: UpdateMenuDto) {
    return this.menuService.updateMenu(updateMenuDto);
  }

  /**
   * 删除菜单
   *
   * @Delete('deleteMenu/:id') - 路由：DELETE /api/system/user/deleteMenu/:id
   * @Param('id') id - 获取 URL 路径参数中的 id
   *
   * 【路由参数说明】
   * :id 是动态参数，如 /deleteMenu/123
   * @Param('id') 会获取到 "123"
   */
  @Delete('deleteMenu/:id')
  @ApiOperation({ summary: '删除菜单' })
  async deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }

  /**
   * 获取当前用户的菜单列表
   *
   * @Get('menuList') - 路由：GET /api/system/user/menuList
   * @CurrentUser() user - 获取当前登录用户信息
   *
   * 【业务逻辑】
   * 1. 从 JWT Token 中获取用户角色 ID 列表
   * 2. 根据角色 ID 查询角色详情
   * 3. 从角色中提取菜单 ID 列表
   * 4. 根据菜单 ID 查询菜单并返回树形结构
   *
   * 【类比前端】
   * 类似于前端根据用户权限动态生成侧边栏菜单
   */
  @Get('menuList')
  @ApiOperation({ summary: '获取用户菜单' })
  async getMenuList(@CurrentUser() user: JwtPayload) {
    // 从用户信息中获取角色 ID 列表
    const roleIds = user.roles.map((id) => String(id));

    // 查询角色详情
    const roleList = await this.roleRepository.findBy({
      id: In(roleIds.map(Number)),
    });

    // 如果没有角色，返回空菜单
    if (!roleList || roleList.length === 0) {
      return {
        code: 200,
        message: '未获取到菜单',
        data: [],
      };
    }

    // 从所有角色中提取菜单 ID，并去重
    const menuIds: (string | number)[] = roleList
      .map((role) => role.useMenus)
      .flat();

    // 返回菜单树形结构
    return this.menuService.getMenuList([...new Set(menuIds)]);
  }

  /**
   * 获取所有菜单列表（用于管理后台）
   *
   * @Get('allMenuList') - 路由：GET /api/system/user/allMenuList
   * @Query() query - 获取 URL 查询参数
   *
   * 与 getMenuList 不同，这个接口返回所有菜单，用于管理后台的菜单管理页面
   */
  @Get('allMenuList')
  @ApiOperation({ summary: '获取所有菜单' })
  async getAllMenus(@Query() query: MenuListQueryDto) {
    return this.menuService.getAllMenus(query);
  }
}

/**
 * 语义化菜单控制器
 *
 * @class SystemMenuController
 * @description 按统一接口契约暴露 `/api/system/menus` 菜单资源接口。
 */
@ApiTags('菜单')
@Controller('api/system/menus')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SystemMenuController {
  /**
   * 构造函数
   *
   * @param menuService - 菜单业务服务
   * @param roleRepository - 角色仓库，用于查询当前用户可访问菜单
   */
  constructor(
    private readonly menuService: MenuService,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * 获取当前用户可访问菜单
   */
  @Get('current')
  @ApiOperation({ summary: '获取当前用户菜单' })
  async getCurrentMenus(@CurrentUser() user: JwtPayload) {
    // 根据 JWT 中的角色 ID 查询角色，再合并菜单权限
    const roleIds = user.roles.map((id) => String(id));
    const roleList = await this.roleRepository.findBy({
      id: In(roleIds.map(Number)),
    });

    if (!roleList || roleList.length === 0) {
      return {
        code: 200,
        message: '未获取到菜单',
        data: [],
      };
    }

    const menuIds: (string | number)[] = roleList
      .map((role) => role.useMenus)
      .flat();
    return this.menuService.getMenuList([...new Set(menuIds)]);
  }

  /**
   * 获取全部菜单
   */
  @Get()
  @ApiOperation({ summary: '获取全部菜单' })
  async getAllMenus(@Query() query: MenuListQueryDto) {
    return this.menuService.getAllMenus(query);
  }

  /**
   * 新增菜单
   */
  @Post()
  @ApiOperation({ summary: '新增菜单' })
  async createMenu(@Body() createMenuDto: CreateMenuDto) {
    return this.menuService.createMenu(createMenuDto);
  }

  /**
   * 编辑菜单
   */
  @Put(':id')
  @ApiOperation({ summary: '编辑菜单' })
  async updateMenu(
    @Param('id') id: string,
    @Body() updateMenuDto: Omit<UpdateMenuDto, 'id'>,
  ) {
    return this.menuService.updateMenu({ ...updateMenuDto, id });
  }

  /**
   * 删除菜单
   */
  @Delete(':id')
  @ApiOperation({ summary: '删除菜单' })
  async deleteMenu(@Param('id') id: string) {
    return this.menuService.deleteMenu(id);
  }
}
