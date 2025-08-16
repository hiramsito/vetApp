import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const ProfileSettings = () => {
  const { user, userProfile, actualizarNombrePerfil } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState(userProfile?.nombre || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!nombre.trim()) {
      setMessage('El nombre no puede estar vacío');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      await actualizarNombrePerfil(nombre);
      setMessage('Nombre actualizado correctamente');
      setShowForm(false);
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error al actualizar nombre:', error);
      setMessage('Error al actualizar el nombre. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNombre(userProfile?.nombre || '');
    setShowForm(false);
    setMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          👤 Configuración de Perfil
        </h3>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            Editar Nombre
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Información actual */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Actual
              </label>
              <p className="text-gray-900 font-medium">
                {userProfile?.nombre && userProfile.nombre.trim() 
                  ? userProfile.nombre 
                  : 'No configurado'
                }
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Formulario de edición */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Personalizado *
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Ingresa tu nombre"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
                maxLength={50}
              />
              <p className="text-xs text-gray-500 mt-1">
                Este nombre se mostrará en el mensaje de bienvenida
              </p>
            </div>

            {/* Mensaje de estado */}
            {message && (
              <div className={`mb-4 p-3 rounded-md text-sm ${
                message.includes('Error') 
                  ? 'bg-red-50 text-red-700 border border-red-200' 
                  : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
                {message}
              </div>
            )}

            {/* Botones */}
            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                disabled={loading}
                className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}

        {/* Información adicional */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <span className="text-yellow-600 text-lg">💡</span>
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">¿Por qué configurar tu nombre?</p>
              <p>
                Al configurar tu nombre personalizado, el sistema te dará la bienvenida de forma más amigable 
                en lugar de mostrar tu dirección de email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings; 