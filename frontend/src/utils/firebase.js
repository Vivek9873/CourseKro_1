// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
    authDomain: "coursekro-b2456.firebaseapp.com",
    projectId: "coursekro-b2456",
    storageBucket: "coursekro-b2456.firebasestorage.app",
    messagingSenderId: "461294321957",
    appId: "1:461294321957:web:8950ea50ec506a7d9adacc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };