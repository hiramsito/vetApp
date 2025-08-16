import { useState, useEffect } from 'react';
import { 
  obtenerMedicamentos, 
  agregarMedicamento, 
  actualizarMedicamento, 
  eliminarMedicamento 
} from '../services/medicamentoService';
import Loader from '../components/Loader';

const AdminPanel = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    marca: '',
    medicamento: '',
    dosisMin: '',
    dosisMax: '',
    tableta1: '',
    tableta2: '',
    tableta3: '',
    tableta4: ''
  });

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const cargarMedicamentos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await obtenerMedicamentos();
      setMedicamentos(data);
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
      setError('Error al cargar los medicamentos');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      marca: '',
      medicamento: '',
      dosisMin: '',
      dosisMax: '',
      tableta1: '',
      tableta2: '',
      tableta3: '',
      tableta4: ''
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
    if (!formData.marca.trim()) return 'La marca comercial es requerida';
    if (!formData.medicamento.trim()) return 'El nombre del medicamento es requerido';
    if (!formData.dosisMin || parseFloat(formData.dosisMin) <= 0) return 'La dosis mínima debe ser mayor a 0';
    if (formData.dosisMax && parseFloat(formData.dosisMax) <= parseFloat(formData.dosisMin)) {
      return 'La dosis máxima debe ser mayor a la mínima';
    }
    
    const tabletas = [formData.tableta1, formData.tableta2, formData.tableta3, formData.tableta4]
      .filter(t => t && parseFloat(t) > 0);
    
    if (tabletas.length === 0) return 'Al menos un tamaño de tableta es requerido';
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError('');
      const tabletas = [
        parseFloat(formData.tableta1) || 0,
        parseFloat(formData.tableta2) || 0,
        parseFloat(formData.tableta3) || 0,
        parseFloat(formData.tableta4) || 0
      ].filter(t => t > 0);

      const medicamentoData = {
        marca: formData.marca.trim(),
        medicamento: formData.medicamento.trim(),
        dosis: {
          min: parseFloat(formData.dosisMin),
          max: formData.dosisMax ? parseFloat(formData.dosisMax) : null
        },
        tabletas
      };

      if (editingId) {
        await actualizarMedicamento(editingId, medicamentoData);
      } else {
        await agregarMedicamento(medicamentoData);
      }

      await cargarMedicamentos();
      resetForm();
    } catch (error) {
      console.error('Error al guardar medicamento:', error);
      setError('Error al guardar el medicamento');
    }
  };

  const handleEdit = (medicamento) => {
    setFormData({
      marca: medicamento.marca,
      medicamento: medicamento.medicamento,
      dosisMin: medicamento.dosis.min.toString(),
      dosisMax: medicamento.dosis.max ? medicamento.dosis.max.toString() : '',
      tableta1: medicamento.tabletas[0] ? medicamento.tabletas[0].toString() : '',
      tableta2: medicamento.tabletas[1] ? medicamento.tabletas[1].toString() : '',
      tableta3: medicamento.tabletas[2] ? medicamento.tabletas[2].toString() : '',
      tableta4: medicamento.tabletas[3] ? medicamento.tabletas[3].toString() : ''
    });
    setEditingId(medicamento.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este medicamento?')) {
      return;
    }

    try {
      await eliminarMedicamento(id);
      await cargarMedicamentos();
    } catch (error) {
      console.error('Error al eliminar medicamento:', error);
      setError('Error al eliminar el medicamento');
    }
  };

  if (loading) {
    return <Loader text="Cargando medicamentos..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-3xl">⚙️</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Panel de Administración
                </h1>
                <p className="text-gray-600">
                  Gestiona los medicamentos del sistema
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            >
              {showForm ? 'Cancelar' : '+ Agregar Medicamento'}
            </button>
          </div>
        </div>

        {/* Formulario */}
        {showForm && (
          <div className="mb-8 bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingId ? 'Editar' : 'Agregar'} Medicamento
            </h2>
            
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tamaños de Tabletas (mg) *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[1, 2, 3, 4].map((num) => (
                    <div key={num}>
                      <label className="block text-xs text-gray-600 mb-1">
                        Tableta {num}
                      </label>
                      <input
                        type="number"
                        name={`tableta${num}`}
                        value={formData[`tableta${num}`]}
                        onChange={handleInputChange}
                        step="0.1"
                        min="0"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
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

        {/* Lista de medicamentos */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Medicamentos ({medicamentos.length})
            </h3>
          </div>

          {medicamentos.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No hay medicamentos registrados
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marca</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicamento</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Dosis</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Tabletas</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {medicamentos.map((med) => (
                    <tr key={med.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{med.marca}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{med.medicamento}</td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        {med.dosis.min} mg/kg
                        {med.dosis.max && ` - ${med.dosis.max} mg/kg`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        <div className="flex flex-wrap gap-1 justify-center">
                          {med.tabletas.filter(t => t > 0).map((tableta, index) => (
                            <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              {tableta}mg
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 text-center">
                        <div className="flex space-x-2 justify-center">
                          <button
                            onClick={() => handleEdit(med)}
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(med.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
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
      </div>
    </div>
  );
};

export default AdminPanel; 