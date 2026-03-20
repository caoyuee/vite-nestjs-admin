import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = '服务器内部错误';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (typeof exceptionResponse === 'object') {
        const responseObj = exceptionResponse as Record<string, any>;
        message = responseObj.message || exception.message;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    console.error('Error occurred:', {
      statusCode,
      message,
      timestamp: new Date().toISOString(),
      error: exception instanceof Error ? exception.stack : exception,
    });

    const errorResponse: ApiResponse<null> = {
      code: statusCode,
      message,
      data: null,
    };

    response.status(statusCode).json(errorResponse);
  }
}
