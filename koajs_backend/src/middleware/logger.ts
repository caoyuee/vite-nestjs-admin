// logger.ts - Winston日志中间件
import type { Context, Next } from "koa";
import { createLogger, transports, format } from "winston";
import "winston-daily-rotate-file";
import path from "path";

// 创建日志根目录
const logRootDir = path.join(process.cwd(), "logs");

/**
 * 获取指定日期的日志目录
 * @param dateStr 日期字符串（yyyy-MM-dd格式）
 * @returns 日志目录路径
 */
export const getLogDir = (dateStr?: string): string => {
  if (!dateStr) {
    // 获取今天的日期
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    dateStr = `${year}-${month}-${day}`;
  }
  return path.join(logRootDir, dateStr);
};

// 创建自定义格式 - 更易于查询和阅读
const customFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, ...meta }) => {
    // 如果有额外 metadata，添加到消息中
    let metaStr = "";
    if (Object.keys(meta).length > 0 && meta.stack) {
      metaStr = ` | ${JSON.stringify(meta.stack)}`;
    }
    return `${timestamp} [${level.toUpperCase()}]: ${message}${metaStr}`;
  })
);

// JSON 格式用于查询
const jsonFormat = format.combine(
  format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  format.errors({ stack: true }),
  format.json()
);

/**
 * 自定义文件名函数 - 按日期分目录存放
 * @param timestamp 当前时间戳
 * @returns 包含目录的日志文件路径
 */
const getFileName = (timestamp: Date): string => {
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const day = String(timestamp.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  // 返回包含目录的文件名: 2026-03-13/app.log
  return path.join(logRootDir, dateStr, 'app.log');
};

/**
 * 获取错误日志文件名
 */
const getErrorFileName = (timestamp: Date): string => {
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const day = String(timestamp.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  return path.join(logRootDir, dateStr, 'error.log');
};

/**
 * 获取HTTP日志文件名
 */
const getHttpFileName = (timestamp: Date): string => {
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const day = String(timestamp.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  return path.join(logRootDir, dateStr, 'http.log');
};

/**
 * 获取异常日志文件名
 */
const getExceptionFileName = (timestamp: Date): string => {
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const day = String(timestamp.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  return path.join(logRootDir, dateStr, 'exception.log');
};

/**
 * 获取拒绝日志文件名
 */
const getRejectionFileName = (timestamp: Date): string => {
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const day = String(timestamp.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  return path.join(logRootDir, dateStr, 'rejection.log');
};

// 创建 logger 实例
export const logger = createLogger({
  // 日志级别
  level: "info",
  // 格式化
  format: jsonFormat,
  transports: [
    // 错误日志 - 按日期分目录
    new transports.DailyRotateFile({
      level: "error",
      filename: getErrorFileName(new Date()),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      zippedArchive: true, // 压缩已归档的日志
      json: true,
      format: jsonFormat,
    }),
    // HTTP 请求日志 - 按日期分目录
    new transports.DailyRotateFile({
      level: "http",
      filename: getHttpFileName(new Date()),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      zippedArchive: true,
      json: true,
      format: jsonFormat,
    }),
    // 所有日志 - 按日期分目录
    new transports.DailyRotateFile({
      filename: getFileName(new Date()),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      zippedArchive: true,
      json: true,
      format: jsonFormat,
    }),
  ],
  exceptionHandlers: [
    new transports.DailyRotateFile({
      filename: getExceptionFileName(new Date()),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      zippedArchive: true,
      json: true,
      format: jsonFormat,
    }),
  ],
  rejectionHandlers: [
    new transports.DailyRotateFile({
      filename: getRejectionFileName(new Date()),
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "30d",
      zippedArchive: true,
      json: true,
      format: jsonFormat,
    }),
  ],
});

// 开发环境同时输出到控制台
if (process.env.NODE_ENV === "development") {
  logger.add(
    new transports.Console({
      format: customFormat,
    })
  );
}

/**
 * 日志中间件 - 记录 HTTP 请求
 */
const registerLogger = async (ctx: Context, next: Next) => {
  const start = Date.now();

  try {
    await next();

    const duration = Date.now() - start;
    const userInfo = ctx.state.user
      ? { username: (ctx.state.user as any).username, id: (ctx.state.user as any).sub }
      : { username: "anonymous", id: "-1" };

    // 记录 HTTP 日志
    logger.http("request", {
      method: ctx.method,
      url: ctx.url,
      status: ctx.status,
      duration: `${duration}ms`,
      ip: ctx.ip,
      userAgent: ctx.get("user-agent"),
      user: userInfo,
      responseData: ctx.body,
    });
  } catch (err: unknown) {
    const duration = Date.now() - start;
    const userInfo = ctx.state.user
      ? { username: (ctx.state.user as any).username, id: (ctx.state.user as any).sub }
      : { username: "anonymous", id: "-1" };

    // 记录错误日志
    logger.error("request error", {
      method: ctx.method,
      url: ctx.url,
      duration: `${duration}ms`,
      ip: ctx.ip,
      userAgent: ctx.get("user-agent"),
      user: userInfo,
      error: err instanceof Error ? err.stack : String(err),
    });

    throw err;
  }
};

/**
 * 日志查询参数接口
 */
export interface LogQueryOptions {
  time?: Date;        // 查询时间基准（用于计算查询范围）
  pageNumber?: number; // 页码（从1开始）
  pageSize?: number;   // 每页数量
  level?: string;      // 日志级别
  keyword?: string;    // 关键字搜索
  startTime?: string;  // 开始时间（yyyy-MM-dd格式）
  endTime?: string;    // 结束时间（yyyy-MM-dd格式）
}

/**
 * 日志条目接口
 */
export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  method?: string;
  url?: string;
  status?: number;
  duration?: string;
  ip?: string;
  user?: {
    username: string;
    id: string;
  };
  error?: string;
}

/**
 * 日志查询响应接口
 */
export interface LogQueryResult {
  list: LogEntry[];
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 获取日志列表
 * 直接读取日志文件，支持分页和筛选
 * @param options 查询参数
 * @returns 日志列表和分页信息
 */
export const getLogs = async (options: LogQueryOptions): Promise<LogQueryResult> => {
  const {
    time = new Date(),
    pageNumber = 1,
    pageSize = 10,
    level,
    keyword,
    startTime,
    endTime,
  } = options;

  // 动态导入 fs 模块
  const fs = await import('fs');
  const pathModule = await import('path');

  const allLogs: LogEntry[] = [];

  // 确定要查询的日期范围
  let daysToSearch: number;
  let startDate: Date;
  let endDate: Date;

  // 解析日期字符串（处理时区问题）
  const parseDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  if (startTime && endTime) {
    // 如果指定了时间范围，则按时间范围查询
    startDate = parseDate(startTime);
    endDate = parseDate(endTime);
    endDate.setHours(23, 59, 59, 999); // 设置为当天的最后一秒
    // 计算查询天数
    daysToSearch = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  } else if (startTime) {
    // 只有开始时间，查询从开始时间到今天的日志
    startDate = new Date(startTime);
    endDate = new Date();
    daysToSearch = Math.ceil((endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)) + 1;
  } else if (endTime) {
    // 只有结束时间，查询从7天前到结束时间的日志
    endDate = new Date(endTime);
    endDate.setHours(23, 59, 59, 999);
    startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000); // 默认查询7天
    daysToSearch = 7;
  } else {
    // 默认查询最近7天
    startDate = new Date(time.getTime() - 6 * 24 * 60 * 60 * 1000);
    endDate = new Date();
    daysToSearch = 7;
  }

  // 遍历指定日期范围的日志文件
  for (let i = 0; i < daysToSearch; i++) {
    const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
    // 使用本地日期格式 (yyyy-MM-dd)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`; // 格式: 2026-03-13

    // 跳过超出范围的日期
    if (date < startDate || date > endDate) continue;

    // 读取各类型日志文件（新目录结构：logs/2026-03-13/app.log.2026-03-13）
    const dateLogDir = pathModule.join(logRootDir, dateStr);
    const appLogFile = pathModule.join(dateLogDir, `app.log.${dateStr}`);
    const httpLogFile = pathModule.join(dateLogDir, `http.log.${dateStr}`);
    const errorLogFile = pathModule.join(dateLogDir, `error.log.${dateStr}`);

    // 读取并解析日志文件
    const readLogFile = (filename: string, defaultLevel?: string) => {
      try {
        if (fs.existsSync(filename)) {
          const content = fs.readFileSync(filename, 'utf-8');
          const lines = content.split('\n').filter(line => line.trim());

          lines.forEach(line => {
            try {
              // 尝试解析 JSON 格式
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
              // 如果不是 JSON 格式，尝试解析自定义格式
              // 格式: 2026-03-13 10:27:15 [INFO]: message
              const match = line.match(/^(\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})\s+\[(\w+)\]:\s*(.*)$/);
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

    // 读取各类型日志文件
    readLogFile(appLogFile);
    readLogFile(httpLogFile, 'http');
    readLogFile(errorLogFile, 'error');
  }

  // 过滤日志
  let filteredLogs = allLogs;

  // 按级别过滤
  if (level) {
    filteredLogs = filteredLogs.filter(log => log.level === level);
  }

  // 按关键字搜索
  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filteredLogs = filteredLogs.filter(log => {
      const logStr = JSON.stringify(log).toLowerCase();
      return logStr.includes(lowerKeyword);
    });
  }

  // 按时间倒序排列
  filteredLogs.sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // 总数
  const total = filteredLogs.length;

  // 分页处理
  const startIndex = (pageNumber - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const list = filteredLogs.slice(startIndex, endIndex);

  return {
    list,
    total,
    pageNumber,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
};

/**
 * 获取日志文件列表（按日期）
 * 新目录结构：logs/2026-03-13/app.log
 */
export const getLogFiles = (): string[] => {
  const fs = require("fs");
  const pathModule = require("path");
  const files: string[] = [];

  try {
    // 读取日志根目录下的所有日期文件夹
    const dateDirs = fs.readdirSync(logRootDir);
    dateDirs.forEach((dateDir: string) => {
      const dateLogDir = pathModule.join(logRootDir, dateDir);
      // 检查是否为目录
      const stat = fs.statSync(dateLogDir);
      if (stat.isDirectory()) {
        const logFiles = fs.readdirSync(dateLogDir);
        logFiles.forEach((file: string) => {
          if (file.includes('.log')) {
            files.push(`${dateDir}/${file}`);
          }
        });
      }
    });
  } catch (error) {
    console.error("读取日志目录失败:", error);
  }

  return files.sort().reverse();
};

/**
 * 清理日志结果接口
 */
export interface ClearLogsResult {
  deletedFiles: string[];  // 已删除的文件列表
  deletedCount: number;     // 删除的文件数量
  retainedFiles: string[]; // 保留的文件列表
}

/**
 * 清理日志参数接口
 */
export interface ClearLogsOptions {
  startTime?: string;  // 开始时间（yyyy-MM-dd格式）
  endTime?: string;    // 结束时间（yyyy-MM-dd格式）
  level?: string;      // 日志级别（info, http, error等）
  keyword?: string;    // 关键字搜索
}

/**
 * 清理日志文件
 * @param options 清理选项
 * @param options.startTime 开始时间（yyyy-MM-dd格式），不传则清除所有
 * @param options.endTime 结束时间（yyyy-MM-dd格式），不传则清除所有
 * @param options.level 日志级别，不传则清除所有级别
 * @param options.keyword 关键字，不传则不限制
 * @returns 清理结果
 *
 * 清除规则：
 * - 不传任何参数：清除所有日志
 * - 只传日期范围：清除指定日期范围内的所有日志文件
 * - 传日期+级别：清除指定日期范围内指定级别的日志
 * - 传关键字：清除包含关键字的日志（需配合日期范围）
 */
export const clearLogs = async (options?: ClearLogsOptions): Promise<ClearLogsResult> => {
  const fs = await import('fs');
  const pathModule = await import('path');

  const { startTime, endTime, level, keyword } = options || {};

  const deletedFiles: string[] = [];
  const retainedFiles: string[] = [];

  // 解析日期字符串
  const parseDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  // 确定要清除的日期范围
  let targetDateDirs: string[] = [];

  if (startTime || endTime) {
    // 有日期范围，按日期范围清除
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

    // 遍历日志目录，找出在日期范围内的目录
    try {
      const dateDirs = fs.readdirSync(logRootDir);
      for (const dateDir of dateDirs) {
        const dateLogDir = pathModule.join(logRootDir, dateDir);
        const stat = fs.statSync(dateLogDir);

        if (!stat.isDirectory()) continue;

        const match = dateDir.match(/^(\d{4}-\d{2}-\d{2})$/);
        if (!match) continue;

        const [, dateStr] = match;
        const fileDate = parseDate(dateStr);

        if (fileDate >= startDate && fileDate <= endDate) {
          targetDateDirs.push(dateDir);
        }
      }
    } catch (err) {
      console.error("[日志清理] 读取日志目录失败:", err);
    }
  } else {
    // 无日期范围，清除所有日志
    try {
      const dateDirs = fs.readdirSync(logRootDir);
      for (const dateDir of dateDirs) {
        const dateLogDir = pathModule.join(logRootDir, dateDir);
        const stat = fs.statSync(dateLogDir);
        if (stat.isDirectory()) {
          targetDateDirs.push(dateDir);
        }
      }
    } catch (err) {
      console.error("[日志清理] 读取日志目录失败:", err);
    }
  }

  // 处理每个目标日期目录
  for (const dateDir of targetDateDirs) {
    const dateLogDir = pathModule.join(logRootDir, dateDir);

    try {
      // 获取目录下的所有日志文件
      const logFiles = fs.readdirSync(dateLogDir);

      // 根据级别和关键字筛选要删除的文件
      const filesToDelete: string[] = [];

      for (const file of logFiles) {
        // 检查是否为日志文件（以.log开头或包含.log.）
        if (!file.includes('.log')) continue;

        // 检查文件是否匹配级别
        const fileBaseName = file.replace(/\.\d{4}-\d{2}-\d{2}$/, ''); // 去掉日期后缀
        const fileLevel = fileBaseName.replace('.log', ''); // app, http, error, exception, rejection

        // 如果指定了级别，只处理匹配的文件
        if (level && fileLevel !== level) continue;

        // 如果有关键字，需要读取文件内容检查
        if (keyword) {
          const filePath = pathModule.join(dateLogDir, file);
          try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const lines = content.split('\n').filter(line => line.trim());

            // 检查是否有包含关键字的日志
            const hasKeyword = lines.some(line => {
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
          // 没有关键字，删除整个文件
          filesToDelete.push(file);
        }
      }

      // 删除匹配的文件
      for (const file of filesToDelete) {
        const filePath = pathModule.join(dateLogDir, file);
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
      const logFilesLeft = remainingFiles.filter(f => f.includes('.log'));
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
};

export default registerLogger;
