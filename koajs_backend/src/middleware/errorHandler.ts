import type { Context, Next } from "koa";
import Response from "../config/responseManage.conf.ts";
import { AppError, ValidationError, UnauthorizedError, NotFoundError, ForbiddenError, BusinessError } from "../utils/AppError.ts";

/**
 * 错误处理中间件
 * 捕获所有未处理的错误，并格式化为统一的响应格式
 */
export const errorHandler = () => {
  return async (ctx: Context, next: Next): Promise<void> => {
    try {
      await next();
    } catch (error) {
      // 设置默认状态码和消息
      let statusCode = 500;
      let message = '服务器内部错误';

      // 如果是我们定义的错误类型
      if (error instanceof AppError) {
        statusCode = error.code;
        message = error.message;
      }
      // 处理Koa的404错误
      else if (error && typeof error === 'object' && 'status' in (error as any) && (error as any).status === 404) {
        statusCode = 404;
        message = '未找到请求的资源';
      }
      // 处理JWT验证错误
      else if (error && typeof error === 'object' && (('name' in (error as any) && (error as any).name === 'UnauthorizedError') || ('status' in (error as any) && (error as any).status === 401))) {
        statusCode = 401;
        message = '未授权，请先登录';
      }
      // 其他错误
      else if (error instanceof Error) {
        message = error.message;
      }

      // 记录错误日志（生产环境应该记录到日志文件）
      if (process.env.NODE_ENV !== 'test') {
        console.error('Error occurred:', {
          statusCode,
          message,
          path: ctx.path,
          method: ctx.method,
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.stack : error
        });
      }

      // 设置响应状态码
      ctx.status = statusCode;

      // 返回统一的错误响应格式
      ctx.body = Response(null, message, statusCode);
    }
  };
};

/**
 * 创建错误处理函数的快捷方式
 */
export const createError = {
  validation: (message: string, details?: any) => new ValidationError(message, details),
  unauthorized: (message?: string) => new UnauthorizedError(message),
  notFound: (message?: string) => new NotFoundError(message),
  forbidden: (message?: string) => new ForbiddenError(message),
  business: (message: string, details?: any) => new BusinessError(message, details),
  internal: (message: string, details?: any) => new AppError(message, 500, details)
};