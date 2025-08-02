import { db } from "../config/firebase";
import { Task, CreateTaskDto, UpdateTaskDto } from "../types/Task";
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from "firebase-admin/firestore";

export class TaskRepository {
  private readonly collection: CollectionReference<DocumentData>;

  constructor() {
    this.collection = db.collection("tasks");
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      let snapshot: QuerySnapshot<DocumentData>;

      try {
        // Intentar ordenar por created_at primero
        snapshot = await this.collection.orderBy("created_at", "desc").get();
      } catch (orderError) {
        // Si falla, intentar sin ordenar
        console.log(
          "No se pudo ordenar por created_at, obteniendo sin orden:",
          orderError
        );
        snapshot = await this.collection.get();
      }

      const tasks: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          status: data.status || false,
          priority: data.priority || 0,
          created_at: data.created_at?.toDate() || new Date(),
          userId: data.userId || data.user_id || "anonymous",
        });
      });

      // Ordenar manualmente por fecha si no se pudo hacer en la consulta
      tasks.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

      return tasks;
    } catch (error) {
      console.error("Error al obtener las tareas:", error);
      throw new Error("No se pudieron obtener las tareas");
    }
  }

  async getTasksByUserId(userId: string): Promise<Task[]> {
    try {
      const snapshot: QuerySnapshot<DocumentData> = await this.collection
        .where("userId", "==", userId)
        .orderBy("created_at", "desc")
        .get();

      const tasks: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        tasks.push({
          id: doc.id,
          title: data.title || "",
          description: data.description || "",
          status: data.status || false,
          priority: data.priority || 0,
          created_at:
            data.created_at?.toDate() || data.createdAt?.toDate() || new Date(),

          userId: data.userId || data.user_id || "anonymous",
        });
      });

      return tasks;
    } catch (error) {
      console.error("Error al obtener las tareas del usuario:", error);
      throw new Error("No se pudieron obtener las tareas del usuario");
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const now = new Date();
      const taskData = {
        title: createTaskDto.title,
        description: createTaskDto.description,
        status: false, // Usar 'status' para coincidir con tu formato
        priority: 0, // Mantener ambos para compatibilidad
        created_at: now, // Usar 'created_at' para coincidir con tu formato
        userId: createTaskDto.userId,
      };

      const docRef = await this.collection.add(taskData);

      return {
        id: docRef.id,
        ...taskData,
      };
    } catch (error) {
      console.error("Error al crear la tarea:", error);
      throw new Error("No se pudo crear la tarea");
    }
  }

  async updateTask(
    id: string,
    updateTaskDto: UpdateTaskDto
  ): Promise<Task | null> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return null;
      }

      const updateData = {
        ...updateTaskDto,
      };

      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      const data = updatedDoc.data()!;

      return {
        id: updatedDoc.id,
        title: data.title || "",
        description: data.description || "",
        status: data.status || data.completed || false,
        priority: data.priority || 0,
        created_at:
          data.created_at?.toDate() || data.createdAt?.toDate() || new Date(),

        userId: data.userId || data.user_id || "anonymous",
      };
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      throw new Error("No se pudo actualizar la tarea");
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;

      return {
        id: doc.id,
        title: data.title || "",
        description: data.description || "",
        status: data.status || false,
        priority: data.priority || 0,
        created_at: data.created_at?.toDate() || new Date(),
        userId: data.userId || data.user_id || "anonymous",
      };
    } catch (error) {
      console.error("Error al obtener la tarea por ID:", error);
      throw new Error("No se pudo obtener la tarea");
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
      throw new Error("No se pudo eliminar la tarea");
    }
  }
}
