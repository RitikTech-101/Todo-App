// firebase.js
import { initializeApp } from 'firebase/app';
import { initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getMessaging } from 'firebase/messaging';
import { getFunctions } from 'firebase/functions';

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC4MmYRqdpl9Ew5aX4iW20h3NeMdhdd5P4",
  authDomain: "todo-app-92a7d.firebaseapp.com",
  projectId: "todo-app-92a7d",
  storageBucket: "todo-app-92a7d.appspot.com",
  messagingSenderId: "664812526014",
  appId: "1:664812526014:web:9f5d890f383c2a6ee701ef"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore with persistent cache
const db = initializeFirestore(app, {
  cache: persistentLocalCache({ memoryOnly: false }) // IndexedDB persistence enabled
});

// Initialize other Firebase services
const auth = getAuth(app);
const messaging = getMessaging(app);
const functions = getFunctions(app);

export { db, auth, messaging, functions };
