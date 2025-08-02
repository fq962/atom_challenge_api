import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";

// Cargar variables de entorno ANTES de usarlas
dotenv.config();

// Validar variables de entorno requeridas
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.FIREBASE_CLIENT_EMAIL
) {
  throw new Error(
    "Faltan variables de entorno de Firebase. Verifica tu archivo .env"
  );
}

// Configuración del SDK de Firebase Admin
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Inicializar Firebase Admin solo si no está ya inicializado
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Exportar la instancia de Firestore
export const db = admin.firestore();
export const auth = admin.auth();

export default admin;
