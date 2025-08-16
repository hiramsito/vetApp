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

const COLLECTION_PERROS = "ansioliticos_perros";
const COLLECTION_GATOS = "ansioliticos_gatos";

/**
 * Obtiene todos los ansiolíticos para perros ordenados por nombre
 */
export const obtenerAnsioliticosPerros = async () => {
  try {
    const q = query(collection(db, COLLECTION_PERROS), orderBy("farmaco"));
    const querySnapshot = await getDocs(q);
    const ansioliticos = [];

    querySnapshot.forEach((doc) => {
      ansioliticos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return ansioliticos;
  } catch (error) {
    console.error("Error al obtener ansiolíticos para perros:", error);
    throw error;
  }
};

/**
 * Obtiene todos los ansiolíticos para gatos ordenados por nombre
 */
export const obtenerAnsioliticosGatos = async () => {
  try {
    const q = query(collection(db, COLLECTION_GATOS), orderBy("farmaco"));
    const querySnapshot = await getDocs(q);
    const ansioliticos = [];

    querySnapshot.forEach((doc) => {
      ansioliticos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return ansioliticos;
  } catch (error) {
    console.error("Error al obtener ansiolíticos para gatos:", error);
    throw error;
  }
};

/**
 * Agrega un nuevo ansiolítico para perros
 */
export const agregarAnsioliticoPerro = async (ansiolitico) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_PERROS), ansiolitico);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar ansiolítico para perros:", error);
    throw error;
  }
};

/**
 * Agrega un nuevo ansiolítico para gatos
 */
export const agregarAnsioliticoGato = async (ansiolitico) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_GATOS), ansiolitico);
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar ansiolítico para gatos:", error);
    throw error;
  }
};

/**
 * Actualiza un ansiolítico para perros existente
 */
export const actualizarAnsioliticoPerro = async (id, ansiolitico) => {
  try {
    const docRef = doc(db, COLLECTION_PERROS, id);
    await updateDoc(docRef, ansiolitico);
  } catch (error) {
    console.error("Error al actualizar ansiolítico para perros:", error);
    throw error;
  }
};

/**
 * Actualiza un ansiolítico para gatos existente
 */
export const actualizarAnsioliticoGato = async (id, ansiolitico) => {
  try {
    const docRef = doc(db, COLLECTION_GATOS, id);
    await updateDoc(docRef, ansiolitico);
  } catch (error) {
    console.error("Error al actualizar ansiolítico para gatos:", error);
    throw error;
  }
};

/**
 * Elimina un ansiolítico para perros
 */
export const eliminarAnsioliticoPerro = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_PERROS, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar ansiolítico para perros:", error);
    throw error;
  }
};

/**
 * Elimina un ansiolítico para gatos
 */
export const eliminarAnsioliticoGato = async (id) => {
  try {
    const docRef = doc(db, COLLECTION_GATOS, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar ansiolítico para gatos:", error);
    throw error;
  }
};
