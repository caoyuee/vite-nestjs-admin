import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MenuListQueryDto {
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNum?: number = 1;

  @ApiPropertyOptional({ description: '每页数量' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number;

  @ApiPropertyOptional({ description: '路由路径' })
  @IsOptional()
  @IsString()
  path?: string;

  @ApiPropertyOptional({ description: '路由名称' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: '路由中文名称' })
  @IsOptional()
  @IsString()
  nameZH?: string;

  @ApiPropertyOptional({ description: '组件路径' })
  @IsOptional()
  @IsString()
  component?: string;

  @ApiPropertyOptional({ description: '菜单状态' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean;

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
}
