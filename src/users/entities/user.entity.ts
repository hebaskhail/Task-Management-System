import { Column, Entity, OneToMany } from 'typeorm';
import { IsEnum } from 'class-validator';
import { BaseEntity } from 'src/common/entities/base.entity';
import { Task } from '../../tasks/entities/task.entity';


@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[];

  @Column({ default: false })
  isDeleted: boolean;
}
