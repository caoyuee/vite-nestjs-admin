/**
 * 用户列表查询参数的数据传输对象（DTO）
 *
 * 【业务场景】
 * 当前端请求用户列表时，可以通过这个 DTO 传递查询参数：
 * - 分页参数：pageNum（页码）、pageSize（每页数量）
 * - 筛选条件：username、name、email、phone、status
 *
 * 【类比前端】
 * 类似于列表页面的搜索表单：
 * - 分页器组件传递 pageNum 和 pageSize
 * - 搜索框传递 username、name 等筛选条件
 * - 状态筛选下拉框传递 status
 *
 * 【GET 请求的参数处理】
 * GET 请求的参数是 URL 查询字符串，如：/users?pageNum=1&pageSize=10&username=admin
 * 这些参数默认都是字符串类型，需要转换为对应的数据类型
 */

import { IsOptional, IsString, IsBoolean, IsInt, Min } from 'class-validator';
// Type 装饰器用于类型转换
// GET 请求的查询参数都是字符串，需要转换为 Number、Boolean 等类型
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

/**
 * 用户列表查询参数的 DTO 类
 *
 * 所有字段都是可选的，因为：
 * - 不传分页参数时使用默认值
 * - 不传筛选条件时查询全部数据
 */
export class UserListQueryDto {
  /**
   * 页码（可选）
   *
   * @Type(() => Number) - 将字符串转换为数字
   *   - URL 参数都是字符串，如 "1"、"2"
   *   - 这个装饰器会将其转换为数字 1、2
   *
   * @IsInt() - 验证必须是整数
   * @Min(1) - 验证最小值为 1（页码从 1 开始）
   *
   * 【分页计算公式】
   * skip = (pageNum - 1) * pageSize
   * 例如：第 2 页，每页 10 条
   * skip = (2 - 1) * 10 = 10，跳过前 10 条
   */
  @ApiPropertyOptional({ description: '页码', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNum?: number = 1;

  /**
   * 每页数量（可选）
   *
   * 控制每页显示多少条数据
   * 通常前端会提供选项：10、20、50、100
   */
  @ApiPropertyOptional({ description: '每页数量', default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize?: number = 10;

  /**
   * 用户名筛选（可选）
   *
   * 模糊搜索用户名
   * Service 层会使用 LIKE 查询
   */
  @ApiPropertyOptional({ description: '用户名' })
  @IsOptional()
  @IsString()
  username?: string;

  /**
   * 姓名筛选（可选）
   *
   * 模糊搜索姓名
   */
  @ApiPropertyOptional({ description: '姓名' })
  @IsOptional()
  @IsString()
  name?: string;

  /**
   * 邮箱筛选（可选）
   */
  @ApiPropertyOptional({ description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  /**
   * 电话筛选（可选）
   */
  @ApiPropertyOptional({ description: '电话' })
  @IsOptional()
  @IsString()
  phone?: string;

  /**
   * 状态筛选（可选）
   *
   * @Type(() => Boolean) - 将字符串转换为布尔值
   *   - URL 参数 "true" 会被转换为 true
   *   - URL 参数 "false" 会被转换为 false
   *
   * 用于筛选启用/禁用的用户
   */
  @ApiPropertyOptional({ description: '状态' })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  status?: boolean;
}
