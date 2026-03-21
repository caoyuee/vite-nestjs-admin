/**
 * 角色授权的数据传输对象（DTO）
 *
 * 【业务场景】
 * 管理员为角色分配权限时使用
 * 可以设置菜单权限、按钮权限、表格权限
 *
 * 【类比前端】
 * 类似于角色授权页面的表单：
 * - 左侧是菜单树，勾选可访问的菜单
 * - 右侧是权限列表，勾选可使用的按钮和表格列
 */

import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 角色授权的 DTO 类
 */
export class RolePermissionDto {
  /**
   * 角色ID（必填）
   *
   * 要授权的角色 ID
   */
  @ApiProperty({ description: '角色ID' })
  @IsString()
  @IsNotEmpty({ message: '角色ID不能为空' })
  id: string;

  /**
   * 菜单权限 ID 列表（必填）
   *
   * 角色可以访问的菜单 ID 数组
   * 完全替换原有的菜单权限
   */
  @ApiProperty({ description: '菜单权限ID列表', type: [String] })
  @IsArray()
  useMenus: (string | number)[];

  /**
   * ProTable 表格权限标识符列表（可选）
   *
   * 角色可以查看的表格列权限标识符
   * 完全替换原有的表格权限
   */
  @ApiPropertyOptional({
    description: 'ProTable表格权限标识符列表',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  useProTable?: string[];

  /**
   * 按钮权限标识符列表（可选）
   *
   * 角色可以使用的按钮权限标识符
   * 完全替换原有的按钮权限
   */
  @ApiPropertyOptional({ description: '按钮权限标识符列表', type: [String] })
  @IsOptional()
  @IsArray()
  authButton?: string[];
}
