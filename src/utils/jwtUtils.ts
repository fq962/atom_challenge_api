import jwt from "jsonwebtoken";

// Interfaz para el payload del JWT
export interface JwtPayload {
  id_user: string;
  mail: string;
  iat?: number;
  exp?: number;
}

// Configuración del JWT
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "tu-clave-secreta-super-segura-cambiar-en-produccion";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Generar un token JWT
 */
export const generateToken = (
  payload: Omit<JwtPayload, "iat" | "exp">
): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: "atom-challenge-api",
      audience: "atom-challenge-client",
    });
  } catch (error) {
    console.error("Error al generar token JWT:", error);
    throw new Error("No se pudo generar el token de autenticación");
  }
};

/**
 * Verificar y decodificar un token JWT
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "atom-challenge-api",
      audience: "atom-challenge-client",
    }) as JwtPayload;

    return decoded;
  } catch (error: any) {
    console.error("Error al verificar token JWT:", error.message);

    if (error.name === "TokenExpiredError") {
      throw new Error("Token expirado");
    } else if (error.name === "JsonWebTokenError") {
      throw new Error("Token inválido");
    } else if (error.name === "NotBeforeError") {
      throw new Error("Token no válido aún");
    } else {
      throw new Error("Error de verificación de token");
    }
  }
};

/**
 * Decodificar token sin verificar (para debugging)
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    console.error("Error al decodificar token:", error);
    return null;
  }
};

/**
 * Obtener tiempo de expiración de un token
 */
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = decodeToken(token);
    if (decoded && decoded.exp) {
      return new Date(decoded.exp * 1000);
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Verificar si un token está cerca de expirar (menos de 1 hora)
 */
export const isTokenNearExpiry = (token: string): boolean => {
  try {
    const expiration = getTokenExpiration(token);
    if (!expiration) return true;

    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000);
    return expiration < oneHourFromNow;
  } catch (error) {
    return true;
  }
};
