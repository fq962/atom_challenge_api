import { User, CreateUserDto } from "../types/User";

export class UserFactory {
  /**
   * Crear un nuevo User desde un DTO de creación
   */
  static createFromDto(createUserDto: CreateUserDto): Omit<User, "id"> {
    return {
      mail: this.validateAndNormalizeEmail(createUserDto.mail),
    };
  }

  /**
   * Crear User desde datos de Firestore
   */
  static createFromFirestore(id: string, data: any): User {
    return {
      id,
      mail: this.validateAndNormalizeEmail(data.mail || data.email || ""),
    };
  }

  /**
   * Crear User completo con ID generado
   */
  static createComplete(id: string, createUserDto: CreateUserDto): User {
    const userData = this.createFromDto(createUserDto);
    return {
      id,
      ...userData,
    };
  }

  /**
   * Crear datos para Firestore desde DTO
   */
  static createFirestoreData(
    createUserDto: CreateUserDto
  ): Record<string, any> {
    return {
      mail: this.validateAndNormalizeEmail(createUserDto.mail),
      created_at: new Date(),
    };
  }

  /**
   * Verificar si dos usuarios son el mismo
   */
  static isSameUser(user1: User, user2: User): boolean {
    return (
      user1.id === user2.id ||
      this.normalizeEmail(user1.mail) === this.normalizeEmail(user2.mail)
    );
  }

  /**
   * Crear User para respuesta de autenticación
   */
  static createAuthUser(user: User): { id: string; mail: string } {
    return {
      id: user.id,
      mail: user.mail,
    };
  }

  /**
   * Verificar si un email ya existe (comparación normalizada)
   */
  static emailMatches(userEmail: string, searchEmail: string): boolean {
    return this.normalizeEmail(userEmail) === this.normalizeEmail(searchEmail);
  }

  // Métodos privados de validación y normalización

  private static validateAndNormalizeEmail(email: string): string {
    if (!email || typeof email !== "string") {
      throw new Error("El email es requerido y debe ser texto");
    }

    const normalizedEmail = this.normalizeEmail(email);

    if (!this.isValidEmailFormat(normalizedEmail)) {
      throw new Error("El formato del email no es válido");
    }

    if (normalizedEmail.length > 254) {
      throw new Error("El email es demasiado largo (máximo 254 caracteres)");
    }

    return normalizedEmail;
  }

  private static normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  private static isValidEmailFormat(email: string): boolean {
    // Regex básico para validación de email según RFC 5322 simplificado
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }
}
