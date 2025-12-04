import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { Tag } from './tag.model';
import { Task } from '../tasks/task.model';
import { TaskTag } from './task-tag.model';

@Module({
  imports: [SequelizeModule.forFeature([Tag, Task, TaskTag])],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
