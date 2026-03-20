import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class ClearLogDto {
  @ApiPropertyOptional({ description: '开始时间 (yyyy-MM-dd)' })
  @IsOptional()
  @IsString()
  startTime?: string;

  @ApiPropertyOptional({ description: '结束时间 (yyyy-MM-dd)' })
  @IsOptional()
  @IsString()
  endTime?: string;

  @ApiPropertyOptional({ description: '日志级别' })
  @IsOptional()
  @IsString()
  level?: string;

  @ApiPropertyOptional({ description: '关键字' })
  @IsOptional()
  @IsString()
  keyword?: string;
}
