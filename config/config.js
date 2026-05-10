"use client";

// src/config/config.js
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, RecaptchaVerifier, GithubAuthProvider, TwitterAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC0Hr_y0i8bHG6TUyeeu6lF3HzBoa4tp1o",
  authDomain: "codewithmuhilandb.firebaseapp.com",
  projectId: "codewithmuhilandb",
  storageBucket: "codewithmuhilandb.appspot.com",
  messagingSenderId: "54571259121",
  appId: "1:54571259121:web:a07590b257308747128550",
  measurementId: "G-GZB15RRKD7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the storage service
const storage = getStorage(app);

// Get Auth and Firestore services
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// Export services, providers, and Firestore methods
export { auth, db, storage, googleProvider, RecaptchaVerifier, githubProvider, twitterProvider, collection, addDoc, onAuthStateChanged, query, where, getDocs, doc, getDoc, setDoc, deleteDoc, Timestamp };
