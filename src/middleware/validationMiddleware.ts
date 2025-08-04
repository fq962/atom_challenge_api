import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";

/**
 * Schemas configuration for request validation
 * Defines which parts of the request to validate
 */
export interface ValidationSchemas {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
}

/**
 * Generic validation middleware factory
 * Creates middleware to validate request body, params, and query using Zod schemas
 * @param schemas Validation schemas for different parts of the request
 * @returns Express middleware function
 */
export const validate = (schemas: ValidationSchemas) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // Validar body si se proporciona schema
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      // Validar params si se proporciona schema
      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      // Validar query si se proporciona schema
      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((err) => ({
          field: err.path.join("."),
          message: err.message,
          code: err.code,
        }));

        // Si hay un solo error, usar su mensaje específico
        // Si hay múltiples errores, usar un mensaje genérico
        const mainMessage =
          errorMessages.length === 1
            ? errorMessages[0].message
            : "Error de validación";

        res.status(400).json({
          success: false,
          message: mainMessage,
          errors: errorMessages,
          details: "Los datos proporcionados no cumplen con los requisitos",
        });
        return;
      }

      // Error inesperado
      res.status(500).json({
        success: false,
        message: "Error interno del servidor durante la validación",
      });
    }
  };
};

/**
 * Body validation middleware factory
 * @param schema Zod schema for request body validation
 * @returns Express middleware function
 */
export const validateBody = (schema: ZodSchema<any>) => {
  return validate({ body: schema });
};

/**
 * Params validation middleware factory
 * @param schema Zod schema for request params validation
 * @returns Express middleware function
 */
export const validateParams = (schema: ZodSchema<any>) => {
  return validate({ params: schema });
};

/**
 * Query validation middleware factory
 * @param schema Zod schema for request query validation
 * @returns Express middleware function
 */
export const validateQuery = (schema: ZodSchema<any>) => {
  return validate({ query: schema });
};

/**
 * Format Zod validation errors consistently
 * @param error ZodError instance
 * @returns Formatted error response object
 */
export const formatValidationError = (error: ZodError) => {
  const errors = error.issues.map((err) => {
    const field = err.path.join(".") || "campo";
    let message = err.message;

    // Personalizar algunos mensajes comunes
    if (err.code === "invalid_type") {
      message = `El campo '${field}' es requerido`;
    } else if (err.code === "too_small") {
      message = `El campo '${field}' es demasiado corto`;
    } else if (err.code === "too_big") {
      message = `El campo '${field}' es demasiado largo`;
    } else if (err.message.includes("email")) {
      message = `El campo '${field}' debe ser un email válido`;
    }

    return {
      field,
      message,
      code: err.code,
    };
  });

  return {
    success: false,
    message: "Error de validación en los datos proporcionados",
    errors,
  };
};

/**
 * Global validation error handler middleware
 * Catches and formats ZodError instances
 * @param error Error instance
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 */
export const validationErrorHandler = (
  error: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (error instanceof ZodError) {
    const formattedError = formatValidationError(error);
    res.status(400).json(formattedError);
    return;
  }

  next(error);
};
