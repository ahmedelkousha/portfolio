import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration from user request
const firebaseConfig = {
  apiKey: "AIzaSyCQvlMpAe4n-WgnSQnrbvjkyRKebxK8Xg0",
  authDomain: "myportfolio-54.firebaseapp.com",
  projectId: "myportfolio-54",
  storageBucket: "myportfolio-54.firebasestorage.app",
  messagingSenderId: "517655012676",
  appId: "1:517655012676:web:2b881d14963ec21fc02311",
  measurementId: "G-841PMS4TFH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics is only supported in browser environments
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
