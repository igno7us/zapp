import appfirebase from '../credenciales';
import { getFirestore } from 'firebase/firestore'; 
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';



const auth = initializeAuth(appfirebase, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(appfirebase);

export default auth;

