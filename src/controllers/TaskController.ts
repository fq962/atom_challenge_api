import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { ResponseFactory } from "../factories/ResponseFactory";
import {
  CreateTaskInput,
  UpdateTaskInput,
  DeleteTaskInput,
  GetTasksByUserInput,
} from "../schemas/taskSchemas";

/**
 * Task management controller
 * Handles CRUD operations for user tasks with auth validation
 */
export class TaskController {
  private readonly taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  /**
   * GET /api/tasks - Retrieve user tasks with statistics
   * @param req.user - Authenticated user from JWT middleware
   * @param req.query.id_user - Optional user ID (must match authenticated user)
   * @returns Task list with count, completed, and pending stats
   * @throws 401 - Not authenticated, 403 - Unauthorized access
   */
  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          data: null,
        });
        return;
      }

      const { id_user } = req.query as GetTasksByUserInput;
      const authenticatedUserId = req.user.id_user;

      // If userId is specified in query, verify it matches authenticated user
      if (id_user && id_user !== authenticatedUserId) {
        res.status(403).json({
          success: false,
          message: "You don't have permission to access another user's tasks",
          data: null,
          id_user: authenticatedUserId,
        });
        return;
      }

      // Use userId from query if present, otherwise use authenticated user's ID
      const targetUserId = id_user || authenticatedUserId;
      const taskResponses = await this.taskService.getTasksByUserId(
        targetUserId
      );

      // Convert TaskResponse[] back to Task[] for metadata calculation
      const tasksForStats = taskResponses.map((tr) => ({
        ...tr,
        created_at: new Date(tr.created_at),
        id_user: targetUserId,
      }));

      const response = ResponseFactory.createTasksWithMetadata(
        tasksForStats,
        authenticatedUserId,
        "Tasks retrieved successfully"
      );

      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Internal server error",
        data: null,
      });
    }
  };

  /**
   * POST /api/tasks - Create new task
   * @param req.body - Task data (title, description?, priority?) - Zod validated
   * @param req.user - User ID extracted from JWT token, not from body
   * @returns Created task with metadata
   * @throws 401 - Not authenticated, 400 - Validation error
   */
  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          data: null,
        });
        return;
      }

      // Data is already validated by Zod middleware (without id_user)
      const { title, description, priority } = req.body as CreateTaskInput;
      const authenticatedUserId = req.user.id_user;

      // Create complete DTO with id_user from token
      const createTaskDto = {
        title,
        description: description || "",
        priority: priority || 0,
        id_user: authenticatedUserId, // Comes from JWT token, not from body
      };

      const taskResponse = await this.taskService.createTask(createTaskDto);

      // Create Task for ResponseFactory
      const task = {
        ...taskResponse,
        created_at: new Date(taskResponse.created_at),
        id_user: authenticatedUserId,
      };

      const response = ResponseFactory.createTaskCreatedResponse(
        task,
        authenticatedUserId
      );
      res.status(201).json(response);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Error creating task",
        data: null,
      });
    }
  };

  /**
   * PATCH /api/tasks - Update existing task
   * @param req.body - Partial task data (id required, title?, description?, is_done?, priority?)
   * @param req.user - Task ownership validated against authenticated user
   * @returns Updated task or 404 if not found
   * @throws 401 - Not authenticated, 404 - Task not found
   */
  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          data: null,
        });
        return;
      }

      // Data is already validated by Zod middleware
      const { id, title, description, is_done, priority } =
        req.body as UpdateTaskInput;
      const authenticatedUserId = req.user.id_user;

      const updateTaskDto = {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(is_done !== undefined && { is_done }),
        ...(priority !== undefined && { priority }),
      };

      const taskResponse = await this.taskService.updateTask(id, updateTaskDto);

      if (!taskResponse) {
        const response = ResponseFactory.createTaskNotFoundResponse();
        res.status(404).json(response);
        return;
      }

      // Create Task for ResponseFactory
      const task = {
        ...taskResponse,
        created_at: new Date(taskResponse.created_at),
        id_user: authenticatedUserId,
      };

      const response = ResponseFactory.createTaskUpdatedResponse(
        task,
        authenticatedUserId
      );
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Error updating task",
        data: null,
      });
    }
  };

  /**
   * DELETE /api/tasks - Remove task permanently
   * @param req.body.id - Task ID to delete
   * @param req.user - Task ownership validated against authenticated user
   * @returns Success confirmation or 404 if not found
   * @throws 401 - Not authenticated, 404 - Task not found
   */
  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "User not authenticated",
          data: null,
        });
        return;
      }

      // Data is already validated by Zod middleware
      const { id } = req.body as DeleteTaskInput;
      const authenticatedUserId = req.user.id_user;

      const deleted = await this.taskService.deleteTask(id);

      if (!deleted) {
        const response = ResponseFactory.createTaskNotFoundResponse();
        res.status(404).json(response);
        return;
      }

      const response =
        ResponseFactory.createTaskDeletedResponse(authenticatedUserId);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : "Error deleting task",
        data: null,
      });
    }
  };
}
