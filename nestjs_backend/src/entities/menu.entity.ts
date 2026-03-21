/**
 * @file menu.entity.ts
 * @description 菜单实体 - 对应数据库中的 menu 表
 *
 * 菜单概念说明：
 * - 菜单用于构建前端的路由和导航
 * - 支持多级嵌套（通过 parentId 关联）
 * - 包含路由信息、图标、权限等元数据
 *
 * 类比前端：
 * - 类似于 Vue Router 的路由配置
 * - 类似于侧边栏导航的数据源
 * - 前端根据菜单数据动态生成路由和导航
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
 * 菜单实体类
 *
 * @class Menu
 * @extends BaseEntity
 *
 * @description
 * 菜单用于：
 * 1. 前端路由配置（path, name, component）
 * 2. 侧边栏导航（nameZH, icon）
 * 3. 权限控制（根据角色显示不同菜单）
 */
@Entity('menu')
export class Menu extends BaseEntity {
  /**
   * 菜单 ID（主键）
   */
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 排序序号
   *
   * 用于控制菜单显示顺序，数值越小越靠前
   */
  @Column({ type: 'int', default: 0 })
  index: number;

  /**
   * 菜单类型
   *
   * 通常用于区分：
   * - 0: 目录（有子菜单的父级）
   * - 1: 菜单（实际页面）
   * - 2: 按钮（页面内的操作权限）
   */
  @Column({ type: 'int' })
  type: number;

  /**
   * 父级菜单 ID
   *
   * - 0 表示顶级菜单
   * - 其他值表示父菜单的 ID
   *
   * 通过这个字段实现菜单的树形结构
   */
  @Column({ type: 'int' })
  parentId: number;

  /**
   * 路由路径
   *
   * 对应 Vue Router 的 path
   * 例如：'/system/user', '/dashboard'
   */
  @Column({ type: 'varchar' })
  path: string;

  /**
   * 路由名称
   *
   * 对应 Vue Router 的 name
   * 例如：'SystemUser', 'Dashboard'
   */
  @Column({ type: 'varchar' })
  name: string;

  /**
   * 菜单中文名称
   *
   * 显示在侧边栏导航中的文字
   * 例如：'用户管理', '仪表盘'
   */
  @Column({ type: 'varchar' })
  nameZH: string;

  /**
   * 组件路径
   *
   * 对应 Vue 组件的路径
   * 例如：'system/user/index', 'dashboard/index'
   *
   * 前端根据这个路径动态导入组件
   */
  @Column({ type: 'varchar' })
  component: string;

  /**
   * 重定向路径
   *
   * 当访问这个路由时，自动重定向到指定路径
   * 例如：'/system' 重定向到 '/system/user'
   */
  @Column({ type: 'varchar', nullable: true })
  redirect: string | null;

  /**
   * 菜单状态
   *
   * true = 启用，false = 禁用
   * 禁用后前端不显示这个菜单
   */
  @Column({ type: 'boolean', default: true })
  status: boolean;

  /**
   * 菜单元数据
   *
   * @Column({ type: 'json' }) 表示这是一个 JSON 类型字段
   * 存储复杂的配置信息
   *
   * 包含：
   * - icon: 菜单图标
   * - title: 菜单标题（同 nameZH）
   * - isLink: 外部链接地址
   * - isHide: 是否隐藏菜单
   * - isFull: 是否全屏显示
   * - isAffix: 是否固定在标签栏
   * - isKeepAlive: 是否缓存页面
   * - activeMenu: 高亮的菜单路径
   */
  @Column({ type: 'json', nullable: true })
  meta: {
    /** 菜单图标，例如：'user', 'setting' */
    icon?: string;
    /** 菜单标题 */
    title: string;
    /** 外部链接地址 */
    isLink?: string;
    /** 是否隐藏菜单（隐藏后不在侧边栏显示，但可以通过 URL 访问） */
    isHide?: boolean;
    /** 是否全屏显示（隐藏侧边栏和顶栏） */
    isFull?: boolean;
    /** 是否固定在标签栏（不可关闭） */
    isAffix?: boolean;
    /** 是否缓存页面（切换后保留状态） */
    isKeepAlive?: boolean;
    /** 高亮的菜单路径（用于详情页高亮列表页菜单） */
    activeMenu?: string;
  };

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
