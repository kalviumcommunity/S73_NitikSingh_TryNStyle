// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";  // initializeApp-> this function initializes firebase with your app's configuration.
import { getAuth } from "firebase/auth";  //getAuth->This function is used to get the Firebase Authentication service, which allow user login/signup.
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDQStLJe9PTyc7A5XdHIQ4PuU7zCQxUGJs",
  //A uniques key to authenticate Firebase requests (used internally by Firebase).
  authDomain: "trynstyle-auth.firebaseapp.com",
  //The domain used for authentication, linked to Firebase Auth.
  projectId: "trynstyle-auth",
  //Your Firebase Project's unique ID.
  storageBucket: "trynstyle-auth.firebasestorage.app",
  //If you use Firebase Storage, this is where uploaded files are stored.
  messagingSenderId: "103223619087",
  //Used for Firebase Cloud Messaging(FCM).
  appId: "1:103223619087:web:649bf867293ab8aab7bd7a"
  //appId: A unique identifier for your Firebase app.
};

const app = initializeApp(firebaseConfig);
//It creates an instance of your firebase project that you can interact with.
const auth = getAuth(app);

export { auth }; //This exports the auth instance so ot can be used in other parts of your app.