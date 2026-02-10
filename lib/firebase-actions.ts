import { auth } from "@/lib/firebase";
import { saveUser, saveOrder } from "@/lib/firebase-helpers";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// Register a user - with error handling
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await saveUser(user.uid, user.email || "");
    return user;
  } catch (error: any) {
    if (error.code === 'auth/email-already-in-use') {
      // Email exists, try to sign in instead
      console.log('Email already exists, attempting sign in...');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    }
    throw error;
  }
};

// Save an order
export const registerOrder = async (orderId: string, uid: string, data: any) => {
  await saveOrder(orderId, uid, data);
};
