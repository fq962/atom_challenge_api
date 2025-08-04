import { z } from "zod";

/**
 * Task validation schemas
 * Defines Zod schemas for task-related operations and validation
 */

/**
 * Base Task schema with complete task data
 */
export const TaskSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder 100 caracteres")
    .trim(),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim(),
  is_done: z.boolean().default(false),
  priority: z
    .number()
    .int("La prioridad debe ser un número entero")
    .min(0, "La prioridad mínima es 0")
    .max(10, "La prioridad máxima es 10")
    .default(0),
  created_at: z.date(),
  id_user: z.string().min(1, "ID de usuario es requerido"),
});

/**
 * Schema for task creation
 * User ID is extracted from JWT token, not from request body
 */
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder 100 caracteres")
    .trim(),
  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim()
    .optional()
    .default(""),
  priority: z
    .number()
    .int("La prioridad debe ser un número entero")
    .min(0, "La prioridad mínima es 0")
    .max(10, "La prioridad máxima es 10")
    .optional()
    .default(0),
});

/**
 * Schema for task updates
 * All fields except ID are optional for partial updates
 */
export const UpdateTaskSchema = z.object({
  id: z.string().min(1, "ID de la tarea es requerido"),
  title: z
    .string()
    .min(1, "El título no puede estar vacío")
    .max(100, "El título no puede exceder 100 caracteres")
    .trim()
    .optional(),
  description: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres")
    .trim()
    .optional(),
  is_done: z.boolean().optional(),
  priority: z
    .number()
    .int("La prioridad debe ser un número entero")
    .min(0, "La prioridad mínima es 0")
    .max(10, "La prioridad máxima es 10")
    .optional(),
});

/**
 * Schema for getting tasks by user
 * User ID filter is optional for admin operations
 */
export const GetTasksByUserSchema = z.object({
  id_user: z.string().min(1, "ID de usuario es requerido").optional(),
});

/**
 * Schema for task deletion
 * Requires only task ID for deletion
 */
export const DeleteTaskSchema = z.object({
  id: z.string().min(1, "ID de la tarea es requerido"),
});

/**
 * Schema for task API responses
 * Defines structure of task data returned to clients
 */
export const TaskResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  is_done: z.boolean(),
  priority: z.number(),
  created_at: z.string(), // ISO string format
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>; // Body data only (no id_user)
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type GetTasksByUserInput = z.infer<typeof GetTasksByUserSchema>;
export type DeleteTaskInput = z.infer<typeof DeleteTaskSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
