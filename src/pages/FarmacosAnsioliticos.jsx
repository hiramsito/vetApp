import { useState, useEffect } from 'react';
import InputPeso from '../components/InputPeso';
import TablaAnsioliticosPerros from '../components/TablaAnsioliticosPerros';
import TablaAnsioliticosGatos from '../components/TablaAnsioliticosGatos';
import {
  obtenerAnsioliticosPerros,
  obtenerAnsioliticosGatos,
  agregarAnsioliticoPerro,
  agregarAnsioliticoGato,
  actualizarAnsioliticoPerro,
  actualizarAnsioliticoGato,
  eliminarAnsioliticoPerro,
  eliminarAnsioliticoGato
} from '../services/ansioliticosService';
import { validarPeso } from '../utils/calculos';

const FarmacosAnsioliticos = () => {
  const [ansioliticosPerros, setAnsioliticosPerros] = useState([]);
  const [ansioliticosGatos, setAnsioliticosGatos] = useState([]);
  const [peso, setPeso] = useState(null);
  const [loadingPerros, setLoadingPerros] = useState(true);
  const [loadingGatos, setLoadingGatos] = useState(true);
  const [errorPerros, setErrorPerros] = useState('');
  const [errorGatos, setErrorGatos] = useState('');
  const [calculado, setCalculado] = useState(false);
  const [activeTab, setActiveTab] = useState('perros'); // 'perros' o 'gatos'

  useEffect(() => {
    cargarAnsioliticos();
  }, []);

  const cargarAnsioliticos = async () => {
    try {
      setLoadingPerros(true);
      setLoadingGatos(true);
      setErrorPerros('');
      setErrorGatos('');

      const [perros, gatos] = await Promise.all([
        obtenerAnsioliticosPerros(),
        obtenerAnsioliticosGatos()
      ]);

      setAnsioliticosPerros(perros);
      setAnsioliticosGatos(gatos);
    } catch (error) {
      console.error('Error al cargar ansiolíticos:', error);
      setErrorPerros('Error al cargar ansiolíticos para perros');
      setErrorGatos('Error al cargar ansiolíticos para gatos');
    } finally {
      setLoadingPerros(false);
      setLoadingGatos(false);
    }
  };

  const handlePesoChange = (nuevoPeso) => {
    setPeso(nuevoPeso);
    setCalculado(false);
  };

  const handleCalcular = (pesoCalculado) => {
    if (validarPeso(pesoCalculado)) {
      setPeso(pesoCalculado);
      setCalculado(true);
    }
  };

  // Handlers para perros
  const handleAgregarPerro = async (ansiolitico) => {
    try {
      await agregarAnsioliticoPerro(ansiolitico);
      await cargarAnsioliticos();
    } catch (error) {
      console.error('Error al agregar ansiolítico para perros:', error);
      throw error;
    }
  };

  const handleEditarPerro = async (id, ansiolitico) => {
    try {
      await actualizarAnsioliticoPerro(id, ansiolitico);
      await cargarAnsioliticos();
    } catch (error) {
      console.error('Error al editar ansiolítico para perros:', error);
      throw error;
    }
  };

  const handleEliminarPerro = async (id) => {
    try {
      await eliminarAnsioliticoPerro(id);
      await cargarAnsioliticos();
    } catch (error) {
      console.error('Error al eliminar ansiolítico para perros:', error);
      throw error;
    }
  };

  // Handlers para gatos
  const handleAgregarGato = async (ansiolitico) => {
    try {
      await agregarAnsioliticoGato(ansiolitico);
      await cargarAnsioliticos();
    } catch (error) {
      console.error('Error al agregar ansiolítico para gatos:', error);
      throw error;
    }
  };

  const handleEditarGato = async (id, ansiolitico) => {
    try {
      await actualizarAnsioliticoGato(id, ansiolitico);
      await cargarAnsioliticos();
    } catch (error) {
      console.error('Error al editar ansiolítico para gatos:', error);
      throw error;
    }
  };

  const handleEliminarGato = async (id) => {
    try {
      await eliminarAnsioliticoGato(id);
      await cargarAnsioliticos();
    } catch (error) {
      console.error('Error al eliminar ansiolítico para gatos:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">😴</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Fármacos en Ansiolíticos
              </h1>
              <p className="text-gray-600">
                Cálculo de dosis para medicamentos ansiolíticos en perros y gatos
              </p>
            </div>
          </div>
        </div>

        {/* Input de peso (solo para perros) */}
        {activeTab === 'perros' && (
          <div className="mb-8">
            <InputPeso 
              onPesoChange={handlePesoChange}
              onCalcular={handleCalcular}
              placeholder="Ingresa el peso del perro en kg"
            />
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('perros')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'perros'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🐶 Perros
              </button>
              <button
                onClick={() => setActiveTab('gatos')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'gatos'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                🐱 Gatos
              </button>
            </nav>
          </div>
        </div>

        {/* Contenido de las tabs */}
        {activeTab === 'perros' && (
          <div>
            {calculado && peso ? (
              <TablaAnsioliticosPerros
                ansioliticos={ansioliticosPerros}
                peso={peso}
                loading={loadingPerros}
                error={errorPerros}
                onAgregar={handleAgregarPerro}
                onEditar={handleEditarPerro}
                onEliminar={handleEliminarPerro}
              />
            ) : (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span>💡</span>
                  <span>Ingresa el peso del perro para ver los cálculos de dosis</span>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'gatos' && (
          <div>
            <TablaAnsioliticosGatos
              ansioliticos={ansioliticosGatos}
              loading={loadingGatos}
              error={errorGatos}
              onAgregar={handleAgregarGato}
              onEditar={handleEditarGato}
              onEliminar={handleEliminarGato}
            />
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">📋 Información del Módulo</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>🐶 Sección Perros:</strong> Incluye cálculos dinámicos basados en el peso ingresado.</p>
            <p><strong>🐱 Sección Gatos:</strong> Muestra información de referencia sin cálculos.</p>
            <p><strong>💊 Funcionalidades:</strong> Agregar, editar y eliminar ansiolíticos para ambas especies.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmacosAnsioliticos; 