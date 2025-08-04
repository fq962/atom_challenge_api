import { UpdateTaskDto } from "../../src/types/Task";

/**
 * Mock del TaskRepository para tests aislados
 * Simula operaciones de base de datos sin conexión real
 */

// Tipo para la creación de tasks con id_user incluido
interface CreateTaskDto {
  title: string;
  description: string;
  priority: number;
  id_user: string;
}

// Base de datos en memoria para tests
const mockTasks: any[] = [];

export class TaskRepository {
  async getTasksByUserId(userId: string): Promise<any[]> {
    return mockTasks.filter((task) => task.id_user === userId);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<any> {
    const newTask = {
      id: `mock-task-${Date.now()}`,
      title: createTaskDto.title,
      description: createTaskDto.description || "",
      is_done: false,
      priority: createTaskDto.priority || 0,
      created_at: new Date(), // Devolver Date en lugar de string ISO
      id_user: createTaskDto.id_user,
    };

    mockTasks.push(newTask);
    return newTask;
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<any | null> {
    const taskIndex = mockTasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return null;

    mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updateTaskDto };
    return mockTasks[taskIndex];
  }

  async deleteTask(id: string): Promise<boolean> {
    const taskIndex = mockTasks.findIndex((task) => task.id === id);
    if (taskIndex === -1) return false;

    mockTasks.splice(taskIndex, 1);
    return true;
  }

  // Método auxiliar para limpiar la base de datos en memoria entre tests
  static clearMockData(): void {
    mockTasks.length = 0;
  }

  // Método auxiliar para obtener todas las tasks mock (para debugging)
  static getMockData(): any[] {
    return [...mockTasks];
  }
}
