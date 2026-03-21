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
  timestamp: string;   // 时间戳
  level: string;       // 日志级别：info、error、warn、http 等
  message: string;     // 日志消息
  method?: string;     // HTTP 请求方法（仅 HTTP 日志）
  url?: string;        // HTTP 请求路径（仅 HTTP 日志）
  status?: number;     // HTTP 响应状态码（仅 HTTP 日志）
  duration?: string;   // 请求处理时间（仅 HTTP 日志）
  ip?: string;         // 客户端 IP
  user?: {
    username: string;
    id: string;
  };
  error?: string;      // 错误信息（仅错误日志）
}

/**
 * 日志查询结果接口
 */
export interface LogQueryResult {
  list: LogEntry[];      // 日志列表
  total: number;         // 总数
  pageNumber: number;    // 当前页码
  pageSize: number;      // 每页数量
  totalPages: number;    // 总页数
}

/**
 * 清理日志结果接口
 */
export interface ClearLogsResult {
  deletedFiles: string[];   // 已删除的文件列表
  deletedCount: number;     // 已删除的文件数量
  retainedFiles: string[];  // 保留的文件列表
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
   * 1. 确定要搜索的日期范围
   * 2. 读取日期范围内的所有日志文件
   * 3. 解析日志内容为 LogEntry 对象
   * 4. 按条件筛选日志
   * 5. 排序并分页返回
   */
  async getLogs(options: LogQueryDto): Promise<LogQueryResult> {
    const {
      pageNumber = 1,
      pageSize = 10,
      level,       // 日志级别筛选
      keyword,     // 关键字筛选
      startTime,   // 开始时间
      endTime,     // 结束时间
    } = options;

    // 存储所有读取到的日志
    const allLogs: LogEntry[] = [];

    /**
     * 解析日期字符串为 Date 对象
     * @param dateStr - 格式：yyyy-MM-dd
     */
    const parseDate = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number);
      // 注意：JavaScript 的月份从 0 开始，所以要减 1
      return new Date(year, month - 1, day);
    };

    // 确定要搜索的日期范围
    let daysToSearch: number;
    let startDate: Date;
    let endDate: Date;

    // 根据传入的时间参数确定搜索范围
    if (startTime && endTime) {
      // 有开始和结束时间
      startDate = parseDate(startTime);
      endDate = parseDate(endTime);
      endDate.setHours(23, 59, 59, 999);
      daysToSearch =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
        ) + 1;
    } else if (startTime) {
      // 只有开始时间，搜索到当前
      startDate = parseDate(startTime);
      endDate = new Date();
      daysToSearch =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
        ) + 1;
    } else if (endTime) {
      // 只有结束时间，搜索前 7 天
      endDate = parseDate(endTime);
      endDate.setHours(23, 59, 59, 999);
      startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);
      daysToSearch = 7;
    } else {
      // 默认搜索最近 7 天
      startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
      endDate = new Date();
      daysToSearch = 7;
    }

    // 遍历日期范围内的每一天
    for (let i = 0; i < daysToSearch; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      // 跳过不在范围内的日期
      if (date < startDate || date > endDate) continue;

      // 构建日志文件路径
      const dateLogDir = path.join(this.logRootDir, dateStr);
      const appLogFile = path.join(dateLogDir, `app.log.${dateStr}`);
      const httpLogFile = path.join(dateLogDir, `http.log.${dateStr}`);
      const errorLogFile = path.join(dateLogDir, `error.log.${dateStr}`);

      /**
       * 读取单个日志文件
       * @param filename - 文件路径
       * @param defaultLevel - 默认日志级别
       */
      const readLogFile = (filename: string, defaultLevel?: string) => {
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
                // 尝试解析为 JSON
                const log = JSON.parse(line);
                allLogs.push({
                  timestamp: log.timestamp || log.time || dateStr,
                  level: log.level || defaultLevel || 'info',
                  message: log.message || '',
                  method: log.method,
                  url: log.url,
                  status: log.status,
                  duration: log.duration,
                  ip: log.ip,
                  user: log.user,
                  error: log.error,
                });
              } catch {
                // JSON 解析失败，尝试正则匹配
                const match = line.match(
                  /^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+\[(\w+)\]:\s*(.*)$/,
                );
                if (match) {
                  allLogs.push({
                    timestamp: match[1],
                    level: match[2].toLowerCase(),
                    message: match[3],
                  });
                }
              }
            });
          }
        } catch (err) {
          console.error(`读取日志文件失败: ${filename}`, err);
        }
      };

      // 读取三种类型的日志文件
      readLogFile(appLogFile);
      readLogFile(httpLogFile, 'http');
      readLogFile(errorLogFile, 'error');
    }

    // 筛选日志
    let filteredLogs = allLogs;

    // 按日志级别筛选
    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level);
    }

    // 按关键字筛选
    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredLogs = filteredLogs.filter((log) => {
        const logStr = JSON.stringify(log).toLowerCase();
        return logStr.includes(lowerKeyword);
      });
    }

    // 按时间倒序排序（最新的在前）
    filteredLogs.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
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
   * 1. 确定要清理的日期范围
   * 2. 遍历日期目录
   * 3. 根据条件筛选要删除的文件
   * 4. 删除文件和空目录
   */
  async clearLogs(options?: ClearLogDto): Promise<ClearLogsResult> {
    const { startTime, endTime, level, keyword } = options || {};

    const deletedFiles: string[] = [];
    const retainedFiles: string[] = [];

    // 解析日期字符串
    const parseDate = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    // 要处理的日期目录列表
    const targetDateDirs: string[] = [];

    // 根据时间范围确定要处理的目录
    if (startTime || endTime) {
      let startDate: Date;
      let endDate: Date;

      if (startTime && endTime) {
        startDate = parseDate(startTime);
        endDate = parseDate(endTime);
        endDate.setHours(23, 59, 59, 999);
      } else if (startTime) {
        startDate = parseDate(startTime);
        endDate = new Date();
      } else {
        startDate = new Date(0); // 从最早开始
        endDate = parseDate(endTime!);
        endDate.setHours(23, 59, 59, 999);
      }

      try {
        // 读取日志根目录下的所有目录
        const dateDirs = fs.readdirSync(this.logRootDir);
        for (const dateDir of dateDirs) {
          const dateLogDir = path.join(this.logRootDir, dateDir);
          const stat = fs.statSync(dateLogDir);

          // 只处理目录
          if (!stat.isDirectory()) continue;

          // 检查目录名是否符合日期格式
          const match = dateDir.match(/^(\d{4}-\d{2}-\d{2})$/);
          if (!match) continue;

          const [, dateStr] = match;
          const fileDate = parseDate(dateStr);

          // 检查是否在时间范围内
          if (fileDate >= startDate && fileDate <= endDate) {
            targetDateDirs.push(dateDir);
          }
        }
      } catch (err) {
        console.error('[日志清理] 读取日志目录失败:', err);
      }
    } else {
      // 没有时间范围，处理所有目录
      try {
        const dateDirs = fs.readdirSync(this.logRootDir);
        for (const dateDir of dateDirs) {
          const dateLogDir = path.join(this.logRootDir, dateDir);
          const stat = fs.statSync(dateLogDir);
          if (stat.isDirectory()) {
            targetDateDirs.push(dateDir);
          }
        }
      } catch (err) {
        console.error('[日志清理] 读取日志目录失败:', err);
      }
    }

    // 遍历并删除文件
    for (const dateDir of targetDateDirs) {
      const dateLogDir = path.join(this.logRootDir, dateDir);

      try {
        const logFiles = fs.readdirSync(dateLogDir);
        const filesToDelete: string[] = [];

        for (const file of logFiles) {
          // 只处理 .log 文件
          if (!file.includes('.log')) continue;

          // 从文件名提取日志级别
          const fileBaseName = file.replace(/\.\d{4}-\d{2}-\d{2}$/, '');
          const fileLevel = fileBaseName.replace('.log', '');

          // 按级别筛选
          if (level && fileLevel !== level) continue;

          // 按关键字筛选
          if (keyword) {
            const filePath = path.join(dateLogDir, file);
            try {
              const content = fs.readFileSync(filePath, 'utf-8');
              const lines = content.split('\n').filter((line) => line.trim());

              // 检查文件是否包含关键字
              const hasKeyword = lines.some((line) => {
                try {
                  const log = JSON.parse(line);
                  const logStr = JSON.stringify(log).toLowerCase();
                  return logStr.includes(keyword.toLowerCase());
                } catch {
                  return line.toLowerCase().includes(keyword.toLowerCase());
                }
              });

              if (hasKeyword) {
                filesToDelete.push(file);
              }
            } catch (err) {
              console.error(`[日志清理] 读取日志文件失败: ${file}`, err);
            }
          } else {
            // 没有关键字筛选，直接删除
            filesToDelete.push(file);
          }
        }

        // 删除文件
        for (const file of filesToDelete) {
          const filePath = path.join(dateLogDir, file);
          try {
            fs.unlinkSync(filePath);
            deletedFiles.push(`${dateDir}/${file}`);
            console.log(`[日志清理] 已删除: ${dateDir}/${file}`);
          } catch (err) {
            console.error(`[日志清理] 删除文件失败: ${dateDir}/${file}`, err);
          }
        }

        // 检查目录是否为空，如果为空则删除目录
        const remainingFiles = fs.readdirSync(dateLogDir);
        const logFilesLeft = remainingFiles.filter((f) => f.includes('.log'));
        if (logFilesLeft.length === 0) {
          fs.rmSync(dateLogDir, { recursive: true, force: true });
          console.log(`[日志清理] 已删除空目录: ${dateDir}`);
        }

        retainedFiles.push(`${dateDir}/*`);
      } catch (err) {
        console.error(`[日志清理] 处理目录失败: ${dateDir}`, err);
      }
    }

    console.log(`[日志清理] 完成 - 已删除 ${deletedFiles.length} 个文件`);

    return {
      deletedFiles,
      deletedCount: deletedFiles.length,
      retainedFiles,
    };
  }
}
