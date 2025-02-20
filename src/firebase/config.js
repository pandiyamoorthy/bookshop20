import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import getAuth

const firebaseConfig = {
  apiKey: "AIzaSyCgSaSgiAG1vtG85Jqvd7rk0AgJrNoGV5s",
  authDomain: "barathybooks.firebaseapp.com",
  projectId: "barathybooks",
  storageBucket: "barathybooks.firebasestorage.app",
  messagingSenderId: "851028147111",
  appId: "1:851028147111:web:e369007f62f53f8c09d482"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize auth

export { db, auth }; // Export auth


