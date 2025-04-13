import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  Query,
  Put,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ExtendedRequest } from '../types/express/index';
import { PaginationInterceptor } from '../common/interceptors/pagintation.interceptor';
import { FindAllTasksDto } from './dto/find-all-tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req: ExtendedRequest) {
    const user = req.user;
    return this.tasksService.create(createTaskDto, user);
  }

  @Get()
  @UseInterceptors(PaginationInterceptor)
  findAllTasks(
    @Req() req: ExtendedRequest,
    @Query() findAllTasksDto: FindAllTasksDto,
  ) {
    return this.tasksService.findAllTasks(findAllTasksDto, req);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: ExtendedRequest) {
    const user = req.user.sub;
    return this.tasksService.findOne(id, user);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req: ExtendedRequest,
  ) {
    const user = req.user.sub;
    return this.tasksService.update(id, updateTaskDto, user);
  }

  @Put('mark-completed/:id')
  markCompleted(@Param('id') id: string, @Req() req: ExtendedRequest) {
    const user = req.user.sub;

    return this.tasksService.markAsCompleted(id, user);
  }
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req: ExtendedRequest) {
    const user = req.user.sub;
    return this.tasksService.remove(id, user);
  }
}
