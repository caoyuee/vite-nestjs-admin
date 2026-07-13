/**
 * 创建菜单的数据传输对象（DTO）
 *
 * 【菜单结构说明】
 * 菜单是树形结构，每个菜单项可以包含：
 * - 基本信息：路径、名称、组件
 * - 元数据：图标、标题、是否隐藏等
 * - 层级关系：父级菜单ID、排序序号
 *
 * 【类比前端】
 * 这个 DTO 对应前端的路由配置：
 * ```js
 * {
 *   path: '/system',
 *   name: 'System',
 *   component: 'layout',
 *   meta: { title: '系统管理', icon: 'setting' },
 *   children: [...]
 * }
 * ```
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsBoolean,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 菜单元数据 DTO
 *
 * meta 字段包含菜单的显示配置
 * 类似于 Vue Router 的 meta 字段
 */
class MetaDto {
  /**
   * 菜单图标
   *
   * 存储图标名称，前端根据名称渲染对应图标
   * 例如：'setting'、'user'、'dashboard'
   */
  @ApiPropertyOptional({ description: '菜单图标' })
  @IsOptional()
  @IsString()
  icon?: string;

  /**
   * 菜单标题（必填）
   *
   * 显示在侧边栏的菜单名称
   */
  @ApiProperty({ description: '菜单标题' })
  @IsString()
  @IsNotEmpty({ message: '菜单标题不能为空' })
  title: string;

  /**
   * 外部链接地址
   *
   * 如果设置，点击菜单会跳转到外部链接
   * 例如：'https://github.com'
   */
  @ApiPropertyOptional({ description: '外部链接地址' })
  @IsOptional()
  @IsString()
  isLink?: string;

  /**
   * 是否隐藏菜单
   *
   * true: 不在侧边栏显示，但可以通过 URL 访问
   * false: 正常显示
   */
  @ApiPropertyOptional({ description: '是否隐藏菜单' })
  @IsOptional()
  @IsBoolean()
  isHide?: boolean;

  /**
   * 是否全屏显示
   *
   * true: 页面全屏显示，隐藏侧边栏和顶栏
   */
  @ApiPropertyOptional({ description: '是否全屏显示' })
  @IsOptional()
  @IsBoolean()
  isFull?: boolean;

  /**
   * 是否固定标签页
   *
   * true: 标签页固定显示，不可关闭
   * 类似于浏览器的固定标签页
   */
  @ApiPropertyOptional({ description: '是否固定标签页' })
  @IsOptional()
  @IsBoolean()
  isAffix?: boolean;

  /**
   * 是否缓存组件
   *
   * true: 使用 keep-alive 缓存组件
   * 切换页面时保留组件状态，不重新加载
   */
  @ApiPropertyOptional({ description: '是否缓存组件' })
  @IsOptional()
  @IsBoolean()
  isKeepAlive?: boolean;

  /**
   * 高亮菜单路径
   *
   * 当访问某个页面时，高亮指定的菜单项
   * 用于详情页高亮列表页菜单等场景
   */
  @ApiPropertyOptional({ description: '高亮菜单路径' })
  @IsOptional()
  @IsString()
  activeMenu?: string;
}

/**
 * 创建菜单的 DTO 类
 */
export class CreateMenuDto {
  /**
   * 菜单排序序号
   *
   * 数字越小越靠前
   * 用于同级菜单的排序
   */
  @ApiPropertyOptional({ description: '菜单排序序号', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index?: number;

  /**
   * 菜单类型
   *
   * 0: 目录（有子菜单）
   * 1: 菜单（可点击跳转）
   * 2: 按钮（权限控制）
   */
  @ApiPropertyOptional({ description: '菜单类型', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  type?: number;

  /**
   * 父级菜单ID
   *
   * 0: 顶级菜单
   * 其他: 父菜单的 ID
   */
  @ApiPropertyOptional({ description: '父级菜单ID', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;

  /**
   * 路由路径
   *
   * 对应 Vue Router 的 path
   * 例如：'/system/user'、'user'
   */
  @ApiProperty({ description: '路由路径' })
  @IsString()
  @IsNotEmpty({ message: '路由路径不能为空' })
  path: string;

  /**
   * 路由名称
   *
   * 对应 Vue Router 的 name
   * 用于路由跳转：router.push({ name: 'User' })
   * 必须唯一
   */
  @ApiProperty({ description: '路由名称' })
  @IsString()
  @IsNotEmpty({ message: '路由名称不能为空' })
  name: string;

  /**
   * 组件路径
   *
   * 对应 Vue Router 的 component
   * 例如：'system/user/index'、'layout'
   * 前端会根据这个路径动态导入组件
   */
  @ApiProperty({ description: '组件路径' })
  @IsString()
  @IsNotEmpty({ message: '组件路径不能为空' })
  component: string;

  /**
   * 路由重定向地址
   *
   * 访问目录时自动重定向到指定路径
   * 例如：访问 /system 重定向到 /system/user
   */
  @ApiPropertyOptional({ description: '路由重定向地址' })
  @IsOptional()
  @IsString()
  redirect?: string;

  /**
   * 菜单状态
   *
   * true: 启用，显示在菜单中
   * false: 禁用，不显示
   */
  @ApiPropertyOptional({ description: '菜单状态', default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  /**
   * 菜单元数据
   *
   * 包含图标、标题等显示配置
   */
  @ApiProperty({ description: '菜单元数据' })
  meta: MetaDto;
}
