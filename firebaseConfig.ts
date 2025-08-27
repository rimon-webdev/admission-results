// firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDmu-SRy-95uGP1wdnJ2fkxSdASE6OhP5Q",
  authDomain: "results-bed59.firebaseapp.com",
  projectId: "results-bed59",
  storageBucket: "results-bed59.firebasestorage.app",
  messagingSenderId: "655986710611",
  appId: "1:655986710611:web:eb8df0db8e6412342a4ea6",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
