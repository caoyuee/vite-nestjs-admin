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
@Entity("role")
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "int", default: 0 })
  sort: number;

  @Column({ type: "varchar" })
  role: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "varchar" })
  description: string;

  @Column({ type: "boolean", default: true })
  status: boolean;

  @Column("simple-array")
  useMenus: string[] | number[];

  @Column("simple-array")
  useProTable: string[];

  @Column("simple-array")
  authButton: string[];

  @CreateDateColumn({
    name: "create_time",
    nullable: true,
  })
  createTime: Date;

  @UpdateDateColumn({
    name: "update_time",
    nullable: true,
  })
  updateTime: Date | null;

  // 软删除核心字段
  @DeleteDateColumn({
    name: "delete_time", // 数据库列名
    type: "timestamp", // 字段类型
    nullable: true, // 允许为NULL（未删除状态）
    comment: "记录删除时间戳,NULL表示未删除",
  })
  deleteTime: Date | null;
}
