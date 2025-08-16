import MedicamentoRow from './MedicamentoRow';
import Loader from './Loader';

const TablaResultados = ({ medicamentos, peso, loading, error }) => {
  if (loading) {
    return <Loader text="Cargando medicamentos..." />;
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

  if (!medicamentos || medicamentos.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <span>📋</span>
          <span>No hay medicamentos disponibles. Agrega algunos desde el panel de administración.</span>
        </div>
      </div>
    );
  }

  // Determinar si algún medicamento tiene dosis máxima para mostrar la columna
  const tieneDosisMaxima = medicamentos.some(med => med.dosis.max);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          📊 Resultados para {peso} kg
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {medicamentos.length} medicamento{medicamentos.length !== 1 ? 's' : ''} encontrado{medicamentos.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr className="border-b border-gray-200">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Marca Comercial
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Medicamento
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosis Estándar
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tamaños de Tabletas
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dosis mg*kg
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fracción de Tableta (Mín)
              </th>
              {tieneDosisMaxima && (
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fracción de Tableta (Máx)
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicamentos.map((medicamento) => (
              <MedicamentoRow
                key={medicamento.id}
                medicamento={medicamento}
                peso={peso}
                tieneDosisMaxima={tieneDosisMaxima}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p className="flex items-center space-x-2">
            <span>💡</span>
            <span>
              Los resultados muestran las dosis calculadas y las fracciones de tableta necesarias para cada medicamento.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TablaResultados; 