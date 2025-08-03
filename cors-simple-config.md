# Configuración Simple de CORS (Alternativa)

Si prefieres una configuración más simple, puedes usar esta en lugar de la actual:

```typescript
// Configuración CORS simple - permite todos los dominios de Vercel
app.use(
  cors({
    origin: [
      /^https:\/\/.*\.vercel\.app$/, // Cualquier dominio de Vercel
      /^http:\/\/localhost:\d+$/, // Localhost en cualquier puerto
      "http://127.0.0.1:3000",
      "http://127.0.0.1:4200",
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```

## O la más permisiva para testing:

```typescript
// SOLO PARA DESARROLLO/TESTING - NO USAR EN PRODUCCIÓN
app.use(
  cors({
    origin: "*",
    credentials: false, // Debe ser false si origin es "*"
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
```
