import { Task, TaskResponse } from "../types/Task";
import { User } from "../types/User";

export class ResponseFactory {
  /**
   * Crear respuesta exitosa estándar
   */
  static createSuccessResponse<T>(
    message: string,
    data: T,
    additionalFields?: Record<string, any>
  ) {
    return {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
      ...additionalFields,
    };
  }

  /**
   * Crear respuesta de error estándar
   */
  static createErrorResponse(
    message: string,
    statusCode?: number,
    errors?: any[],
    additionalFields?: Record<string, any>
  ) {
    return {
      success: false,
      message,
      ...(statusCode && { statusCode }),
      ...(errors && { errors }),
      timestamp: new Date().toISOString(),
      ...additionalFields,
    };
  }

  /**
   * Convertir Task a TaskResponse
   */
  static createTaskResponse(task: Task): TaskResponse {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      is_done: task.is_done,
      priority: task.priority,
      created_at: task.created_at.toISOString(),
    };
  }

  /**
   * Convertir array de Tasks a TaskResponses
   */
  static createTasksResponse(tasks: Task[]): TaskResponse[] {
    return tasks.map((task) => this.createTaskResponse(task));
  }

  /**
   * Crear respuesta de tareas con metadatos
   */
  static createTasksWithMetadata(
    tasks: Task[],
    userId: string,
    message: string = "Tareas obtenidas exitosamente"
  ) {
    const taskResponses = this.createTasksResponse(tasks);

    return this.createSuccessResponse(message, taskResponses, {
      count: tasks.length,
      completed: tasks.filter((task) => task.is_done).length,
      pending: tasks.filter((task) => !task.is_done).length,
      id_user: userId,
    });
  }

  /**
   * Crear respuesta de autenticación
   */
  static createAuthResponse(
    user: User,
    token: string,
    exists: boolean = false,
    message?: string
  ) {
    const defaultMessage = exists
      ? "Usuario encontrado exitosamente"
      : "Usuario creado exitosamente";

    return this.createSuccessResponse(message || defaultMessage, null, {
      token,
      exists,
      user: {
        id: user.id,
        mail: user.mail,
      },
    });
  }

  /**
   * Crear respuesta de usuario no encontrado
   */
  static createUserNotFoundResponse() {
    return this.createErrorResponse("Usuario no encontrado", 404, undefined, {
      exists: false,
    });
  }

  /**
   * Crear respuesta de tarea creada
   */
  static createTaskCreatedResponse(task: Task, userId: string) {
    return this.createSuccessResponse(
      "Tarea creada exitosamente",
      this.createTaskResponse(task),
      { id_user: userId }
    );
  }

  /**
   * Crear respuesta de tarea actualizada
   */
  static createTaskUpdatedResponse(task: Task, userId: string) {
    return this.createSuccessResponse(
      "Tarea actualizada exitosamente",
      this.createTaskResponse(task),
      { id_user: userId }
    );
  }

  /**
   * Crear respuesta de tarea eliminada
   */
  static createTaskDeletedResponse(userId: string) {
    return this.createSuccessResponse("Tarea eliminada exitosamente", null, {
      id_user: userId,
    });
  }

  /**
   * Crear respuesta de tarea no encontrada
   */
  static createTaskNotFoundResponse() {
    return this.createErrorResponse("Tarea no encontrada", 404);
  }

  /**
   * Crear respuesta de health check
   */
  static createHealthResponse() {
    return this.createSuccessResponse("API funcionando correctamente", null, {
      version: "1.0.0",
      environment: process.env.NODE_ENV || "development",
      uptime: process.uptime(),
    });
  }

  /**
   * Crear respuesta de acceso no autorizado
   */
  static createUnauthorizedResponse(
    message: string = "No tienes permisos para acceder a este recurso"
  ) {
    return this.createErrorResponse(message, 403);
  }

  /**
   * Crear respuesta de validación fallida
   */
  static createValidationErrorResponse(errors: any[]) {
    return this.createErrorResponse(
      "Error de validación en los datos proporcionados",
      400,
      errors
    );
  }
}
