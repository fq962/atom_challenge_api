import { Task, TaskResponse } from "../types/Task";
import { User } from "../types/User";

/**
 * Factory for standardized API responses
 * Provides consistent response formatting across the application
 */
export class ResponseFactory {
  /**
   * Create standard success response
   * @param message Success message
   * @param data Response data
   * @param additionalFields Additional fields to include
   * @returns Standardized success response object
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
   * Create standard error response
   * @param message Error message
   * @param statusCode HTTP status code
   * @param errors Array of specific errors
   * @param additionalFields Additional fields to include
   * @returns Standardized error response object
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
   * Convert Task to TaskResponse format
   * @param task Task object to convert
   * @returns TaskResponse formatted for client
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
   * Convert array of Tasks to TaskResponses
   * @param tasks Array of Task objects
   * @returns Array of TaskResponse objects
   */
  static createTasksResponse(tasks: Task[]): TaskResponse[] {
    return tasks.map((task) => this.createTaskResponse(task));
  }

  /**
   * Create tasks response with metadata
   * @param tasks Array of tasks
   * @param userId User ID
   * @param message Success message
   * @returns Response with tasks and statistics
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
   * Create authentication response
   * @param user User object
   * @param token JWT token
   * @param exists Whether user already existed
   * @param message Custom message
   * @returns Authentication response with token and user data
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
   * Create user not found response
   * @returns Standardized 404 error response
   */
  static createUserNotFoundResponse() {
    return this.createErrorResponse("Usuario no encontrado", 404, undefined, {
      exists: false,
    });
  }

  /**
   * Create task created response
   * @param task Created task
   * @param userId User ID
   * @returns Success response with created task
   */
  static createTaskCreatedResponse(task: Task, userId: string) {
    return this.createSuccessResponse(
      "Tarea creada exitosamente",
      this.createTaskResponse(task),
      { id_user: userId }
    );
  }

  /**
   * Create task updated response
   * @param task Updated task
   * @param userId User ID
   * @returns Success response with updated task
   */
  static createTaskUpdatedResponse(task: Task, userId: string) {
    return this.createSuccessResponse(
      "Tarea actualizada exitosamente",
      this.createTaskResponse(task),
      { id_user: userId }
    );
  }

  /**
   * Create task deleted response
   * @param userId User ID
   * @returns Success response for task deletion
   */
  static createTaskDeletedResponse(userId: string) {
    return this.createSuccessResponse("Tarea eliminada exitosamente", null, {
      id_user: userId,
    });
  }

  /**
   * Create task not found response
   * @returns Standardized 404 error response
   */
  static createTaskNotFoundResponse() {
    return this.createErrorResponse("Tarea no encontrada", 404);
  }

  /**
   * Create unauthorized access response
   * @param message Custom error message
   * @returns Standardized 403 error response
   */
  static createUnauthorizedResponse(
    message: string = "No tienes permisos para acceder a este recurso"
  ) {
    return this.createErrorResponse(message, 403);
  }

  /**
   * Create validation error response
   * @param errors Array of validation errors
   * @returns Standardized 400 error response with details
   */
  static createValidationErrorResponse(errors: any[]) {
    return this.createErrorResponse(
      "Error de validación en los datos proporcionados",
      400,
      errors
    );
  }
}
