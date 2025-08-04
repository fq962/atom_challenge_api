import { db } from "../config/firebase";
import { Task, CreateTaskDto, UpdateTaskDto } from "../types/Task";
import { TaskFactory } from "../factories/TaskFactory";
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from "firebase-admin/firestore";

/**
 * Repository for Task entity operations
 * Handles Firestore database interactions for tasks
 */
export class TaskRepository {
  private readonly collection: CollectionReference<DocumentData>;

  constructor() {
    this.collection = db.collection("tasks");
  }

  /**
   * Get all tasks from database
   * @returns Array of all tasks ordered by creation date (newest first)
   * @throws Error when database operation fails
   */
  async getAllTasks(): Promise<Task[]> {
    try {
      let snapshot: QuerySnapshot<DocumentData>;

      try {
        // Try to order by created_at first
        snapshot = await this.collection.orderBy("created_at", "desc").get();
      } catch (orderError) {
        // If ordering fails, get without order

        snapshot = await this.collection.get();
      }

      const tasks: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const task = TaskFactory.createFromFirestore(doc.id, data);
        tasks.push(task);
      });

      // Sort manually by date if query ordering failed
      tasks.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());

      return tasks;
    } catch (error) {
      throw new Error("Could not retrieve tasks");
    }
  }

  /**
   * Get tasks by user ID
   * @param userId User ID to filter tasks
   * @returns Array of user's tasks ordered by creation date (newest first)
   * @throws Error when database operation fails
   */
  async getTasksByUserId(userId: string): Promise<Task[]> {
    try {
      // Create user document reference
      const userRef = db.collection("users").doc(userId);
      const snapshot: QuerySnapshot<DocumentData> = await this.collection
        .where("id_user", "==", userRef)
        .get();

      const tasks: Task[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const task = TaskFactory.createFromFirestore(doc.id, data);
        tasks.push(task);
      });

      // Sort manually by creation date (newest first)
      tasks.sort((a, b) => b.created_at.getTime() - a.created_at.getTime());
      return tasks;
    } catch (error) {
      throw new Error("Could not retrieve user tasks");
    }
  }

  /**
   * Create new task in database
   * @param createTaskDto Task creation data
   * @returns Created Task object with generated ID
   * @throws Error when task creation fails
   */
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const userRef = db
        .collection("users")
        .doc(createTaskDto.id_user.toString());

      // Use factory to create task data
      const taskData = TaskFactory.createFromDto({
        ...createTaskDto,
        id_user: userRef, // Use reference for Firestore
      });

      const docRef = await this.collection.add(taskData);

      // Use factory to create complete task object
      return TaskFactory.createComplete(docRef.id, createTaskDto);
    } catch (error) {
      throw new Error("Could not create task");
    }
  }

  /**
   * Update existing task
   * @param id Task ID to update
   * @param updateTaskDto Task update data
   * @returns Updated Task object or null if not found
   * @throws Error when database operation fails
   */
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

      // Use factory to create update data
      const updateData = TaskFactory.createFirestoreUpdateData(updateTaskDto);

      await docRef.update(updateData);

      const updatedDoc = await docRef.get();
      const data = updatedDoc.data()!;

      // Use factory to create task from Firestore data
      return TaskFactory.createFromFirestore(updatedDoc.id, data);
    } catch (error) {
      throw new Error("Could not update task");
    }
  }

  /**
   * Delete task from database
   * @param id Task ID to delete
   * @returns True if task was deleted, false if not found
   * @throws Error when database operation fails
   */
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
      throw new Error("Could not delete task");
    }
  }
}
