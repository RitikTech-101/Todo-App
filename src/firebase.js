// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Access Firebase config from environment variables
const firebaseConfig = {
  apiKey: "AIzaSyC4MmYRqdpl9Ew5aX4iW20h3NeMdhdd5P4",
  authDomain: "todo-app-92a7d.firebaseapp.com",
  projectId: "todo-app-92a7d",
  storageBucket: "todo-app-92a7d.firebasestorage.app",
  messagingSenderId: "664812526014",
  appId: "1:664812526014:web:9f5d890f383c2a6ee701ef"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

