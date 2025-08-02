import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const taskController = new TaskController();

// GET /tasks - Obtener todas las tareas o las tareas de un usuario específico (protegido)
router.get("/", authMiddleware, taskController.getAllTasks);

// POST /tasks - Crear una nueva tarea (protegido)
router.post("/", authMiddleware, taskController.createTask);

// PUT /tasks/:id - Actualizar una tarea específica (protegido)
router.put("/:id", authMiddleware, taskController.updateTask);

// DELETE /tasks/:id - Eliminar una tarea específica (protegido)
router.delete("/:id", authMiddleware, taskController.deleteTask);

export default router;
