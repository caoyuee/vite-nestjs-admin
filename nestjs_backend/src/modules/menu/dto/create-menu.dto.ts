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

class MetaDto {
  @ApiPropertyOptional({ description: '菜单图标' })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ description: '菜单标题' })
  @IsString()
  @IsNotEmpty({ message: '菜单标题不能为空' })
  title: string;

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

export class CreateMenuDto {
  @ApiPropertyOptional({ description: '菜单排序序号', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  index?: number;

  @ApiPropertyOptional({ description: '菜单类型', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  type?: number;

  @ApiPropertyOptional({ description: '父级菜单ID', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  parentId?: number;

  @ApiProperty({ description: '路由路径' })
  @IsString()
  @IsNotEmpty({ message: '路由路径不能为空' })
  path: string;

  @ApiProperty({ description: '路由名称' })
  @IsString()
  @IsNotEmpty({ message: '路由名称不能为空' })
  name: string;

  @ApiProperty({ description: '组件路径' })
  @IsString()
  @IsNotEmpty({ message: '组件路径不能为空' })
  component: string;

  @ApiPropertyOptional({ description: '路由重定向地址' })
  @IsOptional()
  @IsString()
  redirect?: string;

  @ApiPropertyOptional({ description: '菜单状态', default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiProperty({ description: '菜单元数据' })
  meta: MetaDto;
}
