// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDAgkhSoK_t2e7stShohQWj2rNz6zZPyMQ",
  authDomain: "eglise-ecole-adzope.firebaseapp.com",
  projectId: "eglise-ecole-adzope",
  storageBucket: "eglise-ecole-adzope.firebasestorage.app",
  messagingSenderId: "380570564421",
  appId: "1:380570564421:web:97317978302d0c271e702c",
  measurementId: "G-BH14JEY4FN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);