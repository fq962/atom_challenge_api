import { Request, Response, NextFunction } from "express";
import { z, ZodError, ZodSchema } from "zod";

// Tipos para especificar qué partes del request validar
export interface ValidationSchemas {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
}

// Middleware de validación genérico
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

        res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: errorMessages,
          details: "Los datos proporcionados no cumplen con los requisitos",
        });
        return;
      }

      // Error inesperado
      console.error("Error inesperado en validación:", error);
      res.status(500).json({
        success: false,
        message: "Error interno del servidor durante la validación",
      });
    }
  };
};

// Middleware específico para validar solo el body
export const validateBody = (schema: ZodSchema<any>) => {
  return validate({ body: schema });
};

// Middleware específico para validar solo los params
export const validateParams = (schema: ZodSchema<any>) => {
  return validate({ params: schema });
};

// Middleware específico para validar solo el query
export const validateQuery = (schema: ZodSchema<any>) => {
  return validate({ query: schema });
};

// Función helper para formatear errores de validación de forma consistente
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

// Middleware para manejar errores de validación de forma global
export const validationErrorHandler = (
  error: any,
  req: Request,
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
