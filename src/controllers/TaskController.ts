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

      const { id_user } = req.query;
      const authenticatedUserId = req.user.id_user;

      let tasks;
      console.log("authenticatedUserId", req.user);
      console.log("id_user", id_user);
      // Si se especifica un userId en la query, verificar que coincida con el usuario autenticado
      if (id_user && typeof id_user === "string") {
        if (id_user !== authenticatedUserId) {
          res.status(403).json({
            success: false,
            message:
              "No tienes permisos para acceder a las tareas de otro usuario",
            data: null,
            id_user: authenticatedUserId,
          });
          return;
        }
        tasks = await this.taskService.getTasksByUserId(id_user);
      } else {
        // Por defecto, obtener tareas del usuario autenticado
        tasks = await this.taskService.getTasksByUserId(authenticatedUserId);
      }

      res.status(200).json({
        success: true,
        message: "Tareas obtenidas exitosamente",
        data: tasks,
        count: tasks.length,
        id_user: authenticatedUserId,
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

      const { title, description, priority } = req.body;
      const authenticatedUserId = req.user.id_user;

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
        priority: priority,
        id_user: authenticatedUserId, // Usar el ID del usuario autenticado
      };

      const task = await this.taskService.createTask(createTaskDto);

      res.status(201).json({
        success: true,
        message: "Tarea creada exitosamente",
        data: task,
        id_user: authenticatedUserId,
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

      const { id, title, description, is_done, priority } = req.body;
      const authenticatedUserId = req.user.id_user;

      // Validar que el ID esté presente
      if (!id || typeof id !== "string") {
        res.status(400).json({
          success: false,
          message: "ID de la tarea es requerido",
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
        ...(is_done !== undefined && { is_done }),
        ...(priority !== undefined && { priority }),
      };

      const task = await this.taskService.updateTask(id, updateTaskDto);

      res.status(200).json({
        success: true,
        message: "Tarea actualizada exitosamente",
        data: task,
        id_user: authenticatedUserId,
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

      const { id } = req.body;
      const authenticatedUserId = req.user.id_user;

      await this.taskService.deleteTask(id);

      res.status(200).json({
        success: true,
        message: "Tarea eliminada exitosamente",
        data: null,
        id_user: authenticatedUserId,
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
