import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// Importar rutas
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";

// Importar middleware de validación
import { validationErrorHandler } from "./middleware/validationMiddleware";

// Importar factories
import { ResponseFactory } from "./factories/ResponseFactory";

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middlewares de seguridad
app.use(helmet());

// Configurar CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://atom-challenge-five.vercel.app"] // Cambiar por el dominio del frontend
        : ["http://localhost:4200", "http://localhost:3000"], // Para desarrollo
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middlewares para parsear el body
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Middleware de logging en desarrollo
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Rutas de la API
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

// Ruta de health check
app.get("/api/health", (_req, res) => {
  const response = ResponseFactory.createHealthResponse();
  res.status(200).json(response);
});

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    path: req.originalUrl,
  });
});

// Middleware de validación de errores de Zod
app.use(validationErrorHandler);

// Middleware global de manejo de errores
app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Error no manejado:", error);

    res.status(500).json({
      success: false,
      message:
        process.env.NODE_ENV === "production"
          ? "Error interno del servidor"
          : error.message,
      ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
    });
  }
);

export default app;
