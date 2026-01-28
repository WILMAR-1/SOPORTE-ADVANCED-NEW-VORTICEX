import React, { useState, useEffect } from 'react';
import { User, UserRole, Ticket, TicketStatus, TicketCategory, TicketNote } from './types';
import Auth from './components/Auth';
import Layout from './components/Layout';
import TicketCard from './components/TicketCard';
import UserManagement from './components/UserManagement';
import { analyzeTicketDescription, getSmartResponse } from './services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { api } from './services/api';

const ITLA_LOGO_URL = 'https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [activeTab, setActiveTab] = useState<'tickets' | 'users'>('tickets');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    category: TicketCategory.EMAIL_PASS
  });

  // Check for existing session
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user_info');
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Fetch tickets when user is set
  useEffect(() => {
    if (user) {
      fetchTickets();
      if (user.role === UserRole.ADMIN) {
        fetchUsers();
      }
    }
  }, [user]);

  const fetchTickets = async () => {
    try {
      const data = await api.get('/tickets');
      if (Array.isArray(data)) {
        setTickets(data);
      } else {
        console.error("Received non-array ticket data:", data);
        setTickets([]);
      }
    } catch (error) {
      console.error("Error fetching tickets", error);
      setTickets([]);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await api.get('/users');
      if (data) {
        setAllUsers(data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);

    // AI Analysis (client-side for now, could move to backend)
    const analysis = await analyzeTicketDescription(newTicket.description);
    const response = await getSmartResponse(newTicket.description);

    setAiAnalysis(analysis);
    setAiResponse(response);

    const ticketData = {
      title: newTicket.title,
      description: newTicket.description,
      category: newTicket.category,
      priority: analysis?.priority || 'Media'
    };

    try {
      const result = await api.post('/tickets', ticketData);
      if (result && result.id) {
        fetchTickets();
        setIsSubmitting(false);
        setTimeout(() => {
          setIsModalOpen(false);
          setNewTicket({ title: '', description: '', category: TicketCategory.EMAIL_PASS });
          setAiAnalysis(null);
          setAiResponse(null);
        }, 2000);
      } else {
        setIsSubmitting(false);
        alert("Error: No se recibió confirmación del servidor");
      }
    } catch (error: any) {
      console.error("Error al crear el ticket:", error);
      alert("Error al crear el ticket: " + (error.message || "Error desconocido"));
      setIsSubmitting(false);
    }
  };

  const updateTicketStatus = async (id: string, status: TicketStatus) => {
    try {
      await api.put(`/tickets/${id}`, {
        status,
        category: tickets.find(t => t.id === id)?.category
      });
      fetchTickets(); // Refresh
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const handleAssignTicket = async (id: string) => {
    if (!user) return;
    try {
      // We reuse update endpoint for assignment by sending updated fields
      // Or we could have a specific endpoint. 
      // For simplicity, reusing update
      const ticket = tickets.find(t => t.id === id);
      if (!ticket) return;

      await api.put(`/tickets/${id}`, {
        status: TicketStatus.IN_PROGRESS,
        assignedTo: user.id,
        category: ticket.category
      });
      fetchTickets();
    } catch (error) {
      console.error("Error assigning ticket", error);
    }
  };

  const handleTransferTicket = async (id: string, newCategory: TicketCategory) => {
    if (!user) return;
    try {
      const ticket = tickets.find(t => t.id === id);
      if (!ticket) return;

      await api.put(`/tickets/${id}`, {
        status: TicketStatus.OPEN, // Reset status on transfer?
        assignedTo: null, // Unassign on transfer? backend might handle this logic better
        category: newCategory
      });

      // Add system note for transfer
      await api.post(`/tickets/${id}/notes`, {
        text: `🔄 Ticket reubicado internamente a [${newCategory}] por ${user.name}.`,
        is_system: 1
      });

      fetchTickets();
    } catch (error) {
      console.error("Error transferring ticket", error);
    }
  };

  const addTicketNote = async (id: string, text: string) => {
    if (!user) return;
    try {
      await api.post(`/tickets/${id}/notes`, { text });
      fetchTickets();
    } catch (error) {
      console.error("Error adding note", error);
    }
  };

  const handleSaveUser = (userData: User) => {
    // User create/update logic via API would go here
    // For now, simple alert as it might require more complex UI changes
    alert("Funcionalidad de guardar usuario disponible próximamente con API completa.");
  };

  const handleDeleteUser = async (userId: string) => {
    if (userId === user?.id) {
      alert("Operación denegada: No puedes eliminar tu propia sesión administrativa.");
      return;
    }

    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        alert("Error eliminando usuario");
      }
    }
  };

  if (!user) {
    return <Auth onLogin={setUser} />;
  }

  const getUserTickets = () => {
    // Client-side filtering is still useful for UI, 
    // but better if backend filtered. Backend getAll already filters by role/id
    return tickets;
  };

  const userTickets = getUserTickets();

  const stats = [
    { name: 'Abiertos', count: userTickets.filter(t => t.status === TicketStatus.OPEN).length, color: '#f9b233' },
    { name: 'En Proceso', count: userTickets.filter(t => t.status === TicketStatus.IN_PROGRESS).length, color: '#003876' },
    { name: 'Resueltos', count: userTickets.filter(t => t.status === TicketStatus.RESOLVED).length, color: '#10b981' }
  ];

  // Estadísticas globales solo para el Admin
  const adminUserStats = [
    { name: 'Estudiantes', count: allUsers.filter(u => u.role === UserRole.STUDENT).length },
    { name: 'Tecnología', count: allUsers.filter(u => u.role === UserRole.TECNOLOGIA).length },
    { name: 'DTE', count: allUsers.filter(u => u.role === UserRole.DTE).length },
    { name: 'Seguridad', count: allUsers.filter(u => u.role === UserRole.SEGURIDAD).length },
  ];

  return (
    <Layout user={user} onLogout={() => { localStorage.removeItem('token'); localStorage.removeItem('user_info'); setUser(null); }}>
      <div className="flex flex-col space-y-8 animate-fadeIn">

        <div className="bg-gradient-to-r from-[#002855] to-[#004a99] rounded-3xl p-10 text-white shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden border border-white/10">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none transform translate-x-1/4 -translate-y-1/4 scale-150">
            <img src={ITLA_LOGO_URL} alt="" />
          </div>
          <div className="flex items-center gap-8 relative z-10">
            <div className="h-24 w-24 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center text-4xl font-black border border-white/20 shadow-inner">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-4xl font-black tracking-tight">Hola, {user.name}</h2>
              <div className="mt-2 flex flex-wrap gap-2">
                <p className="text-blue-200 font-bold text-sm bg-white/10 inline-block px-4 py-1.5 rounded-xl border border-white/5 shadow-sm">
                  {user.role === UserRole.ADMIN ? '🔧 Administrador del Sistema' :
                    user.role === UserRole.TECNOLOGIA ? '💻 Soporte Tecnología (SIGEI)' :
                      user.role === UserRole.DTE ? '🌐 Soporte DTE (Virtual)' :
                        user.role === UserRole.SEGURIDAD ? '🛡️ Seguridad IT (Correo)' :
                          `🎓 Estudiante | Matrícula: ${user.matricula}`}
                </p>
                {user.role === UserRole.ADMIN && (
                  <p className="text-yellow-200 font-black text-[10px] uppercase tracking-widest bg-white/5 px-4 py-1.5 rounded-xl border border-white/5 self-center">
                    Modo Supervisor Activado
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-3 relative z-10">
            {user.role !== UserRole.STUDENT && (
              <div className="bg-white/10 p-1.5 rounded-2xl flex gap-2 border border-white/10">
                <button
                  onClick={() => setActiveTab('tickets')}
                  className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'tickets' ? 'bg-white text-[#003876] shadow-lg' : 'text-white hover:bg-white/10'}`}
                >
                  Tickets
                </button>
                {user.role === UserRole.ADMIN && (
                  <button
                    onClick={() => setActiveTab('users')}
                    className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-white text-[#003876] shadow-lg' : 'text-white hover:bg-white/10'}`}
                  >
                    Usuarios ({allUsers.length})
                  </button>
                )}
              </div>
            )}
            {user.role === UserRole.STUDENT && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-itla-accent hover:bg-yellow-500 text-[#002855] font-black py-5 px-10 rounded-2xl shadow-xl transition-all transform hover:scale-105 uppercase tracking-widest text-sm"
              >
                Nueva Solicitud
              </button>
            )}
          </div>
        </div>

        {activeTab === 'tickets' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-5">
                <h3 className="text-2xl font-black text-slate-800 flex items-center tracking-tight">
                  <div className="bg-[#003876] p-2 rounded-lg mr-3 shadow-md">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                  {user.role === UserRole.STUDENT ? 'Mis Solicitudes' :
                    user.role === UserRole.ADMIN ? 'Gestión Global de Tickets' : `Bandeja: ${user.role}`}
                </h3>
                {user.role === UserRole.ADMIN && (
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-2 rounded-xl">
                    Total: {tickets.length} Incidencias
                  </span>
                )}
              </div>

              {userTickets.length === 0 ? (
                <div className="bg-white rounded-3xl p-24 text-center border-2 border-dashed border-slate-300">
                  <p className="text-slate-500 font-bold text-xl uppercase tracking-widest">No hay tickets activos en este momento.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-8">
                  {userTickets.map(ticket => (
                    <TicketCard
                      key={ticket.id}
                      ticket={ticket}
                      user={user}
                      onUpdateStatus={updateTicketStatus}
                      onAddNote={addTicketNote}
                      onAssign={handleAssignTicket}
                      onTransfer={handleTransferTicket}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-10">
              <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-slate-200">
                <h3 className="font-black text-slate-800 mb-8 flex items-center text-sm uppercase tracking-[0.2em] border-b border-slate-100 pb-4">
                  Métricas {user.role === UserRole.ADMIN ? 'Globales' : 'Área'}
                </h3>
                <div className="h-64 w-full min-h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" fontSize={11} tick={{ fill: '#475569', fontWeight: 800 }} axisLine={false} tickLine={false} />
                      <YAxis fontSize={11} tick={{ fill: '#475569', fontWeight: 600 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '16px', border: 'none' }} />
                      <Bar dataKey="count" radius={[10, 10, 10, 10]} barSize={40}>
                        {stats.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {user.role === UserRole.ADMIN && (
                <div className="bg-[#003876] p-8 rounded-[2rem] shadow-xl text-white">
                  <h3 className="font-black text-white mb-6 flex items-center text-[10px] uppercase tracking-[0.2em] border-b border-white/10 pb-4">
                    Usuarios Registrados
                  </h3>
                  <div className="space-y-4">
                    {adminUserStats.map(s => (
                      <div key={s.name} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors">
                        <span className="text-xs font-black uppercase tracking-widest text-blue-200">{s.name}</span>
                        <span className="text-2xl font-black">{s.count}</span>
                      </div>
                    ))}
                    <div className="pt-4 mt-4 border-t border-white/10 flex justify-between items-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-itla-accent">Total General</span>
                      <span className="text-3xl font-black text-white">{allUsers.length}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <UserManagement
            users={allUsers}
            onSaveUser={handleSaveUser}
            onDeleteUser={handleDeleteUser}
          />
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto backdrop-blur-xl bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl w-full max-w-xl border-t-[12px] border-[#003876] animate-modalEnter">
            <form onSubmit={handleCreateTicket}>
              <div className="p-10">
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">Nueva Solicitud</h3>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-red-500 bg-slate-100 rounded-full p-2 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
                  </button>
                </div>

                <div className="space-y-6">
                  <input
                    type="text" required
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 outline-none focus:border-[#003876]"
                    placeholder="Asunto de la solicitud"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  />
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 -mb-4">Tipo de Incidencia / Solicitud</label>
                  <select
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 outline-none focus:border-[#003876]"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value as TicketCategory })}
                  >
                    <option value={TicketCategory.EMAIL_PASS}>Incidente Contraseña Correo</option>
                    <option value={TicketCategory.SIGEI_PASS}>Incidente Contraseña SIGEI</option>
                    <option value={TicketCategory.VIRTUAL_PASS}>Incidente Contraseña Plataforma Virtual</option>
                    <option value={TicketCategory.ACADEMIC_REQUEST}>Solicitud Académica General</option>
                    <option value={TicketCategory.OTHER}>Otros Incidentes</option>
                  </select>
                  <textarea
                    required rows={4}
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 font-bold text-slate-800 outline-none focus:border-[#003876]"
                    placeholder="Describa el problema detalladamente..."
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  ></textarea>
                </div>
              </div>

              {aiResponse && (
                <div className="mx-10 mb-8 p-6 bg-blue-50 border-2 border-blue-100 rounded-[2rem] flex items-start gap-5">
                  <div className="bg-[#003876] p-3 rounded-2xl text-white text-xs font-black shadow-lg">IA</div>
                  <p className="text-slate-700 font-bold leading-relaxed italic">"{aiResponse}"</p>
                </div>
              )}

              <div className="bg-slate-50 p-10 flex gap-4">
                <button type="submit" disabled={isSubmitting} className="flex-1 py-5 bg-[#003876] text-white rounded-[1.5rem] font-black uppercase tracking-widest transition-all hover:bg-slate-800 active:scale-95 shadow-lg border-b-4 border-slate-900">
                  {isSubmitting ? 'Procesando...' : 'Enviar a Soporte'}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-white border-2 border-slate-200 rounded-[1.5rem] text-slate-500 font-black uppercase tracking-widest transition-all hover:bg-slate-100">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
