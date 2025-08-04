import { User, CreateUserDto } from "../../src/types/User";

/**
 * Mock del UserRepository para tests aislados
 * Simula operaciones de base de datos sin conexión real
 */

// Base de datos en memoria para tests
const mockUsers: User[] = [];

export class UserRepository {
  async getUserByMail(mail: string): Promise<User | null> {
    const user = mockUsers.find((user) => user.mail === mail);
    return user || null;
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser: User = {
      id: `mock-user-${Date.now()}`,
      mail: createUserDto.mail,
    };

    mockUsers.push(newUser);
    return newUser;
  }

  // Método auxiliar para limpiar la base de datos en memoria entre tests
  static clearMockData(): void {
    mockUsers.length = 0;
  }

  // Método auxiliar para obtener todos los usuarios mock (para debugging)
  static getMockData(): User[] {
    return [...mockUsers];
  }
}
