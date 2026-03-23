/**
 * 清理日志的数据传输对象（DTO）
 *
 * 【业务场景】
 * 管理员清理日志时，可以指定清理条件
 * 不传任何参数则清理所有日志
 */

import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 清理日志的 DTO 类
 */
export class ClearLogDto {
  /**
   * 开始时间
   *
   * 格式：yyyy-MM-dd
   * 清理此日期之后的日志
   */
  @ApiPropertyOptional({ description: '开始时间 (yyyy-MM-dd)' })
  @IsOptional()
  @IsString()
  startTime?: string;

  /**
   * 结束时间
   *
   * 格式：yyyy-MM-dd
   * 清理此日期之前的日志
   */
  @ApiPropertyOptional({ description: '结束时间 (yyyy-MM-dd)' })
  @IsOptional()
  @IsString()
  endTime?: string;

  /**
   * 日志级别
   *
   * 只清理指定级别的日志
   * 可选值：error、warn、info、http
   */
  @ApiPropertyOptional({ description: '日志级别' })
  @IsOptional()
  @IsString()
  level?: string;

  /**
   * 关键字
   *
   * 只清理包含指定关键字的日志文件
   */
  @ApiPropertyOptional({ description: '关键字' })
  @IsOptional()
  @IsString()
  keyword?: string;
}
