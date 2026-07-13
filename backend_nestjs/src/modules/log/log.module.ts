/**
 * 日志模块定义
 *
 * 【业务说明】
 * 日志模块用于系统日志的查询和清理
 * 日志文件存储在 logs 目录下，按日期分文件夹
 *
 * 【日志文件结构】
 * logs/
 * ├── 2024-01-01/
 * │   ├── app.log.2024-01-01      # 应用日志
 * │   ├── http.log.2024-01-01     # HTTP 请求日志
 * │   └── error.log.2024-01-01    # 错误日志
 * └── 2024-01-02/
 *     └── ...
 *
 * 【类比前端】
 * 类似于前端的日志管理页面：
 * - 查看系统运行日志
 * - 按时间、级别筛选日志
 * - 清理过期日志
 */

import { Module } from '@nestjs/common';
import { LogController, SystemLogController } from './log.controller';
import { LogService } from './log.service';

/**
 * 日志模块类
 *
 * 注意：日志模块不需要数据库，直接读取文件系统中的日志文件
 */
@Module({
  controllers: [LogController, SystemLogController],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
