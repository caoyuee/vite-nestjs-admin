/**
 * 通用响应类型
 */
export interface ApiResponse<T = any> {
  /** 状态码 */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据 */
  data: T | null;
}

/**
 * 分页查询参数基础接口
 */
export interface PaginationParams {
  /** 页码，从1开始 */
  pageNum?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 其他查询参数 */
  [key: string]: unknown;
}

/**
 * 分页响应数据
 */
export interface PaginationResult<T> {
  /** 数据列表 */
  list: T[];
  /** 总记录数 */
  total: number;
}

/**
 * 日志查询参数
 */
export interface LogQueryParams {
  /** 每页日志数量 */
  pageSize?: number;
  /** 页码 */
  pageNumber?: number;
  /** 查询时间基准 */
  time?: Date;
}

/**
 * 重置密码请求参数
 */
export interface ResetPasswordRequest {
  /** 旧密码 */
  oldPassword: string;
  /** 新密码 */
  newPassword: string;
}

/**
 * 登录响应数据
 */
export interface LoginResponse {
  /** JWT令牌 */
  token: string;
}

/**
 * 错误类型接口
 */
export interface AppError extends Error {
  /** 错误消息 */
  message: string;
  /** 错误状态码 */
  code: number;
  /** 错误详情 */
  details?: any;
  /** 错误名称 */
  name: string;
}

/**
 * 验证错误接口
 */
export interface ValidationError extends AppError {
  name: 'ValidationError';
}

/**
 * 未授权错误接口
 */
export interface UnauthorizedError extends AppError {
  name: 'UnauthorizedError';
}

/**
 * 未找到错误接口
 */
export interface NotFoundError extends AppError {
  name: 'NotFoundError';
}