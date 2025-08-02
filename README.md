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

### Usuarios (Authentication)

- **GET** `/api/users/:mail` - Verificar si un usuario existe (login)
- **POST** `/api/users` - Crear nuevo usuario

### Tareas (Protegidas con autenticación)

- **GET** `/api/tasks` - Obtener todas las tareas del usuario autenticado
- **GET** `/api/tasks?userId={userId}` - Obtener tareas de un usuario específico (debe coincidir con el usuario autenticado)
- **POST** `/api/tasks` - Crear nueva tarea
- **PUT** `/api/tasks/:id` - Actualizar tarea existente (solo si pertenece al usuario autenticado)
- **DELETE** `/api/tasks/:id` - Eliminar tarea (solo si pertenece al usuario autenticado)

## 🔒 Autenticación con Firebase

### Headers requeridos para rutas protegidas

```
Authorization: Bearer <firebase_id_token>
```

### Obtener token de Firebase (Frontend)

```javascript
import { auth } from "./firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";

// Autenticar usuario
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const token = await userCredential.user.getIdToken();

// Usar el token en las peticiones
const response = await fetch("/api/tasks", {
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
});
```

## 📋 Ejemplos de Uso

### 1. Verificar si un usuario existe (Login)

```bash
curl -X GET http://localhost:3000/api/users/usuario@ejemplo.com
```

**Respuesta si existe:**

```json
{
  "success": true,
  "message": "Usuario encontrado",
  "data": {
    "id": "user-id-123",
    "mail": "usuario@ejemplo.com",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "exists": true
}
```

### 2. Crear nuevo usuario

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "mail": "nuevo@ejemplo.com"
  }'
```

### 3. Obtener tareas del usuario autenticado

```bash
curl -X GET http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <firebase_id_token>"
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
      "status": false,
      "priority": 0,
      "created_at": "2024-01-15T10:30:00.000Z",
      "userId": "firebase-uid-123"
    }
  ],
  "count": 1,
  "userId": "firebase-uid-123"
}
```

### 4. Crear nueva tarea (autenticado)

```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <firebase_id_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Nueva tarea",
    "description": "Descripción de la tarea"
  }'
```

### 5. Actualizar tarea (autenticado)

```bash
curl -X PUT http://localhost:3000/api/tasks/task-id-123 \
  -H "Authorization: Bearer <firebase_id_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "status": true
  }'
```

### 6. Eliminar tarea (autenticado)

```bash
curl -X DELETE http://localhost:3000/api/tasks/task-id-123 \
  -H "Authorization: Bearer <firebase_id_token>"
```

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

## 🔒 Seguridad Implementada

### ✅ Autenticación con Tokens
- **Firebase Authentication**: Validación de tokens JWT de Firebase
- **Middleware de autenticación**: Protección automática de rutas
- **Manejo de errores**: Códigos específicos para diferentes tipos de errores de token

### ✅ Seguridad Adicional
- **Helmet**: Protección contra vulnerabilidades comunes
- **CORS**: Configurado para permitir orígenes específicos con credenciales
- **Validación de datos**: Validación estricta en controladores y servicios
- **Variables de entorno**: Credenciales sensibles protegidas
- **Autorización**: Verificación de propiedad de recursos (tareas)

### 🔐 Códigos de Error de Autenticación
- `MISSING_TOKEN`: Token de autorización no proporcionado
- `INVALID_TOKEN_FORMAT`: Formato de token incorrecto
- `TOKEN_EXPIRED`: Token expirado
- `TOKEN_REVOKED`: Token revocado
- `USER_NOT_FOUND`: Usuario no encontrado
- `USER_DISABLED`: Usuario deshabilitado

## ✅ Challenge Completado

### 🎯 Implementación Realizada

- [x] **Endpoints para usuarios** (`GET /api/users/:mail`, `POST /api/users`, `GET /api/users/me`)
- [x] **Middleware de autenticación** con Firebase JWT
- [x] **Protección de rutas** con tokens
- [x] **Validación de datos** en todas las capas
- [x] **Manejo de errores** estructurado
- [x] **Autorización por usuario** (cada usuario solo ve sus tareas)
- [x] **Arquitectura en capas** (Controller -> Service -> Repository)
- [x] **Seguridad robusta** con múltiples validaciones

### 🔄 Mejoras Opcionales Futuras

- [ ] Tests unitarios e integración
- [ ] Rate limiting
- [ ] Logging estructurado con Winston
- [ ] Documentación con Swagger/OpenAPI
- [ ] Métricas y monitoreo
- [ ] Cache con Redis

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
```
