import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

/**
 * Express application setup
 * Configures middleware, routes, and error handling for the API
 */

// Import routes
import taskRoutes from "./routes/taskRoutes";
import userRoutes from "./routes/userRoutes";

// Import validation middleware
import { validationErrorHandler } from "./middleware/validationMiddleware";

// Import factories
import { ResponseFactory } from "./factories/ResponseFactory";

/**
 * Load environment variables from .env file
 */
dotenv.config();

/**
 * Create Express application instance
 */
const app = express();

/**
 * Security middleware
 * Helmet helps secure Express apps by setting various HTTP headers
 */
app.use(helmet());

/**
 * CORS configuration
 * Configure Cross-Origin Resource Sharing for different environments
 */
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://atom-challenge-five.vercel.app"] // Production frontend domain
        : ["http://localhost:4200", "http://localhost:3000"], // Development
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * Body parsing middleware
 * Parse JSON and URL-encoded data with size limits
 */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/**
 * Development logging middleware
 * Log HTTP requests in non-production environments
 */
if (process.env.NODE_ENV !== "production") {
  app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

/**
 * API routes configuration
 */
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

/**
 * 404 handler for undefined routes
 * Catches all unmatched routes and returns standardized error
 */
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Endpoint no encontrado",
    path: req.originalUrl,
  });
});

/**
 * Zod validation error handler middleware
 */
app.use(validationErrorHandler);

/**
 * Global error handler middleware
 * Catches and formats all unhandled errors
 */
app.use(
  (
    error: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Unhandled error:", error);

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
