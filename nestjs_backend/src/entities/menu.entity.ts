import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

@Entity('menu')
export class Menu extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  index: number;

  @Column({ type: 'int' })
  type: number;

  @Column({ type: 'int' })
  parentId: number;

  @Column({ type: 'varchar' })
  path: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  nameZH: string;

  @Column({ type: 'varchar' })
  component: string;

  @Column({ type: 'varchar', nullable: true })
  redirect: string | null;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'json', nullable: true })
  meta: {
    icon?: string;
    title: string;
    isLink?: string;
    isHide?: boolean;
    isFull?: boolean;
    isAffix?: boolean;
    isKeepAlive?: boolean;
    activeMenu?: string;
  };

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
