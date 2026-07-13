/**
 * @file response.interface.ts
 * @description 公共响应接口定义文件
 *
 * 接口概念说明：
 * - TypeScript 接口用于定义数据结构类型
 * - 类似于前端项目中 types 或 interfaces 目录下的文件
 * - 确保前后端数据格式一致
 *
 * 类比前端：
 * - 类似于 Vue 项目中 src/types/ 下的类型定义
 * - 类似于 API 响应的类型定义
 * - 前端可以复用这些接口定义，保证类型安全
 */

/**
 * 统一 API 响应格式接口
 *
 * @interface ApiResponse
 * @template T - data 字段的数据类型
 *
 * @description
 * 所有 API 响应都遵循这个格式，方便前端统一处理
 *
 * @example
 * // 成功响应
 * {
 *   code: 200,
 *   message: 'success',
 *   data: { id: 1, name: '张三' }
 * }
 *
 * @example
 * // 错误响应
 * {
 *   code: 400,
 *   message: '参数错误',
 *   data: null
 * }
 */
export interface ApiResponse<T = unknown> {
  /** HTTP 状态码，200 表示成功，其他表示错误 */
  code: number;

  /** 响应消息，成功时为 'success'，错误时为错误信息 */
  message: string;

  /** 响应数据，成功时包含实际数据，错误时为 null */
  data: T | null;
}

/**
 * 分页查询参数接口
 *
 * @interface PaginationParams
 * @description
 * 用于列表查询时的分页参数
 *
 * @example
 * // 查询第 2 页，每页 20 条
 * const params: PaginationParams = {
 *   pageNum: 2,
 *   pageSize: 20
 * };
 */
export interface PaginationParams {
  /** 当前页码，从 1 开始 */
  pageNum?: number;

  /** 每页数量 */
  pageSize?: number;
}

/**
 * 分页结果接口
 *
 * @interface PaginationResult
 * @template T - 列表项的数据类型
 *
 * @description
 * 分页查询返回的数据格式
 *
 * @example
 * // 用户列表分页结果
 * const result: PaginationResult<User> = {
 *   list: [{ id: 1, name: '张三' }, { id: 2, name: '李四' }],
 *   total: 100
 * };
 */
export interface PaginationResult<T> {
  /** 当前页的数据列表 */
  list: T[];

  /** 总记录数，用于前端计算总页数 */
  total: number;
}

/**
 * JWT 载荷接口
 *
 * @interface JwtPayload
 * @description
 * JWT token 解码后的数据结构
 *
 * JWT token 结构说明：
 * - JWT token 分为三部分：header.payload.signature
 * - payload 部分包含用户信息，由服务器签名
 * - 前端解码后可以得到这些信息
 *
 * @example
 * // JWT token 解码后的 payload
 * {
 *   sub: '1',           // 用户 ID
 *   username: 'admin',  // 用户名
 *   roles: ['admin'],   // 角色列表
 *   iat: 1704067200,    // 签发时间（时间戳）
 *   exp: 1704672000     // 过期时间（时间戳）
 * }
 */
export interface JwtPayload {
  /** 用户 ID（subject，JWT 标准字段） */
  sub: string;

  /** 用户名 */
  username: string;

  /** 用户角色 ID 列表 */
  roles: string[] | number[];

  /** 签发时间（Issued At），Unix 时间戳 */
  iat?: number;

  /** 过期时间（Expiration），Unix 时间戳 */
  exp?: number;
}

/**
 * JWT 载荷类型别名
 *
 * @description
 * 类型别名，方便在其他地方使用
 * 使用 JwtPayloadType 或 JwtPayload 效果相同
 */
export type JwtPayloadType = JwtPayload;
