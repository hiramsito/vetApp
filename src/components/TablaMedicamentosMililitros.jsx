import { useState } from 'react';
import MedicamentoMililitrosRow from './MedicamentoMililitrosRow';
import Loader from './Loader';
import { dosisMgKg, mililitrosTotales, formatearDecimal } from '../utils/calculos';

const TablaMedicamentosMililitros = ({ 
  medicamentos, 
  peso, 
  loading, 
  error, 
  titulo,
  tipo,
  onAgregar,
  onEditar,
  onEliminar
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [dosisSeleccionadas, setDosisSeleccionadas] = useState({});
  const [formData, setFormData] = useState({
    concentracion: '',
    marca: '',
    medicamento: '',
    dosisMin: '',
    dosisMax: '',
    mgPorMl: ''
  });

  // Inicializar dosis seleccionadas para medicamentos nuevos
  const getDosisSeleccionada = (medicamentoId) => {
    if (!dosisSeleccionadas[medicamentoId]) {
      const medicamento = medicamentos.find(m => m.id === medicamentoId);
      if (medicamento) {
        setDosisSeleccionadas(prev => ({
          ...prev,
          [medicamentoId]: medicamento.dosis.min
        }));
        return medicamento.dosis.min;
      }
    }
    return dosisSeleccionadas[medicamentoId] || 0;
  };

  const handleDosisChange = (medicamentoId, nuevaDosis) => {
    setDosisSeleccionadas(prev => ({
      ...prev,
      [medicamentoId]: nuevaDosis
    }));
  };

  const resetForm = () => {
    setFormData({
      concentracion: '',
      marca: '',
      medicamento: '',
      dosisMin: '',
      dosisMax: '',
      mgPorMl: ''
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
    if (!formData.concentracion.trim()) return 'La concentración es requerida';
    if (!formData.marca.trim()) return 'La marca comercial es requerida';
    if (!formData.medicamento.trim()) return 'El nombre del medicamento es requerido';
    if (!formData.dosisMin || parseFloat(formData.dosisMin) <= 0) return 'La dosis mínima debe ser mayor a 0';
    if (formData.dosisMax && parseFloat(formData.dosisMax) <= parseFloat(formData.dosisMin)) {
      return 'La dosis máxima debe ser mayor a la mínima';
    }
    if (!formData.mgPorMl || parseFloat(formData.mgPorMl) <= 0) return 'Los mg/ml deben ser mayores a 0';
    
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
      const medicamentoData = {
        concentracion: formData.concentracion.trim(),
        marca: formData.marca.trim(),
        medicamento: formData.medicamento.trim(),
        dosis: {
          min: parseFloat(formData.dosisMin),
          max: formData.dosisMax ? parseFloat(formData.dosisMax) : null
        },
        mgPorMl: parseFloat(formData.mgPorMl)
      };

      if (editingId) {
        await onEditar(editingId, medicamentoData);
      } else {
        await onAgregar(medicamentoData);
      }

      resetForm();
    } catch (error) {
      console.error('Error al guardar medicamento:', error);
      alert('Error al guardar el medicamento');
    }
  };

  const handleEdit = (medicamento) => {
    setFormData({
      concentracion: medicamento.concentracion,
      marca: medicamento.marca,
      medicamento: medicamento.medicamento,
      dosisMin: medicamento.dosis.min.toString(),
      dosisMax: medicamento.dosis.max ? medicamento.dosis.max.toString() : '',
      mgPorMl: medicamento.mgPorMl.toString()
    });
    setEditingId(medicamento.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este medicamento?')) {
      return;
    }

    try {
      await onEliminar(id);
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      alert('Error al eliminar el medicamento');
    }
  };

  if (loading) {
    return <Loader text={`Cargando ${titulo.toLowerCase()}...`} />;
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
              {titulo} ({medicamentos.length})
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Cálculos para {peso} kg
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {showForm ? 'Cancelar' : `+ Agregar ${tipo}`}
          </button>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="text-md font-semibold text-gray-800 mb-4">
            {editingId ? 'Editar' : 'Agregar'} Medicamento
          </h4>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Concentración Comercial *
              </label>
              <input
                type="text"
                name="concentracion"
                value={formData.concentracion}
                onChange={handleInputChange}
                placeholder="Ej: 250mg en 5ml"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Marca Comercial *
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
                Medicamento *
              </label>
              <input
                type="text"
                name="medicamento"
                value={formData.medicamento}
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
                mg por ml *
              </label>
              <input
                type="number"
                name="mgPorMl"
                value={formData.mgPorMl}
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
      {medicamentos.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No hay medicamentos registrados
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Concentración
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Marca
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicamento
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosis Estándar
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Selección
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  mg/ml
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dosis Mg*Kg
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mililitros
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {medicamentos.map((medicamento) => {
                const dosisSeleccionada = getDosisSeleccionada(medicamento.id);
                const dosisMinMgKg = dosisMgKg(peso, medicamento.dosis.min);
                const dosisMaxMgKg = medicamento.dosis.max ? dosisMgKg(peso, medicamento.dosis.max) : null;
                const dosisSeleccionadaMgKg = dosisMgKg(peso, dosisSeleccionada);
                
                const mlMin = mililitrosTotales(dosisMinMgKg, medicamento.mgPorMl);
                const mlMax = dosisMaxMgKg ? mililitrosTotales(dosisMaxMgKg, medicamento.mgPorMl) : null;
                const mlSeleccionado = mililitrosTotales(dosisSeleccionadaMgKg, medicamento.mgPorMl);

                return (
                  <tr key={medicamento.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="font-medium text-gray-900">{medicamento.concentracion}</div>
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {medicamento.marca}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {medicamento.medicamento}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            Mín
                          </span>
                          <span className="font-medium text-green-600">
                            {medicamento.dosis.min} mg/kg
                          </span>
                        </div>
                        {medicamento.dosis.max && (
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              Máx
                            </span>
                            <span className="text-xs text-gray-500">
                              {medicamento.dosis.max} mg/kg
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <input
                        type="number"
                        defaultValue={dosisSeleccionada}
                        onInput={(e) => {
                          const nuevaDosis = parseFloat(e.target.value);
                          if (!isNaN(nuevaDosis) && nuevaDosis >= medicamento.dosis.min && 
                              (!medicamento.dosis.max || nuevaDosis <= medicamento.dosis.max)) {
                            handleDosisChange(medicamento.id, nuevaDosis);
                          }
                        }}
                        min={medicamento.dosis.min}
                        max={medicamento.dosis.max || medicamento.dosis.min}
                        step="0.1"
                        className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="mg/kg"
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="font-medium">{medicamento.mgPorMl} mg/ml</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            Mín
                          </span>
                          <span className="font-medium text-green-600">
                            {formatearDecimal(dosisMinMgKg)} mg
                          </span>
                        </div>
                        {dosisMaxMgKg && (
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              Máx
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatearDecimal(dosisMaxMgKg)} mg
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Sel
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            {formatearDecimal(dosisSeleccionadaMgKg)} mg
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                            Mín
                          </span>
                          <span className="font-medium text-green-600">
                            {formatearDecimal(mlMin)} ml
                          </span>
                        </div>
                        {mlMax && (
                          <div className="flex items-center justify-center space-x-2">
                            <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                              Máx
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatearDecimal(mlMax)} ml
                            </span>
                          </div>
                        )}
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            Sel
                          </span>
                          <span className="text-xs text-blue-600 font-medium">
                            {formatearDecimal(mlSeleccionado)} ml
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 text-center">
                      <div className="flex space-x-2 justify-center">
                        <button
                          onClick={() => handleEdit(medicamento)}
                          className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(medicamento.id)}
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

export default TablaMedicamentosMililitros; 