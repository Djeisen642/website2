// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { defineNuxtPlugin, useRuntimeConfig } from '#imports';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  const firebaseConfig = {
    apiKey: runtimeConfig.GOOGLE_FIREBASE_API_KEY,
    authDomain: 'jasonsuttles-website.firebaseapp.com',
    projectId: 'jasonsuttles-website',
    storageBucket: 'jasonsuttles-website.appspot.com',
    messagingSenderId: runtimeConfig.GOOGLE_FIREBASE_MESSAGING_ID,
    appId: runtimeConfig.GOOGLE_FIREBASE_APP_ID,
    measurementId: runtimeConfig.GOOGLE_FIREBASE_MESSAGING_ID,
  };
  const app = initializeApp(firebaseConfig);
  getAnalytics(app);
});
