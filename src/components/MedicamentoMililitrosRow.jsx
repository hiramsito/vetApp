import { useState } from 'react';
import { dosisMgKg, mililitrosTotales, formatearDecimal, validarDosis } from '../utils/calculos';

const MedicamentoMililitrosRow = ({ medicamento, peso, onUpdate }) => {
  const { 
    id, 
    concentracion, 
    marca, 
    medicamento: nombreMed, 
    dosis, 
    mgPorMl 
  } = medicamento;
  
  const [dosisSeleccionada, setDosisSeleccionada] = useState(dosis.min);

  // Cálculos automáticos
  const dosisMinMgKg = dosisMgKg(peso, dosis.min);
  const dosisMaxMgKg = dosis.max ? dosisMgKg(peso, dosis.max) : null;
  const dosisSeleccionadaMgKg = dosisMgKg(peso, dosisSeleccionada);

  const mlMin = mililitrosTotales(dosisMinMgKg, mgPorMl);
  const mlMax = dosisMaxMgKg ? mililitrosTotales(dosisMaxMgKg, mgPorMl) : null;
  const mlSeleccionado = mililitrosTotales(dosisSeleccionadaMgKg, mgPorMl);

  const handleDosisChange = (e) => {
    const nuevaDosis = parseFloat(e.target.value);
    if (validarDosis(nuevaDosis, dosis.min, dosis.max)) {
      setDosisSeleccionada(nuevaDosis);
      if (onUpdate) {
        onUpdate(id, { ...medicamento, dosisSeleccionada: nuevaDosis });
      }
    }
  };

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
      {/* Concentración Comercial */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="font-medium text-gray-900">{concentracion}</div>
      </td>
      
      {/* Marca Comercial */}
      <td className="px-4 py-3 text-sm font-medium text-gray-900">
        {marca}
      </td>
      
      {/* Nombre del Medicamento */}
      <td className="px-4 py-3 text-sm text-gray-700">
        {nombreMed}
      </td>
      
      {/* Dosis Estándar en Mg */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="text-center">
          <div className="font-medium">{dosis.min} mg/kg</div>
          {dosis.max && (
            <div className="text-xs text-gray-500">
              hasta {dosis.max} mg/kg
            </div>
          )}
        </div>
      </td>
      
      {/* Selección de Dosis */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="flex flex-col space-y-1">
          <input
            type="number"
            value={dosisSeleccionada}
            onChange={handleDosisChange}
            min={dosis.min}
            max={dosis.max || dosis.min}
            step="0.1"
            className="w-20 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="text-xs text-gray-500">
            mg/kg
          </div>
        </div>
      </td>
      
      {/* Miligramos en 1 ml */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="text-center">
          <div className="font-medium">{mgPorMl} mg/ml</div>
        </div>
      </td>
      
      {/* Dosis Mg*Kg */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="text-center space-y-1">
          <div className="font-medium text-green-600">
            {formatearDecimal(dosisMinMgKg)} mg
          </div>
          {dosisMaxMgKg && (
            <div className="text-xs text-gray-500">
              hasta {formatearDecimal(dosisMaxMgKg)} mg
            </div>
          )}
          <div className="text-xs text-blue-600 font-medium">
            {formatearDecimal(dosisSeleccionadaMgKg)} mg
          </div>
        </div>
      </td>
      
      {/* Mililitros Totales */}
      <td className="px-4 py-3 text-sm text-gray-700">
        <div className="text-center space-y-1">
          <div className="font-medium text-green-600">
            {formatearDecimal(mlMin)} ml
          </div>
          {mlMax && (
            <div className="text-xs text-gray-500">
              hasta {formatearDecimal(mlMax)} ml
            </div>
          )}
          <div className="text-xs text-blue-600 font-medium">
            {formatearDecimal(mlSeleccionado)} ml
          </div>
        </div>
      </td>
    </tr>
  );
};

export default MedicamentoMililitrosRow; 