import { useState } from 'react';
import Loader from './Loader';

const TablaAnsioliticosGatos = ({ 
  ansioliticos, 
  loading, 
  error, 
  onAgregar,
  onEditar,
  onEliminar
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    farmaco: '',
    dosisMin: '',
    dosisMax: '',
    tableta1: '',
    tableta2: ''
  });

  const resetForm = () => {
    setFormData({
      farmaco: '',
      dosisMin: '',
      dosisMax: '',
      tableta1: '',
      tableta2: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.farmaco.trim()) return 'El nombre del fármaco es requerido';
    if (!formData.dosisMin || parseFloat(formData.dosisMin) <= 0) return 'La dosis mínima debe ser mayor a 0';
    if (formData.dosisMax && parseFloat(formData.dosisMax) <= parseFloat(formData.dosisMin)) {
      return 'La dosis máxima debe ser mayor a la mínima';
    }
    if (!formData.tableta1 || parseFloat(formData.tableta1) <= 0) return 'La tableta 1 debe ser mayor a 0';
    if (!formData.tableta2 || parseFloat(formData.tableta2) <= 0) return 'La tableta 2 debe ser mayor a 0';
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      alert(validationError);
      return;
    }

    try {
      const ansioliticoData = {
        farmaco: formData.farmaco.trim(),
        dosis: {
          min: parseFloat(formData.dosisMin),
          max: formData.dosisMax ? parseFloat(formData.dosisMax) : null
        },
        tabletas: [
          parseFloat(formData.tableta1),
          parseFloat(formData.tableta2)
        ]
      };

      if (editingId) {
        await onEditar(editingId, ansioliticoData);
      } else {
        await onAgregar(ansioliticoData);
      }

      resetForm();
    } catch (error) {
      console.error('Error al guardar ansiolítico:', error);
      alert('Error al guardar el ansiolítico');
    }
  };

  const handleEdit = (ansiolitico) => {
    setFormData({
      farmaco: ansiolitico.farmaco,
      dosisMin: ansiolitico.dosis.min.toString(),
      dosisMax: ansiolitico.dosis.max ? ansiolitico.dosis.max.toString() : '',
      tableta1: ansiolitico.tabletas[0].toString(),
      tableta2: ansiolitico.tabletas[1].toString()
    });
    setEditingId(ansiolitico.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este ansiolítico?')) {
      return;
    }

    try {
      await onEliminar(id);
    } catch (error) {
      console.error('Error al eliminar ansiolítico:', error);
      alert('Error al eliminar el ansiolítico');
    }
  };

  if (loading) {
    return <Loader text="Cargando ansiolíticos para gatos..." />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <span>❌</span>
          <span>Error: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      {/* Header de la tabla */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Ansiolíticos para Gatos ({ansioliticos.length})
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Información de referencia (sin cálculos)
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {showForm ? 'Cancelar' : '+ Agregar Ansiolítico'}
          </button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            {editingId ? 'Editar' : 'Agregar'} Ansiolítico
          </h4>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fármaco Ansiolítico *
              </label>
              <input
                type="text"
                name="farmaco"
                value={formData.farmaco}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosis Mínima (mg/kg) *
              </label>
              <input
                type="number"
                name="dosisMin"
                value={formData.dosisMin}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dosis Máxima (mg/kg)
              </label>
              <input
                type="number"
                name="dosisMax"
                value={formData.dosisMax}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tableta 1° (mg) *
              </label>
              <input
                type="number"
                name="tableta1"
                value={formData.tableta1}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tableta 2° (mg) *
              </label>
              <input
                type="number"
                name="tableta2"
                value={formData.tableta2}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div className="md:col-span-2 lg:col-span-3 flex space-x-3 pt-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tabla */}
      {ansioliticos.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No hay ansiolíticos registrados
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fármaco Ansiolítico
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosis Estándar (mg/kg)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tabletas (mg)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ansioliticos.map((ansiolitico) => (
                <tr key={ansiolitico.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {ansiolitico.farmaco}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                          Mín
                        </span>
                        <span className="font-medium text-green-600">
                          {ansiolitico.dosis.min} mg/kg
                        </span>
                      </div>
                      {ansiolitico.dosis.max && (
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            Máx
                          </span>
                          <span className="text-xs text-gray-500">
                            {ansiolitico.dosis.max} mg/kg
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                          1°
                        </span>
                        <span className="font-medium text-blue-600">
                          {ansiolitico.tabletas[0]} mg
                        </span>
                      </div>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          2°
                        </span>
                        <span className="text-xs text-purple-600">
                          {ansiolitico.tabletas[1]} mg
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700 text-center">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => handleEdit(ansiolitico)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(ansiolitico.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TablaAnsioliticosGatos; 