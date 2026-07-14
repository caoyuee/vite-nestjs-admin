/**
 * 创建用户的数据传输对象（DTO）
 *
 * 【什么是 DTO？】
 * DTO = Data Transfer Object（数据传输对象）
 * 它类似于前端的 TypeScript 接口定义，但功能更强大：
 * 1. 定义数据结构（像 TypeScript 的 interface）
 * 2. 自动验证数据（像前端的表单验证库，如 vee-validate、yup 等）
 * 3. 自动生成 API 文档（Swagger）
 *
 * 【类比前端】
 * - DTO 类 ≈ Vue 组件的 props 定义 + 表单验证规则
 * - @IsString() ≈ type: String
 * - @IsNotEmpty() ≈ required: true
 * - @IsOptional() ≈ 没有设置 required
 */

// 从 class-validator 导入验证装饰器
// 这个库提供了各种验证装饰器，类似于前端的 yup、joi 等验证库
import {
  IsString, // 验证字段必须是字符串
  IsNotEmpty, // 验证字段不能为空（不能是 null、undefined、空字符串）
  IsOptional, // 标记字段为可选的
  IsBoolean, // 验证字段必须是布尔值
  IsArray, // 验证字段必须是数组
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

// 从 @nestjs/swagger 导入 API 文档装饰器
// Swagger 会根据这些装饰器自动生成 API 文档
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 创建用户的 DTO 类
 *
 * 当前端发送 POST 请求创建用户时，请求体的数据会被映射到这个类
 * NestJS 会自动：
 * 1. 验证数据是否符合装饰器的规则
 * 2. 如果验证失败，自动返回 400 错误
 * 3. 如果验证成功，将数据传递给 Controller
 */
export class CreateUserDto {
  /**
   * 用户名字段
   *
   * @ApiProperty - Swagger 文档装饰器，用于描述这个字段
   *   - 在 API 文档中会显示这个字段的描述
   *   - 前端开发者可以通过 Swagger 文档了解这个接口需要什么参数
   *
   * @IsString() - 验证必须是字符串类型
   * @IsNotEmpty() - 验证不能为空
   *   - message 参数：自定义错误提示信息
   */
  @ApiProperty({ description: '用户名' })
  @IsString()
  @IsNotEmpty({ message: '用户名不能为空' })
  username: string;

  /**
   * 密码字段
   *
   * 注意：密码在传输后会被 Service 层使用 bcrypt 加密
   * 数据库中存储的是加密后的密码，不是明文密码
   */
  @ApiProperty({ description: '密码' })
  @IsString()
  @IsNotEmpty({ message: '密码不能为空' })
  password: string;

  /**
   * 姓名字段
   *
   * 这是用户的真实姓名，与用户名（登录账号）不同
   */
  @ApiProperty({ description: '姓名' })
  @IsString()
  @IsNotEmpty({ message: '姓名不能为空' })
  name: string;

  /**
   * 所属部门 ID
   *
   * 新增用户必须绑定到一个有效部门，便于后续按组织结构管理用户。
   */
  @ApiProperty({ description: '所属部门ID' })
  @Type(() => Number)
  @IsInt({ message: '所属部门ID必须是整数' })
  @Min(1, { message: '请选择所属部门' })
  departmentId: number;

  /**
   * 邮箱字段（可选）
   *
   * @ApiPropertyOptional - 表示这个字段在 API 文档中是可选的
   * @IsOptional() - 标记这个字段可以不传，不会触发必填验证
   */
  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  /**
   * 电话字段（可选）
   */
  @ApiPropertyOptional({ description: '电话' })
  @IsOptional()
  @IsString()
  phone?: string;

  /**
   * 头像字段（可选）
   *
   * 存储头像图片的 URL 地址
   * 用户上传头像后，会返回一个 URL，这个字段存储的就是那个 URL
   */
  @ApiPropertyOptional({ description: '头像' })
  @IsOptional()
  @IsString()
  avatar?: string;

  /**
   * 状态字段（可选）
   *
   * @IsBoolean() - 验证必须是布尔值（true/false）
   * true: 用户启用，可以正常登录
   * false: 用户禁用，无法登录
   */
  @ApiPropertyOptional({ description: '状态', default: true })
  @IsOptional()
  @IsBoolean()
  status?: boolean;

  /**
   * 角色ID列表（可选）
   *
   * @IsArray() - 验证必须是数组类型
   * 用户可以拥有多个角色，所以用数组存储
   *
   * 【类比前端】
   * 类似于 Vue 中的多选框，用户可以选择多个角色
   */
  @ApiPropertyOptional({ description: '角色ID列表', type: [String] })
  @IsOptional()
  @IsArray()
  roles?: string[];
}
