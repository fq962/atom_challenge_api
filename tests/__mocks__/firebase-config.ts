/**
 * Mock de la configuración Firebase para tests
 * Evita conexiones reales a Firebase durante testing
 */

export const mockDb = {
  collection: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    get: jest.fn(),
    add: jest.fn(),
  })),
};

export const mockAuth = {
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
};

export const db = mockDb;
export const auth = mockAuth;

export default {
  apps: { length: 0 },
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
  firestore: () => mockDb,
  auth: () => mockAuth,
};
