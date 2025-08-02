import app from "./app";

const PORT = process.env.PORT || 3000;

// Iniciar el servidor
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor ejecutándose en puerto ${PORT}`);
  console.log(`📍 URL local: http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📋 Tareas endpoint: http://localhost:${PORT}/api/tasks`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || "development"}`);
});

// Manejo de cierre grácil del servidor
process.on("SIGTERM", () => {
  console.log("SIGTERM recibido, cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado correctamente");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT recibido, cerrando servidor...");
  server.close(() => {
    console.log("Servidor cerrado correctamente");
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on("unhandledRejection", (reason, promise) => {
  console.error("Promesa rechazada no manejada:", promise, "Razón:", reason);
});

process.on("uncaughtException", (error) => {
  console.error("Excepción no capturada:", error);
  process.exit(1);
});

export default server;
