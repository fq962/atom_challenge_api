import { Router } from "express";
import { TaskController } from "../controllers/TaskController";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  validateBody,
  validateQuery,
} from "../middleware/validationMiddleware";
import {
  CreateTaskSchema,
  UpdateTaskSchema,
  DeleteTaskSchema,
  GetTasksByUserSchema,
} from "../schemas/taskSchemas";

const router = Router();
const taskController = new TaskController();

// GET /tasks - Obtener todas las tareas o las tareas de un usuario específico (protegido)
router.get(
  "/",
  authMiddleware,
  validateQuery(GetTasksByUserSchema),
  taskController.getAllTasks
);

// POST /tasks - Crear una nueva tarea (protegido)
router.post(
  "/",
  authMiddleware,
  validateBody(CreateTaskSchema),
  taskController.createTask
);

// PATCH /tasks - Actualizar una tarea específica (protegido) - ID va en body
router.patch(
  "/",
  authMiddleware,
  validateBody(UpdateTaskSchema),
  taskController.updateTask
);

// DELETE /tasks - Eliminar una tarea específica (protegido)
router.delete(
  "/",
  authMiddleware,
  validateBody(DeleteTaskSchema),
  taskController.deleteTask
);

export default router;
