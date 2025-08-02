import { Request, Response } from "express";
import { UserService } from "../services/UserService";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /users/:mail - Verificar si un usuario existe
  getUserByMail = async (req: Request, res: Response): Promise<void> => {
    try {
      const { mail } = req.params;

      if (!mail) {
        res.status(400).json({
          success: false,
          message: "Mail es requerido",
          data: null,
        });
        return;
      }

      // Validar formato de mail básico
      const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!mailRegex.test(mail)) {
        res.status(400).json({
          success: false,
          message: "Formato de mail inválido",
          data: null,
        });
        return;
      }

      const user = await this.userService.getUserByMail(mail);

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
      console.error("Error en getUserByMail:", error);
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
      const { mail } = req.body;

      if (!mail) {
        res.status(400).json({
          success: false,
          message: "Mail es requerido",
          data: null,
        });
        return;
      }

      // Validar formato de mail
      const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!mailRegex.test(mail)) {
        res.status(400).json({
          success: false,
          message: "Formato de mail inválido",
          data: null,
        });
        return;
      }

      // Verificar si el usuario ya existe
      const existingUser = await this.userService.getUserByMail(mail);
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: "El usuario ya existe",
          data: existingUser,
        });
        return;
      }

      const createUserDto = { mail };
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
}
