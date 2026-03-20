import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('role')
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @Column({ type: 'varchar' })
  role: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column('simple-array')
  useMenus: string[];

  @Column('simple-array')
  useProTable: string[];

  @Column('simple-array')
  authButton: string[];

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
