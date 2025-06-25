import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
	apiKey: "AIzaSyCWms0L47rNx6_dZOG1bbgHSbyXa0eqY98",
	authDomain: "crm-5f835.firebaseapp.com",
	projectId: "crm-5f835",
	storageBucket: "crm-5f835.firebasestorage.app",
	messagingSenderId: "369782563115",
	appId: "1:369782563115:web:18ba284ff07af536b3e56e",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
