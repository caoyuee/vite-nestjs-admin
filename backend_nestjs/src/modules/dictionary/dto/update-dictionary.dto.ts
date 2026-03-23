/**
 * 更新字典的数据传输对象（DTO）
 *
 * 【业务场景】
 * 当管理员更新字典项时，需要提供字典 ID 和需要更新的字段
 * 所有字段都是可选的，只更新提供的字段
 */

import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 更新字典的 DTO 类
 *
 * 当前端发送 PUT 请求更新字典时，请求体的数据会被映射到这个类
 * id 字段必填，其他字段可选
 */
export class UpdateDictionaryDto {
  /**
   * 字典 ID（必填）
   *
   * 用于指定要更新的字典项
   */
  @ApiProperty({ description: '字典ID' })
  @IsInt()
  @IsNotEmpty({ message: '字典ID不能为空' })
  id: number;

  /**
   * 字典项名称（可选）
   */
  @ApiPropertyOptional({ description: '字典项名称' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 字典类型（可选）
   */
  @ApiPropertyOptional({ description: '字典类型' })
  @IsOptional()
  @IsString()
  dictType?: string;

  /**
   * 显示标签（可选）
   */
  @ApiPropertyOptional({ description: '显示标签' })
  @IsOptional()
  @IsString()
  label?: string;

  /**
   * 实际值（可选）
   */
  @ApiPropertyOptional({ description: '实际值' })
  @IsOptional()
  @IsString()
  value?: string;

  /**
   * 标签类型（可选）
   */
  @ApiPropertyOptional({ description: '标签类型' })
  @IsOptional()
  @IsString()
  tag?: string;

  /**
   * 排序序号（可选）
   */
  @ApiPropertyOptional({ description: '排序序号' })
  @IsOptional()
  @IsInt()
  sort?: number;
}
