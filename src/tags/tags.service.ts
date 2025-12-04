import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Tag, TagCreationAttributes } from './tag.model';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag)
    private readonly tagModel: typeof Tag,
  ) {}

  async create(userId: number, dto: CreateTagDto): Promise<Tag> {
    const data: TagCreationAttributes = {
      name: dto.name,
      color: dto.color,
      userId,
    };

    return this.tagModel.create(data);
  }

  findAll(userId: number): Promise<Tag[]> {
    return this.tagModel.findAll({
      where: { userId },
    });
  }

  async findOne(userId: number, id: number): Promise<Tag> {
    const tag = await this.tagModel.findOne({
      where: { id, userId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    return tag;
  }

  async update(userId: number, id: number, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(userId, id);

    if (dto.name !== undefined) tag.name = dto.name;
    if (dto.color !== undefined) tag.color = dto.color;

    await tag.save();
    return tag;
  }

  async remove(userId: number, id: number): Promise<void> {
    const tag = await this.findOne(userId, id);
    await tag.destroy();
  }
}
