/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/**
 * 日志服务
 *
 * 【业务说明】
 * 日志服务负责读取和清理文件系统中的日志文件
 * 日志文件由 Winston 日志库生成，存储在 logs 目录下
 *
 * 【日志文件格式】
 * 每行是一个 JSON 对象，包含：
 * - timestamp: 时间戳
 * - level: 日志级别
 * - message: 日志消息
 * - 其他上下文信息（method、url、status 等）
 */

import { Injectable } from '@nestjs/common';
// Node.js 文件系统模块
import * as fs from 'fs';
// Node.js 路径模块
import * as path from 'path';
import { LogQueryDto } from './dto/log-query.dto';
import { ClearLogDto } from './dto/clear-log.dto';

/**
 * 日志条目接口
 *
 * 定义单条日志的数据结构
 */
export interface LogEntry {
  timestamp: string; // 时间戳
  level: string; // 日志级别：info、error、warn、http 等
  message: string; // 日志消息
  trace?: string; // 错误堆栈（仅错误日志）
  method?: string; // HTTP 请求方法（仅 HTTP 日志）
  url?: string; // HTTP 请求路径（仅 HTTP 日志）
  status?: number; // HTTP 响应状态码（仅 HTTP 日志）
  duration?: string; // 请求处理时间（仅 HTTP 日志）
  ip?: string; // 客户端 IP
  username: string; // 用户名
  statusCode: number; // HTTP 响应状态码（仅 HTTP 日志）
  userId: string; // 用户ID
  error?: string; // 错误信息（仅错误日志）
  query?: unknown; // 查询参数（仅 HTTP 日志）
}

/**
 * 日志查询结果接口
 */
export interface LogQueryResult {
  list: LogEntry[]; // 日志列表
  total: number; // 总数
  pageNumber: number; // 当前页码
  pageSize: number; // 每页数量
  totalPages: number; // 总页数
}

/**
 * 清理日志结果接口
 */
export interface ClearLogsResult {
  deletedFiles: string[]; // 已删除的文件列表
  deletedCount: number; // 已删除的文件数量
  retainedFiles: string[]; // 保留的文件列表
}

/**
 * 日志服务类
 */
@Injectable()
export class LogService {
  // 日志根目录路径
  // process.cwd() 返回当前工作目录
  private readonly logRootDir = path.join(process.cwd(), 'logs');

  /**
   * 获取日志列表
   *
   * @param options - 查询参数
   * @returns 日志列表和分页信息
   *
   * 【业务流程】
   * 1. 读取 logs/combined.log 和 logs/error.log 文件
   * 2. 解析每行 JSON 格式的日志内容
   * 3. 按时间范围筛选
   * 4. 按日志级别筛选
   * 5. 按关键字筛选
   * 6. 排序并分页返回
   */
  getLogs(options: LogQueryDto): LogQueryResult {
    const {
      pageNumber = 1,
      pageSize = 10,
      level, // 日志级别筛选
      keyword, // 关键字筛选
      startTime, // 开始时间
      endTime, // 结束时间
    } = options;

    // 存储所有读取到的日志
    const allLogs: LogEntry[] = [];

    /**
     * 解析日志时间戳字符串为 Date 对象
     * @param timestamp - 格式：yyyy-MM-dd HH:mm:ss
     */
    const parseTimestamp = (timestamp: string): Date => {
      // 格式：2026-03-21 17:12:56
      const match = timestamp.match(
        /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
      );
      if (match) {
        const [, year, month, day, hour, minute, second] = match.map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
      }
      // 尝试直接解析
      return new Date(timestamp);
    };

    /**
     * 读取单个日志文件
     * @param filename - 文件路径
     */
    const readLogFile = (filename: string) => {
      try {
        // 检查文件是否存在
        if (fs.existsSync(filename)) {
          // 读取文件内容
          const content = fs.readFileSync(filename, 'utf-8');
          // 按行分割，过滤空行
          const lines = content.split('\n').filter((line) => line.trim());

          // 解析每一行日志
          lines.forEach((line) => {
            try {
              // 解析 JSON 格式的日志

              const log = JSON.parse(line);
              allLogs.push({
                timestamp: log.timestamp || '',
                level: log.level || 'info',
                message: log.message || '',
                trace: log.trace,
                method: log.method,
                url: log.url,
                ip: log.ip,
                userId: log.userId || '-',
                username: log.username || '-',
                statusCode: log.status || '-',
                duration: log.duration || '-',
                query: log.query || '-',
              });
            } catch {
              // JSON 解析失败，忽略该行
            }
          });
        }
      } catch (err) {
        console.error(`读取日志文件失败: ${filename}`, err);
      }
    };

    // 读取日志文件
    const combinedLogFile = path.join(this.logRootDir, 'combined.log');
    const errorLogFile = path.join(this.logRootDir, 'error.log');
    readLogFile(combinedLogFile);
    readLogFile(errorLogFile);

    // 筛选日志
    let filteredLogs = allLogs;

    // 按时间范围筛选
    if (startTime || endTime) {
      filteredLogs = filteredLogs.filter((log) => {
        if (!log.timestamp) return false;
        const logDate = parseTimestamp(log.timestamp);

        // 检查开始时间
        if (startTime) {
          const startDate = parseTimestamp(startTime + ' 00:00:00');
          if (logDate < startDate) return false;
        }

        // 检查结束时间
        if (endTime) {
          const endDate = parseTimestamp(endTime + ' 23:59:59');
          if (logDate > endDate) return false;
        }

        return true;
      });
    }

    // 按日志级别筛选
    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level);
    }

    // 按关键字筛选（搜索 message 和 trace 字段）
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredLogs = filteredLogs.filter((log) => {
        const messageMatch = log.message?.toLowerCase().includes(lowerKeyword);
        const traceMatch = log.trace?.toLowerCase().includes(lowerKeyword);
        return messageMatch || traceMatch;
      });
    }

    // 按时间倒序排序（最新的在前）
    filteredLogs.sort((a, b) => {
      const timeA = a.timestamp ? parseTimestamp(a.timestamp).getTime() : 0;
      const timeB = b.timestamp ? parseTimestamp(b.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    // 分页处理
    const total = filteredLogs.length;
    const startIndex = (pageNumber - 1) * pageSize;
    const list = filteredLogs.slice(startIndex, startIndex + pageSize);

    return {
      list,
      total,
      pageNumber,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 清理日志文件
   *
   * @param options - 清理参数
   * @returns 清理结果
   *
   * 【业务流程】
   * 1. 读取 logs/combined.log 和 logs/error.log 文件
   * 2. 解析每行 JSON 格式的日志内容
   * 3. 根据条件筛选要删除的日志（反向筛选保留的日志）
   * 4. 将保留的日志写回文件
   * 5. 如果文件为空则删除文件
   */
  clearLogs(options?: ClearLogDto): ClearLogsResult {
    const { startTime, endTime, level, keyword } = options || {};

    let deletedCount = 0;
    const deletedFiles: string[] = [];
    const retainedFiles: string[] = [];

    /**
     * 解析日志时间戳字符串为 Date 对象
     * @param timestamp - 格式：yyyy-MM-dd HH:mm:ss
     */
    const parseTimestamp = (timestamp: string): Date => {
      const match = timestamp.match(
        /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})$/,
      );
      if (match) {
        const [, year, month, day, hour, minute, second] = match.map(Number);
        return new Date(year, month - 1, day, hour, minute, second);
      }
      return new Date(timestamp);
    };

    /**
     * 判断日志是否匹配删除条件
     * @param log - 日志条目
     * @returns 是否应该被删除
     */
    const shouldDelete = (log: LogEntry): boolean => {
      // 按时间范围筛选
      if (startTime || endTime) {
        if (!log.timestamp) return false;
        const logDate = parseTimestamp(log.timestamp);

        // 检查开始时间
        if (startTime) {
          const startDate = parseTimestamp(startTime + ' 00:00:00');
          if (logDate < startDate) return false;
        }

        // 检查结束时间
        if (endTime) {
          const endDate = parseTimestamp(endTime + ' 23:59:59');
          if (logDate > endDate) return false;
        }
      }

      // 按日志级别筛选
      if (level && log.level !== level) {
        return false;
      }

      // 按关键字筛选（搜索 message 和 trace 字段）
      if (keyword) {
        const lowerKeyword = keyword.toLowerCase();
        const messageMatch = log.message?.toLowerCase().includes(lowerKeyword);
        const traceMatch = log.trace?.toLowerCase().includes(lowerKeyword);
        if (!messageMatch && !traceMatch) {
          return false;
        }
      }

      return true;
    };

    /**
     * 处理单个日志文件
     * @param filename - 文件名
     */
    const processLogFile = (filename: string) => {
      const filePath = path.join(this.logRootDir, filename);

      // 检查文件是否存在
      if (!fs.existsSync(filePath)) {
        return;
      }

      try {
        // 读取文件内容
        const content = fs.readFileSync(filePath, 'utf-8');
        // 按行分割，过滤空行
        const lines = content.split('\n').filter((line) => line.trim());

        // 如果文件为空，跳过
        if (lines.length === 0) {
          return;
        }

        // 解析并筛选日志
        const retainedLines: string[] = [];
        let fileDeletedCount = 0;

        for (const line of lines) {
          try {
            const log: LogEntry = JSON.parse(line);

            // 判断是否应该删除
            if (shouldDelete(log)) {
              fileDeletedCount++;
            } else {
              // 保留该日志
              retainedLines.push(line);
            }
          } catch {
            // JSON 解析失败的行，保留原样
            retainedLines.push(line);
          }
        }

        // 更新删除计数
        deletedCount += fileDeletedCount;

        // 如果有日志被删除
        if (fileDeletedCount > 0) {
          if (retainedLines.length === 0) {
            // 所有日志都被删除，删除文件
            fs.unlinkSync(filePath);
            deletedFiles.push(filename);
            console.log(`[日志清理] 已删除文件: ${filename}`);
          } else {
            // 将保留的日志写回文件
            const newContent = retainedLines.join('\n') + '\n';
            fs.writeFileSync(filePath, newContent, 'utf-8');
            deletedFiles.push(filename);
            console.log(
              `[日志清理] 已清理文件: ${filename}，删除 ${fileDeletedCount} 条日志`,
            );
          }
        } else {
          // 没有日志被删除，文件保留
          retainedFiles.push(filename);
        }
      } catch (err) {
        console.error(`[日志清理] 处理日志文件失败: ${filename}`, err);
      }
    };

    // 处理日志文件
    processLogFile('combined.log');
    processLogFile('error.log');

    console.log(
      `[日志清理] 完成 - 共删除 ${deletedCount} 条日志，涉及 ${deletedFiles.length} 个文件`,
    );

    return {
      deletedCount,
      deletedFiles,
      retainedFiles,
    };
  }
}
