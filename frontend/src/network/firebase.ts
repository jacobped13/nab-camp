import { initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";

export const app = initializeApp(
  JSON.parse(import.meta.env.VITE_FIREBASE_CONFIG),
);

export const auth = getAuth(app);

if (import.meta.env.MODE === "development") {
  try {
    connectAuthEmulator(auth, import.meta.env.VITE_FIREBASE_AUTH_EMULATOR_HOST);
  } catch (error) {
    console.error("Error connecting to Firebase emulator:", error);
  }
}
