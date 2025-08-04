import { Router } from "express";
import { UserController } from "../controllers/UserController";
import {
  validateBody,
  validateParams,
} from "../middleware/validationMiddleware";
import { CreateUserSchema, GetUserByMailSchema } from "../schemas/userSchemas";

/**
 * User routes configuration
 * Defines public endpoints for user authentication and registration
 */

const router = Router();
const userController = new UserController();

/**
 * GET /users/:mail - Check if user exists (public)
 * Validates user email and returns JWT token if user exists
 */
router.get(
  "/:mail",
  validateParams(GetUserByMailSchema),
  userController.getUserByMail
);

/**
 * POST /users - Create new user (public)
 * Registers new user and returns JWT token
 */
router.post("/", validateBody(CreateUserSchema), userController.createUser);

export default router;
