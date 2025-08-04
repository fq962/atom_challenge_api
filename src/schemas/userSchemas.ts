import { z } from "zod";

/**
 * User validation schemas
 * Defines Zod schemas for user-related operations and validation
 */

/**
 * Base User schema with complete user data
 */
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

/**
 * Schema for user creation
 * Used for registering new users
 */
export const CreateUserSchema = z.object({
  mail: z
    .string()
    .email("Formato de email inválido")
    .min(1, "Email es requerido")
    .max(254, "Email demasiado largo")
    .toLowerCase()
    .trim(),
});

/**
 * Schema for getting user by email
 * Used for user authentication and lookup
 */
export const GetUserByMailSchema = z.object({
  mail: z
    .string()
    .email("Formato de email inválido")
    .min(1, "Email es requerido")
    .max(254, "Email demasiado largo")
    .toLowerCase()
    .trim(),
});

/**
 * Schema for authentication response
 * Defines structure of login/register API responses
 */
export const AuthResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  token: z.string().optional(),
  exists: z.boolean().optional(),
});

/**
 * TypeScript types inferred from Zod schemas
 */
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type GetUserByMailInput = z.infer<typeof GetUserByMailSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
