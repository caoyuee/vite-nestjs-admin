/**
 * 更新角色的数据传输对象
 *
 * @description
 * 用于角色编辑接口，所有业务字段均为可选字段，Controller 通过路径参数确定要编辑的角色 ID。
 */

import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 角色更新 DTO
 *
 * @class UpdateRoleDto
 * @description 编辑角色时只提交需要修改的字段。
 */
export class UpdateRoleDto {
  /**
   * 排序序号
   */
  @ApiPropertyOptional({ description: '排序序号' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort?: number;

  /**
   * 角色标识符
   */
  @ApiPropertyOptional({ description: '角色标识符' })
  @IsOptional()
  @IsString()
  role?: string;

  /**
   * 角色名称
   */
  @ApiPropertyOptional({ description: '角色名称' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 角色描述
   */
  @ApiPropertyOptional({ description: '角色描述' })
  @IsOptional()
  @IsString()
  description?: string;

  /**
   * 角色状态
   */
  @ApiPropertyOptional({ description: '角色状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  /**
   * 菜单权限 ID 列表
   */
  @ApiPropertyOptional({ description: '菜单权限ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  useMenus?: (string | number)[];

  /**
   * 按钮权限 ID 列表
   */
  @ApiPropertyOptional({ description: '按钮权限ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  authButton?: string[];

  /**
   * 表格权限 ID 列表
   */
  @ApiPropertyOptional({ description: '表格权限ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  useProTable?: string[];
}
