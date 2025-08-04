import { db } from "../config/firebase";
import { Task, CreateTaskDto, UpdateTaskDto } from "../types/Task";
import { TaskFactory } from "../factories/TaskFactory";
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
        const task = TaskFactory.createFromFirestore(doc.id, data);
        tasks.push(task);
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
      console.log("userId", userId);

      // Crear la referencia del documento del usuario
      const userRef = db.collection("users").doc(userId);
      console.log("Buscando tareas para userRef:", userRef.path);
      console.log("userRef", userRef);
      const snapshot: QuerySnapshot<DocumentData> = await this.collection
        .where("id_user", "==", userRef)
        .get();

      console.log("Documentos encontrados:", snapshot.size);
      const tasks: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const task = TaskFactory.createFromFirestore(doc.id, data);
        tasks.push(task);
      });

      // Ordenar manualmente por fecha de creación (más recientes primero)
      tasks.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      return tasks;
    } catch (error) {
      console.error("Error al obtener las tareas del usuario:", error);
      throw new Error("No se pudieron obtener las tareas del usuario");
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const userRef = db
        .collection("users")
        .doc(createTaskDto.id_user.toString());

      // Usar factory para crear los datos de la tarea
      const taskData = TaskFactory.createFromDto({
        ...createTaskDto,
        id_user: userRef, // Usar referencia para Firestore
      });

      const docRef = await this.collection.add(taskData);

      // Usar factory para crear la tarea completa
      return TaskFactory.createComplete(docRef.id, createTaskDto);
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

      // Usar factory para crear los datos de actualización
      const updateData = TaskFactory.createFirestoreUpdateData(updateTaskDto);

      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      const data = updatedDoc.data()!;

      // Usar factory para crear la tarea desde Firestore
      return TaskFactory.createFromFirestore(updatedDoc.id, data);
    } catch (error) {
      console.error("Error al actualizar la tarea:", error);
      throw new Error("No se pudo actualizar la tarea");
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
