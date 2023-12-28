// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-937a5.firebaseapp.com",
  projectId: "mern-auth-937a5",
  storageBucket: "mern-auth-937a5.appspot.com",
  messagingSenderId: "146055720123",
  appId: "1:146055720123:web:fb9c7a3c553f117d73cd9e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);