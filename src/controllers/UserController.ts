import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { generateToken } from "../utils/jwtUtils";
import { ResponseFactory } from "../factories/ResponseFactory";
import { CreateUserInput, GetUserByMailInput } from "../schemas/userSchemas";

/**
 * User authentication controller
 * Handles login/register flow with JWT token generation
 */
export class UserController {
  private readonly userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  /**
   * GET /api/users/:mail - Login by email verification
   * @param req.params.mail - Email address (Zod validated)
   * @returns JWT token if user exists, 404 if not found
   * @throws 400 - Invalid email format, 404 - User not found
   */
  getUserByMail = async (req: Request, res: Response): Promise<void> => {
    try {
      // Data is already validated by Zod middleware
      const { mail } = req.params as GetUserByMailInput;

      const user = await this.userService.getUserByMail(mail);

      if (!user) {
        const response = ResponseFactory.createUserNotFoundResponse();
        res.status(404).json(response);
        return;
      }

      // Generate JWT token for the user
      const token = generateToken({
        id_user: user.id,
        mail: user.mail,
      });

      const response = ResponseFactory.createAuthResponse(
        user,
        token,
        true,
        "User found successfully"
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
      });
    }
  };

  /**
   * POST /api/users - Register/Login unified endpoint
   * @param req.body.mail - Email address (Zod validated)
   * @returns JWT token for new or existing user with exists flag
   * @throws 400 - Invalid email or creation error
   */
  createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Data is already validated by Zod middleware
      const { mail } = req.body as CreateUserInput;

      // Check if user already exists
      const existingUser = await this.userService.getUserByMail(mail);
      if (existingUser) {
        // If user exists, generate token for them
        const token = generateToken({
          id_user: existingUser.id,
          mail: existingUser.mail,
        });

        const response = ResponseFactory.createAuthResponse(
          existingUser,
          token,
          true,
          "User already exists"
        );
        res.status(200).json(response);
        return;
      }

      const createUserDto = { mail };
      const user = await this.userService.createUser(createUserDto);

      // Generate JWT token for the new user
      const token = generateToken({
        id_user: user.id,
        mail: user.mail,
      });

      const response = ResponseFactory.createAuthResponse(
        user,
        token,
        false,
        "User created successfully"
      );
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Error creating user",
      });
    }
  };
}
