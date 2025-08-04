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

/**
 * Task routes configuration
 * Defines protected endpoints for task CRUD operations
 * All routes require JWT authentication
 */

const router = Router();
const taskController = new TaskController();

/**
 * GET /tasks - Get all tasks or user-specific tasks (protected)
 * Returns filtered tasks based on query parameters
 */
router.get(
  "/",
  authMiddleware,
  validateQuery(GetTasksByUserSchema),
  taskController.getAllTasks
);

/**
 * POST /tasks - Create new task (protected)
 * Creates task for authenticated user
 */
router.post(
  "/",
  authMiddleware,
  validateBody(CreateTaskSchema),
  taskController.createTask
);

/**
 * PATCH /tasks - Update specific task (protected)
 * Updates task identified by ID in request body
 */
router.patch(
  "/",
  authMiddleware,
  validateBody(UpdateTaskSchema),
  taskController.updateTask
);

/**
 * DELETE /tasks - Delete specific task (protected)
 * Deletes task identified by ID in request body
 */
router.delete(
  "/",
  authMiddleware,
  validateBody(DeleteTaskSchema),
  taskController.deleteTask
);

export default router;
