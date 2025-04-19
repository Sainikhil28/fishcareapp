// firebaseConfig.js

// Firebase SDK imports
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; // Realtime Database

// ✅ Your Firebase configuration object
const firebaseConfig = {
  apiKey: "-",
  authDomain: "-",
  databaseURL: "-", // Realtime DB
  projectId: "-",
  storageBucket: "-",
  messagingSenderId: "-",
  appId: "1:147448473668:web:cc7e475fa5094f046af411",
  measurementId: "G-VKSNK36X2F"
};

// ✅ Initialize Firebase App
const app = initializeApp(firebaseConfig);

// ✅ Initialize Firebase Services
const auth = getAuth(app);             // Authentication
const db = getFirestore(app);          // Firestore Database
const dbRealtime = getDatabase(app);   // Realtime Database
const storage = getStorage(app);       // Cloud Storage

// ✅ Export initialized services
export { app, auth, db, dbRealtime, storage };
