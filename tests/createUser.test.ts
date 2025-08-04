import request from "supertest";
import app from "../src/app";
import { UserRepository } from "../src/repositories/UserRepository";

/**
 * Tests para el endpoint de crear usuario
 * POST /api/users
 */

describe("POST /api/users - Crear Usuario", () => {
  // Limpiar datos mock antes de cada test
  beforeEach(() => {
    (UserRepository as any).clearMockData();
  });
  describe("Casos exitosos", () => {
    it("debería crear un nuevo usuario con email válido y retornar status 201", async () => {
      const userData = {
        mail: "test@example.com",
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(201);

      // Verificar estructura de respuesta
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty(
        "message",
        "User created successfully"
      );
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("exists", false);
      expect(response.body).toHaveProperty("user");

      // Verificar que el token es una string válida
      expect(typeof response.body.token).toBe("string");
      expect(response.body.token.length).toBeGreaterThan(0);

      // Verificar datos del usuario
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("mail", userData.mail);
      expect(typeof response.body.user.id).toBe("string");
    });

    it("debería manejar usuario existente y retornar status 200", async () => {
      const userData = {
        mail: "existing@example.com",
      };

      // Crear usuario la primera vez
      await request(app).post("/api/users").send(userData).expect(201);

      // Intentar crear el mismo usuario nuevamente
      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(200);

      // Verificar respuesta para usuario existente
      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "User already exists");
      expect(response.body).toHaveProperty("token");
      expect(response.body).toHaveProperty("exists", true);
      expect(response.body).toHaveProperty("user");

      // Verificar que se retorna token válido
      expect(typeof response.body.token).toBe("string");
      expect(response.body.token.length).toBeGreaterThan(0);
    });
  });

  describe("Casos de error - Validación de datos", () => {
    it("debería retornar error 400 cuando el email está vacío", async () => {
      const userData = {
        mail: "",
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    it("debería retornar error 400 cuando el email tiene formato inválido", async () => {
      const userData = {
        mail: "email-invalido",
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Formato de email inválido");
    });

    it("debería retornar error 400 cuando no se envía el campo mail", async () => {
      const userData = {};

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    it("debería retornar error 400 cuando el email es demasiado largo", async () => {
      // Crear un email que exceda el límite de 254 caracteres
      const longEmail = "a".repeat(250) + "@example.com";
      const userData = {
        mail: longEmail,
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
      expect(response.body.message).toContain("Email demasiado largo");
    });
  });

  describe("Casos de normalización de datos", () => {
    it("debería normalizar el email a lowercase", async () => {
      const userData = {
        mail: "TEST.User@EXAMPLE.COM",
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(201);

      expect(response.body.user.mail).toBe("test.user@example.com");
    });

    it("debería eliminar espacios en blanco del email", async () => {
      const userData = {
        mail: "  trimmed@example.com  ",
      };

      const response = await request(app)
        .post("/api/users")
        .send(userData)
        .expect(201);

      expect(response.body.user.mail).toBe("trimmed@example.com");
    });
  });
});
