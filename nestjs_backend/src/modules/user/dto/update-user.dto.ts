/**
 * 更新用户的数据传输对象（DTO）
 *
 * 【与 CreateUserDto 的区别】
 * - CreateUserDto: 创建新用户，所有必填字段都必须提供
 * - UpdateUserDto: 更新用户信息，只需要提供要更新的字段
 *
 * 【类比前端】
 * 类似于编辑表单：
 * - 创建表单：所有必填项都要填
 * - 编辑表单：只修改需要改的字段，其他保持不变
 */

import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 更新用户的 DTO 类
 *
 * 注意：id 字段是必填的，因为需要知道要更新哪个用户
 * 其他字段都是可选的，只更新传入的字段
 */
export class UpdateUserDto {
  /**
   * 用户ID（必填）
   *
   * 更新操作必须指定要更新哪个用户
   * 这个 ID 会用于数据库查询条件
   */
  @ApiProperty({ description: '用户ID' })
  @IsString()
  @IsNotEmpty({ message: '用户ID不能为空' })
  id: string;

  /**
   * 用户名（可选）
   *
   * 如果传入，则更新用户名
   * 如果不传，则保持原用户名不变
   */
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  @IsString()
  username?: string;

  /**
   * 姓名（可选）
   */
  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 邮箱（可选）
   */
  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  /**
   * 电话（可选）
   */
  @ApiPropertyOptional({ description: '电话' })
  @IsOptional()
  @IsString()
  phone?: string;

  /**
   * 头像（可选）
   */
  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string;

  /**
   * 状态（可选）
   *
   * 用于启用/禁用用户
   */
  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  /**
   * 角色ID列表（可选）
   *
   * 如果传入，会完全替换用户的角色列表
   * 不是增量更新，而是全量替换
   */
  @ApiPropertyOptional({ description: '角色ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  roles?: string[];
}
