import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import FarmacosTabletas from './pages/FarmacosTabletas';
import FarmacosMililitros from './pages/FarmacosMililitros';
import FarmacosAnsioliticos from './pages/FarmacosAnsioliticos';
import CalculoKilocalorias from './pages/CalculoKilocalorias';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Ruta pública */}
            <Route path="/login" element={<Login />} />
            
            {/* Rutas protegidas */}
            <Route path="/" element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/farmacos-tabletas" element={
              <ProtectedRoute>
                <MainLayout>
                  <FarmacosTabletas />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/farmacos-mililitros" element={
              <ProtectedRoute>
                <MainLayout>
                  <FarmacosMililitros />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/farmacos-ansioliticos" element={
              <ProtectedRoute>
                <MainLayout>
                  <FarmacosAnsioliticos />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/calculo-kilocalorias" element={
              <ProtectedRoute>
                <MainLayout>
                  <CalculoKilocalorias />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/admin" element={
              <ProtectedRoute>
                <MainLayout>
                  <AdminPanel />
                </MainLayout>
              </ProtectedRoute>
            } />
            
            {/* Redirección por defecto */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
