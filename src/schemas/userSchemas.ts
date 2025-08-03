import { z } from "zod";

// Schema base para User
export const UserSchema = z.object({
  id: z.string().min(1, "ID es requerido"),
  mail: z
    .string()
    .email("Formato de email inválido")
    .min(1, "Email es requerido")
    .max(254, "Email demasiado largo") // RFC 5321 limit
    .toLowerCase()
    .trim(),
});

// Schema para crear usuario
export const CreateUserSchema = z.object({
  mail: z
    .string()
    .email("Formato de email inválido")
    .min(1, "Email es requerido")
    .max(254, "Email demasiado largo")
    .toLowerCase()
    .trim(),
});

// Schema para obtener usuario por email
export const GetUserByMailSchema = z.object({
  mail: z
    .string()
    .email("Formato de email inválido")
    .min(1, "Email es requerido")
    .max(254, "Email demasiado largo")
    .toLowerCase()
    .trim(),
});

// Schema para login/auth response
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  token: z.string().optional(),
  exists: z.boolean().optional(),
});

// Exportar tipos inferidos
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type GetUserByMailInput = z.infer<typeof GetUserByMailSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
