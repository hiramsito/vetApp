import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_ALIMENTOS = "alimentos";

/**
 * Obtiene todos los alimentos ordenados por marca
 */
export const obtenerAlimentos = async () => {
  try {
    const q = query(collection(db, COLLECTION_ALIMENTOS), orderBy("marca"));
    const querySnapshot = await getDocs(q);
    const alimentos = [];

    querySnapshot.forEach((doc) => {
      alimentos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return alimentos;
  } catch (error) {
    console.error("Error al obtener alimentos:", error);
    throw error;
  }
};

/**
 * Agrega un nuevo alimento
 */
export const agregarAlimento = async (alimento) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_ALIMENTOS), alimento);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar alimento:", error);
    throw error;
  }
};

/**
 * Actualiza un alimento existente
 */
export const actualizarAlimento = async (id, alimento) => {
  try {
    const docRef = doc(db, COLLECTION_ALIMENTOS, id);
    await updateDoc(docRef, alimento);
  } catch (error) {
    console.error("Error al actualizar alimento:", error);
    throw error;
  }
};

/**
 * Elimina un alimento
 */
export const eliminarAlimento = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_ALIMENTOS, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar alimento:", error);
    throw error;
  }
};
