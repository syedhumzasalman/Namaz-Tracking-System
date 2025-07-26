import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  setDoc,
  getDoc,
  where,
  query,
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

const auth = getAuth();

export {
  app,
  db,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setDoc,
  getDoc,
  where,
  query,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
};
