import { db } from "../config/firebase";
import { User, CreateUserDto } from "../types/User";
import { UserFactory } from "../factories/UserFactory";
import {
  CollectionReference,
  DocumentData,
  QuerySnapshot,
} from "firebase-admin/firestore";

/**
 * Repository for User entity operations
 * Handles Firestore database interactions for users
 */
export class UserRepository {
  private readonly collection: CollectionReference<DocumentData>;

  constructor() {
    this.collection = db.collection("users");
  }

  /**
   * Find user by email address
   * @param mail User email to search for
   * @returns User object if found, null otherwise
   * @throws Error when database operation fails
   */
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

      // Use factory to create user from Firestore data
      return UserFactory.createFromFirestore(doc.id, data);
    } catch (error) {
      throw new Error("Could not retrieve user");
    }
  }

  /**
   * Create new user in database
   * @param createUserDto User creation data
   * @returns Created User object with generated ID
   * @throws Error when user creation fails
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Use factory to create Firestore data
      const userData = UserFactory.createFirestoreData(createUserDto);

      const docRef = await this.collection.add(userData);

      // Use factory to create complete user object
      return UserFactory.createComplete(docRef.id, createUserDto);
    } catch (error) {
      throw new Error("Could not create user");
    }
  }
}
