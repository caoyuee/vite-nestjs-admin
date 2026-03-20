import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LogQueryDto } from './dto/log-query.dto';
import { ClearLogDto } from './dto/clear-log.dto';

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

export interface LogQueryResult {
  list: LogEntry[];
  total: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface ClearLogsResult {
  deletedFiles: string[];
  deletedCount: number;
  retainedFiles: string[];
}

@Injectable()
export class LogService {
  private readonly logRootDir = path.join(process.cwd(), 'logs');

  async getLogs(options: LogQueryDto): Promise<LogQueryResult> {
    const {
      pageNumber = 1,
      pageSize = 10,
      level,
      keyword,
      startTime,
      endTime,
    } = options;

    const allLogs: LogEntry[] = [];

    const parseDate = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    let daysToSearch: number;
    let startDate: Date;
    let endDate: Date;

    if (startTime && endTime) {
      startDate = parseDate(startTime);
      endDate = parseDate(endTime);
      endDate.setHours(23, 59, 59, 999);
      daysToSearch =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
        ) + 1;
    } else if (startTime) {
      startDate = parseDate(startTime);
      endDate = new Date();
      daysToSearch =
        Math.ceil(
          (endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000),
        ) + 1;
    } else if (endTime) {
      endDate = parseDate(endTime);
      endDate.setHours(23, 59, 59, 999);
      startDate = new Date(endDate.getTime() - 6 * 24 * 60 * 60 * 1000);
      daysToSearch = 7;
    } else {
      startDate = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000);
      endDate = new Date();
      daysToSearch = 7;
    }

    for (let i = 0; i < daysToSearch; i++) {
      const date = new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      if (date < startDate || date > endDate) continue;

      const dateLogDir = path.join(this.logRootDir, dateStr);
      const appLogFile = path.join(dateLogDir, `app.log.${dateStr}`);
      const httpLogFile = path.join(dateLogDir, `http.log.${dateStr}`);
      const errorLogFile = path.join(dateLogDir, `error.log.${dateStr}`);

      const readLogFile = (filename: string, defaultLevel?: string) => {
        try {
          if (fs.existsSync(filename)) {
            const content = fs.readFileSync(filename, 'utf-8');
            const lines = content.split('\n').filter((line) => line.trim());

            lines.forEach((line) => {
              try {
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

      readLogFile(appLogFile);
      readLogFile(httpLogFile, 'http');
      readLogFile(errorLogFile, 'error');
    }

    let filteredLogs = allLogs;

    if (level) {
      filteredLogs = filteredLogs.filter((log) => log.level === level);
    }

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      filteredLogs = filteredLogs.filter((log) => {
        const logStr = JSON.stringify(log).toLowerCase();
        return logStr.includes(lowerKeyword);
      });
    }

    filteredLogs.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

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

  async clearLogs(options?: ClearLogDto): Promise<ClearLogsResult> {
    const { startTime, endTime, level, keyword } = options || {};

    const deletedFiles: string[] = [];
    const retainedFiles: string[] = [];

    const parseDate = (dateStr: string): Date => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day);
    };

    const targetDateDirs: string[] = [];

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
        startDate = new Date(0);
        endDate = parseDate(endTime!);
        endDate.setHours(23, 59, 59, 999);
      }

      try {
        const dateDirs = fs.readdirSync(this.logRootDir);
        for (const dateDir of dateDirs) {
          const dateLogDir = path.join(this.logRootDir, dateDir);
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
        console.error('[日志清理] 读取日志目录失败:', err);
      }
    } else {
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

    for (const dateDir of targetDateDirs) {
      const dateLogDir = path.join(this.logRootDir, dateDir);

      try {
        const logFiles = fs.readdirSync(dateLogDir);
        const filesToDelete: string[] = [];

        for (const file of logFiles) {
          if (!file.includes('.log')) continue;

          const fileBaseName = file.replace(/\.\d{4}-\d{2}-\d{2}$/, '');
          const fileLevel = fileBaseName.replace('.log', '');

          if (level && fileLevel !== level) continue;

          if (keyword) {
            const filePath = path.join(dateLogDir, file);
            try {
              const content = fs.readFileSync(filePath, 'utf-8');
              const lines = content.split('\n').filter((line) => line.trim());

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
            filesToDelete.push(file);
          }
        }

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
