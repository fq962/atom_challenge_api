# 🧠 Atom Challenge API

API RESTful desarrollada con **Express.js**, **TypeScript** y **Firebase Firestore** para gestionar una aplicación de lista de tareas.

## 🚀 Tecnologías Utilizadas

- **Node.js** - Runtime de JavaScript
- **Express.js** - Framework web minimalista
- **TypeScript** - Superset tipado de JavaScript
- **Firebase Firestore** - Base de datos NoSQL en tiempo real
- **Firebase Admin SDK** - SDK para operaciones del lado del servidor

## 📁 Estructura del Proyecto

```
src/
├── config/
│   └── firebase.ts          # Configuración de Firebase Admin SDK
├── controllers/
│   └── TaskController.ts    # Controladores para manejar requests HTTP
├── repositories/
│   └── TaskRepository.ts    # Capa de acceso a datos (Firestore)
├── routes/
│   └── taskRoutes.ts        # Definición de rutas de la API
├── services/
│   └── TaskService.ts       # Lógica de negocio
├── types/
│   ├── Task.ts             # Interfaces y tipos para tareas
│   └── User.ts             # Interfaces y tipos para usuarios
├── app.ts                  # Configuración de Express
└── index.ts               # Punto de entrada del servidor
```

## 🛠️ Configuración e Instalación

### 1. Clonar e instalar dependencias

```bash
# Instalar dependencias
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` basado en `.env.example` y completa con tus credenciales de Firebase:

```bash
cp .env.example .env
```

Completa las variables en `.env`:

```env
PORT=3000
NODE_ENV=development

# Credenciales de Firebase (obtener desde Firebase Console > Configuración del proyecto > Cuentas de servicio)
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_PRIVATE_KEY_ID=tu-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-private-key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=tu-client-email
FIREBASE_CLIENT_ID=tu-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
```

### 3. Configurar Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita **Firestore Database**
4. Ve a **Configuración del proyecto > Cuentas de servicio**
5. Genera una nueva clave privada
6. Copia las credenciales al archivo `.env`

## 🚀 Ejecución

### Desarrollo

```bash
# Modo desarrollo con hot reload
npm run dev
```

### Producción

```bash
# Compilar TypeScript
npm run build

# Ejecutar en producción
npm start
```

## 📡 Endpoints Disponibles

### Health Check

- **GET** `/api/health` - Verificar estado del servidor

### Tareas

- **GET** `/api/tasks` - Obtener todas las tareas
- **GET** `/api/tasks?userId={userId}` - Obtener tareas de un usuario específico
- **POST** `/api/tasks` - Crear nueva tarea
- **PUT** `/api/tasks/:id` - Actualizar tarea existente
- **DELETE** `/api/tasks/:id` - Eliminar tarea

## 📋 Ejemplos de Uso

### Obtener todas las tareas

```bash
curl -X GET http://localhost:3000/api/tasks
```

**Respuesta:**

```json
{
  "success": true,
  "message": "Tareas obtenidas exitosamente",
  "data": [
    {
      "id": "task-id-123",
      "title": "Completar proyecto",
      "description": "Finalizar la implementación del API",
      "completed": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z",
      "userId": "user-123"
    }
  ],
  "count": 1
}
```

### Crear nueva tarea

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nueva tarea",
    "description": "Descripción de la tarea",
    "userId": "user-123"
  }'
```

### Actualizar tarea

```bash
curl -X PUT http://localhost:3000/api/tasks/task-id-123 \
  -H "Content-Type: application/json" \
  -d '{
    "completed": true
  }'
```

### Eliminar tarea

```bash
curl -X DELETE http://localhost:3000/api/tasks/task-id-123
```

## 🏗️ Arquitectura

Este proyecto implementa una **arquitectura en capas** siguiendo principios de **Clean Architecture**:

1. **Controladores**: Manejan las peticiones HTTP y respuestas
2. **Servicios**: Contienen la lógica de negocio
3. **Repositorios**: Capa de acceso a datos (Firestore)
4. **Tipos**: Definiciones de interfaces y tipos TypeScript

### Principios Aplicados

- **SOLID**: Cada clase tiene una responsabilidad única
- **Dependency Injection**: Los servicios dependen de abstracciones
- **Separation of Concerns**: Lógica de negocio separada de la infraestructura
- **Type Safety**: TypeScript con tipado estricto

## 🔒 Seguridad

- **Helmet**: Protección contra vulnerabilidades comunes
- **CORS**: Configurado para permitir orígenes específicos
- **Validación**: Validación de datos de entrada
- **Variables de entorno**: Credenciales sensibles protegidas

## 📝 Próximos Pasos

Para completar el challenge, se pueden implementar:

- [ ] Endpoints para usuarios (`GET /api/users/:email`, `POST /api/users`)
- [ ] Middleware de autenticación
- [ ] Validación más robusta con bibliotecas como Joi o class-validator
- [ ] Tests unitarios e integración
- [ ] Rate limiting
- [ ] Logging estructurado
- [ ] Documentación con Swagger/OpenAPI

## 🐛 Solución de Problemas

### Error de conexión a Firestore

- Verifica que las credenciales de Firebase estén correctas
- Asegúrate de que Firestore esté habilitado en tu proyecto
- Revisa los permisos de la cuenta de servicio

### Error CORS

- Verifica que el origen del frontend esté en la lista de orígenes permitidos
- Para desarrollo, asegúrate de incluir `http://localhost:4200`

## 📄 Licencia

MIT License - consulta el archivo LICENSE para más detalles.
