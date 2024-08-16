import { initializeApp, getApp, getApps } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import 'firebase/storage'
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyCuN1ZGhN-rUMjWeZT7rA9VI8IXUZ0uL0Q",
  authDomain: "posaplus-ca081.firebaseapp.com",
  projectId: "posaplus-ca081",
  storageBucket: "posaplus-ca081.appspot.com",
  messagingSenderId: "1003227015036",
  appId: "1:1003227015036:web:31ce0ef8aaf5aa15ef26f9",
  measurementId: "G-TCQFBB9L85"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const storage = getStorage(app);
const db = getFirestore(app)

export { auth, storage, db, app };