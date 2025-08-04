import { DocumentReference, DocumentData } from "firebase-admin/firestore";

export interface Task {
  id: string;
  title: string;
  description: string;
  id_user?: string | DocumentReference<DocumentData>;
  is_done: boolean;
  priority: number;
  created_at: Date;
}

// DTO para datos del body (sin id_user)
export interface CreateTaskBodyDto {
  title: string;
  description: string;
  priority: number;
}

// DTO para crear tarea internamente (con id_user del token)
export interface CreateTaskDto {
  title: string;
  description: string;
  priority: number;
  id_user: string | DocumentReference<DocumentData>;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  is_done?: boolean;
  priority?: number;
}

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  is_done: boolean;
  priority: number;
  created_at: string;
}
