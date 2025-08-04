import { z } from "zod";

// Schema base para Task
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

// Schema para crear una tarea (sin id_user porque viene del token)
export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder 100 caracteres")
    .trim(),
  description: z
    .string()
    .min(1, "La descripción es requerida")
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

// Schema para actualizar una tarea
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
    .min(1, "La descripción no puede estar vacía")
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

// Schema para obtener tareas por usuario
export const GetTasksByUserSchema = z.object({
  id_user: z.string().min(1, "ID de usuario es requerido").optional(),
});

// Schema para eliminar tarea
export const DeleteTaskSchema = z.object({
  id: z.string().min(1, "ID de la tarea es requerido"),
});

// Schema para response de tarea
export const TaskResponseSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  is_done: z.boolean(),
  priority: z.number(),
  created_at: z.string(), // ISO string format
});

// Exportar tipos inferidos
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>; // Solo datos del body (sin id_user)
export type UpdateTaskInput = z.infer<typeof UpdateTaskSchema>;
export type GetTasksByUserInput = z.infer<typeof GetTasksByUserSchema>;
export type DeleteTaskInput = z.infer<typeof DeleteTaskSchema>;
export type TaskResponse = z.infer<typeof TaskResponseSchema>;
