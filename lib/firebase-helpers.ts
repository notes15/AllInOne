import { ref, set } from "firebase/database";
import { rtdb } from "./firebase";

// Save a user
export const saveUser = (uid: string, email: string) => {
  return set(ref(rtdb, `users/${uid}`), {
    email,
    createdAt: Date.now(),
  });
};

// Save an order
export const saveOrder = (orderId: string, uid: string, data: any) => {
  return set(ref(rtdb, `orders/${orderId}`), {
    uid,
    ...data,
    createdAt: Date.now(),
  });
};
