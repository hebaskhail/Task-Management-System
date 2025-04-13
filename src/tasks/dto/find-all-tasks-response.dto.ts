import { Task } from '../entities/task.entity';

export class FindAllTasksResponseDto {
  tasks: Task[];
  meta: {
    total: number;
    lastPage: number;
    page: number;
  };
}
