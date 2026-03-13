// entity/Menu.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
@Entity("menu")
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "int", default: 0 })
  index: number; // 菜单排序字段

  @Column({ type: "int" })
  type: number; // 0: 分组, 1: 页面

  @Column({ type: "int" })
  parentId: number; // 父级菜单ID

  @Column({ type: "varchar" })
  path: string; // 路由路径

  @Column({ type: "varchar" })
  name: string; // 路由名称

  @Column({ type: "varchar" })
  nameZH: string; // 路由中文名称

  @Column({ type: "varchar" })
  component: string; // 组件路径

  @Column({ type: "varchar" })
  redirect: string; // 重定向路径

  @Column({ type: "boolean", default: true })
  status: boolean; // 菜单状态，true 正常，false 禁用

  // 使用 JSON 类型存储 meta 对象
  @Column({ type: "json", nullable: true })
  meta: {
    // 菜单元信息
    icon?: string;
    title: string;
    isLink?: string;
    isHide?: boolean;
    isFull?: boolean;
    isAffix?: boolean;
    isKeepAlive?: boolean;
    activeMenu?: string;
  };

  @CreateDateColumn({
    name: "create_time",
    nullable: true,
  })
  createTime: Date; // 创建时间

  @UpdateDateColumn({
    name: "update_time",
    nullable: true,
  })
  updateTime: Date | null; // 更新时间

  // 软删除核心字段
  @DeleteDateColumn({
    name: "delete_time", // 数据库列名
    type: "timestamp", // 字段类型
    nullable: true, // 允许为NULL（未删除状态）
    comment: "记录删除时间戳,NULL表示未删除",
  })
  deleteTime: Date | null;
}
