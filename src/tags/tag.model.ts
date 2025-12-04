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
import { User } from '../users/user.model';
import { Task } from '../tasks/task.model';
import { TaskTag } from './task-tag.model';

export interface TagAttributes {
  id: number;
  name: string;
  color: string;
  userId: number;
}

export interface TagCreationAttributes extends Optional<TagAttributes, 'id'> {}

@Table
export class Tag
  extends Model<TagAttributes, TagCreationAttributes>
  implements TagAttributes
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
  declare name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare color: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  declare userId: number;

  @BelongsTo(() => User)
  declare user?: User;

  @BelongsToMany(() => Task, () => TaskTag)
  declare tasks?: Task[];
}
