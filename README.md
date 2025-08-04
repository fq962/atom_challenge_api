# API de Lista de Tareas

API REST desarrollada con Express, TypeScript y Firebase/Firestore para gestión de tareas.

## 📋 Prerrequisitos

- **Node.js** versión 22 o superior
- **npm** (incluido con Node.js)
- Cuenta de **Firebase** con proyecto configurado

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd atom_challenge_api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\ntu-clave-privada\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=tu-service-account@tu-proyecto.iam.gserviceaccount.com
PORT=3000
```

**Nota:** Para obtener estas credenciales:

1. Ve a Firebase Console
2. Configuración del proyecto → Cuentas de servicio
3. Generar nueva clave privada
4. Descargar el archivo JSON y extraer los valores necesarios

### 4. Ejecutar el proyecto

**Modo desarrollo:**

```bash
npm run dev
```

**Modo producción:**

```bash
npm run build
npm start
```

## ✅ Verificación

Una vez iniciado el servidor, deberías ver un mensaje similar a:

```
🚀 Server running on port 3000
📍 Local URL: http://localhost:3000
🏥 Health check: http://localhost:3000/api/health
```

## 🛠️ Scripts Disponibles

- `npm run dev` - Ejecuta en modo desarrollo con recarga automática
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Ejecuta la versión compilada
- `npm run vercel-build` - Build optimizado para Vercel

## 📁 Estructura del Proyecto

```
src/
├── controllers/     # Controladores de rutas
├── services/        # Lógica de negocio
├── repositories/    # Acceso a datos
├── middleware/      # Middleware personalizado
├── routes/          # Definición de rutas
├── schemas/         # Validación con Zod
├── types/           # Tipos de TypeScript
└── utils/           # Utilidades generales
```

## 🔧 Solución de Problemas

**Error de variables de entorno:**

- Verifica que el archivo `.env` existe y tiene todas las variables requeridas
- Asegúrate de que la clave privada mantenga el formato con `\n`

**Error de conexión a Firebase:**

- Confirma que las credenciales de Firebase son correctas
- Verifica que el proyecto de Firebase está activo

**Puerto ocupado:**

- Cambia el valor de `PORT` en el archivo `.env`
- O termina el proceso que está usando el puerto 3000
