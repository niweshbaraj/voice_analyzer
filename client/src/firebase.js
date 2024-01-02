// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "voice-analyzer-b0e47.firebaseapp.com",
  projectId: "voice-analyzer-b0e47",
  storageBucket: "voice-analyzer-b0e47.appspot.com",
  messagingSenderId: "629355273569",
  appId: "1:629355273569:web:0a569387513ef161d87920"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);