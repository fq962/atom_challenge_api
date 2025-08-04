import { UserRepository } from "../repositories/UserRepository";
import { User, CreateUserDto } from "../types/User";

/**
 * User business logic service
 * Handles user-related operations and business rules
 */
export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Find user by email address
   * @param mail User email (already validated by Zod middleware)
   * @returns User object if found, null otherwise
   * @throws Error when repository operation fails
   */
  async getUserByMail(mail: string): Promise<User | null> {
    try {
      // Format validation is handled by Zod middleware
      // Email is already normalized from schema
      return await this.userRepository.getUserByMail(mail);
    } catch (error) {
      console.error("Error in UserService.getUserByMail:", error);
      throw error;
    }
  }

  /**
   * Create new user with business logic validation
   * @param createUserDto User creation data (already validated by Zod middleware)
   * @returns Created User object
   * @throws Error when user already exists or creation fails
   */
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Format validation is handled by Zod middleware
      // Email is already normalized from schema

      // Check user doesn't exist (business logic validation)
      const existingUser = await this.userRepository.getUserByMail(
        createUserDto.mail
      );
      if (existingUser) {
        throw new Error("El usuario ya existe");
      }

      return await this.userRepository.createUser(createUserDto);
    } catch (error) {
      console.error("Error in UserService.createUser:", error);
      throw error;
    }
  }
}
