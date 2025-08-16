import { dosisMgKg, fraccionTableta, formatearDecimal } from '../utils/calculos';

const MedicamentoRow = ({ medicamento, peso }) => {
  const { marca, medicamento: nombreMed, dosis, tabletas } = medicamento;
  
  // Filtrar tabletas que no sean 0 o null
  const tabletasValidas = tabletas.filter(t => t > 0);

  const calcularDosisMin = () => {
    return dosisMgKg(peso, dosis.min);
  };

  const calcularDosisMax = () => {
    return dosis.max ? dosisMgKg(peso, dosis.max) : null;
  };

  // Colores para los diferentes tamaños de tabletas
  const coloresTabletas = [
    'text-blue-600 bg-blue-50',    // 1° tableta - Azul
    'text-purple-600 bg-purple-50', // 2° tableta - Púrpura
    'text-green-600 bg-green-50',   // 3° tableta - Verde
    'text-orange-600 bg-orange-50'  // 4° tableta - Naranja
  ];

  const renderFracciones = (dosisMgKg, tipo) => {
    return tabletasValidas.map((tableta, index) => {
      const fraccion = fraccionTableta(dosisMgKg, tableta);
      const colorClase = coloresTabletas[index] || 'text-gray-600 bg-gray-50';
      const numeroTableta = `${index + 1}°`;
      
      return (
        <div key={index} className="flex items-center justify-center space-x-2 mb-2">
          <span className={`text-xs font-medium px-2 py-1 rounded ${
            tipo === 'min' 
              ? 'text-green-600 bg-green-50' 
              : 'text-gray-600 bg-gray-50'
          }`}>
            {tipo === 'min' ? 'Mín' : 'Máx'}
          </span>
          <span className={`text-sm font-medium ${colorClase.split(' ')[0]}`}>
            {formatearDecimal(fraccion)}
          </span>
          <span className={`text-xs font-medium px-2 py-1 rounded ${colorClase}`}>
            {numeroTableta}
          </span>
          <span className="text-xs text-gray-400">
            de {tableta}mg
          </span>
        </div>
      );
    });
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      {/* Marca Comercial */}
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {marca}
      </td>
      
      {/* Medicamento */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {nombreMed}
      </td>
      
      {/* Dosis estándar */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              Mín
            </span>
            <span className="font-medium text-green-600">
              {dosis.min} mg/kg
            </span>
          </div>
          {dosis.max && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                Máx
              </span>
              <span className="text-xs text-gray-500">
                {dosis.max} mg/kg
              </span>
            </div>
          )}
        </div>
      </td>
      
      {/* Tamaños de tabletas */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="flex flex-wrap gap-1 justify-center">
          {tabletasValidas.map((tableta, index) => {
            const colorClase = coloresTabletas[index] || 'text-gray-600 bg-gray-50';
            const numeroTableta = `${index + 1}°`;
            
            return (
              <div key={index} className="flex items-center space-x-1">
                <span className={`text-xs font-medium px-2 py-1 rounded ${colorClase}`}>
                  {numeroTableta}
                </span>
                <span className={`text-xs font-medium ${colorClase.split(' ')[0]}`}>
                  {tableta}mg
                </span>
              </div>
            );
          })}
        </div>
      </td>
      
      {/* Dosis mg*kg */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              Mín
            </span>
            <span className="font-medium text-green-600">
              {formatearDecimal(calcularDosisMin())} mg
            </span>
          </div>
          {dosis.max && (
            <div className="flex items-center justify-center space-x-2">
              <span className="text-xs font-medium text-gray-600 bg-gray-50 px-2 py-1 rounded">
                Máx
              </span>
              <span className="text-xs text-gray-500">
                {formatearDecimal(calcularDosisMax())} mg
              </span>
            </div>
          )}
        </div>
      </td>
      
      {/* Fracción de tableta (mínima) */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="flex flex-col space-y-1">
          {renderFracciones(calcularDosisMin(), 'min')}
        </div>
      </td>
      
      {/* Fracción de tableta (máxima) - solo si existe dosis máxima */}
      {dosis.max && (
        <td className="px-4 py-3 text-sm text-gray-700">
          <div className="flex flex-col space-y-1">
            {renderFracciones(calcularDosisMax(), 'max')}
          </div>
        </td>
      )}
    </tr>
  );
};

export default MedicamentoRow; 