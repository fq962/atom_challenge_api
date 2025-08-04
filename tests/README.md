# Tests de la API

Esta carpeta contiene los tests unitarios y de integración para la API de lista de tareas.

## Estructura de Tests

### Tests Implementados

1. **`createUser.test.ts`** - Tests para el endpoint de crear usuario

   - ✅ Creación exitosa de usuario nuevo
   - ✅ Manejo de usuario existente
   - ✅ Validación de email inválido
   - ✅ Validación de campos requeridos
   - ✅ Normalización de datos (lowercase, trim)

2. **`getTasks.test.ts`** - Tests para el endpoint de obtener tasks
   - ✅ Obtención exitosa de tasks con autenticación
   - ✅ Validación de permisos de usuario
   - ✅ Manejo de errores de autenticación (401)
   - ✅ Manejo de errores de autorización (403)
   - ✅ Validación de estructura de respuesta

## Configuración

### Dependencias de Testing

```bash
npm install --save-dev @types/jest @types/supertest jest supertest ts-jest
```

### Variables de Entorno para Tests

Los tests utilizan variables de entorno específicas definidas en `setup.ts`:

- `NODE_ENV=test`
- `JWT_SECRET=test-jwt-secret-key`
- `JWT_EXPIRES_IN=1h`

## Cómo Ejecutar los Tests

### Instalar dependencias

```bash
npm install
```

### Ejecutar todos los tests

```bash
npm test
```

### Ejecutar tests en modo watch (desarrollo)

```bash
npm run test:watch
```

### Ejecutar tests con reporte de cobertura

```bash
npm run test:coverage
```

### Ejecutar un test específico

```bash
npm test -- createUser.test.ts
npm test -- getTasks.test.ts
```

## Casos de Prueba Cubiertos

### Endpoint: POST /api/users

| Caso                 | Descripción                     | Status Esperado |
| -------------------- | ------------------------------- | --------------- |
| ✅ Usuario nuevo     | Email válido, usuario no existe | 201             |
| ✅ Usuario existente | Email válido, usuario ya existe | 200             |
| ❌ Email inválido    | Formato incorrecto              | 400             |
| ❌ Email vacío       | Campo requerido faltante        | 400             |
| ❌ Email muy largo   | Excede 254 caracteres           | 400             |

### Endpoint: GET /api/tasks

| Caso                  | Descripción                                               | Status Esperado |
| --------------------- | --------------------------------------------------------- | --------------- |
| ✅ Autenticado        | Token válido del usuario                                  | 200             |
| ✅ Con query param    | Token válido + id_user correcto                           | 200             |
| ❌ Sin token          | No se proporciona Authorization                           | 401             |
| ❌ Token inválido     | Token malformado o expirado                               | 401             |
| ❌ Formato incorrecto | No usa formato "Bearer <token>"                           | 401             |
| ❌ Otro usuario       | Token válido pero intenta acceder a tasks de otro usuario | 403             |

## Estructura de los Tests

### Organización por Describe

```typescript
describe("Endpoint Principal", () => {
  describe("Casos exitosos", () => {
    // Tests de casos felices
  });

  describe("Casos de error", () => {
    // Tests de validación y errores
  });
});
```

### Verificaciones Comunes

- Status code de respuesta HTTP
- Estructura del objeto de respuesta
- Tipos de datos correctos
- Validación de tokens JWT
- Mensajes de error apropiados

## Notas de Implementación

- Se usa **Jest** como framework de testing
- **Supertest** para testing de API endpoints
- **ts-jest** para soporte de TypeScript
- Configuración de timeout de 10 segundos por test
- **Tests completamente aislados**: Usan mocks de Firebase/Firestore, no requieren base de datos real
- **Mocks implementados**:
  - Firebase configuration mock
  - UserRepository mock con base de datos en memoria
  - TaskRepository mock con base de datos en memoria
  - Limpieza automática de datos entre tests

## Resolución de Problemas

### ✅ Problema Resuelto: Tests fallaban por Firebase

**Error anterior:** Los tests intentaban conectarse a Firebase real sin credenciales.

**Solución implementada:**

1. **Mocks de Firebase**: Configuración mock que evita conexiones reales
2. **Repositorios mockeados**: Versiones en memoria de UserRepository y TaskRepository
3. **Variables de entorno de test**: Credenciales fake para evitar errores de inicialización
4. **Limpieza automática**: Los datos mock se limpian antes de cada test

**Archivos creados para la solución:**

- `tests/__mocks__/firebase-config.ts`
- `tests/__mocks__/UserRepository.ts`
- `tests/__mocks__/TaskRepository.ts`
- Configuración actualizada en `tests/setup.ts`

Los tests ahora funcionan de manera completamente aislada sin necesidad de Firebase.
