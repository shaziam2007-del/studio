// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  projectId: "timeforge-r3oej",
  appId: "1:587194046579:web:7cf5e7d2301e637c36f206",
  storageBucket: "timeforge-r3oej.firebasestorage.app",
  apiKey: "AIzaSyCse0aVTea2gDUBdmHlKwu118Lf904SBqs",
  authDomain: "timeforge-r3oej.firebaseapp.com",
  messagingSenderId: "587194046579",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
