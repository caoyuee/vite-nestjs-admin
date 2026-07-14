/**
 * @file create-department.dto.ts
 * @description 创建部门 DTO
 */

import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 创建部门参数
 */
export class CreateDepartmentDto {
  @ApiPropertyOptional({
    description: '上级部门 ID，0 表示顶级部门',
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  parentId?: number = 0;

  @ApiProperty({ description: '部门名称' })
  @IsString()
  @IsNotEmpty({ message: '部门名称不能为空' })
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: '部门编码' })
  @IsString()
  @IsNotEmpty({ message: '部门编码不能为空' })
  @MaxLength(100)
  code: string;

  @ApiPropertyOptional({ description: '排序值', default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sort?: number = 0;

  @ApiPropertyOptional({ description: '负责人' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  leader?: string;

  @ApiPropertyOptional({ description: '联系电话' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: '状态', default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean = true;

  @ApiPropertyOptional({ description: '备注' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  remark?: string;
}
