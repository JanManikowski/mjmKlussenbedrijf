import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyBGBuLpig1cD7dLSW1FSoAksRE8I5n6Zm0",
    authDomain: "mjm-klussenbedrijf.firebaseapp.com",
    projectId: "mjm-klussenbedrijf",
    storageBucket: "gs://mjm-klussenbedrijf.firebasestorage.app",
    messagingSenderId: "698294560654",
    appId: "1:698294560654:web:08f513d4d50f78ffe6e6df",
    measurementId: "G-MK083GE8GP"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
