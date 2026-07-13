/**
 * 权限查询参数的数据传输对象（DTO）
 *
 * 【业务场景】
 * 用于权限列表的查询和筛选
 */

import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 权限查询参数的 DTO 类
 */
export class AuthQueryDto {
  /**
   * 页码
   */
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNum?: number = 1;

  /**
   * 每页数量
   */
  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  /**
   * 权限类型筛选
   *
   * 用于筛选特定类型的权限：
   * - 'button': 按钮权限
   * - 'proTable': 表格列权限
   */
  @ApiPropertyOptional({ description: '权限类型' })
  @IsOptional()
  @IsString()
  type?: string;

  /**
   * 权限名称筛选
   *
   * 权限的显示名称
   * 如：'新增用户'、'删除用户'
   */
  @ApiPropertyOptional({ description: '权限名称' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 权限标识符筛选
   *
   * 权限的唯一标识，用于代码判断
   * 如：'user:create'、'user:delete'
   *
   * 【命名规范】
   * 通常采用 '资源:操作' 格式：
   * - user:create - 创建用户
   * - user:delete - 删除用户
   * - user:update - 更新用户
   * - user:read - 查看用户
   */
  @ApiPropertyOptional({ description: '权限标识符' })
  @IsOptional()
  @IsString()
  permission?: string;
}
