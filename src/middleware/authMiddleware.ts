import { Request, Response, NextFunction } from "express";
import { auth } from "../config/firebase";
import { DecodedIdToken } from "firebase-admin/auth";

// Extender el tipo Request para incluir usuario autenticado
declare global {
  namespace Express {
    interface Request {
      user?: DecodedIdToken;
    }
  }
}

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
      // Verificar el token con Firebase Auth
      const decodedToken = await auth.verifyIdToken(token);

      // Verificar que el token no haya expirado
      const currentTime = Math.floor(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        res.status(401).json({
          success: false,
          message: "Token expirado",
          code: "TOKEN_EXPIRED",
        });
        return;
      }

      // Agregar información del usuario al request
      req.user = decodedToken;

      next();
    } catch (error: any) {
      console.error("Error al verificar token:", error);

      // Manejar diferentes tipos de errores de token
      let message = "Token inválido";
      let code = "INVALID_TOKEN";

      if (error.code === "auth/id-token-expired") {
        message = "Token expirado";
        code = "TOKEN_EXPIRED";
      } else if (error.code === "auth/id-token-revoked") {
        message = "Token revocado";
        code = "TOKEN_REVOKED";
      } else if (error.code === "auth/user-not-found") {
        message = "Usuario no encontrado";
        code = "USER_NOT_FOUND";
      } else if (error.code === "auth/user-disabled") {
        message = "Usuario deshabilitado";
        code = "USER_DISABLED";
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

// Middleware opcional para rutas que pueden funcionar con o sin autenticación
export const optionalAuthMiddleware = async (
  req: Request,
  res: Response,
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
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
    }
  } catch (error) {
    // Si hay error en el token opcional, continuar sin usuario
    console.warn("Token opcional inválido:", error);
  }

  next();
};
