import { useState } from 'react';

const InputPeso = ({ onPesoChange, onCalcular }) => {
  const [peso, setPeso] = useState('');
  const [error, setError] = useState('');

  const handlePesoChange = (e) => {
    const value = e.target.value;
    setPeso(value);
    setError('');
    
    if (onPesoChange) {
      onPesoChange(value);
    }
  };

  const handleCalcular = () => {
    const pesoNum = parseFloat(peso);
    
    if (!peso || pesoNum <= 0) {
      setError('Por favor ingresa un peso válido mayor a 0');
      return;
    }
    
    if (pesoNum > 1000) {
      setError('El peso parece ser muy alto. Verifica que esté en kg');
      return;
    }
    
    setError('');
    onCalcular(pesoNum);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleCalcular();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        💉 Cálculo de Dosis
      </h2>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="peso" className="block text-sm font-medium text-gray-700 mb-2">
            Peso de la mascota (kg)
          </label>
          <div className="flex space-x-3">
            <input
              type="number"
              id="peso"
              value={peso}
              onChange={handlePesoChange}
              onKeyPress={handleKeyPress}
              placeholder="Ej: 25.5"
              step="0.1"
              min="0.1"
              max="1000"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            />
            <button
              onClick={handleCalcular}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
            >
              <span>🧮</span>
              <span>Calcular</span>
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          </div>
        )}
        
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="flex items-center space-x-2">
            <span>💡</span>
            <span>
              Ingresa el peso de la mascota en kilogramos para calcular las dosis de medicamentos.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default InputPeso; 