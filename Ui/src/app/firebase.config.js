// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // apiKey: process.env.API_KEY,
  apiKey: "AIzaSyAyKHC4_702WV_u6WO8onsqo9Zo5wzQEp8",
  authDomain: "astra-nova-black-pass.firebaseapp.com",
  projectId: "astra-nova-black-pass",
  storageBucket: "astra-nova-black-pass.appspot.com",
  messagingSenderId: "37559334114",
  appId: "1:37559334114:web:533cf1a201f020c54b9abb",
  measurementId: "G-G0KJ94ZQQB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app)