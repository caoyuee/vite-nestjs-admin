import { Controller, Get, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LogService } from './log.service';
import { LogQueryDto } from './dto/log-query.dto';
import { ClearLogDto } from './dto/clear-log.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';

@ApiTags('日志')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('logs')
  @ApiOperation({ summary: '获取系统日志' })
  async getLogs(@Query() query: LogQueryDto) {
    const result = await this.logService.getLogs(query);
    return {
      code: 200,
      message: '获取成功',
      data: result,
    };
  }

  @Delete('logs')
  @ApiOperation({ summary: '清空日志' })
  async clearLogs(
    @Query() query: ClearLogDto,
    @CurrentUser() _user: JwtPayload,
  ) {
    const result = await this.logService.clearLogs(query);
    return {
      code: 200,
      message: `成功清理 ${result.deletedCount} 个日志文件`,
      data: result,
    };
  }
}
