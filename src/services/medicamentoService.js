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

const COLLECTION_NAME = "medicamentos";

/**
 * Obtiene todos los medicamentos ordenados por marca
 */
export const obtenerMedicamentos = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("marca"));
    const querySnapshot = await getDocs(q);
    const medicamentos = [];

    querySnapshot.forEach((doc) => {
      medicamentos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return medicamentos;
  } catch (error) {
    console.error("Error al obtener medicamentos:", error);
    throw error;
  }
};

/**
 * Agrega un nuevo medicamento
 */
export const agregarMedicamento = async (medicamento) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), medicamento);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar medicamento:", error);
    throw error;
  }
};

/**
 * Actualiza un medicamento existente
 */
export const actualizarMedicamento = async (id, medicamento) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, medicamento);
  } catch (error) {
    console.error("Error al actualizar medicamento:", error);
    throw error;
  }
};

/**
 * Elimina un medicamento
 */
export const eliminarMedicamento = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar medicamento:", error);
    throw error;
  }
};
