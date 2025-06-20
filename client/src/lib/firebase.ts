import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Initialize Firebase with server-provided config
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

const initializeFirebase = async () => {
  if (app) return { app, auth, db, storage };
  
  try {
    const response = await fetch('/api/firebase-config');
    const firebaseConfig = await response.json();
    
    // Validate config has required fields
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
      throw new Error('Invalid Firebase configuration');
    }
    
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log('Firebase initialized successfully');
    return { app, auth, db, storage };
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    throw error;
  }
};

// Initialize Firebase services
const getFirebaseServices = async () => {
  if (!app) {
    return await initializeFirebase();
  }
  return { app, auth, db, storage };
};

// Export promise-based services for async initialization
export const getAuth = async () => {
  const services = await getFirebaseServices();
  return services.auth;
};

export const getFirestore = async () => {
  const services = await getFirebaseServices();
  return services.db;
};

export const getStorage = async () => {
  const services = await getFirebaseServices();
  return services.storage;
};

// Export default instances for immediate use (will be null until initialized)
export { auth, db, storage };

export default app;
