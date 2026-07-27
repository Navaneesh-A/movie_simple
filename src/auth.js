// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // import { getAnalytics } from "firebase/analytics";
// import { getFirestore } from 'firebase/firestore'
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getAuth } from "firebase/auth";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
    signOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB6uc0qxbpmJg4Yb3YgWzFpc0yOCKh9RIA",
    authDomain: "sample-2bd1a.firebaseapp.com",
    projectId: "sample-2bd1a",
    storageBucket: "sample-2bd1a.firebasestorage.app",
    messagingSenderId: "81374819291",
    appId: "1:81374819291:web:410e6516dbfa4d33bbadfe",
    measurementId: "G-LNBJY9KXGE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
//authentication set up
const auth = getAuth(app);
const db = getFirestore(app);
const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        // Redirect to your main app page after successful login
        window.location.href = "home.html";
    } catch (error) {
        console.error(error);
        alert("Google Sign-In failed");
    }
});
//export const db = getFirestore(app);
export { db, auth };

