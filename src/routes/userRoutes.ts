import { Router } from "express";
import { UserController } from "../controllers/UserController";
import {
  validateBody,
  validateParams,
} from "../middleware/validationMiddleware";
import { CreateUserSchema, GetUserByMailSchema } from "../schemas/userSchemas";

const router = Router();
const userController = new UserController();

// GET /users/:mail - Verificar si un usuario existe (público)
router.get(
  "/:mail",
  validateParams(GetUserByMailSchema),
  userController.getUserByMail
);

// POST /users - Crear un nuevo usuario (público)
router.post("/", validateBody(CreateUserSchema), userController.createUser);

export default router;
