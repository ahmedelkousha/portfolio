import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// Firebase configuration using environment variables with PPV_ prefix
const firebaseConfig = {
  apiKey: import.meta.env.PPV_FIREBASE_API_KEY,
  authDomain: import.meta.env.PPV_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.PPV_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.PPV_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.PPV_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.PPV_FIREBASE_APP_ID,
  measurementId: import.meta.env.PPV_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Analytics is only supported in browser environments
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
