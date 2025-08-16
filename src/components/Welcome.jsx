import { useAuth } from '../context/AuthContext';

const Welcome = () => {
  const { user, userProfile } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  const getUserName = () => {
    if (!user) return 'Usuario';
    
    // Si hay un perfil con nombre personalizado, usarlo
    if (userProfile && userProfile.nombre && userProfile.nombre.trim()) {
      return userProfile.nombre;
    }
    
    // Si no hay nombre personalizado, intentar obtener el nombre del email
    const email = user.email;
    if (email) {
      const name = email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    
    return user.displayName || 'Usuario';
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center space-x-4">
        <div className="text-4xl">👋</div>
        <div>
          <h2 className="text-2xl font-bold">
            {getGreeting()}, {getUserName()}!
          </h2>
          <p className="text-blue-100 mt-1">
            Bienvenido al sistema de cálculo de dosis veterinarias
          </p>
        </div>
      </div>
    </div>
  );
};

export default Welcome; 