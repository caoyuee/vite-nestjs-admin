/**
 * 字典列表查询参数的数据传输对象（DTO）
 *
 * 【业务场景】
 * 当前端请求字典列表时，可以通过这个 DTO 传递查询参数：
 * - 分页参数：pageNum（页码）、pageSize（每页数量）
 * - 筛选条件：dictType（字典类型）、name（字典名称）
 */

import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 字典列表查询参数的 DTO 类
 *
 * 所有字段都是可选的，因为：
 * - 不传分页参数时使用默认值
 * - 不传筛选条件时查询全部数据
 */
export class DictionaryListQueryDto {
  /**
   * 页码（可选）
   *
   * @Type(() => Number) - 将字符串转换为数字
   * URL 参数都是字符串，需要转换为数字类型
   */
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNum?: number = 1;

  /**
   * 每页数量（可选）
   *
   * 控制每页显示多少条数据
   */
  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  /**
   * 字典类型筛选（可选）
   *
   * 用于按字典类型筛选
   * 例如：'user_status', 'gender'
   */
  @ApiPropertyOptional({ description: '字典类型' })
  @IsOptional()
  @IsString()
  dictType?: string;

  /**
   * 字典名称筛选（可选）
   *
   * 用于模糊搜索字典名称
   */
  @ApiPropertyOptional({ description: '字典名称' })
  @IsOptional()
  @IsString()
  name?: string;
}
