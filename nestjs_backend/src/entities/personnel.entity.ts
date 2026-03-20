import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('personnel')
export class Personnel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  sort: number;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'int' })
  gender: number;

  @Column({ type: 'varchar' })
  idCard: string;

  @Column({ type: 'json', nullable: true })
  detail: {
    age?: number;
  };

  @Column({ type: 'varchar' })
  email: string;

  @Column({ type: 'varchar' })
  address: string;

  @Column({ type: 'int' })
  status: number;

  @Column({ type: 'varchar' })
  avatar: string;

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
