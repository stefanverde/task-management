import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBEmJ7FZ5ks6PH6LvQQX3-SngNtwToy_QM",
    authDomain: "task-management-app-5cc85.firebaseapp.com",
    projectId: "task-management-app-5cc85",
    storageBucket: "task-management-app-5cc85.firebasestorage.app",
    messagingSenderId: "353169751179",
    appId: "1:353169751179:web:2487a4004fcfb54b23e88e",
    measurementId: "G-5KSDEG1XE2"
};
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
