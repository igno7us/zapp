import { getFirestore } from 'firebase/firestore'; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: "AIzaSyBse1z-uLNBBrMMXIWvcuwMDH2CNsNv5OM",
  authDomain: "proyectoz-a0a28.firebaseapp.com",
  projectId: "proyectoz-a0a28",
  storageBucket: "proyectoz-a0a28.appspot.com",
  messagingSenderId: "715754604208",
  appId: "1:715754604208:web:04765bd9817c5fe0d25d75",
  measurementId: "G-6ZLCDE19TK"
};
const appfirebase = initializeApp(firebaseConfig);

const auth = initializeAuth(appfirebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(appfirebase);

export default auth;

