import { IsEnum, IsNumberString, IsOptional } from 'class-validator';
import { TaskStatus } from '../entities/task.entity';

export class FindAllTasksDto {
  @IsEnum(TaskStatus)
  @IsOptional()
  status?: string;

  @IsOptional()
  @IsNumberString()
  readonly page?: string;

  @IsOptional()
  @IsNumberString()
  readonly limit?: string;
}
