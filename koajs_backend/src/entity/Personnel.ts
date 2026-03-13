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
@Entity("personnel")
export class Personnel extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "int", default: 0 })//排序
    sort: number;

    @Column({ type: "varchar" })//人员名称
    username: string;

    @Column({ type: "int" })//性别
    gender: number;

    @Column({ type: "varchar" })//身份证号
    idCard: string;
    // 使用 JSON 类型存储 detail 对象
    @Column({ type: "json", nullable: true })
    detail: {
        // 用户详情信息
        age?: number;
    };

    @Column({ type: "varchar" })//邮箱
    email: string;

    @Column({ type: "varchar" })//地址
    address: string;

    @Column({ type: "int" })//状态
    status: number;

    @Column({ type: "varchar" })//头像
    avatar: string;

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
