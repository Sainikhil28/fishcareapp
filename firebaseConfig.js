// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database"; // Realtime DB

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDA4-ulSRpohaM81bLNnNFhYmo9Ru-QoTc",
  authDomain: "fishcareapp-6aad7.firebaseapp.com",
  databaseURL: "https://fishcareapp-6aad7-default-rtdb.firebaseio.com", // Realtime DB
  projectId: "fishcareapp-6aad7",
  storageBucket: "fishcareapp-6aad7.appspot.com",
  messagingSenderId: "147448473668",
  appId: "1:147448473668:web:cc7e475fa5094f046af411",
  measurementId: "G-VKSNK36X2F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);         // Firestore
const dbRealtime = getDatabase(app);  // Realtime DB
const storage = getStorage(app);

export { app, auth, db, dbRealtime, storage };
