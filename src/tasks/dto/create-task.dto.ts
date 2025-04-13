import { IsNotEmpty, IsString, IsDateString, IsEnum } from 'class-validator';
import { TaskPriority } from '../entities/task.entity';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  dueDate: Date;

  @IsEnum(TaskPriority)
  priority: TaskPriority;
}