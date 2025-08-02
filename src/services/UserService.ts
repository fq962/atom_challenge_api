import { UserRepository } from "../repositories/UserRepository";
import { User, CreateUserDto } from "../types/User";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserByMail(mail: string): Promise<User | null> {
    try {
      // Validaciones de negocio
      if (!mail || typeof mail !== "string") {
        throw new Error("Mail debe ser una cadena válida");
      }

      const normalizedMail = mail.toLowerCase().trim();

      // Validar formato de mail
      const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!mailRegex.test(normalizedMail)) {
        throw new Error("Formato de mail inválido");
      }

      return await this.userRepository.getUserByMail(normalizedMail);
    } catch (error) {
      console.error("Error en UserService.getUserByMail:", error);
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Validaciones de negocio
      if (!createUserDto.mail || typeof createUserDto.mail !== "string") {
        throw new Error("Mail es requerido y debe ser una cadena válida");
      }

      const normalizedMail = createUserDto.mail.toLowerCase().trim();

      // Validar formato de mail
      const mailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!mailRegex.test(normalizedMail)) {
        throw new Error("Formato de mail inválido");
      }

      // Verificar que el usuario no exista
      const existingUser = await this.userRepository.getUserByMail(
        normalizedMail
      );
      if (existingUser) {
        throw new Error("El usuario ya existe");
      }

      // Crear el usuario
      const normalizedCreateUserDto: CreateUserDto = {
        mail: normalizedMail,
      };

      return await this.userRepository.createUser(normalizedCreateUserDto);
    } catch (error) {
      console.error("Error en UserService.createUser:", error);
      throw error;
    }
  }
}
