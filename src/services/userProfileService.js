import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

const COLLECTION_USERS = "user_profiles";

/**
 * Obtiene el perfil de un usuario por su ID
 */
export const obtenerPerfilUsuario = async (userId) => {
  try {
    const docRef = doc(db, COLLECTION_USERS, userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      // Si no existe el perfil, crear uno por defecto
      const perfilDefault = {
        nombre: "",
        email: "",
        fechaCreacion: new Date().toISOString(),
        fechaActualizacion: new Date().toISOString(),
      };
      await setDoc(docRef, perfilDefault);
      return perfilDefault;
    }
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    throw error;
  }
};

/**
 * Actualiza el perfil de un usuario
 */
export const actualizarPerfilUsuario = async (userId, datosPerfil) => {
  try {
    const docRef = doc(db, COLLECTION_USERS, userId);
    const datosActualizados = {
      ...datosPerfil,
      fechaActualizacion: new Date().toISOString(),
    };

    await updateDoc(docRef, datosActualizados);
    return datosActualizados;
  } catch (error) {
    console.error("Error al actualizar perfil de usuario:", error);
    throw error;
  }
};

/**
 * Crea o actualiza el perfil inicial de un usuario
 */
export const crearPerfilUsuario = async (userId, email) => {
  try {
    const docRef = doc(db, COLLECTION_USERS, userId);
    const perfilInicial = {
      nombre: "",
      email: email,
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString(),
    };

    await setDoc(docRef, perfilInicial);
    return perfilInicial;
  } catch (error) {
    console.error("Error al crear perfil de usuario:", error);
    throw error;
  }
};
