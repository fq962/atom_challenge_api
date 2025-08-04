import { DocumentReference, DocumentData } from "firebase-admin/firestore";

/**
 * Task type definitions
 * Defines interfaces for task-related data structures and DTOs
 */

/**
 * Task entity interface
 * Represents a complete task object with all properties
 */
export interface Task {
  id: string;
  title: string;
  description: string;
  id_user?: string | DocumentReference<DocumentData>;
  is_done: boolean;
  priority: number;
  created_at: Date;
}

/**
 * Task creation body DTO interface
 * Data from request body (without id_user from token)
 */
export interface CreateTaskBodyDto {
  title: string;
  description: string;
  priority: number;
}

/**
 * Task creation DTO interface
 * Internal DTO with id_user extracted from JWT token
 */
export interface CreateTaskDto {
  title: string;
  description: string;
  priority: number;
  id_user: string | DocumentReference<DocumentData>;
}

/**
 * Task update DTO interface
 * Partial update data for existing tasks
 */
export interface UpdateTaskDto {
  title?: string;
  description?: string;
  is_done?: boolean;
  priority?: number;
}

/**
 * Task response interface
 * Formatted task data for API responses
 */
export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  is_done: boolean;
  priority: number;
  created_at: string;
}
