/**
 * @file login.dto.ts
 * @description 登录请求参数 DTO（数据传输对象）
 *
 * DTO 概念说明：
 * - DTO（Data Transfer Object）用于定义 API 请求/响应的数据结构
 * - 类似于前端 TypeScript 的 interface，但带有验证功能
 * - 用于验证请求数据是否符合要求
 *
 * 类比前端：
 * - 类似于表单验证规则
 * - 类似于 TypeScript 的类型定义
 * - 类似于 Element Plus Form 的 rules
 *
 * class-validator 装饰器：
 * - @IsString(): 验证是否为字符串
 * - @IsNotEmpty(): 验证是否非空
 * - @IsEmail(): 验证是否为邮箱格式
 * - @MinLength(): 验证最小长度
 */

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 登录请求 DTO
 *
 * @class LoginDto
 *
 * @description
 * 定义登录接口的请求参数结构
 * 包含用户名和密码两个字段
 *
 * @example
 * // 请求体示例
 * {
 *   "username": "admin",
 *   "password": "123456"
 * }
 */
export class LoginDto {
  /**
   * 用户名
   *
   * @ApiProperty() 用于 Swagger 文档生成
   * @IsString() 验证必须是字符串类型
   * @IsNotEmpty() 验证不能为空
   */
  @ApiProperty({ description: '用户名', example: 'admin' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  /**
   * 密码
   *
   * 密码在传输时是明文，存储时会用 bcrypt 加密
   */
  @ApiProperty({ description: '密码', example: '123456' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;
}
