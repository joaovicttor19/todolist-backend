import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Task } from '../tasks/task.model';
import { Tag } from './tag.model';

export interface TaskTagAttributes {
  taskId: number;
  tagId: number;
}

@Table
export class TaskTag
  extends Model<TaskTagAttributes, TaskTagAttributes>
  implements TaskTagAttributes
{
  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  declare taskId: number;

  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  declare tagId: number;
}
