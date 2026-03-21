import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WinstonLoggerService } from '../services/logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const { method, url, ip } = request;
    const startTime = Date.now();

    // 获取用户信息
    const user = request.user as { sub?: string; username?: string } | undefined;
    const userId = user?.sub || '-';
    const username = user?.username || '-';

    const sanitizedBody = this.sanitizeBody(request.body);
    const sanitizedQuery = this.sanitizeQuery(request.query);

    this.logger.http('Incoming Request', {
      method,
      url,
      ip,
      userId,
      username,
      query: sanitizedQuery,
      body: sanitizedBody,
    });

    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.logger.http('Outgoing Response', {
            method,
            url,
            userId,
            username,
            statusCode,
            duration: `${duration}ms`,
          });
        },
        error: (error: Error & { status?: number }) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;

          this.logger.error('Request Failed', error.stack, {
            method,
            url,
            userId,
            username,
            statusCode,
            duration: `${duration}ms`,
          });
        },
      }),
    );
  }

  private sanitizeBody(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensitiveFields = ['password', 'token', 'accessToken', 'refreshToken', 'secret'];
    const sanitized = { ...body };

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    }

    return sanitized;
  }

  private sanitizeQuery(query: any): any {
    if (!query || typeof query !== 'object') {
      return query;
    }

    const sanitized = { ...query };
    const sensitiveFields = ['token', 'secret', 'key'];

    for (const field of sensitiveFields) {
      if (sanitized[field]) {
        sanitized[field] = '***';
      }
    }

    return sanitized;
  }
}
