import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User, UserCreationAttributes } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const data: UserCreationAttributes = { email, password };
    return this.userModel.create(data);
  }

  findByEmail(email: string) {
    return this.userModel.findOne({ where: { email } });
  }

  findById(id: number) {
    return this.userModel.findByPk(id);
  }
}
