import { db } from "../config/firebase";
import { User, CreateUserDto } from "../types/User";
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from "firebase-admin/firestore";

export class UserRepository {
  private readonly collection: CollectionReference<DocumentData>;

  constructor() {
    this.collection = db.collection("users");
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const snapshot: QuerySnapshot<DocumentData> = await this.collection
        .where("email", "==", email)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        email: data.email || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error("Error al obtener usuario por email:", error);
      throw new Error("No se pudo obtener el usuario");
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      const doc = await this.collection.doc(id).get();

      if (!doc.exists) {
        return null;
      }

      const data = doc.data()!;

      return {
        id: doc.id,
        email: data.email || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
      throw new Error("No se pudo obtener el usuario");
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const now = new Date();
      const userData = {
        email: createUserDto.email,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await this.collection.add(userData);

      return {
        id: docRef.id,
        email: userData.email,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
      };
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw new Error("No se pudo crear el usuario");
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const snapshot: QuerySnapshot<DocumentData> = await this.collection
        .orderBy("createdAt", "desc")
        .get();

      const users: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        users.push({
          id: doc.id,
          email: data.email || "",
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
        });
      });

      return users;
    } catch (error) {
      console.error("Error al obtener todos los usuarios:", error);
      throw new Error("No se pudieron obtener los usuarios");
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return null;
      }

      const dataToUpdate = {
        ...updateData,
        updatedAt: new Date(),
      };

      // Remover campos que no deben actualizarse directamente
      delete dataToUpdate.id;
      delete dataToUpdate.createdAt;

      await docRef.update(dataToUpdate);

      const updatedDoc = await docRef.get();
      const data = updatedDoc.data()!;

      return {
        id: updatedDoc.id,
        email: data.email || "",
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
      };
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
      throw new Error("No se pudo actualizar el usuario");
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists) {
        return false;
      }

      await docRef.delete();
      return true;
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw new Error("No se pudo eliminar el usuario");
    }
  }
}
