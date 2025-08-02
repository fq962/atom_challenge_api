import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();
const userController = new UserController();

// GET /users/:mail - Verificar si un usuario existe (público)
router.get("/:mail", userController.getUserByMail);

// POST /users - Crear un nuevo usuario (público)
router.post("/", userController.createUser);

export default router;
