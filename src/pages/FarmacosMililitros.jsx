import { useState, useEffect } from 'react';
import InputPeso from '../components/InputPeso';
import TablaMedicamentosMililitros from '../components/TablaMedicamentosMililitros';
import { 
  obtenerMedicamentosOrales, 
  obtenerMedicamentosInyectables,
  agregarMedicamentoOral,
  agregarMedicamentoInyectable,
  actualizarMedicamentoOral,
  actualizarMedicamentoInyectable,
  eliminarMedicamentoOral,
  eliminarMedicamentoInyectable
} from '../services/medicamentoMililitrosService';
import { validarPeso } from '../utils/calculos';

const FarmacosMililitros = () => {
  const [medicamentosOrales, setMedicamentosOrales] = useState([]);
  const [medicamentosInyectables, setMedicamentosInyectables] = useState([]);
  const [peso, setPeso] = useState(null);
  const [loadingOrales, setLoadingOrales] = useState(true);
  const [loadingInyectables, setLoadingInyectables] = useState(true);
  const [errorOrales, setErrorOrales] = useState('');
  const [errorInyectables, setErrorInyectables] = useState('');
  const [calculado, setCalculado] = useState(false);

  useEffect(() => {
    cargarMedicamentos();
  }, []);

  const cargarMedicamentos = async () => {
    try {
      setLoadingOrales(true);
      setLoadingInyectables(true);
      setErrorOrales('');
      setErrorInyectables('');

      const [orales, inyectables] = await Promise.all([
        obtenerMedicamentosOrales(),
        obtenerMedicamentosInyectables()
      ]);

      setMedicamentosOrales(orales);
      setMedicamentosInyectables(inyectables);
    } catch (error) {
      console.error('Error al cargar medicamentos:', error);
      setErrorOrales('Error al cargar los medicamentos orales');
      setErrorInyectables('Error al cargar los medicamentos inyectables');
    } finally {
      setLoadingOrales(false);
      setLoadingInyectables(false);
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

  // Handlers para medicamentos orales
  const handleAgregarOral = async (medicamento) => {
    try {
      await agregarMedicamentoOral(medicamento);
      await cargarMedicamentos();
    } catch (error) {
      console.error('Error al agregar medicamento oral:', error);
      throw error;
    }
  };

  const handleEditarOral = async (id, medicamento) => {
    try {
      await actualizarMedicamentoOral(id, medicamento);
      await cargarMedicamentos();
    } catch (error) {
      console.error('Error al editar medicamento oral:', error);
      throw error;
    }
  };

  const handleEliminarOral = async (id) => {
    try {
      await eliminarMedicamentoOral(id);
      await cargarMedicamentos();
    } catch (error) {
      console.error('Error al eliminar medicamento oral:', error);
      throw error;
    }
  };

  // Handlers para medicamentos inyectables
  const handleAgregarInyectable = async (medicamento) => {
    try {
      await agregarMedicamentoInyectable(medicamento);
      await cargarMedicamentos();
    } catch (error) {
      console.error('Error al agregar medicamento inyectable:', error);
      throw error;
    }
  };

  const handleEditarInyectable = async (id, medicamento) => {
    try {
      await actualizarMedicamentoInyectable(id, medicamento);
      await cargarMedicamentos();
    } catch (error) {
      console.error('Error al editar medicamento inyectable:', error);
      throw error;
    }
  };

  const handleEliminarInyectable = async (id) => {
    try {
      await eliminarMedicamentoInyectable(id);
      await cargarMedicamentos();
    } catch (error) {
      console.error('Error al eliminar medicamento inyectable:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">💉</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Fármacos en Mililitros
              </h1>
              <p className="text-gray-600">
                Calcula las dosis de medicamentos líquidos (orales e inyectables)
              </p>
            </div>
          </div>
        </div>

        {/* Input de peso */}
        <div className="mb-8">
          <InputPeso 
            onPesoChange={handlePesoChange}
            onCalcular={handleCalcular}
          />
        </div>

        {/* Tablas de resultados */}
        {calculado && peso && (
          <div className="space-y-8">
            {/* Tabla de Medicamentos Orales */}
            <div>
              <TablaMedicamentosMililitros
                medicamentos={medicamentosOrales}
                peso={peso}
                loading={loadingOrales}
                error={errorOrales}
                titulo="Medicamentos Vía Oral"
                tipo="Oral"
                onAgregar={handleAgregarOral}
                onEditar={handleEditarOral}
                onEliminar={handleEliminarOral}
              />
            </div>

            {/* Tabla de Medicamentos Inyectables */}
            <div>
              <TablaMedicamentosMililitros
                medicamentos={medicamentosInyectables}
                peso={peso}
                loading={loadingInyectables}
                error={errorInyectables}
                titulo="Medicamentos Inyectables"
                tipo="Inyectable"
                onAgregar={handleAgregarInyectable}
                onEditar={handleEditarInyectable}
                onEliminar={handleEliminarInyectable}
              />
            </div>
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
                  <li>• Puedes ajustar la dosis manualmente entre mínima y máxima</li>
                  <li>• Se muestran los mililitros totales necesarios</li>
                  <li>• Cada tabla tiene su propio botón para agregar medicamentos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Medicamentos disponibles</h4>
                <p className="mb-2">
                  <strong>Orales:</strong> {medicamentosOrales.length} medicamento{medicamentosOrales.length !== 1 ? 's' : ''}
                </p>
                <p className="mb-2">
                  <strong>Inyectables:</strong> {medicamentosInyectables.length} medicamento{medicamentosInyectables.length !== 1 ? 's' : ''}
                </p>
                <p className="text-xs text-gray-500">
                  Los medicamentos se pueden gestionar directamente desde cada tabla usando los botones "+ Agregar"
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmacosMililitros; 