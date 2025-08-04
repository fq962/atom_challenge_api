import { TaskRepository } from "../repositories/TaskRepository";
import { ResponseFactory } from "../factories/ResponseFactory";
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
    return ResponseFactory.createTasksResponse(tasks);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
    // Las validaciones de formato ahora se hacen en el middleware de Zod
    // Solo validamos lógica de negocio si es necesario
    const task = await this.taskRepository.createTask(createTaskDto);
    return ResponseFactory.createTaskResponse(task);
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponse | null> {
    // Las validaciones de formato ahora se hacen en el middleware de Zod
    const task = await this.taskRepository.updateTask(id, updateTaskDto);
    return task ? ResponseFactory.createTaskResponse(task) : null;
  }

  async deleteTask(id: string): Promise<boolean> {
    // Las validaciones de formato ahora se hacen en el middleware de Zod
    return await this.taskRepository.deleteTask(id);
  }

  // Los métodos de mapeo ahora se manejan en ResponseFactory
}
