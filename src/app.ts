import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

// Importar rutas
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";

// Cargar variables de entorno
dotenv.config();

// Crear aplicación Express
const app = express();

// Middlewares de seguridad
app.use(helmet());

// Configurar CORS
const allowedOrigins = [
  // Desarrollo local
  "http://localhost:3000",
  "http://localhost:4200",
  "http://localhost:5173", // Vite
  "http://127.0.0.1:3000",
  "http://127.0.0.1:4200",
  "http://127.0.0.1:5173",
  // Producción - Añade tu dominio de Vercel aquí
  "https://atom-challenge-five.vercel.app/", // 👈 CAMBIA ESTO por tu dominio real
  // También permitir cualquier subdominio de vercel.app si usas deployments de preview
  /https:\/\/.*\.vercel\.app$/,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir peticiones sin origin (como aplicaciones móviles o Postman)
      if (!origin) return callback(null, true);

      // Verificar si el origin está permitido
      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (typeof allowedOrigin === "string") {
          return origin === allowedOrigin;
        }
        // Para regex patterns
        return allowedOrigin.test(origin);
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.log("CORS blocked origin:", origin);
        callback(new Error("No permitido por CORS"), false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours
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
  res.status(200).json({
    success: true,
    message: "API funcionando correctamente",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});

// Middleware para rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    path: req.originalUrl,
  });
});

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
