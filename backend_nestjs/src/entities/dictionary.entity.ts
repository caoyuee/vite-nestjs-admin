/**
 * @file dictionary.entity.ts
 * @description 数据字典实体 - 对应数据库中的 dictionary 表
 *
 * 数据字典概念说明：
 * - 数据字典用于存储系统中的枚举值和配置项
 * - 例如：用户状态、订单状态、性别等
 * - 前端通过字典类型获取对应的选项列表
 *
 * 类比前端：
 * - 类似于前端的枚举定义
 * - 类似于下拉框的选项数据源
 * - 类似于 Element Plus Select 组件的 options
 *
 * 使用场景：
 * - 下拉框选项
 * - 状态显示
 * - 表格列筛选
 */

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

/**
 * 数据字典实体类
 *
 * @class Dictionary
 * @extends BaseEntity
 *
 * @description
 * 数据字典用于：
 * 1. 存储系统枚举值
 * 2. 提供下拉框选项数据
 * 3. 统一管理系统配置项
 *
 * 字典类型示例：
 * - user_status: 用户状态（启用/禁用）
 * - gender: 性别（男/女）
 * - order_status: 订单状态（待支付/已支付/已发货/已完成）
 */
@Entity('dictionary')
export class Dictionary extends BaseEntity {
  /**
   * 字典 ID（主键）
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 排序序号
   *
   * 用于控制字典项在下拉框中的显示顺序
   */
  @Column({ type: 'int', default: 0 })
  sort: number;

  /**
   * 字典项名称
   *
   * 字典项的标识名称
   * 例如：'启用', '禁用'
   */
  @Column({ type: 'varchar' })
  name: string;

  /**
   * 字典类型
   *
   * 用于分组，同一类型的字典项属于同一组
   * 例如：'user_status', 'gender', 'order_status'
   *
   * 前端根据这个字段获取对应的字典列表
   */
  @Column({ type: 'varchar' })
  dictType: string;

  /**
   * 显示标签
   *
   * 显示给用户看的文字
   * 例如：'启用', '禁用', '男', '女'
   */
  @Column({ type: 'varchar' })
  label: string;

  /**
   * 实际值
   *
   * 存储到数据库的值
   * 例如：'1', '0', 'male', 'female'
   */
  @Column({ type: 'varchar' })
  value: string;

  /**
   * 标签类型
   *
   * 用于前端显示不同样式的标签
   * 例如：'success', 'danger', 'warning', 'info'
   *
   * 对应 Element Plus 的 Tag 组件 type 属性
   */
  @Column({ type: 'varchar' })
  tag: string;

  /**
   * 创建时间
   */
  @CreateDateColumn({ name: 'create_time', nullable: true })
  createTime: Date;

  /**
   * 更新时间
   */
  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime: Date | null;

  /**
   * 软删除时间
   */
  @DeleteDateColumn({
    name: 'delete_time',
    type: 'timestamp',
    nullable: true,
    comment: '记录删除时间戳,NULL表示未删除',
  })
  deleteTime: Date | null;
}
