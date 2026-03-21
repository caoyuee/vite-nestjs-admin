# HTTP 日志拦截器实现计划

## 目标

添加一个全局 HTTP 日志拦截器，记录所有 HTTP 请求和响应信息，包括：
- 请求方法（GET、POST、PUT、DELETE 等）
- 请求 URL
- 请求参数（Query、Body）
- 响应状态码
- 响应时间
- 客户端 IP

## 实现步骤

### 步骤 1：创建 HTTP 日志拦截器

**文件路径：** `nestjs_backend/src/common/interceptors/http-logging.interceptor.ts`

**功能：**
- 实现 `NestInterceptor` 接口
- 在请求开始时记录请求信息
- 在请求结束时记录响应信息和耗时
- 使用 `WinstonLoggerService` 记录日志

**关键实现：**
```typescript
@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: WinstonLoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    
    const { method, url, ip } = request;
    const startTime = Date.now();
    
    // 记录请求信息
    this.logger.http(`Incoming Request`, {
      method,
      url,
      ip,
      query: request.query,
      body: request.body,
    });
    
    return next.handle().pipe(
      tap({
        next: () => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;
          
          this.logger.http(`Outgoing Response`, {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
          });
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          const statusCode = error.status || 500;
          
          this.logger.error(`Request Failed`, error.stack, {
            method,
            url,
            statusCode,
            duration: `${duration}ms`,
          });
        },
      }),
    );
  }
}
```

### 步骤 2：在 AppModule 中注册拦截器

**文件路径：** `nestjs_backend/src/app.module.ts`

**修改内容：**
- 导入 `HttpLoggingInterceptor`
- 在 `providers` 中添加全局拦截器注册

```typescript
import { HttpLoggingInterceptor } from './common/interceptors/http-logging.interceptor';

providers: [
  // ... 其他 providers
  {
    provide: APP_INTERCEPTOR,
    useClass: HttpLoggingInterceptor,
  },
],
```

### 步骤 3：更新 LogEntry 接口

**文件路径：** `nestjs_backend/src/modules/log/log.service.ts`

**修改内容：**
- 确保 `LogEntry` 接口包含 HTTP 日志所需的字段

### 步骤 4：验证日志输出

**验证内容：**
- 启动应用
- 发送测试请求
- 检查 `combined.log` 文件是否记录了 HTTP 日志
- 检查日志格式是否正确

## 日志格式示例

**请求日志：**
```json
{
  "timestamp": "2026-03-21 18:00:00",
  "level": "http",
  "message": "Incoming Request",
  "method": "GET",
  "url": "/api/users",
  "ip": "127.0.0.1",
  "query": { "page": "1" }
}
```

**响应日志：**
```json
{
  "timestamp": "2026-03-21 18:00:00",
  "level": "http",
  "message": "Outgoing Response",
  "method": "GET",
  "url": "/api/users",
  "statusCode": 200,
  "duration": "45ms"
}
```

## 注意事项

1. **敏感信息过滤**：不记录密码、token 等敏感信息
2. **性能考虑**：日志记录应该是异步的，不影响请求处理
3. **日志级别**：HTTP 请求使用 `http` 级别，错误使用 `error` 级别
4. **拦截器顺序**：HTTP 日志拦截器应该在响应拦截器之前注册

## 文件清单

| 文件 | 操作 |
|------|------|
| `src/common/interceptors/http-logging.interceptor.ts` | 新建 |
| `src/app.module.ts` | 修改 |
| `src/modules/log/log.service.ts` | 检查/修改 |
