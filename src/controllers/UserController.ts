import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /users/:email - Verificar si un usuario existe
  getUserByEmail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.params;

      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email es requerido",
          data: null,
        });
        return;
      }

      // Validar formato de email básico
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: "Formato de email inválido",
          data: null,
        });
        return;
      }

      const user = await this.userService.getUserByEmail(email);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
          data: null,
          exists: false,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Usuario encontrado",
        data: user,
        exists: true,
      });
    } catch (error) {
      console.error("Error en getUserByEmail:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
        data: null,
      });
    }
  };

  // POST /users - Crear un nuevo usuario
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      if (!email) {
        res.status(400).json({
          success: false,
          message: "Email es requerido",
          data: null,
        });
        return;
      }

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(400).json({
          success: false,
          message: "Formato de email inválido",
          data: null,
        });
        return;
      }

      // Verificar si el usuario ya existe
      const existingUser = await this.userService.getUserByEmail(email);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: "El usuario ya existe",
          data: existingUser,
        });
        return;
      }

      const createUserDto = { email };
      const user = await this.userService.createUser(createUserDto);

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        data: user,
      });
    } catch (error) {
      console.error("Error en createUser:", error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al crear el usuario",
        data: null,
      });
    }
  };

  // GET /users/me - Obtener información del usuario autenticado
  getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
          data: null,
        });
        return;
      }

      const userEmail = req.user.email;
      if (!userEmail) {
        res.status(400).json({
          success: false,
          message: "Email no disponible en el token",
          data: null,
        });
        return;
      }

      const user = await this.userService.getUserByEmail(userEmail);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Usuario no encontrado en la base de datos",
          data: null,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Usuario autenticado obtenido exitosamente",
        data: user,
        tokenInfo: {
          uid: req.user.uid,
          email: req.user.email,
          emailVerified: req.user.email_verified,
        },
      });
    } catch (error) {
      console.error("Error en getCurrentUser:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
        data: null,
      });
    }
  };
}
