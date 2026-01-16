// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions, connectFunctionsEmulator  } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyBNTt3THv8eBkJb0erzPgOYTyp9u0ok2VY",
  authDomain: "projects-39a99.firebaseapp.com",
  projectId: "projects-39a99",
  storageBucket: "projects-39a99.firebasestorage.app",
  messagingSenderId: "1024432063590",
  appId: "1:1024432063590:web:fc3a2fd87c9169267699a7"
};

const app = initializeApp(firebaseConfig);
export {app};

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);


export default app;


