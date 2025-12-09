// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB3QVegBCuQNOrjjdn7cYSPdO5GI-J_IfM",
  authDomain: "gymnow-4f77d.firebaseapp.com",
  projectId: "gymnow-4f77d",
  storageBucket: "gymnow-4f77d.firebasestorage.app",
  messagingSenderId: "177791568788",
  appId: "1:177791568788:web:c3f701423e85d6eede1d81",
  measurementId: "G-3CZH5GSWKC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);