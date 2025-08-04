import { Request, Response, NextFunction } from "express";
import { verifyToken, JwtPayload } from "../utils/jwtUtils";

/**
 * Extend Express Request interface to include authenticated user
 */
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Authentication middleware for protected routes
 * Validates JWT token and attaches user data to request
 * @param req Express request object
 * @param res Express response object
 * @param next Express next function
 * @throws 401 - Missing, invalid, or expired token
 * @throws 500 - Internal server error
 */
export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        message: "Token de autorización requerido",
        code: "MISSING_TOKEN",
      });
      return;
    }

    // Verificar formato del token (Bearer <token>)
    const token = authHeader.split(" ")[1];
    if (!authHeader.startsWith("Bearer ") || !token) {
      res.status(401).json({
        success: false,
        message: "Formato de token inválido. Use: Bearer <token>",
        code: "INVALID_TOKEN_FORMAT",
      });
      return;
    }

    try {
      // Verificar el token JWT propio
      const decodedToken = verifyToken(token);

      // Agregar información del usuario al request
      req.user = decodedToken;

      next();
    } catch (error: any) {
      console.error("Error al verificar token:", error.message);

      // Manejar diferentes tipos de errores de token
      let message = "Token inválido";
      let code = "INVALID_TOKEN";

      if (error.message === "Token expirado") {
        message = "Token expirado";
        code = "TOKEN_EXPIRED";
      } else if (error.message === "Token inválido") {
        message = "Token inválido";
        code = "INVALID_TOKEN";
      } else if (error.message === "Token no válido aún") {
        message = "Token no válido aún";
        code = "TOKEN_NOT_ACTIVE";
      }

      res.status(401).json({
        success: false,
        message,
        code,
      });
      return;
    }
  } catch (error) {
    console.error("Error en middleware de autenticación:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor",
      code: "INTERNAL_ERROR",
    });
  }
};

/**
 * Optional authentication middleware for public routes
 * Attaches user data if valid token is provided, continues without user if not
 * @param req Express request object
 * @param _res Express response object (unused)
 * @param next Express next function
 */
export const optionalAuthMiddleware = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    // Si no hay token, continuar sin usuario
    next();
    return;
  }

  try {
    const token = authHeader.split(" ")[1];
    if (authHeader.startsWith("Bearer ") && token) {
      const decodedToken = verifyToken(token);
      req.user = decodedToken;
    }
  } catch (error) {
    // Si hay error en el token opcional, continuar sin usuario
    console.warn("Token opcional inválido:", error);
  }

  next();
};
