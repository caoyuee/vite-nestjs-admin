/**
 * 创建角色的数据传输对象（DTO）
 *
 * 【业务说明】
 * 角色是权限管理的核心，每个角色包含：
 * - 基本信息：名称、标识符、描述
 * - 权限配置：菜单权限、按钮权限、表格权限
 *
 * 【类比前端】
 * 类似于角色管理页面的新增角色表单
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 创建角色的 DTO 类
 */
export class CreateRoleDto {
  /**
   * 排序序号
   *
   * 用于角色列表的排序
   * 数字越小越靠前
   */
  @ApiPropertyOptional({ description: '排序序号', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort?: number;

  /**
   * 角色标识符（必填）
   *
   * 角色的唯一标识，用于代码中判断角色
   * 例如：'admin'、'editor'、'viewer'
   *
   * 【类比前端】
   * 类似于前端代码中判断用户角色的标识：
   * if (user.role === 'admin') { ... }
   */
  @ApiProperty({ description: '角色标识符' })
  @IsString()
  @IsNotEmpty({ message: '角色标识符不能为空' })
  role: string;

  /**
   * 角色名称（必填）
   *
   * 显示给用户看的名称
   * 例如：'管理员'、'编辑员'、'访客'
   */
  @ApiProperty({ description: '角色名称' })
  @IsString()
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string;

  /**
   * 角色描述（必填）
   *
   * 描述角色的职责和权限范围
   */
  @ApiProperty({ description: '角色描述' })
  @IsString()
  @IsNotEmpty({ message: '角色描述不能为空' })
  description: string;

  /**
   * 角色状态
   *
   * true: 启用，可以分配给用户
   * false: 禁用，不能分配给用户
   */
  @ApiPropertyOptional({ description: '角色状态', default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  /**
   * ProTable 表格权限
   *
   * 控制用户可以看到哪些表格列
   * 存储的是权限标识符数组
   *
   * 【类比前端】
   * 前端根据这个数组控制表格列的显示：
   * columns.filter(col => useProTable.includes(col.key))
   */
  @ApiPropertyOptional({ description: 'ProTable表格权限', type: [String] })
  @IsOptional()
  @IsArray()
  useProTable?: string[];

  /**
   * 按钮权限
   *
   * 控制用户可以使用哪些按钮
   * 存储的是权限 ID 数组
   *
   * 【类比前端】
   * 前端根据这个数组控制按钮的显示：
   * <button v-if="hasPermission('user:delete')">删除</button>
   */
  @ApiPropertyOptional({ description: '按钮权限', type: [String] })
  @IsOptional()
  @IsArray()
  authButton?: string[];

  /**
   * 菜单权限 ID 列表
   *
   * 控制用户可以看到哪些菜单
   * 存储的是菜单 ID 数组
   *
   * 【类比前端】
   * 前端根据这个数组过滤路由配置，生成侧边栏菜单
   */
  @ApiPropertyOptional({ description: '菜单权限ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  useMenus?: (string | number)[];
}
