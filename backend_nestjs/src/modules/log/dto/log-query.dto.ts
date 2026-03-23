/**
 * 日志查询参数的数据传输对象（DTO）
 *
 * 【业务场景】
 * 用于日志列表页面的查询和筛选
 */

import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 日志查询参数的 DTO 类
 */
export class LogQueryDto {
  /**
   * 页码
   */
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number = 1;

  /**
   * 每页数量
   */
  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  /**
   * 日志级别筛选
   *
   * 可选值：
   * - error: 错误日志
   * - warn: 警告日志
   * - info: 信息日志
   * - http: HTTP 请求日志
   */
  @ApiPropertyOptional({ description: '日志级别' })
  @IsOptional()
  @IsString()
  level?: string;

  /**
   * 关键字搜索
   *
   * 在日志内容中搜索关键字
   */
  @ApiPropertyOptional({ description: '关键字搜索' })
  @IsOptional()
  @IsString()
  keyword?: string;

  /**
   * 开始时间
   *
   * 格式：yyyy-MM-dd
   * 查询此日期之后的日志
   */
  @ApiPropertyOptional({ description: '开始时间 (yyyy-MM-dd)' })
  @IsOptional()
  @IsString()
  startTime?: string;

  /**
   * 结束时间
   *
   * 格式：yyyy-MM-dd
   * 查询此日期之前的日志
   */
  @ApiPropertyOptional({ description: '结束时间 (yyyy-MM-dd)' })
  @IsOptional()
  @IsString()
  endTime?: string;
}
