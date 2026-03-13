import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from "typeorm";
@Entity("user")
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string; // 数据库中的数字 ID

  @Column({ type: "varchar" })
  username: string;

  @Column({ type: "varchar" })
  password: string;

  @Column({ type: "varchar", nullable: true })
  email: string;

  @Column({ type: "varchar", nullable: true })
  phone: string;

  @Column({ type: "varchar", nullable: true })
  avatar: string;

  @Column({ type: "boolean", default: true })
  status: boolean;

  @Column("simple-array")
  roles: string[] | number[];

  @Column({ type: "varchar" })
  name: string;

  @CreateDateColumn({
    name: "create_time",
    nullable: true,
  })
  createTime: Date; // 创建时间

  @UpdateDateColumn({
    name: "update_time",
    nullable: true,
  })
  updateTime: Date;

  // 软删除核心字段
  @DeleteDateColumn({
    name: "delete_time", // 数据库列名
    type: "timestamp", // 字段类型
    nullable: true, // 允许为NULL（未删除状态）
    comment: "记录删除时间戳,NULL表示未删除",
  })
  deleteTime: Date | null;
}
