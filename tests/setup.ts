/**
 * Configuración global para los tests
 * Se ejecuta antes de todos los tests
 */

// Configurar variables de entorno para testing
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-jwt-secret-key";
process.env.JWT_EXPIRES_IN = "1h";

// Configurar variables de Firebase para evitar errores de inicialización
process.env.FIREBASE_PROJECT_ID = "test-project";
process.env.FIREBASE_PRIVATE_KEY =
  "-----BEGIN PRIVATE KEY-----\ntest-key\n-----END PRIVATE KEY-----\n";
process.env.FIREBASE_CLIENT_EMAIL = "test@test-project.iam.gserviceaccount.com";

// Mock Firebase antes de que cualquier módulo lo importe
jest.mock("../src/config/firebase", () => {
  const mockDb = {
    collection: jest.fn(() => ({
      where: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      get: jest.fn(),
      add: jest.fn(),
    })),
  };

  return {
    db: mockDb,
    auth: jest.fn(),
    default: {
      apps: { length: 0 },
      initializeApp: jest.fn(),
      credential: { cert: jest.fn() },
      firestore: () => mockDb,
    },
  };
});

// Mock de los repositorios para usar versiones en memoria
jest.mock("../src/repositories/UserRepository", () => {
  return require("./__mocks__/UserRepository");
});

jest.mock("../src/repositories/TaskRepository", () => {
  return require("./__mocks__/TaskRepository");
});
