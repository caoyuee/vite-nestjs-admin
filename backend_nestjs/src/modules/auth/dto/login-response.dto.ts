/**
 * @file login-response.dto.ts
 * @description 登录响应 DTO - 定义登录成功后返回的数据结构
 *
 * 响应 DTO 概念说明：
 * - 响应 DTO 定义 API 返回的数据结构
 * - 用于 Swagger 文档生成
 * - 帮助前端了解接口返回的数据格式
 *
 * 类比前端：
 * - 类似于 API 响应的类型定义
 * - 类似于 TypeScript 的 interface
 */

import { ApiProperty } from '@nestjs/swagger';

/**
 * 登录响应 DTO
 *
 * @class LoginResponseDto
 *
 * @description
 * 定义登录成功后返回的数据结构
 * 只包含一个 token 字段
 *
 * @example
 * // 响应示例
 * {
 *   "code": 200,
 *   "message": "success",
 *   "data": {
 *     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *   }
 * }
 */
export class LoginResponseDto {
  /**
   * JWT 令牌
   *
   * 前端需要将这个 token 存储起来（localStorage 或 cookie）
   * 然后在后续请求的 Authorization header 中携带：
   * Authorization: Bearer <token>
   */
  @ApiProperty({ description: 'JWT令牌' })
  token: string;
}
