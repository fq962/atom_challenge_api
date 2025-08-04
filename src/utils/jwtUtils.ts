import jwt from "jsonwebtoken";

/**
 * JWT utility functions
 * Handles JWT token generation, verification, and management
 */

/**
 * JWT payload interface
 * Defines the structure of JWT token payload data
 */
export interface JwtPayload {
  id_user: string;
  mail: string;
  iat?: number;
  exp?: number;
}

/**
 * JWT configuration
 * Environment variables for JWT settings with fallback defaults
 */
const JWT_SECRET =
  process.env.JWT_SECRET ||
  "tu-clave-secreta-super-segura-cambiar-en-produccion";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h";

/**
 * Generate JWT token
 * @param payload User data to include in token (without iat/exp)
 * @returns Signed JWT token string
 * @throws Error when token generation fails
 */
export const generateToken = (
  payload: Omit<JwtPayload, "iat" | "exp">
): string => {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN as any,
      issuer: "atom-challenge-api",
      audience: "atom-challenge-client",
    });
  } catch (error) {
    throw new Error("No se pudo generar el token de autenticación");
  }
};

/**
 * Verify and decode JWT token
 * @param token JWT token string to verify
 * @returns Decoded JWT payload
 * @throws Error with specific message for different JWT errors
 */
export const verifyToken = (token: string): JwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "atom-challenge-api",
      audience: "atom-challenge-client",
    }) as JwtPayload;

    return decoded;
  } catch (error: any) {
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
 * Decode token without verification (for debugging)
 * @param token JWT token string to decode
 * @returns Decoded JWT payload or null if decoding fails
 */
export const decodeToken = (token: string): JwtPayload | null => {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    return null;
  }
};

/**
 * Get token expiration date
 * @param token JWT token string
 * @returns Expiration date or null if token is invalid
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
 * Check if token is near expiry (less than 1 hour remaining)
 * @param token JWT token string to check
 * @returns True if token expires within 1 hour or is invalid
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
