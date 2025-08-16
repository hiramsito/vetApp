import { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { 
  obtenerPerfilUsuario, 
  crearPerfilUsuario, 
  actualizarPerfilUsuario 
} from '../services/userProfileService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función para cargar el perfil del usuario
  const cargarPerfilUsuario = async (user) => {
    if (user) {
      try {
        const perfil = await obtenerPerfilUsuario(user.uid);
        setUserProfile(perfil);
      } catch (error) {
        console.error('Error al cargar perfil de usuario:', error);
        // Si hay error, crear un perfil por defecto
        try {
          const perfilDefault = await crearPerfilUsuario(user.uid, user.email);
          setUserProfile(perfilDefault);
        } catch (createError) {
          console.error('Error al crear perfil por defecto:', createError);
        }
      }
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      await cargarPerfilUsuario(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Cargar el perfil después del login
      await cargarPerfilUsuario(userCredential.user);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (error) {
      throw error;
    }
  };

  // Función para actualizar el nombre del perfil
  const actualizarNombrePerfil = async (nuevoNombre) => {
    if (!user) throw new Error('Usuario no autenticado');
    
    try {
      const perfilActualizado = await actualizarPerfilUsuario(user.uid, {
        ...userProfile,
        nombre: nuevoNombre.trim()
      });
      setUserProfile(perfilActualizado);
      return perfilActualizado;
    } catch (error) {
      console.error('Error al actualizar nombre del perfil:', error);
      throw error;
    }
  };

  const value = {
    user,
    userProfile,
    login,
    logout,
    actualizarNombrePerfil,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 