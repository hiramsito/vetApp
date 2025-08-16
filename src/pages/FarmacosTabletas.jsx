import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import InputPeso from '../components/InputPeso';
import TablaResultados from '../components/TablaResultados';
import { obtenerMedicamentos } from '../services/medicamentoService';
import { validarPeso } from '../utils/calculos';

const FarmacosTabletas = () => {
  const [medicamentos, setMedicamentos] = useState([]);
  const [peso, setPeso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [calculado, setCalculado] = useState(false);
  const navigate = useNavigate();

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

  const handlePesoChange = (nuevoPeso) => {
    setPeso(nuevoPeso);
    setCalculado(false);
  };

  const handleCalcular = (pesoCalculado) => {
    if (!validarPeso(pesoCalculado)) {
      return;
    }
    
    setPeso(pesoCalculado);
    setCalculado(true);
  };

  const handleAdminClick = () => {
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">💊</div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Fármacos en Tabletas
                </h1>
                <p className="text-gray-600">
                  Calcula las dosis de medicamentos en presentación de tabletas
                </p>
              </div>
            </div>
            
            {/* Botón de Administración */}
            <button
              onClick={handleAdminClick}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 shadow-md"
            >
              <span>⚙️</span>
              <span>Administrar Medicamentos</span>
            </button>
          </div>
        </div>

        {/* Input de peso */}
        <div className="mb-8">
          <InputPeso 
            onPesoChange={handlePesoChange}
            onCalcular={handleCalcular}
          />
        </div>

        {/* Tabla de resultados */}
        {calculado && peso && (
          <div className="mb-8">
            <TablaResultados
              medicamentos={medicamentos}
              peso={peso}
              loading={loading}
              error={error}
            />
          </div>
        )}

        {/* Información adicional */}
        {!calculado && (
          <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              📋 Información del Módulo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">¿Cómo funciona?</h4>
                <ul className="space-y-1">
                  <li>• Ingresa el peso de la mascota en kilogramos</li>
                  <li>• El sistema calcula automáticamente las dosis</li>
                  <li>• Se muestran las fracciones de tableta necesarias</li>
                  <li>• Puedes gestionar medicamentos desde el botón de administración</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Medicamentos disponibles</h4>
                <p className="mb-2">
                  <strong>Total:</strong> {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-500">
                  Usa el botón "Administrar Medicamentos" para agregar, editar o eliminar medicamentos
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmacosTabletas; 