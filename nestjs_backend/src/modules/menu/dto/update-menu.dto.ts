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

export class UpdateMenuDto {
  @ApiProperty({ description: '菜单ID' })
  @IsString()
  @IsNotEmpty({ message: '菜单ID不能为空' })
  id: string;

  @ApiPropertyOptional({ description: '菜单排序序号' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index?: number;

  @ApiPropertyOptional({ description: '菜单类型' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  type?: number;

  @ApiPropertyOptional({ description: '父级菜单ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;

  @ApiPropertyOptional({ description: '路由路径' })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({ description: '路由名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '组件路径' })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiPropertyOptional({ description: '路由重定向地址' })
  @IsOptional()
  @IsString()
  redirect?: string;

  @ApiPropertyOptional({ description: '菜单状态' })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({ description: '菜单元数据' })
  @IsOptional()
  meta?: UpdateMetaDto;
}
