import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTD87cpBmZNzzuGS2AXnvpbwGjO2R9eiU",
  authDomain: "allinone1-a22de.firebaseapp.com",
  databaseURL: "https://allinone1-a22de-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "allinone1-a22de",
  storageBucket: "allinone1-a22de.firebasestorage.app",
  messagingSenderId: "537980898222",
  appId: "1:537980898222:web:d5ea4c344dbcf8a31e163f",
  measurementId: "G-3ZM34X5N1W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);
