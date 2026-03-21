/**
 * @file auth.entity.ts
 * @description 权限实体 - 对应数据库中的 auth 表
 *
 * 权限概念说明：
 * - 权限用于控制用户能执行哪些操作
 * - 通常与角色关联，角色包含多个权限
 * - 实现细粒度的功能权限控制
 *
 * 类比前端：
 * - 类似于按钮级别的权限控制
 * - 类似于 v-if="hasPermission('user:add')" 的判断
 * - 类似于前端权限配置中的 permission 字段
 *
 * 权限类型：
 * - menu: 菜单权限
 * - button: 按钮权限
 * - api: API 接口权限
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
 * 权限实体类
 *
 * @class Auth
 * @extends BaseEntity
 *
 * @description
 * 权限用于：
 * 1. 控制用户能看到哪些按钮
 * 2. 控制用户能调用哪些接口
 * 3. 实现细粒度的功能权限控制
 *
 * 权限标识示例：
 * - user:add - 新增用户
 * - user:edit - 编辑用户
 * - user:delete - 删除用户
 * - user:list - 查看用户列表
 */
@Entity('auth')
export class Auth extends BaseEntity {
  /**
   * 权限 ID（主键）
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 排序序号
   *
   * 用于控制权限在列表中的显示顺序
   */
  @Column({ type: 'int', default: 0 })
  sort: number;

  /**
   * 权限名称
   *
   * 显示给用户看的名称
   * 例如：'新增用户', '编辑用户', '删除用户'
   */
  @Column({ type: 'varchar' })
  name: string;

  /**
   * 权限标识符
   *
   * 用于代码中判断权限的唯一标识
   * 格式通常为：模块:操作
   * 例如：'user:add', 'user:edit', 'user:delete'
   *
   * 前端使用方式：
   * v-if="hasPermission('user:add')"
   *
   * 后端使用方式：
   * @RequirePermission('user:add')
   */
  @Column({ type: 'varchar' })
  permission: string;

  /**
   * 权限类型
   *
   * 用于区分不同类型的权限：
   * - 'menu': 菜单权限
   * - 'button': 按钮权限
   * - 'api': API 接口权限
   */
  @Column({ type: 'varchar' })
  type: string;

  /**
   * 权限描述
   *
   * 详细说明这个权限的作用
   */
  @Column({ type: 'varchar' })
  description: string;

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
