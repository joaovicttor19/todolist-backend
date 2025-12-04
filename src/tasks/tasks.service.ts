import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op, Includeable } from 'sequelize';
import { Task, TaskAttributes, TaskCreationAttributes } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatus } from './task-status.enum';
import { Tag } from '../tags/tag.model';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
    @InjectModel(Tag)
    private readonly tagModel: typeof Tag,
  ) {}

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    const { tagIds, ...rest } = dto;

    const data: TaskCreationAttributes = {
      title: rest.title,
      status: rest.status ?? TaskStatus.IN_PROGRESS,
      priority: rest.priority,
      description: rest.description ?? null,
      userId,
    };

    const task = await this.taskModel.create(data);

    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagModel.findAll({
        where: { id: tagIds, userId },
      });

      await task.$set('tags', tags);
    }

    return this.findOne(userId, task.id);
  }

  async findByTagNames(user_id: number, names: string): Promise<Task[]> {
    const tags = names.split(',').map((n) => n.trim());

    return this.taskModel.findAll({
      where: { userId: user_id },
      include: [
        {
          model: Tag,
          as: 'tags',
          required: true,
          where: { name: { [Op.in]: tags } },
        },
      ],
    });
  }

  async findAll(userId: number, filter: FilterTasksDto): Promise<Task[]> {
    const where: Partial<TaskAttributes> = { userId };
    const include: Includeable[] = [];

    if (filter.status) {
      where.status = filter.status;
    }

    if (filter.tags) {
      const tagNames = filter.tags
        .split(',')
        .map((name) => name.trim())
        .filter((name) => name.length > 0);

      include.push({
        model: Tag,
        where: {
          name: {
            [Op.in]: tagNames,
          },
          userId,
        },
      });
    } else {
      include.push({
        model: Tag,
        where: { userId },
        required: false,
      });
    }

    return this.taskModel.findAll({
      where,
      include,
    });
  }

  async findOne(userId: number, id: number): Promise<Task> {
    const task = await this.taskModel.findOne({
      where: { id: +id, userId },
      include: [
        {
          model: Tag,
          where: { userId },
          required: false,
        },
      ],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(userId: number, id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(userId, id);

    if (dto.title) task.title = dto.title;
    if (dto.status) task.status = dto.status;
    if (dto.priority) task.priority = dto.priority;
    if (dto.description !== undefined) task.description = dto.description;

    await task.save();
    if (dto.tagIds) {
      const tags = await this.tagModel.findAll({
        where: { id: dto.tagIds, userId },
      });
      await task.$set('tags', tags);
    }
    return task;
  }

  async remove(userId: number, id: number): Promise<void> {
    const task = await this.findOne(userId, id);
    await task.destroy();
  }
}
