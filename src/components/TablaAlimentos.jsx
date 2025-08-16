import { useState } from 'react';
import Loader from './Loader';
import {
  calcularGramosTotales,
  formatearDecimal
} from '../utils/calculos';

const TablaAlimentos = ({
  alimentos,
  kcalDiarias,
  titulo,
  loading,
  error,
  onAgregar,
  onEditar,
  onEliminar,
  mostrarBotonAgregar = true,
  showForm = false,
  onToggleForm
}) => {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    marca: '',
    nombre: '',
    contenido_kcal: '',
    gramos: ''
  });

  const resetForm = () => {
    setFormData({
      marca: '',
      nombre: '',
      contenido_kcal: '',
      gramos: ''
    });
    setEditingId(null);
    if (onToggleForm) {
      onToggleForm();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.marca.trim()) return 'La marca es requerida';
    if (!formData.nombre.trim()) return 'El nombre es requerido';
    if (!formData.contenido_kcal || parseFloat(formData.contenido_kcal) <= 0) {
      return 'El contenido calórico debe ser mayor a 0';
    }
    if (!formData.gramos || parseFloat(formData.gramos) <= 0) {
      return 'Los gramos deben ser mayores a 0';
    }

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
      const alimentoData = {
        marca: formData.marca.trim(),
        nombre: formData.nombre.trim(),
        contenido_kcal: parseFloat(formData.contenido_kcal),
        gramos: parseFloat(formData.gramos)
      };

      if (editingId) {
        await onEditar(editingId, alimentoData);
      } else {
        await onAgregar(alimentoData);
      }

      resetForm();
    } catch (error) {
      console.error('Error al guardar alimento:', error);
      alert('Error al guardar el alimento');
    }
  };

  const handleEdit = (alimento) => {
    setFormData({
      marca: alimento.marca,
      nombre: alimento.nombre,
      contenido_kcal: alimento.contenido_kcal.toString(),
      gramos: alimento.gramos.toString()
    });
    setEditingId(alimento.id);
    if (onToggleForm) {
      onToggleForm();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este alimento?')) {
      return;
    }

    try {
      await onEliminar(id);
    } catch (error) {
      console.error('Error al eliminar alimento:', error);
      alert('Error al eliminar el alimento');
    }
  };

  if (loading) {
    return <Loader text="Cargando alimentos..." />;
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
              {titulo}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {kcalDiarias > 0 ? `${formatearDecimal(kcalDiarias)} kcal/día` : 'Ingresa los datos para ver cálculos'}
            </p>
          </div>
          {mostrarBotonAgregar && onToggleForm && (
            <button
              onClick={onToggleForm}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            >
              {showForm ? 'Cancelar' : '+ Agregar Alimento'}
            </button>
          )}
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            {editingId ? 'Editar' : 'Agregar'} Alimento
          </h4>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca *
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contenido kcal *
              </label>
              <input
                type="number"
                name="contenido_kcal"
                value={formData.contenido_kcal}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gramos *
              </label>
              <input
                type="number"
                name="gramos"
                value={formData.gramos}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2 lg:col-span-4 flex space-x-3 pt-4">
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
      {kcalDiarias <= 0 ? (
        <div className="p-6 text-center text-gray-500">
          Ingresa el peso y selecciona los factores para ver los cálculos de raciones
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contenido kcal
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gramos
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Gramos Totales/Día
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  BID (2x/día)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  TID (3x/día)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  QID (4x/día)
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alimentos.map((alimento) => {
                const gramosTotales = calcularGramosTotales(kcalDiarias, alimento.gramos, alimento.contenido_kcal);

                return (
                  <tr key={alimento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {alimento.marca}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {alimento.nombre}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      {alimento.contenido_kcal} kcal
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      {alimento.gramos} g
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            100%
                          </span>
                          <span className="font-medium text-green-600">
                            {formatearDecimal(gramosTotales)} g
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            50%
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatearDecimal(gramosTotales / 2)} g
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            100%
                          </span>
                          <span className="font-medium text-blue-600">
                            {formatearDecimal(gramosTotales / 2)} g
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            50%
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatearDecimal((gramosTotales / 2) / 2)} g
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                            100%
                          </span>
                          <span className="font-medium text-purple-600">
                            {formatearDecimal(gramosTotales / 3)} g
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            50%
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatearDecimal((gramosTotales / 3) / 2)} g
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="space-y-1">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded">
                            100%
                          </span>
                          <span className="font-medium text-orange-600">
                            {formatearDecimal(gramosTotales / 4)} g
                          </span>
                        </div>
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            50%
                          </span>
                          <span className="text-xs text-gray-500">
                            {formatearDecimal((gramosTotales / 4) / 2)} g
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEdit(alimento)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(alimento.id)}
                          className="text-red-600 hover:text-red-800 font-medium text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TablaAlimentos; 