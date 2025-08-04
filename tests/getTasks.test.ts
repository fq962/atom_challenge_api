import request from "supertest";
import app from "../src/app";
import { generateToken } from "../src/utils/jwtUtils";
import { TaskRepository } from "../src/repositories/TaskRepository";

/**
 * Tests para el endpoint de obtener tasks
 * GET /api/tasks
 */

describe("GET /api/tasks - Obtener Tasks", () => {
  // Limpiar datos mock antes de cada test
  beforeEach(() => {
    (TaskRepository as any).clearMockData();
  });
  // Datos de prueba para generar tokens JWT
  const testUser = {
    id_user: "test-user-123",
    mail: "test@example.com",
  };

  const anotherUser = {
    id_user: "another-user-456",
    mail: "another@example.com",
  };

  describe("Casos exitosos", () => {
    it("debería obtener tasks del usuario autenticado con status 200", async () => {
      const token = generateToken(testUser);

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      // Verificar estructura de respuesta
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "Tasks retrieved successfully"
      );
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("id_user", testUser.id_user);

      // Verificar estructura de data (tasks directamente en data)
      expect(Array.isArray(response.body.data)).toBe(true);

      // Verificar campos adicionales fuera de data
      expect(response.body).toHaveProperty("count");
      expect(response.body).toHaveProperty("completed");
      expect(response.body).toHaveProperty("pending");

      // Verificar tipos de datos
      expect(typeof response.body.count).toBe("number");
      expect(typeof response.body.completed).toBe("number");
      expect(typeof response.body.pending).toBe("number");

      // Verificar que count = completed + pending
      expect(response.body.count).toBe(
        response.body.completed + response.body.pending
      );
    });

    it("debería obtener tasks con query parameter id_user que coincide con el usuario autenticado", async () => {
      const token = generateToken(testUser);

      const response = await request(app)
        .get("/api/tasks")
        .query({ id_user: testUser.id_user })
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body).toHaveProperty("id_user", testUser.id_user);
    });
  });

  describe("Casos de error - Autenticación", () => {
    it("debería retornar error 401 cuando no se proporciona token de autenticación", async () => {
      const response = await request(app).get("/api/tasks").expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain(
        "Token de autorización requerido"
      );
    });

    it("debería retornar error 401 cuando el token es inválido", async () => {
      const invalidToken = "token-invalido-123";

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", `Bearer ${invalidToken}`)
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Token inválido");
    });

    it("debería retornar error 401 cuando el header Authorization no tiene formato Bearer", async () => {
      const token = generateToken(testUser);

      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", token) // Sin "Bearer "
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    it("debería retornar error 401 cuando el header Authorization está vacío", async () => {
      const response = await request(app)
        .get("/api/tasks")
        .set("Authorization", "")
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("Casos de error - Autorización", () => {
    it("debería retornar error 403 cuando se intenta acceder a tasks de otro usuario", async () => {
      const token = generateToken(testUser);

      const response = await request(app)
        .get("/api/tasks")
        .query({ id_user: anotherUser.id_user }) // ID de otro usuario
        .set("Authorization", `Bearer ${token}`)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("permission");
      expect(response.body).toHaveProperty("id_user", testUser.id_user);
    });
  });

  describe("Casos de validación de query parameters", () => {
    it("debería retornar error 400 cuando id_user en query está vacío", async () => {
      const token = generateToken(testUser);

      const response = await request(app)
        .get("/api/tasks")
        .query({ id_user: "" }) // ID vacío
        .set("Authorization", `Bearer ${token}`)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });
  });
});
