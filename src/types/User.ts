/**
 * User type definitions
 * Defines interfaces for user-related data structures
 */

/**
 * User entity interface
 * Represents a complete user object with all properties
 */
export interface User {
  id: string;
  mail: string;
}

/**
 * User creation DTO interface
 * Data transfer object for user registration
 */
export interface CreateUserDto {
  mail: string;
}
