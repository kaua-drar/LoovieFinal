import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyB8DeIwMZ-zcvYQC47QP3FfAcsjiu2Vr0g",
  authDomain: "thes-loovie.firebaseapp.com",
  projectId: "thes-loovie",
  storageBucket: "thes-loovie.appspot.com",
  messagingSenderId: "586260178324",
  appId: "1:586260178324:web:6518355a46b114f3fd9b81",
  measurementId: "G-ZFP4617QX8"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const app = initializeApp(firebaseConfig);

export {app, firebase}