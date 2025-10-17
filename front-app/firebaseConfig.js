// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCzqSiIbgwVJwzglgMkucQ0aDGFLAddJw8",
  authDomain: "spotme-30dff.firebaseapp.com",
  projectId: "spotme-30dff",
  storageBucket: "spotme-30dff.firebasestorage.app",
  messagingSenderId: "926709473225",
  appId: "1:926709473225:web:66b60d374ce38b3d759218",
  measurementId: "G-0X1DR44K0K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);