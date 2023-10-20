// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-90a82.firebaseapp.com",
  projectId: "mern-estate-90a82",
  storageBucket: "mern-estate-90a82.appspot.com",
  messagingSenderId: "802746912239",
  appId: "1:802746912239:web:336093af3316f367defa1a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);