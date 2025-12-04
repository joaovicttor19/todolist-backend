import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Optional } from 'sequelize';
import { TaskStatus } from './task-status.enum';
import { User } from '../users/user.model';
import { Tag } from '../tags/tag.model';
import { TaskTag } from '../tags/task-tag.model';

export interface TaskAttributes {
  id: number;
  title: string;
  status: TaskStatus;
  priority: number;
  description?: string | null;
  userId: number;
}

export interface TaskCreationAttributes extends Optional<
  TaskAttributes,
  'id' | 'description'
> {}

@Table
export class Task
  extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes
{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare title: string;

  @Column({
    type: DataType.ENUM(...Object.values(TaskStatus)),
    allowNull: false,
    defaultValue: TaskStatus.IN_PROGRESS,
  })
  declare status: TaskStatus;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare priority: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare description?: string | null;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user?: User;

  @BelongsToMany(() => Tag, () => TaskTag)
  declare tags?: Tag[];
}
