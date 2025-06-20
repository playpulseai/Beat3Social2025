import { initializeApp } from "firebase/app";
import { getAuth as getFirebaseAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage as getFirebaseStorage } from "firebase/storage";

// Initialize Firebase with server config
let firebaseApp: any = null;
let firebaseAuth: any = null;
let firebaseDb: any = null;
let firebaseStorage: any = null;

const initializeFirebase = async () => {
  if (firebaseApp) return;
  
  try {
    const response = await fetch('/api/firebase-config');
    const config = await response.json();
    
    if (config.apiKey && config.projectId) {
      firebaseApp = initializeApp(config);
      firebaseAuth = getFirebaseAuth(firebaseApp);
      firebaseDb = getFirestore(firebaseApp);
      firebaseStorage = getFirebaseStorage(firebaseApp);
      console.log('Firebase initialized successfully');
    } else {
      throw new Error('Invalid Firebase configuration');
    }
  } catch (error) {
    console.warn('Firebase initialization failed:', error);
  }
};

// Initialize Firebase immediately
initializeFirebase();

export const auth = firebaseAuth;
export const db = firebaseDb;
export const storage = firebaseStorage;
