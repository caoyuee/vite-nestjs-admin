import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsInt,
  Min,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiPropertyOptional({ description: '排序序号', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort?: number;

  @ApiProperty({ description: '角色标识符' })
  @IsString()
  @IsNotEmpty({ message: '角色标识符不能为空' })
  role: string;

  @ApiProperty({ description: '角色名称' })
  @IsString()
  @IsNotEmpty({ message: '角色名称不能为空' })
  name: string;

  @ApiProperty({ description: '角色描述' })
  @IsString()
  @IsNotEmpty({ message: '角色描述不能为空' })
  description: string;

  @ApiPropertyOptional({ description: '角色状态', default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  @ApiPropertyOptional({ description: 'ProTable表格权限', type: [String] })
  @IsOptional()
  @IsArray()
  useProTable?: string[];

  @ApiPropertyOptional({ description: '按钮权限', type: [String] })
  @IsOptional()
  @IsArray()
  authButton?: string[];

  @ApiPropertyOptional({ description: '菜单权限ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  useMenus?: (string | number)[];
}
