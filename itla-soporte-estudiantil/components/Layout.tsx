import React from 'react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ user, onLogout, children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-itla-blue text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-2 rounded-md">
                <img 
                  src="https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png" 
                  alt="ITLA Logo" 
                  className="h-10 w-auto"
                />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold tracking-tight">Centro de Soporte Estudiantil</h1>
                <p className="text-xs text-blue-200 uppercase tracking-widest">Excelencia Tecnológica</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-blue-300 capitalize">{user.role === UserRole.ADMIN ? 'Administrador' : user.matricula}</p>
              </div>
              <button 
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-semibold transition-all shadow-sm"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} Instituto Tecnológico de Las Américas (ITLA). Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
