import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGIlCBBF82RMLMnLwgAK2jJUgY4EJDNyw",
  authDomain: "smartcampusconnect-e064e.firebaseapp.com",
  projectId: "smartcampusconnect-e064e",
  storageBucket: "smartcampusconnect-e064e.firebasestorage.app",
  messagingSenderId: "390712002102",
  appId: "1:390712002102:web:4251fc87b0dd66fed93a97"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth with AsyncStorage persistence
// This is critical for keeping users logged in on mobile restarts
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
  });
} catch (e) {
  // If auth is already initialized (e.g. hot reload), use getAuth
  auth = getAuth(app);
}

export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager(),
  }),
  experimentalForceLongPolling: true, // Fix for "Transport errored" / "Client is offline"
});
export const storage = getStorage(app);

export { auth };
export default app;
