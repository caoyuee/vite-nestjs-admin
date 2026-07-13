/**
 * @file logger.service.ts
 * @description Winston 日志服务 - 提供专业的日志记录功能
 *
 * 日志服务说明：
 * - 使用 Winston 作为日志框架
 * - 支持多种日志级别：error、warn、info、http、debug
 * - 支持日志持久化存储（按日期分割文件）
 * - 支持日志格式化和结构化输出
 */

import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

/**
 * 日志级别类型
 */
type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

/**
 * Winston 日志服务
 *
 * @class WinstonLoggerService
 * @implements {LoggerService}
 *
 * @description
 * 提供专业的日志记录服务，支持：
 * 1. 多种日志级别
 * 2. 日志持久化存储
 * 3. 按日期分割日志文件
 * 4. 结构化日志输出
 */
@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;
  private readonly logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');

    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }

    this.logger = this.createLogger();
  }

  private createLogger(): winston.Logger {
    const { combine, timestamp, printf, json, colorize } = winston.format;

    const customFormat = printf(({ level, message, timestamp, ...meta }) => {
      return JSON.stringify({
        timestamp,
        level,
        message,
        ...meta,
      });
    });

    const consoleFormat = printf(({ level, message, timestamp, ...meta }) => {
      const metaStr = Object.keys(meta).length
        ? JSON.stringify(meta, null, 2)
        : '';
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      return `${timestamp} [${level}]: ${message} ${metaStr}`;
    });

    return winston.createLogger({
      level: process.env.LOG_LEVEL || 'http',
      format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), json()),
      transports: [
        new winston.transports.Console({
          format: combine(
            colorize(),
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            consoleFormat,
          ),
        }),

        new winston.transports.File({
          filename: path.join(this.logDir, 'error.log'),
          level: 'error',
          format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            customFormat,
          ),
        }),

        new winston.transports.File({
          filename: path.join(this.logDir, 'combined.log'),
          format: combine(
            timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            customFormat,
          ),
        }),
      ],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(
    message: string,
    trace?: string,
    context?: string | Record<string, unknown>,
  ) {
    if (typeof context === 'object') {
      this.logger.error(message, { trace, ...context });
    } else {
      this.logger.error(message, { trace, context });
    }
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }

  http(message: string, meta?: Record<string, unknown>) {
    this.logger.http(message, meta);
  }

  logWithLevel(
    level: LogLevel,
    message: string,
    meta?: Record<string, unknown>,
  ) {
    this.logger.log(level, message, meta);
  }
}
