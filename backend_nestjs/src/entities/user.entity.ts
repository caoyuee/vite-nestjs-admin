/**
 * @file user.entity.ts
 * @description 用户实体 - 对应数据库中的 user 表
 *
 * Entity 概念说明：
 * - Entity（实体）是 TypeORM 的核心概念，用于映射数据库表
 * - 一个 Entity 类对应数据库中的一张表
 * - 类的属性对应表的字段
 *
 * 类比前端：
 * - 类似于 Vue 组件中的 data model
 * - 类似于 TypeScript 的 interface，但带有数据库映射功能
 * - 类似于 Prisma 的 model 定义
 *
 * 装饰器说明：
 * - @Entity('user'): 标记这个类是一个数据库实体，对应 user 表
 * - @PrimaryGeneratedColumn(): 主键，自动递增
 * - @Column(): 普通字段
 * - @CreateDateColumn(): 创建时间，自动设置
 * - @UpdateDateColumn(): 更新时间，自动更新
 * - @DeleteDateColumn(): 软删除时间，删除时设置（不真正删除记录）
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
 * 用户实体类
 *
 * @class User
 * @extends BaseEntity
 *
 * @description
 * 继承 BaseEntity 可以获得一些内置方法：
 * - User.find() - 查询所有用户
 * - User.findOne() - 查询单个用户
 * - user.save() - 保存用户
 * - user.remove() - 删除用户
 *
 * 类似于前端的状态管理中的 model，但直接映射到数据库
 */
@Entity('user') // @Entity('user') 表示这个类对应数据库中的 user 表
export class User extends BaseEntity {
  /**
   * 用户 ID（主键）
   *
   * @PrimaryGeneratedColumn() 表示这是一个自增主键
   * 类似于 MySQL 的 INT AUTO_INCREMENT PRIMARY KEY
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 用户名（登录账号）
   *
   * @Column({ type: 'varchar' }) 表示这是一个 varchar 类型的字段
   * 类似于 MySQL 的 VARCHAR(255)
   */
  @Column({ type: 'varchar' })
  username: string;

  /**
   * 密码（加密存储）
   *
   * 存储的是加密后的密码（bcrypt），不是明文密码
   */
  @Column({ type: 'varchar' })
  password: string;

  /**
   * 邮箱
   *
   * @Column({ nullable: true }) 表示这个字段可以为 NULL
   * 类似于 MySQL 的 VARCHAR(255) NULL
   */
  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  /**
   * 手机号
   */
  @Column({ type: 'varchar', nullable: true })
  phone: string | null;

  /**
   * 头像 URL
   *
   * 存储的是头像图片的访问路径
   */
  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  /**
   * 用户状态
   *
   * @Column({ default: true }) 表示默认值为 true
   * true = 启用，false = 禁用
   */
  @Column({ type: 'boolean', default: true })
  status: boolean;

  /**
   * 用户角色 ID 列表
   *
   * @Column('simple-array') 表示这是一个简单数组，存储时会用逗号分隔
   * 例如：['1', '2'] 存储为 '1,2'
   *
   * 这是一种简单的多对多关系实现方式
   * 更规范的方式是使用多对多关联表
   */
  @Column('simple-array', { nullable: true })
  roles: string[];

  /**
   * 用户姓名（真实姓名）
   */
  @Column({ type: 'varchar' })
  name: string;

  /**
   * 创建时间
   *
   * @CreateDateColumn() 会自动设置为当前时间
   * name: 'create_time' 表示数据库字段名为 create_time
   */
  @CreateDateColumn({ name: 'create_time', nullable: true })
  createTime: Date;

  /**
   * 更新时间
   *
   * @UpdateDateColumn() 会在记录更新时自动更新为当前时间
   */
  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime: Date;

  /**
   * 软删除时间
   *
   * @DeleteDateColumn() 实现软删除功能
   * - 记录被"删除"时，这个字段会被设置为当前时间
   * - 实际上记录还在数据库中，只是标记为已删除
   * - 查询时会自动过滤掉已删除的记录
   *
   * 类似于前端的 isDeleted 标志，但是带时间戳
   * 好处：可以恢复误删的数据
   */
  @DeleteDateColumn({
    name: 'delete_time',
    type: 'timestamp',
    nullable: true,
    comment: '记录删除时间戳,NULL表示未删除',
  })
  deleteTime: Date | null;
}
