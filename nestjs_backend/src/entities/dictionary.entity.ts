import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('dictionary')
export class Dictionary extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  dictType: string;

  @Column({ type: 'varchar' })
  label: string;

  @Column({ type: 'varchar' })
  value: string;

  @Column({ type: 'varchar' })
  tag: string;

  @CreateDateColumn({ name: 'create_time', nullable: true })
  createTime: Date;

  @UpdateDateColumn({ name: 'update_time', nullable: true })
  updateTime: Date | null;

  @DeleteDateColumn({
    name: 'delete_time',
    type: 'timestamp',
    nullable: true,
    comment: '记录删除时间戳,NULL表示未删除',
  })
  deleteTime: Date | null;
}
