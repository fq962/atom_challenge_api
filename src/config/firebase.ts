import admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";
import dotenv from "dotenv";

/**
 * Firebase Admin SDK configuration
 * Initializes Firebase Admin SDK with service account credentials
 */

/**
 * Load environment variables before using them
 */
dotenv.config();

/**
 * Validate required environment variables
 * Ensures all Firebase credentials are present
 */
if (
  !process.env.FIREBASE_PROJECT_ID ||
  !process.env.FIREBASE_PRIVATE_KEY ||
  !process.env.FIREBASE_CLIENT_EMAIL
) {
  throw new Error(
    "Missing Firebase environment variables. Check your .env file"
  );
}

/**
 * Firebase Admin SDK service account configuration
 * Creates service account object from environment variables
 */
const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

/**
 * Initialize Firebase Admin SDK
 * Only initializes if not already initialized to prevent conflicts
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

/**
 * Firestore database instance
 * Pre-configured database connection for the application
 */
export const db = admin.firestore();

/**
 * Firebase Auth instance
 * Authentication service for user management
 */
export const auth = admin.auth();

/**
 * Firebase Admin SDK instance
 * Main Firebase Admin SDK object
 */
export default admin;
