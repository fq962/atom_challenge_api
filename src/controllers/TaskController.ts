import { Request, Response } from "express";
import { TaskService } from "../services/TaskService";

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

      const { userId } = req.query;
      const authenticatedUserId = req.user.uid;

      let tasks;

      // Si se especifica un userId en la query, verificar que coincida con el usuario autenticado
      if (userId && typeof userId === "string") {
        if (userId !== authenticatedUserId) {
          res.status(403).json({
            success: false,
            message:
              "No tienes permisos para acceder a las tareas de otro usuario",
            data: null,
          });
          return;
        }
        tasks = await this.taskService.getTasksByUserId(userId);
      } else {
        // Por defecto, obtener tareas del usuario autenticado
        tasks = await this.taskService.getTasksByUserId(authenticatedUserId);
      }

      res.status(200).json({
        success: true,
        message: "Tareas obtenidas exitosamente",
        data: tasks,
        count: tasks.length,
        userId: authenticatedUserId,
      });
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

      const { title, description } = req.body;
      const authenticatedUserId = req.user.uid;

      // Validaciones básicas
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        res.status(400).json({
          success: false,
          message: "El título es requerido y debe ser una cadena no vacía",
          data: null,
        });
        return;
      }

      const createTaskDto = {
        title: title.trim(),
        description: description ? description.trim() : "",
        userId: authenticatedUserId, // Usar el ID del usuario autenticado
      };

      const task = await this.taskService.createTask(createTaskDto);

      res.status(201).json({
        success: true,
        message: "Tarea creada exitosamente",
        data: task,
        userId: authenticatedUserId,
      });
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

      const { id } = req.params;
      const { title, description, status, priority } = req.body;
      const authenticatedUserId = req.user.uid;

      // Verificar que la tarea pertenece al usuario autenticado
      const existingTask = await this.taskService.getTaskById(id);
      if (!existingTask) {
        res.status(404).json({
          success: false,
          message: "Tarea no encontrada",
          data: null,
        });
        return;
      }

      if (existingTask.userId !== authenticatedUserId) {
        res.status(403).json({
          success: false,
          message: "No tienes permisos para actualizar esta tarea",
          data: null,
        });
        return;
      }

      const updateTaskDto = {
        ...(title !== undefined && {
          title: typeof title === "string" ? title.trim() : title,
        }),
        ...(description !== undefined && {
          description:
            typeof description === "string" ? description.trim() : description,
        }),
        ...(status !== undefined && { status }),
        ...(priority !== undefined && { priority }),
      };

      const task = await this.taskService.updateTask(id, updateTaskDto);

      res.status(200).json({
        success: true,
        message: "Tarea actualizada exitosamente",
        data: task,
        userId: authenticatedUserId,
      });
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

      const { id } = req.params;
      const authenticatedUserId = req.user.uid;

      // Verificar que la tarea pertenece al usuario autenticado
      const existingTask = await this.taskService.getTaskById(id);
      if (!existingTask) {
        res.status(404).json({
          success: false,
          message: "Tarea no encontrada",
          data: null,
        });
        return;
      }

      if (existingTask.userId !== authenticatedUserId) {
        res.status(403).json({
          success: false,
          message: "No tienes permisos para eliminar esta tarea",
          data: null,
        });
        return;
      }

      const deleted = await this.taskService.deleteTask(id);

      res.status(200).json({
        success: true,
        message: "Tarea eliminada exitosamente",
        data: null,
        userId: authenticatedUserId,
      });
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
