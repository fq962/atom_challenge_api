import { TaskRepository } from "../repositories/TaskRepository";
import {
  Task,
  CreateTaskDto,
  UpdateTaskDto,
  TaskResponse,
} from "../types/Task";

export class TaskService {
  private readonly taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  async getTasksByUserId(userId: string): Promise<TaskResponse[]> {
    // Las validaciones básicas ahora se hacen en el middleware de Zod
    const tasks = await this.taskRepository.getTasksByUserId(userId);
    return this.mapTasksToResponse(tasks);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
    // Las validaciones de formato ahora se hacen en el middleware de Zod
    // Solo validamos lógica de negocio si es necesario
    const task = await this.taskRepository.createTask(createTaskDto);
    return this.mapTaskToResponse(task);
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponse | null> {
    // Las validaciones de formato ahora se hacen en el middleware de Zod
    const task = await this.taskRepository.updateTask(id, updateTaskDto);
    return task ? this.mapTaskToResponse(task) : null;
  }

  async deleteTask(id: string): Promise<boolean> {
    // Las validaciones de formato ahora se hacen en el middleware de Zod
    return await this.taskRepository.deleteTask(id);
  }

  private mapTaskToResponse(task: Task): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      is_done: task.is_done,
      priority: task.priority,
      created_at: task.created_at.toISOString(),
    };
  }

  private mapTasksToResponse(tasks: Task[]): TaskResponse[] {
    return tasks.map((task) => this.mapTaskToResponse(task));
  }
}
