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
@Entity("dictionary")
export class Dictionary extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: "int", default: 0 })//排序
    sort: number;

    @Column({ type: "varchar" })//字典类型名称
    name: string;

    @Column({ type: "varchar" })//字典类型
    dictType: string;

    @Column({ type: "varchar" })//字典名
    label: string;

    @Column({ type: "varchar" })//字典值
    value: string;

    @Column({ type: "varchar" })//字典标签
    tag: string;

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
