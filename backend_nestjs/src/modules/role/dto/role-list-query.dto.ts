/**
 * 角色列表查询参数的数据传输对象（DTO）
 *
 * 【业务场景】
 * 用于角色管理页面的列表查询
 * 支持分页和筛选
 */

import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 角色列表查询参数的 DTO 类
 */
export class RoleListQueryDto {
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
   * 角色标识符筛选
   *
   * 精确匹配角色标识符
   */
  @ApiPropertyOptional({ description: '角色标识符' })
  @IsOptional()
  @IsString()
  role?: string;

  /**
   * 角色名称筛选
   *
   * 精确匹配角色名称
   */
  @ApiPropertyOptional({ description: '角色名称' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 角色状态筛选
   *
   * 筛选启用或禁用的角色
   */
  @ApiPropertyOptional({ description: '角色状态' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean;
}
