import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { Optional } from 'sequelize';

export interface UserAttributes {
  id: number;
  email: string;
  password: string;
}

export interface UserCreationAttributes extends Optional<
  UserAttributes,
  'id'
> {}

@Table
export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes
{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  declare id: number;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  declare password: string;
}
