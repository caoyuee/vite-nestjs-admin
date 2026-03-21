/**
 * @file http-exception.filter.ts
 * @description 全局异常过滤器 - 统一处理所有异常并返回标准格式响应
 *
 * 过滤器概念说明：
 * - 过滤器（Filter）用于捕获和处理异常
 * - 类似于 Vue 的全局错误处理 errorHandler
 * - 所有未捕获的异常都会经过这里处理
 *
 * 类比前端：
 * - 类似于 Vue 的 errorCaptured 钩子
 * - 类似于 Axios 的响应拦截器中的错误处理
 * - 统一错误格式，方便前端处理
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

/**
 * 全局异常过滤器
 *
 * @class HttpExceptionFilter
 * @implements {ExceptionFilter}
 *
 * @description
 * 捕获所有类型的异常，统一返回标准格式的错误响应
 *
 * 处理流程：
 * 1. 捕获异常（@Catch() 装饰器表示捕获所有异常）
 * 2. 判断异常类型，提取错误信息
 * 3. 构造统一的错误响应格式
 * 4. 记录错误日志
 * 5. 返回错误响应
 */
@Catch() // @Catch() 不传参数表示捕获所有类型的异常
export class HttpExceptionFilter implements ExceptionFilter {
  /**
   * 异常处理方法
   *
   * @param {unknown} exception - 捕获的异常对象
   * @param {ArgumentsHost} host - 执行上下文，包含请求和响应对象
   */
  catch(exception: unknown, host: ArgumentsHost) {
    // 获取 HTTP 上下文
    const ctx = host.switchToHttp();

    // 获取 Express 的 Response 对象
    // 类似于 Koa 的 ctx.response
    const response = ctx.getResponse<Response>();

    // 初始化状态码和消息
    // 默认 500 服务器内部错误
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    // 处理 HTTP 异常（如 BadRequestException, NotFoundException 等）
    if (exception instanceof HttpException) {
      // 获取 HTTP 状态码（如 400, 404, 500 等）
      statusCode = exception.getStatus();

      // 获取异常响应内容
      const exceptionResponse = exception.getResponse();

      // 根据响应内容类型提取错误消息
      if (typeof exceptionResponse === 'string') {
        // 如果响应是字符串，直接使用
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        // 如果响应是对象，尝试提取 message 字段
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || exception.message;
      }
    } else if (exception instanceof Error) {
      // 处理普通 JavaScript 错误
      message = exception.message;
    }

    // 在控制台打印错误日志
    // 生产环境应该使用专业的日志服务（如 Winston）
    console.error('Error occurred:', {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      error: exception instanceof Error ? exception.stack : exception,
    });

    // 构造统一的错误响应格式
    // 这个格式与 ResponseInterceptor 的成功响应格式一致
    const errorResponse: ApiResponse<null> = {
      code: statusCode, // HTTP 状态码
      message, // 错误消息
      data: null, // 错误响应没有数据
    };

    // 发送错误响应
    // response.status() 设置 HTTP 状态码
    // .json() 发送 JSON 格式的响应体
    response.status(statusCode).json(errorResponse);
  }
}
