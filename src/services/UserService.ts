import { UserRepository } from "../repositories/UserRepository";
import { User, CreateUserDto } from "../types/User";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserByMail(mail: string): Promise<User | null> {
    try {
      // Las validaciones de formato ahora se hacen en el middleware de Zod
      // El mail ya viene normalizado desde el schema
      return await this.userRepository.getUserByMail(mail);
    } catch (error) {
      console.error("Error en UserService.getUserByMail:", error);
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Las validaciones de formato ahora se hacen en el middleware de Zod
      // El mail ya viene normalizado desde el schema

      // Verificar que el usuario no exista (validación de lógica de negocio)
      const existingUser = await this.userRepository.getUserByMail(
        createUserDto.mail
      );
      if (existingUser) {
        throw new Error("El usuario ya existe");
      }

      return await this.userRepository.createUser(createUserDto);
    } catch (error) {
      console.error("Error en UserService.createUser:", error);
      throw error;
    }
  }
}
