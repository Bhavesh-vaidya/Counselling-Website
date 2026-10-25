import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvrk9AJnWJYNz0PGYRS-7U5wBji_BhCGo",
  authDomain: "anora-counseling.firebaseapp.com",
  projectId: "anora-counseling",
  storageBucket: "anora-counseling.firebasestorage.app",
  messagingSenderId: "616415372893",
  appId: "1:616415372893:web:389baaa85e808fa0020fb4",
  measurementId: "G-2WRVR1CB6K"
};

// Dev only: shows in the browser console which Firebase project the site is using
if (import.meta.env.DEV) {
  console.info('Firebase project:', firebaseConfig.projectId);
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export db
export const db = getFirestore(app);
