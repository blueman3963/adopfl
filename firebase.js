// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_APIKEY,
  authDomain: "iamjt-c5cc7.firebaseapp.com",
  projectId: "iamjt-c5cc7",
  storageBucket: "iamjt-c5cc7.appspot.com",
  messagingSenderId: "167217578792",
  appId: "1:167217578792:web:a4c0724da32a4a3b52061d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore();

export default db;