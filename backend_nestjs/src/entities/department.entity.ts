/**
 * @file department.entity.ts
 * @description 部门实体 - 对应数据库中的 department 表
 */

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * 部门实体
 *
 * @description
 * 用于维护组织部门树，支持上级部门、负责人、联系方式、启停状态和排序。
 */
@Entity('department')
export class Department extends BaseEntity {
  /**
   * 部门 ID
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 上级部门 ID，0 表示顶级部门
   */
  @Column({ name: 'parent_id', type: 'int', default: 0 })
  parentId: number;

  /**
   * 部门名称
   */
  @Column({ type: 'varchar', length: 100 })
  name: string;

  /**
   * 部门编码
   */
  @Column({ type: 'varchar', length: 100, unique: true })
  code: string;

  /**
   * 排序值，数值越小越靠前
   */
  @Column({ type: 'int', default: 0 })
  sort: number;

  /**
   * 负责人
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  leader: string | null;

  /**
   * 联系电话
   */
  @Column({ type: 'varchar', length: 30, nullable: true })
  phone: string | null;

  /**
   * 邮箱
   */
  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string | null;

  /**
   * 状态：true 启用，false 禁用
   */
  @Column({ type: 'boolean', default: true })
  status: boolean;

  /**
   * 备注
   */
  @Column({ type: 'varchar', length: 500, nullable: true })
  remark: string | null;

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
