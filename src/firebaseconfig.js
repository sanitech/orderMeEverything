// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3DIK9AqGwpM65eyK_1vscayztcIf1RBs",
  authDomain: "orderme-cd745.firebaseapp.com",
  projectId: "orderme-cd745",
  storageBucket: "orderme-cd745.firebasestorage.app",
  messagingSenderId: "130222970398",
  appId: "1:130222970398:web:dee6e640619b9341bb800f",
  measurementId: "G-20TPTN36D5",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const facebookProvider = new FacebookAuthProvider(app);
const googleProvider = new GoogleAuthProvider(app);

export { auth, googleProvider, db, facebookProvider, signInWithPopup, signOut };
