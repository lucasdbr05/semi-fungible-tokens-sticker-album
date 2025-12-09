import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCJKi-S5qDhxnjmsbJclXq6lANyZqzDu48",
  authDomain: "bitcoin-47078.firebaseapp.com",
  projectId: "bitcoin-47078",
  storageBucket: "bitcoin-47078.firebasestorage.app",
  messagingSenderId: "569996274570",
  appId: "1:569996274570:web:d285446d95aad6395f3673"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
