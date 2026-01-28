import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { api } from '../services/api';

interface AuthProps {
  onLogin: (user: User) => void;
}

const ITLA_CAREERS = [
  "Desarrollo de Software",
  "Redes de Información",
  "Ciberseguridad",
  "Multimedia",
  "Mecatrónica",
  "Manufactura Automatizada",
  "Inteligencia Artificial",
  "Energías Renovables",
  "Diseño Industrial",
  "Sonido"
];

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    matricula: '',
    personalEmail: '',
    phone: '',
    career: ITLA_CAREERS[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isLogin) {
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password
        }, null); // null = no usar token (ruta pública)

        if (response && response.token) {
          localStorage.setItem('token', response.token);
          // Save user info too if needed for rapid access without fetch
          localStorage.setItem('user_info', JSON.stringify(response.user));
          onLogin(response.user);
        }
      } else {
        const registerData = {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          password: formData.password,
          role: UserRole.STUDENT,
          matricula: formData.matricula,
          personal_email: formData.personalEmail,
          phone: formData.phone,
          career: formData.career
        };

        const response = await api.post('/auth/register', registerData, null); // null = no usar token (ruta pública)
        if (response) {
          // Auto login after register
          const loginResponse = await api.post('/auth/login', {
            email: formData.email,
            password: formData.password
          }, null); // null = no usar token (ruta pública)

          if (loginResponse && loginResponse.token) {
            localStorage.setItem('token', loginResponse.token);
            localStorage.setItem('user_info', JSON.stringify(loginResponse.user));
            onLogin(loginResponse.user);
          }
        }
      }
    } catch (err: any) {
      setError(err.message || "Error de autenticación. Verifique sus credenciales.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsAdmin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Using the default admin credentials created in database.sql
      const response = await api.post('/auth/login', {
        email: 'admin@itla.edu.do',
        password: 'admin123'
      }, null); // null = no usar token (ruta pública)

      if (response && response.token) {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user_info', JSON.stringify(response.user));
        onLogin(response.user);
      }
    } catch (err: any) {
      setError("Error de conexión con el servidor o credenciales inválidas. Asegúrese de que el backend esté corriendo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[url('https://itla.edu.do/wp-content/uploads/2021/04/banner-home.jpg')] bg-cover bg-center relative">
      <div className="absolute inset-0 bg-[#002855]/90 backdrop-blur-md"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="flex justify-center mb-8">
          <div className="bg-white p-5 rounded-[2rem] shadow-2xl transform -rotate-2">
            <img src="https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png" alt="ITLA" className="h-16 w-auto" />
          </div>
        </div>
        <h2 className="text-center text-4xl font-black text-white tracking-tight drop-shadow-md">
          {isLogin ? 'Portal de Soporte' : 'Registro Estudiantil'}
        </h2>
        <p className="text-center text-blue-200 mt-2 font-medium">Soporte técnico y solicitudes académicas</p>
      </div>

      <div className={`mt-10 sm:mx-auto sm:w-full ${!isLogin ? 'sm:max-w-2xl' : 'sm:max-w-md'} relative z-10 px-4 transition-all duration-300`}>
        <div className="bg-white py-10 px-6 shadow-2xl rounded-[2.5rem] border-t-8 border-itla-accent sm:px-12">

          <div className="flex mb-8 rounded-2xl bg-slate-100 p-1.5 shadow-inner">
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all uppercase tracking-wider ${isLogin ? 'bg-white shadow-md text-[#003876]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 py-3 text-sm font-black rounded-xl transition-all uppercase tracking-wider ${!isLogin ? 'bg-white shadow-md text-[#003876]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Registrarse
            </button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border-l-4 border-red-500 font-bold text-sm animate-fadeIn">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Juan"
                    className="block w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#003876] outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Apellidos</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Pérez"
                    className="block w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#003876] outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Matrícula Estudiantil</label>
                  <input
                    type="text"
                    required
                    placeholder="20XX-XXXX"
                    className="block w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#003876] outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className={`grid grid-cols-1 ${!isLogin ? 'md:grid-cols-2' : ''} gap-6`}>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Correo Institucional</label>
                <input
                  type="email"
                  required
                  placeholder="usuario@itla.edu.do"
                  className="block w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#003876] outline-none transition-all placeholder:text-slate-300"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Correo Personal</label>
                  <input
                    type="email"
                    required
                    placeholder="ejemplo@gmail.com"
                    className="block w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#003876] outline-none transition-all placeholder:text-slate-300"
                    onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                  />
                </div>
              )}
            </div>

            {!isLogin && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Número de Celular</label>
                  <input
                    type="tel"
                    required
                    placeholder="809-000-0000"
                    className="block w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#003876] outline-none transition-all placeholder:text-slate-300"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Carrera</label>
                  <select
                    className="block w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#003876] outline-none transition-all"
                    value={formData.career}
                    onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                  >
                    {ITLA_CAREERS.map(career => (
                      <option key={career} value={career}>{career}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Contraseña</label>
              <input
                type="password"
                required
                className="block w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-3.5 px-4 text-slate-900 font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#003876] outline-none transition-all"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 border-b-4 border-[#002855] rounded-2xl shadow-xl text-sm font-black text-white bg-[#003876] hover:bg-slate-800 transition-all uppercase tracking-[0.2em] active:scale-95 disabled:opacity-50"
            >
              {isLoading ? 'Procesando...' : (isLogin ? 'Acceder al Portal' : 'Completar Registro')}
            </button>
          </form>

          {isLogin && (
            <div className="mt-8 pt-8 border-t-2 border-slate-100">
              <button
                onClick={loginAsAdmin}
                disabled={isLoading}
                className="w-full py-3 bg-slate-50 border-2 border-slate-200 rounded-2xl text-[11px] font-black text-[#003876] hover:bg-itla-accent transition-all uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                {isLoading ? 'Conectando...' : 'Acceso Rápido Administrador'}
              </button>
              <p className="text-[10px] text-center text-slate-400 mt-2 font-mono">Credenciales Admin: admin@itla.edu.do / admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
