/**
 * 创建字典的数据传输对象（DTO）
 *
 * 【业务场景】
 * 当管理员创建新的字典项时，需要提供以下信息：
 * - 字典名称：字典项的标识名称
 * - 字典类型：用于分组，同一类型的字典项属于同一组
 * - 显示标签：显示给用户看的文字
 * - 实际值：存储到数据库的值
 * - 标签类型：用于前端显示不同样式的标签
 * - 排序：控制显示顺序
 */

import { IsString, IsNotEmpty, IsOptional, IsInt } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 创建字典的 DTO 类
 *
 * 当前端发送 POST 请求创建字典时，请求体的数据会被映射到这个类
 */
export class CreateDictionaryDto {
  /**
   * 字典项名称
   *
   * 字典项的标识名称
   * 例如：'启用', '禁用'
   */
  @ApiProperty({ description: '字典项名称' })
  @IsString()
  @IsNotEmpty({ message: '字典项名称不能为空' })
  name: string;

  /**
   * 字典类型
   *
   * 用于分组，同一类型的字典项属于同一组
   * 例如：'user_status', 'gender', 'order_status'
   *
   * 前端根据这个字段获取对应的字典列表
   */
  @ApiProperty({ description: '字典类型' })
  @IsString()
  @IsNotEmpty({ message: '字典类型不能为空' })
  dictType: string;

  /**
   * 显示标签
   *
   * 显示给用户看的文字
   * 例如：'启用', '禁用', '男', '女'
   */
  @ApiProperty({ description: '显示标签' })
  @IsString()
  @IsNotEmpty({ message: '显示标签不能为空' })
  label: string;

  /**
   * 实际值
   *
   * 存储到数据库的值
   * 例如：'1', '0', 'male', 'female'
   */
  @ApiProperty({ description: '实际值' })
  @IsString()
  @IsNotEmpty({ message: '实际值不能为空' })
  value: string;

  /**
   * 标签类型
   *
   * 用于前端显示不同样式的标签
   * 例如：'success', 'danger', 'warning', 'info'
   *
   * 对应 Element Plus 的 Tag 组件 type 属性
   */
  @ApiProperty({ description: '标签类型' })
  @IsString()
  @IsNotEmpty({ message: '标签类型不能为空' })
  tag: string;

  /**
   * 排序序号（可选）
   *
   * 用于控制字典项在下拉框中的显示顺序
   * 数值越小越靠前
   */
  @ApiPropertyOptional({ description: '排序序号', default: 0 })
  @IsOptional()
  @IsInt()
  sort?: number;
}
