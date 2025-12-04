import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Task, TaskAttributes, TaskCreationAttributes } from './task.model';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { FilterTasksDto } from './dto/filter-tasks.dto';
import { TaskStatus } from './task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task)
    private readonly taskModel: typeof Task,
  ) {}

  async create(userId: number, dto: CreateTaskDto): Promise<Task> {
    const data: TaskCreationAttributes = {
      title: dto.title,
      status: dto.status ?? TaskStatus.IN_PROGRESS,
      priority: dto.priority,
      description: dto.description ?? null,
      userId,
    };

    return this.taskModel.create(data);
  }

  async findAll(userId: number, filter: FilterTasksDto): Promise<Task[]> {
    const where: Partial<TaskAttributes> = { userId };

    if (filter.status) {
      where.status = filter.status;
    }

    return this.taskModel.findAll({ where });
  }

  async findOne(userId: number, id: number): Promise<Task> {
    const task = await this.taskModel.findOne({
      where: { id, userId },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async update(userId: number, id: number, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(userId, id);

    const dataToUpdate: TaskCreationAttributes = {
      title: dto.title ?? task.title,
      status: dto.status ?? task.status,
      priority: dto.priority ?? task.priority,
      description:
        dto.description !== undefined ? dto.description : task.description,
      userId: task.userId,
      id: task.id,
    };

    await task.update(dataToUpdate);

    return task;
  }

  async remove(userId: number, id: number): Promise<void> {
    const task = await this.findOne(userId, id);
    await task.destroy();
  }
}
