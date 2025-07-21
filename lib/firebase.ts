import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCkto0unfGVSLZLS23YZcZc0PvIgsMQJqM",
  authDomain: "healthtech-5ae95.firebaseapp.com",
  databaseURL: "https://healthtech-5ae95-default-rtdb.firebaseio.com",
  projectId: "healthtech-5ae95",
  storageBucket: "healthtech-5ae95.firebasestorage.app",
  messagingSenderId: "229619561236",
  appId: "1:229619561236:web:e48d4032ae1f8bca7d8801",
  measurementId: "G-7JZNWL256X"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
