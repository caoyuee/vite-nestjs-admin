/**
 * 更新菜单的数据传输对象（DTO）
 *
 * 【与 CreateMenuDto 的区别】
 * - CreateMenuDto: 创建新菜单，必填字段较多
 * - UpdateMenuDto: 更新菜单，所有字段都可选（除了 id）
 *
 * 【类比前端】
 * 类似于编辑菜单表单：
 * - 加载时填充现有数据
 * - 只修改需要改的字段
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
 * 更新菜单元数据 DTO
 *
 * 与 MetaDto 类似，但所有字段都是可选的
 */
class UpdateMetaDto {
  @ApiPropertyOptional({ description: '菜单图标' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiPropertyOptional({ description: '菜单标题' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: '外部链接地址' })
  @IsOptional()
  @IsString()
  isLink?: string;

  @ApiPropertyOptional({ description: '是否隐藏菜单' })
  @IsOptional()
  @IsBoolean()
  isHide?: boolean;

  @ApiPropertyOptional({ description: '是否全屏显示' })
  @IsOptional()
  @IsBoolean()
  isFull?: boolean;

  @ApiPropertyOptional({ description: '是否固定标签页' })
  @IsOptional()
  @IsBoolean()
  isAffix?: boolean;

  @ApiPropertyOptional({ description: '是否缓存组件' })
  @IsOptional()
  @IsBoolean()
  isKeepAlive?: boolean;

  @ApiPropertyOptional({ description: '高亮菜单路径' })
  @IsOptional()
  @IsString()
  activeMenu?: string;
}

/**
 * 更新菜单的 DTO 类
 */
export class UpdateMenuDto {
  /**
   * 菜单ID（必填）
   *
   * 用于定位要更新的菜单
   */
  @ApiProperty({ description: '菜单ID' })
  @IsString()
  @IsNotEmpty({ message: '菜单ID不能为空' })
  id: string;

  /**
   * 菜单排序序号
   */
  @ApiPropertyOptional({ description: '菜单排序序号' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index?: number;

  /**
   * 菜单类型
   */
  @ApiPropertyOptional({ description: '菜单类型' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  type?: number;

  /**
   * 父级菜单ID
   */
  @ApiPropertyOptional({ description: '父级菜单ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;

  /**
   * 路由路径
   */
  @ApiPropertyOptional({ description: '路由路径' })
  @IsOptional()
  @IsString()
  path?: string;

  /**
   * 路由名称
   */
  @ApiPropertyOptional({ description: '路由名称' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 组件路径
   */
  @ApiPropertyOptional({ description: '组件路径' })
  @IsOptional()
  @IsString()
  component?: string;

  /**
   * 路由重定向地址
   */
  @ApiPropertyOptional({ description: '路由重定向地址' })
  @IsOptional()
  @IsString()
  redirect?: string;

  /**
   * 菜单状态
   */
  @ApiPropertyOptional({ description: '菜单状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  /**
   * 菜单元数据
   *
   * 更新时会与原有 meta 合并
   */
  @ApiPropertyOptional({ description: '菜单元数据' })
  @IsOptional()
  meta?: UpdateMetaDto;
}
