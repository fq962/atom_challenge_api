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

  async getUserByMail(mail: string): Promise<User | null> {
    try {
      const snapshot: QuerySnapshot<DocumentData> = await this.collection
        .where("mail", "==", mail)
        .limit(1)
        .get();

      if (snapshot.empty) {
        return null;
      }

      const doc = snapshot.docs[0];
      const data = doc.data();

      return {
        id: doc.id,
        mail: data.mail || "",
      };
    } catch (error) {
      console.error("Error al obtener usuario por mail:", error);
      throw new Error("No se pudo obtener el usuario");
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      const now = new Date();
      const userData = {
        mail: createUserDto.mail,
        createdAt: now,
        updatedAt: now,
      };

      const docRef = await this.collection.add(userData);

      return {
        id: docRef.id,
        mail: userData.mail,
      };
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw new Error("No se pudo crear el usuario");
    }
  }
}
