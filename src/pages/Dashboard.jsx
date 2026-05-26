import { useNavigate } from 'react-router-dom';
import Welcome from '../components/Welcome';
import ProfileSettings from '../components/ProfileSettings';

const Dashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: 'farmacos-tabletas',
      title: 'Fármacos en Tabletas',
      description: 'Cálculo de dosis para medicamentos en presentación de tabletas',
      icon: '💊',
      color: 'from-blue-500 to-blue-600',
      href: '/farmacos-tabletas',
      adminInfo: 'Incluye botón de administración'
    },
    {
      id: 'farmacos-mililitros',
      title: 'Fármacos en Mililitros',
      description: 'Cálculo de dosis para medicamentos líquidos (orales e inyectables)',
      icon: '💉',
      color: 'from-green-500 to-green-600',
      href: '/farmacos-mililitros',
      adminInfo: 'CRUD integrado en cada tabla'
    },
    {
      id: 'farmacos-ansioliticos',
      title: 'Fármacos en Ansiolíticos',
      description: 'Cálculo de dosis para medicamentos ansiolíticos en perros y gatos',
      icon: '😴',
      color: 'from-purple-500 to-purple-600',
      href: '/farmacos-ansioliticos',
      adminInfo: 'CRUD integrado en cada sección'
    },
    {
      id: 'calculo-kilocalorias',
      title: 'Cálculo de Kilocalorías',
      description: 'Cálculo de necesidades calóricas y raciones de alimentos para mascotas',
      icon: '🍽️',
      color: 'from-orange-500 to-orange-600',
      href: '/calculo-kilocalorias',
      adminInfo: 'CRUD integrado en tablas de alimentos'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mensaje de bienvenida */}
        <div className="mb-8">
          <Welcome />
        </div>

        {/* Título principal */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
                                 Bienvenido a VetApp Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Sistema de cálculo de dosis veterinarias. Selecciona el módulo que necesites para comenzar.
          </p>
        </div>

        {/* Grid de módulos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          {modules.map((module) => (
            <div
              key={module.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer border border-gray-200 overflow-hidden"
              onClick={() => navigate(module.href)}
            >
              {/* Header del módulo */}
              <div className={`bg-gradient-to-r ${module.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div className="text-4xl">{module.icon}</div>
                  <div className="text-right">
                    <div className="text-xs opacity-75">Módulo</div>
                  </div>
                </div>
              </div>

              {/* Contenido del módulo */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {module.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {module.description}
                </p>

                {/* Información de administración */}
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-gray-500">⚙️</span>
                    <span className="text-xs text-gray-600">{module.adminInfo}</span>
                  </div>
                </div>

                {/* Botón de acceso */}
                <div className="mt-4">
                  <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                    Acceder al Módulo
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Configuración de perfil */}
        <div className="mb-8">
          <ProfileSettings />
        </div>

        {/* Información adicional */}
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            📋 Información del Sistema
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">🎯 Funcionalidades</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Cálculo automático de dosis basado en peso</li>
                <li>• Gestión de medicamentos (CRUD)</li>
                <li>• Interfaz responsiva y moderna</li>
                <li>• Validaciones de datos</li>
                <li>• Cálculo de kilocalorías y raciones</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-800 mb-2">🔧 Características</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Autenticación segura con Firebase</li>
                <li>• Base de datos en tiempo real</li>
                <li>• Cálculos precisos con decimales</li>
                <li>• Interfaz intuitiva y profesional</li>
                <li>• Perfiles de usuario personalizables</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Nueva Organización Info */}
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-800 mb-2">💡 Nueva Organización</h4>
          <p className="text-blue-700 text-sm">
            Cada módulo ahora incluye sus propias herramientas de administración para una mejor organización y evitar confusiones.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 