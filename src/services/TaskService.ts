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

  async getAllTasks(): Promise<TaskResponse[]> {
    const tasks = await this.taskRepository.getAllTasks();
    return this.mapTasksToResponse(tasks);
  }

  async getTasksByUserId(userId: string): Promise<TaskResponse[]> {
    if (!userId || userId.trim() === "") {
      throw new Error("El ID del usuario es requerido");
    }

    const tasks = await this.taskRepository.getTasksByUserId(userId);
    return this.mapTasksToResponse(tasks);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
    this.validateCreateTaskDto(createTaskDto);

    const task = await this.taskRepository.createTask(createTaskDto);
    return this.mapTaskToResponse(task);
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponse | null> {
    if (!id || id.trim() === "") {
      throw new Error("El ID de la tarea es requerido");
    }

    this.validateUpdateTaskDto(updateTaskDto);

    const task = await this.taskRepository.updateTask(id, updateTaskDto);
    return task ? this.mapTaskToResponse(task) : null;
  }

  async deleteTask(id: string): Promise<boolean> {
    if (!id || id.trim() === "") {
      throw new Error("El ID de la tarea es requerido");
    }

    return await this.taskRepository.deleteTask(id);
  }

  private validateCreateTaskDto(createTaskDto: CreateTaskDto): void {
    if (!createTaskDto.title || createTaskDto.title.trim() === "") {
      throw new Error("El título es requerido");
    }

    if (!createTaskDto.description || createTaskDto.description.trim() === "") {
      throw new Error("La descripción es requerida");
    }

    if (!createTaskDto.userId || createTaskDto.userId.trim() === "") {
      throw new Error("El ID del usuario es requerido");
    }

    if (createTaskDto.title.length > 100) {
      throw new Error("El título no puede exceder 100 caracteres");
    }

    if (createTaskDto.description.length > 500) {
      throw new Error("La descripción no puede exceder 500 caracteres");
    }
  }

  private validateUpdateTaskDto(updateTaskDto: UpdateTaskDto): void {
    if (updateTaskDto.title !== undefined) {
      if (updateTaskDto.title.trim() === "") {
        throw new Error("El título no puede estar vacío");
      }
      if (updateTaskDto.title.length > 100) {
        throw new Error("El título no puede exceder 100 caracteres");
      }
    }

    if (updateTaskDto.description !== undefined) {
      if (updateTaskDto.description.trim() === "") {
        throw new Error("La descripción no puede estar vacía");
      }
      if (updateTaskDto.description.length > 500) {
        throw new Error("La descripción no puede exceder 500 caracteres");
      }
    }
  }

  private mapTaskToResponse(task: Task): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      created_at: task.created_at.toISOString(),
      userId: task.userId,
    };
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("ID debe ser una cadena válida");
      }

      return await this.taskRepository.getTaskById(id);
    } catch (error) {
      console.error("Error en TaskService.getTaskById:", error);
      throw error;
    }
  }

  private mapTasksToResponse(tasks: Task[]): TaskResponse[] {
    return tasks.map((task) => this.mapTaskToResponse(task));
  }
}
