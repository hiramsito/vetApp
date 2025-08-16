import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase (copiada de tu consola de Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyAcYoxenCLan6XjxMC0OncsDJhJRiOvF5E",
  authDomain: "vetapp-49ce6.firebaseapp.com",
  projectId: "vetapp-49ce6",
  storageBucket: "vetapp-49ce6.firebasestorage.app",
  messagingSenderId: "441189078509",
  appId: "1:441189078509:web:c32b14a7600b50636843e4",
  measurementId: "G-3GD2GF2D3J", // este campo puede quedar aunque no lo uses
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios que usará la app
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
