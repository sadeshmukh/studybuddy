// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.1/firebase-app.js";
// import firebaseui
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.1/firebase-auth.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDlQVhP9glOSLIUJHtCobTBrJQl6SxjT2o",
  authDomain: "studybuddy-51413.firebaseapp.com",
  projectId: "studybuddy-51413",
  storageBucket: "studybuddy-51413.appspot.com",
  messagingSenderId: "977365856821",
  appId: "1:977365856821:web:8ba6a3d1ca05e4ef64f77c",
  measurementId: "G-L2KLXRF1HF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// initialize firebase - only google login
const auth = getAuth(app);
console.log(auth);
const googleProvider = new GoogleAuthProvider();
const googleLoginButton = document.getElementById("google-login");

console.log(signInWithPopup);

googleLoginButton.addEventListener("click", () => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      console.log(result);
      // redirect to /dashboard
      window.location.href = "/dashboard";
    })
    .catch((error) => {
      console.log(error);
    });
});
