import { Task, CreateTaskDto, UpdateTaskDto } from "../types/Task";
import { DocumentReference, DocumentData } from "firebase-admin/firestore";

/**
 * Factory for Task entity creation, validation and transformation
 * Handles task data processing and business rules
 */
export class TaskFactory {
  /**
   * Create Task from CreateTaskDto
   * @param createTaskDto Task creation data
   * @returns Task object without ID
   * @throws Error on validation failure
   */
  static createFromDto(createTaskDto: CreateTaskDto): Omit<Task, "id"> {
    const now = new Date();

    return {
      title: this.validateAndNormalizeTitle(createTaskDto.title),
      description: this.validateAndNormalizeDescription(
        createTaskDto.description
      ),
      priority: this.validatePriority(createTaskDto.priority),
      is_done: false, // Las tareas nuevas siempre empiezan como pendientes
      created_at: now,
      id_user: createTaskDto.id_user,
    };
  }

  /**
   * Create Task from Firestore document data
   * @param id Document ID
   * @param data Firestore document data
   * @returns Complete Task object
   */
  static createFromFirestore(id: string, data: any): Task {
    return {
      id,
      title: data.title || "",
      description: data.description || "",
      is_done: data.is_done || data.id_done || false, // Compatibilidad con typos
      priority: this.validatePriority(data.priority || 0),
      created_at:
        data.created_at?.toDate() || data.createdAt?.toDate() || new Date(),
      id_user: data.id_user?.id || data.userId || data.user_id || "anonymous",
    };
  }

  /**
   * Create complete Task with generated ID
   * @param id Generated task ID
   * @param createTaskDto Task creation data
   * @returns Complete Task object
   */
  static createComplete(id: string, createTaskDto: CreateTaskDto): Task {
    const taskData = this.createFromDto(createTaskDto);
    return {
      id,
      ...taskData,
    };
  }

  /**
   * Create updated Task from existing task and update data
   * @param existingTask Current task data
   * @param updateDto Update data
   * @returns Updated Task object
   * @throws Error on validation failure
   */
  static createUpdated(existingTask: Task, updateDto: UpdateTaskDto): Task {
    return {
      ...existingTask,
      title:
        updateDto.title !== undefined
          ? this.validateAndNormalizeTitle(updateDto.title)
          : existingTask.title,
      description:
        updateDto.description !== undefined
          ? this.validateAndNormalizeDescription(updateDto.description)
          : existingTask.description,
      is_done:
        updateDto.is_done !== undefined
          ? updateDto.is_done
          : existingTask.is_done,
      priority:
        updateDto.priority !== undefined
          ? this.validatePriority(updateDto.priority)
          : existingTask.priority,
    };
  }

  /**
   * Mark task as completed
   * @param task Task to mark as completed
   * @returns Task marked as completed
   * @throws Error if task is already completed
   */
  static markAsCompleted(task: Task): Task {
    if (task.is_done) {
      throw new Error("La tarea ya está marcada como completada");
    }

    return {
      ...task,
      is_done: true,
    };
  }

  /**
   * Mark task as pending
   * @param task Task to mark as pending
   * @returns Task marked as pending
   * @throws Error if task is already pending
   */
  static markAsPending(task: Task): Task {
    if (!task.is_done) {
      throw new Error("La tarea ya está marcada como pendiente");
    }

    return {
      ...task,
      is_done: false,
    };
  }

  /**
   * Create Firestore update data from UpdateTaskDto
   * @param updateDto Update data
   * @returns Firestore-ready update object
   * @throws Error on validation failure
   */
  static createFirestoreUpdateData(
    updateDto: UpdateTaskDto
  ): Record<string, any> {
    const updateData: Record<string, any> = {};

    if (updateDto.title !== undefined) {
      updateData.title = this.validateAndNormalizeTitle(updateDto.title);
    }
    if (updateDto.description !== undefined) {
      updateData.description = this.validateAndNormalizeDescription(
        updateDto.description
      );
    }
    if (updateDto.is_done !== undefined) {
      updateData.is_done = updateDto.is_done;
    }
    if (updateDto.priority !== undefined) {
      updateData.priority = this.validatePriority(updateDto.priority);
    }

    return updateData;
  }

  // Private validation methods

  /**
   * Validate and normalize task title
   * @param title Title to validate
   * @returns Normalized valid title
   * @throws Error on validation failure
   */
  private static validateAndNormalizeTitle(title: string): string {
    if (!title || typeof title !== "string") {
      throw new Error("El título es requerido y debe ser texto");
    }

    const normalizedTitle = title.trim();
    if (normalizedTitle.length === 0) {
      throw new Error("El título no puede estar vacío");
    }
    if (normalizedTitle.length > 100) {
      throw new Error("El título no puede exceder 100 caracteres");
    }

    return normalizedTitle;
  }

  /**
   * Validate and normalize task description
   * @param description Description to validate
   * @returns Normalized valid description
   * @throws Error on validation failure
   */
  private static validateAndNormalizeDescription(description: string): string {
    if (description === null || description === undefined) {
      return "";
    }

    if (typeof description !== "string") {
      throw new Error("La descripción debe ser texto");
    }

    const normalizedDescription = description.trim();
    if (normalizedDescription.length > 500) {
      throw new Error("La descripción no puede exceder 500 caracteres");
    }

    return normalizedDescription;
  }

  /**
   * Validate task priority
   * @param priority Priority value to validate
   * @returns Valid priority (0-10)
   * @throws Error on validation failure
   */
  private static validatePriority(priority: number): number {
    if (priority === null || priority === undefined) {
      return 0; // Prioridad por defecto
    }

    if (typeof priority !== "number" || !Number.isInteger(priority)) {
      throw new Error("La prioridad debe ser un número entero");
    }

    if (priority < 0 || priority > 10) {
      throw new Error("La prioridad debe estar entre 0 y 10");
    }

    return priority;
  }
}
