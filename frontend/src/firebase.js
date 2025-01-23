// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ,
  authDomain: "ghargoomti.firebaseapp.com",
  projectId: "ghargoomti",
  storageBucket: "ghargoomti.firebasestorage.app",
  messagingSenderId: "834686019924",
  appId: "1:834686019924:web:7ed1de9728dcc93274c0c1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);