// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Configuración de Firebase (Reemplázala con tu propia configuración)
const firebaseConfig = {
  apiKey: "AIzaSyC0Ht7gEyRf3e8D5oV0J9R1cYz153YMPHw",
  authDomain: "clavosstc.firebaseapp.com",
  projectId: "clavosstc",
  storageBucket: "clavosstc.appspot.com",
  messagingSenderId: "838018204385",
  appId: "1:838018204385:web:9524583b80f8b978dd6da0"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exportar Firebase para usarlo en otros archivos
export { db, collection, addDoc, getDocs, deleteDoc, doc, updateDoc };
