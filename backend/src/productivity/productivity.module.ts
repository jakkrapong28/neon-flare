import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { ProductivityController } from './productivity.controller';
import { ProductivityService } from './productivity.service';
import { Task, TaskSchema } from './infrastructure/schemas/task.schema';
import { TaskRepository } from './infrastructure/repositories/task.repository';
import { PomodoroSession, PomodoroSessionSchema } from './schemas/pomodoro.schema';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: PomodoroSession.name, schema: PomodoroSessionSchema },
    ])
  ],
  controllers: [ProductivityController],
  providers: [
    ProductivityService,
    {
      provide: 'ITaskRepository',
      useClass: TaskRepository
    }
  ],
  exports: [ProductivityService]
})
export class ProductivityModule { }
