import { db } from "../config/firebase";
import { User, CreateUserDto } from "../types/User";
import { UserFactory } from "../factories/UserFactory";
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

      // Usar factory para crear el usuario desde Firestore
      return UserFactory.createFromFirestore(doc.id, data);
    } catch (error) {
      console.error("Error al obtener usuario por mail:", error);
      throw new Error("No se pudo obtener el usuario");
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Usar factory para crear los datos de Firestore
      const userData = UserFactory.createFirestoreData(createUserDto);

      const docRef = await this.collection.add(userData);

      // Usar factory para crear el usuario completo
      return UserFactory.createComplete(docRef.id, createUserDto);
    } catch (error) {
      console.error("Error al crear usuario:", error);
      throw new Error("No se pudo crear el usuario");
    }
  }
}
