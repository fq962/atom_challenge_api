import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const userController = new UserController();

// GET /users/:email - Verificar si un usuario existe (público)
router.get("/:email", userController.getUserByEmail);

// POST /users - Crear un nuevo usuario (público)
router.post("/", userController.createUser);

// GET /users/me - Obtener información del usuario autenticado (protegido)
router.get("/me", authMiddleware, userController.getCurrentUser);

export default router;
