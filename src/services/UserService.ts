import { UserRepository } from "../repositories/UserRepository";
import { User, CreateUserDto } from "../types/User";

export class UserService {
  private readonly userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      // Validaciones de negocio
      if (!email || typeof email !== "string") {
        throw new Error("Email debe ser una cadena válida");
      }

      const normalizedEmail = email.toLowerCase().trim();

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        throw new Error("Formato de email inválido");
      }

      return await this.userRepository.getUserByEmail(normalizedEmail);
    } catch (error) {
      console.error("Error en UserService.getUserByEmail:", error);
      throw error;
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // Validaciones de negocio
      if (!createUserDto.email || typeof createUserDto.email !== "string") {
        throw new Error("Email es requerido y debe ser una cadena válida");
      }

      const normalizedEmail = createUserDto.email.toLowerCase().trim();

      // Validar formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(normalizedEmail)) {
        throw new Error("Formato de email inválido");
      }

      // Verificar que el usuario no exista
      const existingUser = await this.userRepository.getUserByEmail(
        normalizedEmail
      );
      if (existingUser) {
        throw new Error("El usuario ya existe");
      }

      // Crear el usuario
      const normalizedCreateUserDto: CreateUserDto = {
        email: normalizedEmail,
      };

      return await this.userRepository.createUser(normalizedCreateUserDto);
    } catch (error) {
      console.error("Error en UserService.createUser:", error);
      throw error;
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("ID debe ser una cadena válida");
      }

      return await this.userRepository.getUserById(id);
    } catch (error) {
      console.error("Error en UserService.getUserById:", error);
      throw error;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      return await this.userRepository.getAllUsers();
    } catch (error) {
      console.error("Error en UserService.getAllUsers:", error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    updateData: Partial<User>
  ): Promise<User | null> {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("ID debe ser una cadena válida");
      }

      // Si se está actualizando el email, validarlo
      if (updateData.email) {
        const normalizedEmail = updateData.email.toLowerCase().trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
          throw new Error("Formato de email inválido");
        }

        // Verificar que el nuevo email no esté en uso
        const existingUser = await this.userRepository.getUserByEmail(
          normalizedEmail
        );
        if (existingUser && existingUser.id !== id) {
          throw new Error("El email ya está en uso por otro usuario");
        }

        updateData.email = normalizedEmail;
      }

      return await this.userRepository.updateUser(id, updateData);
    } catch (error) {
      console.error("Error en UserService.updateUser:", error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      if (!id || typeof id !== "string") {
        throw new Error("ID debe ser una cadena válida");
      }

      return await this.userRepository.deleteUser(id);
    } catch (error) {
      console.error("Error en UserService.deleteUser:", error);
      throw error;
    }
  }
}
