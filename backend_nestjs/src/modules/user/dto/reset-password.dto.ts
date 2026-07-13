/**
 * 重置密码的数据传输对象（DTO）
 *
 * 【业务场景】
 * 用户修改自己的密码时使用
 * 需要提供旧密码进行验证，防止他人恶意修改密码
 *
 * 【类比前端】
 * 类似于网站上的"修改密码"表单：
 * 1. 输入当前密码（验证身份）
 * 2. 输入新密码
 * 3. 确认新密码（前端处理，不需要传给后端）
 */

import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * 重置密码的 DTO 类
 *
 * 这个 DTO 非常简单，只需要两个字段：
 * - 旧密码：用于验证用户身份
 * - 新密码：用户想要设置的新密码
 */
export class ResetPasswordDto {
  /**
   * 旧密码（当前密码）
   *
   * 用于验证用户身份
   * Service 层会将这个密码与数据库中的加密密码进行比对
   *
   * 【安全说明】
   * 为什么要验证旧密码？
   * - 防止他人获取登录状态后修改密码
   * - 确保是用户本人在操作
   */
  @ApiProperty({ description: '旧密码' })
  @IsString()
  @IsNotEmpty({ message: '旧密码不能为空' })
  oldPassword: string;

  /**
   * 新密码
   *
   * 用户想要设置的新密码
   * Service 层会：
   * 1. 使用 bcrypt 对新密码进行加密
   * 2. 将加密后的密码存入数据库
   *
   * 【前端建议】
   * 前端应该添加一个"确认新密码"字段
   * 在前端验证两次输入的密码是否一致
   * 一致后才发送请求给后端
   */
  @ApiProperty({ description: '新密码' })
  @IsString()
  @IsNotEmpty({ message: '新密码不能为空' })
  newPassword: string;
}
