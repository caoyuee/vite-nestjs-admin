/**
 * @file personnel.entity.ts
 * @description 人员信息实体 - 对应数据库中的 personnel 表
 *
 * 人员信息概念说明：
 * - 人员信息用于存储员工或用户的详细资料
 * - 包含个人基本信息、联系方式等
 * - 与用户表（user）区分，user 存储登录信息，personnel 存储详细信息
 *
 * 类比前端：
 * - 类似于用户详情页的数据模型
 * - 类似于员工档案管理的数据结构
 * - 类似于表单中的用户信息字段
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
 * 人员信息实体类
 *
 * @class Personnel
 * @extends BaseEntity
 *
 * @description
 * 人员信息用于：
 * 1. 存储员工/用户的详细资料
 * 2. 人事管理
 * 3. 通讯录功能
 *
 * 与 User 表的区别：
 * - User: 存储登录账号、密码、权限等
 * - Personnel: 存储姓名、身份证、地址等详细信息
 */
@Entity('personnel')
export class Personnel extends BaseEntity {
  /**
   * 人员 ID（主键）
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 排序序号
   *
   * 用于控制人员在列表中的显示顺序
   */
  @Column({ type: 'int', default: 0 })
  sort: number;

  /**
   * 姓名
   *
   * 人员的真实姓名
   */
  @Column({ type: 'varchar' })
  username: string;

  /**
   * 性别
   *
   * 0 = 未知，1 = 男，2 = 女
   */
  @Column({ type: 'int' })
  gender: number;

  /**
   * 身份证号
   *
   * 18 位身份证号码
   */
  @Column({ type: 'varchar' })
  idCard: string;

  /**
   * 详细信息
   *
   * @Column({ type: 'json' }) 存储为 JSON 格式
   * 用于存储扩展信息，方便后续扩展
   *
   * 包含：
   * - age: 年龄
   * - 其他扩展字段...
   */
  @Column({ type: 'json', nullable: true })
  detail: {
    /** 年龄 */
    age?: number;
  };

  /**
   * 邮箱地址
   */
  @Column({ type: 'varchar' })
  email: string;

  /**
   * 家庭住址
   */
  @Column({ type: 'varchar' })
  address: string;

  /**
   * 人员状态
   *
   * 用于标记人员的在职状态
   * 例如：0 = 离职，1 = 在职，2 = 休假
   */
  @Column({ type: 'int' })
  status: number;

  /**
   * 头像 URL
   *
   * 人员照片的访问路径
   */
  @Column({ type: 'varchar' })
  avatar: string;

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
