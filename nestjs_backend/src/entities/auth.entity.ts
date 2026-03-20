import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('auth')
export class Auth extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  permission: string;

  @Column({ type: 'varchar' })
  type: string;

  @Column({ type: 'varchar' })
  description: string;

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
