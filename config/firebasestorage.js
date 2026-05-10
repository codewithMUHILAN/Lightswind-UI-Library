// src/firebase.js

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyC0Hr_y0i8bHG6TUyeeu6lF3HzBoa4tp1o",
    authDomain: "codewithmuhilandb.firebaseapp.com",
    projectId: "codewithmuhilandb",
    storageBucket: "codewithmuhilandb.appspot.com",
    messagingSenderId: "54571259121",
    appId: "1:54571259121:web:a07590b257308747128550",
    measurementId: "G-GZB15RRKD7"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
export default app;
