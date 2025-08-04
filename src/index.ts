import app from "./app";

/**
 * Server startup and process management
 * Initializes the Express server and handles graceful shutdown
 */

/**
 * Server port configuration
 * Uses PORT environment variable or defaults to 3000
 */
const PORT = process.env.PORT || 3000;

/**
 * Start the HTTP server
 * Binds the Express app to the specified port and logs startup information
 */
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Local URL: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Tasks endpoint: http://localhost:${PORT}/api/tasks`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});

/**
 * Graceful shutdown handlers
 * Handle SIGTERM and SIGINT signals for clean server shutdown
 */

/**
 * Handle SIGTERM signal (termination request)
 */
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down server...");
  server.close(() => {
    console.log("Server closed successfully");
    process.exit(0);
  });
});

/**
 * Handle SIGINT signal (interrupt from keyboard)
 */
process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down server...");
  server.close(() => {
    console.log("Server closed successfully");
    process.exit(0);
  });
});

/**
 * Global error handlers
 * Handle unhandled promise rejections and uncaught exceptions
 */

/**
 * Handle unhandled promise rejections
 */
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled promise rejection:", promise, "Reason:", reason);
});

/**
 * Handle uncaught exceptions
 */
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
  process.exit(1);
});

export default server;
