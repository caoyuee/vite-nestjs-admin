import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RolePermissionDto {
  @ApiProperty({ description: '角色ID' })
  @IsString()
  @IsNotEmpty({ message: '角色ID不能为空' })
  id: string;

  @ApiProperty({ description: '菜单权限ID列表', type: [String] })
  @IsArray()
  useMenus: (string | number)[];

  @ApiPropertyOptional({
    description: 'ProTable表格权限标识符列表',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  useProTable?: string[];

  @ApiPropertyOptional({ description: '按钮权限标识符列表', type: [String] })
  @IsOptional()
  @IsArray()
  authButton?: string[];
}
