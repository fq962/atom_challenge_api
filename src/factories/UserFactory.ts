import { User, CreateUserDto } from "../types/User";

/**
 * Factory for User entity creation and validation
 * Handles user data transformation and email validation
 */
export class UserFactory {
  /**
   * Create User from CreateUserDto
   * @param createUserDto User creation data
   * @returns User object without ID
   * @throws Error on invalid email format or validation failure
   */
  static createFromDto(createUserDto: CreateUserDto): Omit<User, "id"> {
    return {
      mail: this.validateAndNormalizeEmail(createUserDto.mail),
    };
  }

  /**
   * Create User from Firestore document data
   * @param id Document ID
   * @param data Firestore document data
   * @returns Complete User object
   */
  static createFromFirestore(id: string, data: any): User {
    return {
      id,
      mail: this.validateAndNormalizeEmail(data.mail || data.email || ""),
    };
  }

  /**
   * Create complete User with generated ID
   * @param id Generated user ID
   * @param createUserDto User creation data
   * @returns Complete User object
   */
  static createComplete(id: string, createUserDto: CreateUserDto): User {
    const userData = this.createFromDto(createUserDto);
    return {
      id,
      ...userData,
    };
  }

  /**
   * Create Firestore document data from DTO
   * @param createUserDto User creation data
   * @returns Firestore-ready data object
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
   * Check if two users are the same
   * @param user1 First user
   * @param user2 Second user
   * @returns True if users match by ID or email
   */
  static isSameUser(user1: User, user2: User): boolean {
    return (
      user1.id === user2.id ||
      this.normalizeEmail(user1.mail) === this.normalizeEmail(user2.mail)
    );
  }

  /**
   * Create user object for authentication response
   * @param user Complete user object
   * @returns User data safe for client response
   */
  static createAuthUser(user: User): { id: string; mail: string } {
    return {
      id: user.id,
      mail: user.mail,
    };
  }

  /**
   * Check if email matches (normalized comparison)
   * @param userEmail User's email
   * @param searchEmail Email to search for
   * @returns True if emails match after normalization
   */
  static emailMatches(userEmail: string, searchEmail: string): boolean {
    return this.normalizeEmail(userEmail) === this.normalizeEmail(searchEmail);
  }

  // Private validation methods

  /**
   * Validate and normalize email address
   * @param email Email to validate
   * @returns Normalized valid email
   * @throws Error on invalid email format or validation failure
   */
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

  /**
   * Normalize email to lowercase and trim whitespace
   * @param email Email to normalize
   * @returns Normalized email
   */
  private static normalizeEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  /**
   * Validate email format using RFC 5322 regex
   * @param email Email to validate
   * @returns True if email format is valid
   */
  private static isValidEmailFormat(email: string): boolean {
    // Regex básico para validación de email según RFC 5322 simplificado
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
  }
}
