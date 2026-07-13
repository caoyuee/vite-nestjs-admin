/**
 * @file role.entity.ts
 * @description 角色实体 - 对应数据库中的 role 表
 *
 * 角色概念说明：
 * - 角色用于权限管理，实现 RBAC（基于角色的访问控制）
 * - 用户可以拥有多个角色
 * - 每个角色可以关联多个菜单和权限
 *
 * 类比前端：
 * - 类似于 Vue 项目中的权限配置
 * - 类似于路由守卫中判断用户角色
 * - 类似于 v-if="hasRole('admin')" 的权限判断
 *
 * RBAC 模型：
 * 用户 <-> 角色 <-> 权限（菜单/按钮）
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
 * 角色实体类
 *
 * @class Role
 * @extends BaseEntity
 *
 * @description
 * 角色用于：
 * 1. 分配给用户，控制用户能看到哪些菜单
 * 2. 控制用户能操作哪些功能
 * 3. 实现细粒度的权限控制
 *
 * 常见角色：
 * - admin: 超级管理员，拥有所有权限
 * - user: 普通用户，只有基础权限
 * - editor: 编辑，有内容管理权限
 */
@Entity('role')
export class Role extends BaseEntity {
  /**
   * 角色 ID（主键）
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 排序序号
   *
   * 用于控制角色在列表中的显示顺序
   */
  @Column({ type: 'int', default: 0 })
  sort: number;

  /**
   * 角色标识符
   *
   * 用于代码中判断角色的唯一标识
   * 例如：'admin', 'user', 'editor'
   *
   * 前端代码中可以通过这个标识判断权限：
   * if (user.roles.includes('admin')) { ... }
   */
  @Column({ type: 'varchar' })
  role: string;

  /**
   * 角色名称
   *
   * 显示给用户看的中文名称
   * 例如：'超级管理员', '普通用户', '编辑'
   */
  @Column({ type: 'varchar' })
  name: string;

  /**
   * 角色描述
   *
   * 详细说明这个角色的职责和权限范围
   */
  @Column({ type: 'varchar' })
  description: string;

  /**
   * 角色状态
   *
   * true = 启用，false = 禁用
   * 禁用后，拥有此角色的用户将失去对应权限
   */
  @Column({ type: 'boolean', default: true })
  status: boolean;

  /**
   * 可访问的菜单 ID 列表
   *
   * @Column('simple-array') 存储为逗号分隔的字符串
   * 例如：'1,2,3,4,5'
   *
   * 用户登录后，前端根据这个列表显示对应的菜单
   * 实现菜单级别的权限控制
   */
  @Column('simple-array')
  useMenus: string[];

  /**
   * 可使用的表格功能 ID 列表
   *
   * 用于控制表格级别的功能权限
   * 例如：哪些列可以显示、哪些操作可以执行
   */
  @Column('simple-array')
  useProTable: string[];

  /**
   * 按钮权限 ID 列表
   *
   * 用于控制页面内按钮级别的权限
   * 例如：新增、编辑、删除按钮的显示/隐藏
   *
   * 前端使用方式：
   * v-if="hasPermission('user:add')"
   */
  @Column('simple-array')
  authButton: string[];

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
