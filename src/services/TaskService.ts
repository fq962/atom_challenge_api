import { TaskRepository } from "../repositories/TaskRepository";
import { ResponseFactory } from "../factories/ResponseFactory";
import { CreateTaskDto, UpdateTaskDto, TaskResponse } from "../types/Task";

/**
 * Task business logic service
 * Handles task-related operations and response formatting
 */
export class TaskService {
  private readonly taskRepository: TaskRepository;

  constructor() {
    this.taskRepository = new TaskRepository();
  }

  /**
   * Get tasks by user ID
   * @param userId User ID to filter tasks
   * @returns Array of formatted task responses
   * @throws Error when repository operation fails
   */
  async getTasksByUserId(userId: string): Promise<TaskResponse[]> {
    // Basic validation is handled by Zod middleware
    const tasks = await this.taskRepository.getTasksByUserId(userId);
    return ResponseFactory.createTasksResponse(tasks);
  }

  /**
   * Create new task
   * @param createTaskDto Task creation data (already validated by Zod middleware)
   * @returns Formatted task response
   * @throws Error when task creation fails
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<TaskResponse> {
    // Format validation is handled by Zod middleware
    // Only business logic validation if needed
    const task = await this.taskRepository.createTask(createTaskDto);
    return ResponseFactory.createTaskResponse(task);
  }

  /**
   * Update existing task
   * @param id Task ID to update
   * @param updateTaskDto Task update data (already validated by Zod middleware)
   * @returns Formatted task response or null if not found
   * @throws Error when repository operation fails
   */
  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<TaskResponse | null> {
    // Format validation is handled by Zod middleware
    const task = await this.taskRepository.updateTask(id, updateTaskDto);
    return task ? ResponseFactory.createTaskResponse(task) : null;
  }

  /**
   * Delete task by ID
   * @param id Task ID to delete
   * @returns True if task was deleted, false if not found
   * @throws Error when repository operation fails
   */
  async deleteTask(id: string): Promise<boolean> {
    // Format validation is handled by Zod middleware
    return await this.taskRepository.deleteTask(id);
  }

  // Response mapping is handled by ResponseFactory
}
