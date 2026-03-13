import type { AppError as IAppError, ValidationError as IValidationError, UnauthorizedError as IUnauthorizedError, NotFoundError as INotFoundError } from "../types/common.d.ts";

/**
 * 基础应用错误类
 */
export class AppError extends Error implements IAppError {
  constructor(
    public message: string,
    public code: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * 验证错误
 */
export class ValidationError extends AppError implements IValidationError {
  public override name: 'ValidationError' = 'ValidationError';
  constructor(message: string, details?: any) {
    super(message, 400, details);
  }
}

/**
 * 未授权错误
 */
export class UnauthorizedError extends AppError implements IUnauthorizedError {
  public override name: 'UnauthorizedError' = 'UnauthorizedError';
  constructor(message: string = '未授权') {
    super(message, 401);
  }
}

/**
 * 未找到错误
 */
export class NotFoundError extends AppError implements INotFoundError {
  public override name: 'NotFoundError' = 'NotFoundError';
  constructor(message: string = '未找到') {
    super(message, 404);
  }
}

/**
 * 禁止访问错误
 */
export class ForbiddenError extends AppError {
  constructor(message: string = '禁止访问') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * 业务逻辑错误
 */
export class BusinessError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, details);
    this.name = 'BusinessError';
  }
}