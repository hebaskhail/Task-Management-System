import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task, TaskStatus } from './entities/task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { FindAllTasksDto } from './dto/find-all-tasks.dto';
import { FindAllTasksResponseDto } from './dto/find-all-tasks-response.dto';
import { ExtendedRequest } from '../types/express/index';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}
  async create(createTaskDto: CreateTaskDto, user): Promise<Task> {
    const task = this.taskRepository.create({
      ...createTaskDto,
      user: { id: user.sub },
    });
    return await this.taskRepository.save(task);
  }

  async findAllTasks(
    findAllTasksDto: FindAllTasksDto,
    req: ExtendedRequest,
  ): Promise<FindAllTasksResponseDto> {
    const { status } = findAllTasksDto;
    const { page, limit, offset } = (req as any).pagination;
    const userId = req.user.sub;
    const query = this.taskRepository
      .createQueryBuilder('task')
      .where('task.userId = :userId', { userId });

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    query.orderBy('task.createdAt', 'DESC');

    query.skip(offset);
    query.take(limit);

    const [tasks, total] = await query.getManyAndCount();

    return {
      tasks,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id, userId } });
    if (!task) {
      throw new NotFoundException(`Task not found`);
    }
    return task;
  }

  async update(
    id: string,
    updateTaskDto: UpdateTaskDto,
    userId: string,
  ): Promise<Task> {
    const task = await this.findOne(id, userId);
    Object.assign(task, updateTaskDto);
    return await this.taskRepository.save(task);
  }

  async markAsCompleted(id: string, userId: string): Promise<Task> {
    const task = await this.findOne(id, userId);

    task.status = TaskStatus.COMPLETED;
    return await this.taskRepository.save(task);
  }

  async remove(id: string, userId: string): Promise<{ message }> {
    const task = await this.findOne(id, userId);

    await this.taskRepository.remove(task);
    return { message: 'Task deleted successfully' };
  }
}
