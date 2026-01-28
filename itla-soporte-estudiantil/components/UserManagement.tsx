import React, { useState } from 'react';
import { User, UserRole } from '../types';

interface UserManagementProps {
  users: User[];
  onSaveUser: (userData: User) => void;
  onDeleteUser: (userId: string) => void;
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

const UserManagement: React.FC<UserManagementProps> = ({ users, onSaveUser, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'form'>('list');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: UserRole.STUDENT,
    matricula: '',
    personalEmail: '',
    phone: '',
    career: ITLA_CAREERS[0],
    password: '',
    confirmPassword: ''
  });

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.matricula?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openAddForm = () => {
    setEditingUser(null);
    setShowPasswordFields(true);
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: UserRole.STUDENT,
      matricula: '',
      personalEmail: '',
      phone: '',
      career: ITLA_CAREERS[0],
      password: '',
      confirmPassword: ''
    });
    setView('form');
  };

  const openEditForm = (user: User) => {
    setEditingUser(user);
    setShowPasswordFields(false);
    
    const nameParts = user.name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    setFormData({
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      role: user.role,
      matricula: user.matricula || '',
      personalEmail: user.personalEmail || '',
      phone: user.phone || '',
      career: user.career || ITLA_CAREERS[0],
      password: '',
      confirmPassword: ''
    });
    setView('form');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showPasswordFields && formData.password !== formData.confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
    }

    const userData: User = {
        id: editingUser ? editingUser.id : Math.random().toString(36).substr(2, 9),
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        role: formData.role,
        matricula: formData.role === UserRole.STUDENT ? formData.matricula : undefined,
        personalEmail: formData.role === UserRole.STUDENT ? formData.personalEmail : undefined,
        phone: formData.role === UserRole.STUDENT ? formData.phone : undefined,
        career: formData.role === UserRole.STUDENT ? formData.career : undefined,
        createdAt: editingUser ? editingUser.createdAt : new Date().toISOString()
    };
    
    onSaveUser(userData);
    setView('list');
  };

  if (view === 'form') {
    return (
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden animate-fadeIn">
        <div className="p-8 md:p-12 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <div>
                <button 
                    onClick={() => setView('list')}
                    className="flex items-center gap-2 text-[#003876] font-black uppercase tracking-widest text-[10px] mb-4 hover:translate-x-[-4px] transition-transform"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
                    Regresar al Directorio
                </button>
                <h3 className="text-3xl font-black text-[#002855] tracking-tight">
                    {editingUser ? 'Edición de Perfil' : 'Alta de Personal de Soporte'}
                </h3>
                <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Asignación de Roles y Departamentos</p>
            </div>
            <div className="hidden md:block">
                <img src="https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png" alt="ITLA" className="h-12 opacity-20" />
            </div>
        </div>

        <form onSubmit={handleFormSubmit} className="p-8 md:p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Nombre</label>
                    <input 
                        type="text" required
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:border-[#003876] outline-none transition-all"
                        placeholder="Nombre"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    />
                </div>
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Apellidos</label>
                    <input 
                        type="text" required
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:border-[#003876] outline-none transition-all"
                        placeholder="Apellidos"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    />
                </div>
                
                <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Correo Electrónico Institucional</label>
                    <input 
                        type="email" required
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:border-[#003876] outline-none transition-all"
                        placeholder="usuario@itla.edu.do"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                </div>

                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Rol / Departamento Asignado</label>
                    <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:border-[#003876] outline-none transition-all"
                        value={formData.role}
                        onChange={(e) => setFormData({...formData, role: e.target.value as UserRole})}
                    >
                        <option value={UserRole.STUDENT}>Estudiante</option>
                        <option value={UserRole.ADMIN}>Super Administrador</option>
                        <option value={UserRole.TECNOLOGIA}>Soporte Tecnología (SIGEI)</option>
                        <option value={UserRole.DTE}>Soporte DTE (Virtual)</option>
                        <option value={UserRole.SEGURIDAD}>Seguridad IT (Correo)</option>
                    </select>
                </div>

                {formData.role === UserRole.STUDENT && (
                    <>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Matrícula</label>
                            <input 
                                type="text" required
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:border-[#003876] outline-none"
                                placeholder="20XX-XXXX"
                                value={formData.matricula}
                                onChange={(e) => setFormData({...formData, matricula: e.target.value})}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Carrera</label>
                            <select 
                                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:border-[#003876] outline-none"
                                value={formData.career}
                                onChange={(e) => setFormData({...formData, career: e.target.value})}
                            >
                                {ITLA_CAREERS.map(career => (
                                    <option key={career} value={career}>{career}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
            </div>

            <div className="pt-10 border-t border-slate-100">
                <div className="flex items-center justify-between mb-6">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Credenciales de Acceso</label>
                    {editingUser && (
                        <button 
                            type="button" 
                            onClick={() => setShowPasswordFields(!showPasswordFields)}
                            className={`text-[9px] font-black uppercase px-4 py-2 rounded-xl transition-all ${showPasswordFields ? 'bg-red-50 text-red-600' : 'bg-[#003876] text-white shadow-md'}`}
                        >
                            {showPasswordFields ? 'Cerrar Seguridad' : 'Cambiar Contraseña'}
                        </button>
                    )}
                </div>
                
                {showPasswordFields && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                        <input 
                            type="password" required={showPasswordFields}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:border-[#003876] outline-none"
                            placeholder="Contraseña"
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                        />
                        <input 
                            type="password" required={showPasswordFields}
                            className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 focus:border-[#003876] outline-none"
                            placeholder="Confirmar"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        />
                    </div>
                )}
            </div>

            <div className="pt-10 flex flex-col sm:flex-row gap-6">
                <button 
                    type="submit" 
                    className="flex-1 py-5 bg-[#003876] text-white rounded-2xl font-black uppercase tracking-widest transition-all hover:bg-slate-800 shadow-xl active:scale-95 border-b-4 border-slate-900 active:border-b-0"
                >
                  {editingUser ? 'Actualizar Perfil' : 'Finalizar Registro'}
                </button>
                <button 
                    type="button" 
                    onClick={() => setView('list')} 
                    className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-2xl text-slate-500 font-black uppercase tracking-widest transition-all hover:bg-slate-50"
                >
                  Cancelar
                </button>
            </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-200 overflow-hidden">
        <div className="p-8 md:p-10 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-50/50">
          <div>
            <h3 className="text-3xl font-black text-[#002855] tracking-tight">Directorio de Usuarios ITLA</h3>
            <p className="text-slate-500 font-bold mt-1 uppercase tracking-widest text-[10px]">Gestión Departamental de Accesos</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                  <input 
                      type="text"
                      placeholder="Filtrar por nombre o ID..."
                      className="w-full sm:w-72 bg-white border-2 border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-slate-800 font-bold focus:ring-4 focus:ring-blue-100 focus:border-[#003876] outline-none transition-all"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <svg className="w-5 h-5 text-slate-400 absolute left-4 top-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <button 
                onClick={openAddForm}
                className="bg-[#003876] hover:bg-slate-800 text-white font-black px-8 py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-xl active:scale-95 uppercase tracking-widest text-xs border-b-4 border-slate-900 active:border-b-0"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                Alta de Personal
              </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-100/50 border-b border-slate-200">
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Perfil Institucional</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identificación</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Nivel de Acceso / Depto.</th>
                <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Controles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-10 py-8">
                    <div className="flex items-center gap-5">
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${user.role === UserRole.ADMIN ? 'bg-amber-100 text-amber-700' : 'bg-[#003876] text-white'}`}>
                          {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                          <p className="text-slate-800 font-black tracking-tight text-lg">{user.name}</p>
                          <p className="text-slate-500 text-xs font-bold">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-8">
                     <span className="font-black text-slate-600 text-xs bg-slate-200/50 px-4 py-2 rounded-xl border border-slate-200">
                        {user.role === UserRole.STUDENT ? (user.matricula || '---') : 'PERSONAL IT'}
                     </span>
                  </td>
                  <td className="px-6 py-8">
                    <span className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border-2 ${
                      user.role === UserRole.ADMIN ? 'bg-amber-50 text-amber-600 border-amber-200' : 
                      user.role === UserRole.TECNOLOGIA ? 'bg-purple-50 text-purple-600 border-purple-200' :
                      user.role === UserRole.DTE ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                      user.role === UserRole.SEGURIDAD ? 'bg-red-50 text-red-600 border-red-200' :
                      'bg-blue-50 text-[#003876] border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                          onClick={() => openEditForm(user)}
                          className="p-4 bg-white border-2 border-slate-100 text-[#003876] rounded-2xl hover:bg-[#003876] hover:text-white transition-all shadow-md"
                          title="Editar Perfil"
                      >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button 
                          onClick={() => onDeleteUser(user.id)}
                          className="p-4 bg-white border-2 border-slate-100 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-md"
                          title="Eliminar Cuenta"
                      >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
