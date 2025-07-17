// firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC9UfkE1jFWKxroQuSY283MW6UjzzUr-3U",
  authDomain: "smarturo-a6c54.firebaseapp.com",
  databaseURL: "https://smarturo-a6c54-default-rtdb.firebaseio.com",
  projectId: "smarturo-a6c54",
  storageBucket: "smarturo-a6c54.firebasestorage.app",
  messagingSenderId: "76893139678",
  appId: "1:76893139678:web:50f09d06013c369faf884f",
  measurementId: "G-F4J4ZD62H8"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
