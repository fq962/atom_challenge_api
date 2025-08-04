import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";
import { ResponseFactory } from "../factories/ResponseFactory";
import { CreateTaskBodyDto } from "../types/Task";
import {
  CreateTaskInput,
  UpdateTaskInput,
  DeleteTaskInput,
  GetTasksByUserInput,
} from "../schemas/taskSchemas";

export class TaskController {
  private readonly taskService: TaskService;

  constructor() {
    this.taskService = new TaskService();
  }

  getAllTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
          data: null,
        });
        return;
      }

      const { id_user } = req.query as GetTasksByUserInput;
      const authenticatedUserId = req.user.id_user;

      // Si se especifica un userId en la query, verificar que coincida con el usuario autenticado
      if (id_user && id_user !== authenticatedUserId) {
        res.status(403).json({
          success: false,
          message:
            "No tienes permisos para acceder a las tareas de otro usuario",
          data: null,
          id_user: authenticatedUserId,
        });
        return;
      }

      // Usar el userId de la query si está presente, sino usar el del usuario autenticado
      const targetUserId = id_user || authenticatedUserId;
      const taskResponses = await this.taskService.getTasksByUserId(
        targetUserId
      );

      // Convertir TaskResponse[] a Task[] para el factory (necesario para estadísticas)
      const tasksForStats = taskResponses.map((tr) => ({
        ...tr,
        created_at: new Date(tr.created_at),
        id_user: targetUserId,
      }));

      const response = ResponseFactory.createTasksWithMetadata(
        tasksForStats,
        authenticatedUserId,
        "Tareas obtenidas exitosamente"
      );

      res.status(200).json(response);
    } catch (error) {
      console.error("Error en getAllTasks:", error);
      res.status(500).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error interno del servidor",
        data: null,
      });
    }
  };

  createTask = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
          data: null,
        });
        return;
      }

      // Los datos ya están validados por el middleware de Zod (sin id_user)
      const { title, description, priority } = req.body as CreateTaskInput;
      const authenticatedUserId = req.user.id_user;

      // Crear el DTO completo con el id_user del token
      const createTaskDto = {
        title,
        description: description || "",
        priority: priority || 0,
        id_user: authenticatedUserId, // Vienen del token JWT, no del body
      };

      const taskResponse = await this.taskService.createTask(createTaskDto);

      // Crear Task para el ResponseFactory
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
      console.error("Error en createTask:", error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al crear la tarea",
        data: null,
      });
    }
  };

  updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
          data: null,
        });
        return;
      }

      // Los datos ya están validados por el middleware de Zod
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

      // Crear Task para el ResponseFactory
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
      console.error("Error en updateTask:", error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error al actualizar la tarea",
        data: null,
      });
    }
  };

  deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          success: false,
          message: "Usuario no autenticado",
          data: null,
        });
        return;
      }

      // Los datos ya están validados por el middleware de Zod
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
      console.error("Error en deleteTask:", error);
      res.status(400).json({
        success: false,
        message:
          error instanceof Error ? error.message : "Error al eliminar la tarea",
        data: null,
      });
    }
  };
}
