/**
 * 菜单列表查询参数的数据传输对象（DTO）
 *
 * 【业务场景】
 * 用于菜单管理页面的列表查询
 * 支持分页和多条件筛选
 *
 * 【类比前端】
 * 类似于菜单管理页面的搜索表单
 */

import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 菜单列表查询参数的 DTO 类
 */
export class MenuListQueryDto {
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
   *
   * 可选，不传则返回全部
   */
  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  /**
   * 路由路径筛选
   */
  @ApiPropertyOptional({ description: '路由路径' })
  @IsOptional()
  @IsString()
  path?: string;

  /**
   * 路由名称筛选
   */
  @ApiPropertyOptional({ description: '路由名称' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 路由中文名称筛选
   */
  @ApiPropertyOptional({ description: '路由中文名称' })
  @IsOptional()
  @IsString()
  nameZH?: string;

  /**
   * 组件路径筛选
   */
  @ApiPropertyOptional({ description: '组件路径' })
  @IsOptional()
  @IsString()
  component?: string;

  /**
   * 菜单状态筛选
   */
  @ApiPropertyOptional({ description: '菜单状态' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean;

  /**
   * 菜单类型筛选
   */
  @ApiPropertyOptional({ description: '菜单类型' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  type?: number;

  /**
   * 父级菜单ID筛选
   */
  @ApiPropertyOptional({ description: '父级菜单ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;
}
