import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { generateToken } from "../utils/jwtUtils";
import { CreateUserInput, GetUserByMailInput } from "../schemas/userSchemas";

export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  // GET /users/:mail - Verificar si un usuario existe
  getUserByMail = async (req: Request, res: Response): Promise<void> => {
    try {
      // Los datos ya están validados por el middleware de Zod
      const { mail } = req.params as GetUserByMailInput;

      const user = await this.userService.getUserByMail(mail);

      if (!user) {
        res.status(404).json({
          success: false,
          message: "Usuario no encontrado",
          exists: false,
        });
        return;
      }

      // Generar token JWT para el usuario
      const token = generateToken({
        id_user: user.id,
        mail: user.mail,
      });

      res.status(200).json({
        success: true,
        message: "Usuario encontrado",
        token,
        exists: true,
      });
    } catch (error) {
      console.error("Error en getUserByMail:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
      });
    }
  };

  // POST /users - Crear un nuevo usuario
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Los datos ya están validados por el middleware de Zod
      const { mail } = req.body as CreateUserInput;

      // Verificar si el usuario ya existe
      const existingUser = await this.userService.getUserByMail(mail);
      if (existingUser) {
        // Si el usuario ya existe, generar token para él
        const token = generateToken({
          id_user: existingUser.id,
          mail: existingUser.mail,
        });

        res.status(200).json({
          success: true,
          message: "Usuario ya existe",
          token,
          exists: true,
        });
        return;
      }

      const createUserDto = { mail };
      const user = await this.userService.createUser(createUserDto);

      // Generar token JWT para el nuevo usuario
      const token = generateToken({
        id_user: user.id,
        mail: user.mail,
      });

      res.status(201).json({
        success: true,
        message: "Usuario creado exitosamente",
        token,
      });
    } catch (error) {
      console.error("Error en createUser:", error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al crear el usuario",
      });
    }
  };
}
