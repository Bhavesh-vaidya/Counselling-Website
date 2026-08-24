import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBn1wZZ0CJmZ9Rb0anaXars_HLJwjpUnMc",
  authDomain: "archie-counseling.firebaseapp.com",
  projectId: "archie-counseling",
  storageBucket: "archie-counseling.firebasestorage.app",
  messagingSenderId: "1037013903642",
  appId: "1:1037013903642:web:b35a1ed52ac3e897de64a3",
  measurementId: "G-MRTLR4Z76V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export db
export const db = getFirestore(app);