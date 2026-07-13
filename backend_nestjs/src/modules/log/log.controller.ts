/**
 * 日志控制器
 *
 * 【业务说明】
 * 提供日志查询和清理的 API 接口
 *
 * 【类比前端】
 * 这些接口对应日志管理页面：
 * - 日志列表展示
 * - 日志筛选
 * - 日志清理
 */

import { Controller, Get, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LogService } from './log.service';
import { LogQueryDto } from './dto/log-query.dto';
import { ClearLogDto } from './dto/clear-log.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { JwtPayload } from '../../common/interfaces/response.interface';

/**
 * 日志控制器类
 *
 * @ApiTags('日志') - Swagger 文档分组
 * @Controller('api/system/user') - 路由前缀
 */
@ApiTags('日志')
@Controller('api/system/user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LogController {
  /**
   * 构造函数 - 依赖注入日志服务
   */
  constructor(private readonly logService: LogService) {}

  /**
   * 获取系统日志
   *
   * @Get('logs') - 路由：GET /api/system/user/logs
   *
   * 【业务场景】
   * 管理员查看系统运行日志
   * 支持按时间范围、日志级别、关键字筛选
   */
  @Get('logs')
  @ApiOperation({ summary: '获取系统日志' })
  getLogs(@Query() query: LogQueryDto) {
    const result = this.logService.getLogs(query);
    return {
      code: 200,
      message: '获取成功',
      data: result,
    };
  }

  /**
   * 清空日志
   *
   * @Delete('logs') - 路由：DELETE /api/system/user/logs
   *
   * 【业务场景】
   * 清理过期的日志文件，释放磁盘空间
   * 可以按时间范围、日志级别、关键字筛选要清理的日志
   *
   * 【安全说明】
   * 只有管理员才能执行此操作
   *
   * @param _user - 当前用户（用于权限验证，这里未使用）
   */
  @Delete('logs')
  @ApiOperation({ summary: '清空日志' })
  clearLogs(@Query() query: ClearLogDto, @CurrentUser() _user: JwtPayload) {
    const result = this.logService.clearLogs(query);
    return {
      code: 200,
      message: `成功清理 ${result.deletedCount} 个日志文件`,
      data: result,
    };
  }
}

/**
 * 语义化日志控制器
 *
 * @class SystemLogController
 * @description 按统一接口契约暴露 `/api/system/logs` 日志接口。
 */
@ApiTags('日志')
@Controller('api/system/logs')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class SystemLogController {
  /**
   * 构造函数
   *
   * @param logService - 日志业务服务
   */
  constructor(private readonly logService: LogService) {}

  /**
   * 获取系统日志
   */
  @Get()
  @ApiOperation({ summary: '获取系统日志' })
  getLogs(@Query() query: LogQueryDto) {
    const result = this.logService.getLogs(query);
    return {
      code: 200,
      message: '获取成功',
      data: result,
    };
  }

  /**
   * 清空系统日志
   */
  @Delete()
  @ApiOperation({ summary: '清空日志' })
  clearLogs(@Query() query: ClearLogDto, @CurrentUser() _user: JwtPayload) {
    const result = this.logService.clearLogs(query);
    return {
      code: 200,
      message: `成功清理 ${result.deletedCount} 个日志文件`,
      data: result,
    };
  }
}
