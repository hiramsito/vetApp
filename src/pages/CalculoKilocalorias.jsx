import { useState, useEffect } from 'react';
import TablaAlimentos from '../components/TablaAlimentos';
import {
  obtenerAlimentos,
  agregarAlimento,
  actualizarAlimento,
  eliminarAlimento
} from '../services/alimentosService';
import {
  calcularKcalBase,
  obtenerFactores,
  determinarFactorCrecimiento,
  calcularKcalConFactor,
  validarPeso,
  formatearDecimal
} from '../utils/calculos';

const CalculoKilocalorias = () => {
  const [alimentos, setAlimentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Estados del formulario
  const [peso, setPeso] = useState('');
  const [tipoMascota, setTipoMascota] = useState('perro');
  const [factorEvaluar, setFactorEvaluar] = useState('adulto-esterilizado');
  const [edad, setEdad] = useState('');
  const [factorSeleccionado, setFactorSeleccionado] = useState(null);
  
  // Estados de cálculos
  const [kcalBase, setKcalBase] = useState(0);
  const [kcalConFactor, setKcalConFactor] = useState(0);
  const [factores, setFactores] = useState({ min: 0, max: 0 });
  const [calculado, setCalculado] = useState(false);

  // Estado para el formulario de alimentos
  const [showFormAlimentos, setShowFormAlimentos] = useState(false);

  useEffect(() => {
    cargarAlimentos();
  }, []);

  useEffect(() => {
    calcularFactores();
  }, [tipoMascota, factorEvaluar, edad]);

  const cargarAlimentos = async () => {
    try {
      setLoading(true);
      setError('');
      const alimentosData = await obtenerAlimentos();
      setAlimentos(alimentosData);
    } catch (error) {
      console.error('Error al cargar alimentos:', error);
      setError('Error al cargar los alimentos');
    } finally {
      setLoading(false);
    }
  };

  const calcularFactores = () => {
    const factoresBase = obtenerFactores(tipoMascota, factorEvaluar);
    const factoresFinales = determinarFactorCrecimiento(tipoMascota, factorEvaluar, parseFloat(edad) || 0, factoresBase);
    setFactores(factoresFinales);
    
    // Actualizar el factor seleccionado al nuevo mínimo cuando cambie el factor a evaluar
    if (factoresFinales.min > 0) {
      setFactorSeleccionado(factoresFinales.min);
    } else {
      setFactorSeleccionado(null);
    }
    
    // Si hay un factor seleccionado y ya se han calculado kcal base, recalcular
    if (factorSeleccionado !== null && kcalBase > 0) {
      const nuevaKcalConFactor = calcularKcalConFactor(kcalBase, factorSeleccionado);
      setKcalConFactor(nuevaKcalConFactor);
    }
  };

  const handleCalcular = () => {
    if (!validarPeso(peso)) {
      alert('Por favor ingresa un peso válido mayor a 0');
      return;
    }

    const pesoNum = parseFloat(peso);
    const nuevaKcalBase = calcularKcalBase(pesoNum, tipoMascota);
    setKcalBase(nuevaKcalBase);
    
    // Si hay un factor seleccionado, calcular con factor
    if (factorSeleccionado !== null) {
      const nuevaKcalConFactor = calcularKcalConFactor(nuevaKcalBase, factorSeleccionado);
      setKcalConFactor(nuevaKcalConFactor);
    }
    
    setCalculado(true);
  };

  const handleFactorChange = (nuevoFactor) => {
    setFactorSeleccionado(nuevoFactor);
    if (calculado && kcalBase > 0) {
      const nuevaKcalConFactor = calcularKcalConFactor(kcalBase, nuevoFactor);
      setKcalConFactor(nuevaKcalConFactor);
    }
  };

  const handleFactorInputChange = (e) => {
    const valor = e.target.value;
    
    // Permitir campo vacío temporalmente
    if (valor === '') {
      setFactorSeleccionado(null);
      return;
    }
    
    const numero = parseFloat(valor);
    
    // Validar que sea un número válido
    if (!isNaN(numero)) {
      // Si está dentro del rango, actualizar
      if (numero >= factores.min && numero <= factores.max) {
        handleFactorChange(numero);
      } else {
        // Si está fuera del rango, solo actualizar el input pero no el factor
        setFactorSeleccionado(numero);
      }
    }
  };

  const handleAgregarAlimento = async (alimento) => {
    try {
      await agregarAlimento(alimento);
      await cargarAlimentos();
    } catch (error) {
      console.error('Error al agregar alimento:', error);
      throw error;
    }
  };

  const handleEditarAlimento = async (id, alimento) => {
    try {
      await actualizarAlimento(id, alimento);
      await cargarAlimentos();
    } catch (error) {
      console.error('Error al editar alimento:', error);
      throw error;
    }
  };

  const handleEliminarAlimento = async (id) => {
    try {
      await eliminarAlimento(id);
      await cargarAlimentos();
    } catch (error) {
      console.error('Error al eliminar alimento:', error);
      throw error;
    }
  };

  // Filtrar opciones según el tipo de mascota
  const obtenerOpcionesFactores = () => {
    const todasLasOpciones = [
      { value: 'adulto-esterilizado', label: 'Adulto esterilizado' },
      { value: 'adulto-entero', label: 'Adulto entero' },
      { value: 'inactivos-obesos', label: 'Inactivos/Obesos' },
      { value: 'perdida-peso', label: 'Pérdida de peso' },
      { value: 'gestacion', label: 'Gestación' },
      { value: 'lactancia', label: 'Lactancia' },
      { value: 'crecimiento', label: 'Crecimiento' },
      { value: 'trabajo-ligero', label: 'Trabajo ligero' },
      { value: 'trabajo-moderado', label: 'Trabajo moderado' },
      { value: 'trabajo-pesado', label: 'Trabajo pesado' }
    ];

    return todasLasOpciones.filter(opcion => {
      const factores = obtenerFactores(tipoMascota, opcion.value);
      return factores.min > 0 || factores.max > 0;
    });
  };

  const opcionesFactores = obtenerOpcionesFactores();
  const mostrarEdad = tipoMascota === 'perro' && factorEvaluar === 'crecimiento';
  const factorEsCero = factores.min === 0 && factores.max === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="text-3xl">🍽️</div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cálculo de Kilocalorías y Raciones
              </h1>
              <p className="text-gray-600">
                Calcula las necesidades calóricas y raciones de alimentos para mascotas
              </p>
            </div>
          </div>
        </div>

        {/* Formulario de entrada */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            📊 Datos de la Mascota
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Peso */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Peso (kg) *
              </label>
              <input
                type="number"
                value={peso}
                onChange={(e) => setPeso(e.target.value)}
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Ej: 25.5"
                required
              />
            </div>

            {/* Tipo de mascota */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Mascota
              </label>
              <select
                value={tipoMascota}
                onChange={(e) => setTipoMascota(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="perro">🐶 Perro</option>
                <option value="gato">🐱 Gato</option>
              </select>
            </div>

            {/* Factor a evaluar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Factor a Evaluar
              </label>
              <select
                value={factorEvaluar}
                onChange={(e) => setFactorEvaluar(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                {opcionesFactores.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Edad (solo para perros en crecimiento) */}
            {mostrarEdad && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edad (meses)
                </label>
                <input
                  type="number"
                  value={edad}
                  onChange={(e) => setEdad(e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 3"
                />
              </div>
            )}
          </div>

          {/* Información de factores */}
          {factores.min > 0 || factores.max > 0 ? (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-blue-800 mb-2">📋 Factores Disponibles</h4>
                  <p className="text-blue-700 text-sm">
                    Mínimo: {factores.min} | Máximo: {factores.max}
                  </p>
                </div>
                
                {/* Selector de factor */}
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-blue-800">
                    Factor Seleccionado:
                  </label>
                  <input
                    type="number"
                    value={factorSeleccionado || ''}
                    onChange={handleFactorInputChange}
                    min={factores.min}
                    max={factores.max}
                    step="0.1"
                    className="w-20 px-2 py-1 text-sm border border-blue-300 rounded focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Factor"
                  />
                  {factorSeleccionado !== null && (factorSeleccionado < factores.min || factorSeleccionado > factores.max) && (
                    <span className="text-xs text-red-600">
                      Fuera de rango
                    </span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-600">⚠️</span>
                <span className="text-yellow-800 text-sm">
                  Este factor no aplica para {tipoMascota === 'perro' ? 'perros' : 'gatos'}
                </span>
              </div>
            </div>
          )}

          {/* Botón calcular */}
          <div className="mt-6">
            <button
              onClick={handleCalcular}
              disabled={!peso || factorEsCero}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Calcular Kilocalorías
            </button>
          </div>
        </div>

        {/* Resultados */}
        {calculado && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              📈 Resultados de Cálculo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-800 mb-2">Kilocalorías Base</h3>
                <p className="text-2xl font-bold text-green-600">
                  {formatearDecimal(kcalBase)} kcal/día
                </p>
                <p className="text-sm text-green-700 mt-1">
                  {tipoMascota === 'perro' ? 'Fórmula: peso^0.75 × 70' : 'Fórmula: peso × 50'}
                </p>
              </div>

              {factorSeleccionado && factorSeleccionado > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-800 mb-2">Factor Aplicado</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {factorSeleccionado}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Factor seleccionado
                  </p>
                </div>
              )}

              {kcalConFactor > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <h3 className="font-medium text-purple-800 mb-2">Kilocalorías con Factor</h3>
                  <p className="text-2xl font-bold text-purple-600">
                    {formatearDecimal(kcalConFactor)} kcal/día
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    Base × Factor
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gestión de Alimentos (Unificado) */}
        {calculado && (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                🍽️ Gestión de Alimentos
              </h2>
              <button
                onClick={() => setShowFormAlimentos(!showFormAlimentos)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                {showFormAlimentos ? 'Cancelar' : '+ Agregar Alimento'}
              </button>
            </div>
            
            <div className="space-y-8">
              {/* Tabla 1: Sin factor de crecimiento */}
              <div>
                <TablaAlimentos
                  alimentos={alimentos}
                  kcalDiarias={kcalBase}
                  titulo="Sin Factor de Crecimiento"
                  loading={loading}
                  error={error}
                  onAgregar={handleAgregarAlimento}
                  onEditar={handleEditarAlimento}
                  onEliminar={handleEliminarAlimento}
                  mostrarBotonAgregar={false}
                  showForm={showFormAlimentos}
                  onToggleForm={() => setShowFormAlimentos(!showFormAlimentos)}
                />
              </div>

              {/* Tabla 2: Con factor de crecimiento */}
              {factorSeleccionado && factorSeleccionado > 0 && (
                <div>
                  <TablaAlimentos
                    alimentos={alimentos}
                    kcalDiarias={kcalConFactor}
                    titulo="Con Factor de Crecimiento"
                    loading={loading}
                    error={error}
                    onAgregar={handleAgregarAlimento}
                    onEditar={handleEditarAlimento}
                    onEliminar={handleEliminarAlimento}
                    mostrarBotonAgregar={false}
                    showForm={false}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Información adicional */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-800 mb-2">📋 Información del Módulo</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p><strong>🍽️ Funcionalidades:</strong> Cálculo automático de kilocalorías y raciones de alimentos.</p>
            <p><strong>📊 Tablas:</strong> Muestra raciones en diferentes frecuencias (BID, TID, QID).</p>
            <p><strong>⚙️ Gestión:</strong> Agregar, editar y eliminar alimentos desde las tablas.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculoKilocalorias; 