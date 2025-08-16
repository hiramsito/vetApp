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

const COLLECTION_ORALES = "medicamentos_orales";
const COLLECTION_INYECTABLES = "medicamentos_inyectables";

/**
 * Obtiene todos los medicamentos orales ordenados por marca
 */
export const obtenerMedicamentosOrales = async () => {
  try {
    const q = query(collection(db, COLLECTION_ORALES), orderBy("marca"));
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
    console.error("Error al obtener medicamentos orales:", error);
    throw error;
  }
};

/**
 * Obtiene todos los medicamentos inyectables ordenados por marca
 */
export const obtenerMedicamentosInyectables = async () => {
  try {
    const q = query(collection(db, COLLECTION_INYECTABLES), orderBy("marca"));
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
    console.error("Error al obtener medicamentos inyectables:", error);
    throw error;
  }
};

/**
 * Agrega un nuevo medicamento oral
 */
export const agregarMedicamentoOral = async (medicamento) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_ORALES), medicamento);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar medicamento oral:", error);
    throw error;
  }
};

/**
 * Agrega un nuevo medicamento inyectable
 */
export const agregarMedicamentoInyectable = async (medicamento) => {
  try {
    const docRef = await addDoc(
      collection(db, COLLECTION_INYECTABLES),
      medicamento
    );
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar medicamento inyectable:", error);
    throw error;
  }
};

/**
 * Actualiza un medicamento oral existente
 */
export const actualizarMedicamentoOral = async (id, medicamento) => {
  try {
    const docRef = doc(db, COLLECTION_ORALES, id);
    await updateDoc(docRef, medicamento);
  } catch (error) {
    console.error("Error al actualizar medicamento oral:", error);
    throw error;
  }
};

/**
 * Actualiza un medicamento inyectable existente
 */
export const actualizarMedicamentoInyectable = async (id, medicamento) => {
  try {
    const docRef = doc(db, COLLECTION_INYECTABLES, id);
    await updateDoc(docRef, medicamento);
  } catch (error) {
    console.error("Error al actualizar medicamento inyectable:", error);
    throw error;
  }
};

/**
 * Elimina un medicamento oral
 */
export const eliminarMedicamentoOral = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_ORALES, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar medicamento oral:", error);
    throw error;
  }
};

/**
 * Elimina un medicamento inyectable
 */
export const eliminarMedicamentoInyectable = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_INYECTABLES, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar medicamento inyectable:", error);
    throw error;
  }
};
