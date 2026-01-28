import React, { useState } from 'react';
import { Ticket, TicketStatus, TicketCategory, UserRole, TicketNote, User } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  user: User;
  onUpdateStatus?: (id: string, status: TicketStatus) => void;
  onAddNote?: (id: string, noteText: string) => void;
  onAssign?: (id: string) => void;
  onTransfer?: (id: string, newCategory: TicketCategory) => void;
}

const TicketCard: React.FC<TicketCardProps> = ({ ticket, user, onUpdateStatus, onAddNote, onAssign, onTransfer }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newNote, setNewNote] = useState('');

  const isAdmin = user.role === UserRole.ADMIN;
  const canManage = [UserRole.ADMIN, UserRole.TECNOLOGIA, UserRole.DTE, UserRole.SEGURIDAD].includes(user.role);
  const isAssignedToMe = ticket.assignedTo === user.id;

  const getStatusStyle = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.OPEN: return 'bg-amber-100 text-amber-900 border-amber-300';
      case TicketStatus.IN_PROGRESS: return 'bg-blue-100 text-blue-900 border-blue-300';
      case TicketStatus.RESOLVED: return 'bg-emerald-100 text-emerald-900 border-emerald-300';
      case TicketStatus.CLOSED: return 'bg-slate-100 text-slate-900 border-slate-300';
      default: return 'bg-slate-100 text-slate-900';
    }
  };

  const handleNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim() && onAddNote) {
      onAddNote(ticket.id, newNote);
      setNewNote('');
    }
  };

  return (
    <div className={`bg-white rounded-3xl shadow-lg border-l-[6px] transition-all duration-300 overflow-hidden border border-slate-200 ${isExpanded ? 'ring-4 ring-blue-50' : 'hover:-translate-y-1 hover:shadow-xl'} ${
      ticket.status === TicketStatus.RESOLVED ? 'border-emerald-500' : 'border-[#003876]'
    }`}>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex flex-wrap gap-2">
            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase border-2 ${getStatusStyle(ticket.status)}`}>
              {ticket.status}
            </span>
            <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-slate-100 text-slate-800 border-2 border-slate-200">
              {ticket.category}
            </span>
            {ticket.assignedName && (
               <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-itla-blue text-white border-2 border-itla-blue flex items-center gap-1">
                 <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
                 Técnico: {ticket.assignedName}
               </span>
            )}
          </div>
          <span className="text-[11px] text-slate-400 font-black tracking-widest bg-slate-50 px-3 py-1 rounded-lg">
            # {String(ticket.id).padStart(6, '0')}
          </span>
        </div>

        <div className="flex justify-between items-center gap-4 mb-3">
          <div className="flex flex-col">
              <h3 className="text-xl font-black text-slate-800 leading-tight tracking-tight">{ticket.title}</h3>
              <p className="text-[10px] font-bold text-slate-400 mt-1">Solicitado por: {ticket.userName}</p>
          </div>
          {!ticket.assignedTo && canManage && (
             <button 
                onClick={() => onAssign?.(ticket.id)}
                className="bg-itla-accent text-[#003876] px-4 py-2 rounded-xl text-[10px] font-black hover:bg-yellow-500 transition-all flex items-center gap-2 shadow-sm whitespace-nowrap uppercase tracking-widest border-b-2 border-yellow-600"
             >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M7 11l5 5 5-5M7 7l5 5 5-5"></path></svg>
                Gestionar Ticket
             </button>
          )}
        </div>

        <p className={`text-slate-600 font-medium leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>{ticket.description}</p>
        
        <div className="flex justify-between items-center pt-5 mt-5 border-t border-slate-100">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center">
            <svg className="w-4 h-4 mr-2 text-[#003876]" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z"/></svg>
            Última actualización: {new Date(ticket.updatedAt).toLocaleDateString()}
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="bg-[#003876] text-white px-5 py-2 rounded-xl text-xs font-black hover:bg-slate-800 transition-all flex items-center shadow-md active:scale-95"
          >
            {isExpanded ? 'OCULTAR DETALLE' : 'VER SEGUIMIENTO'}
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ml-2 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="bg-slate-50 p-8 border-t-2 border-slate-100 animate-fadeIn">
          
          {/* Panel de Transferencia Departamental - Habilitado para el Técnico asignado o el ADMIN global */}
          {canManage && (isAssignedToMe || isAdmin) && (
            <div className={`mb-8 p-6 bg-white rounded-2xl border-2 shadow-sm ${isAdmin && !isAssignedToMe ? 'border-amber-200 bg-amber-50/20' : 'border-[#003876]/10'}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center ${isAdmin ? 'text-amber-700' : 'text-[#003876]'}`}>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                    {isAdmin ? 'Supervisión: Reasignar Departamento' : 'Canalizar Solicitud'}
                </h4>
                <div className="flex flex-wrap gap-3">
                    {Object.values(TicketCategory).filter(cat => cat !== ticket.category).map(cat => (
                        <button 
                            key={cat}
                            onClick={() => onTransfer?.(ticket.id, cat)}
                            className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border ${
                                isAdmin ? 'bg-amber-100 text-amber-900 border-amber-200 hover:bg-amber-600 hover:text-white' : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-[#003876] hover:text-white'
                            }`}
                        >
                            Pasar a {cat.replace('Incidente de contraseña ', '')}
                        </button>
                    ))}
                </div>
                {isAdmin && <p className="mt-3 text-[9px] text-amber-600 font-black uppercase tracking-widest italic">Intervención administrativa de nivel 1</p>}
            </div>
          )}

          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 border-b border-slate-200 pb-2">Bitácora de Solución</h4>
          
          <div className="relative pl-8 border-l-4 border-slate-200 space-y-8">
            {ticket.notes && ticket.notes.length > 0 ? (
              ticket.notes.map((note) => (
                <div key={note.id} className="relative">
                  <div className={`absolute -left-[44px] mt-1.5 w-6 h-6 rounded-full border-4 border-slate-50 shadow-sm ${[UserRole.ADMIN, UserRole.TECNOLOGIA, UserRole.DTE, UserRole.SEGURIDAD].includes(note.role) ? 'bg-itla-accent' : note.author === 'Sistema' ? 'bg-slate-400' : 'bg-[#003876]'}`}></div>
                  <div className={`p-5 rounded-2xl border-2 shadow-sm ${note.author === 'Sistema' ? 'bg-slate-100/50 border-slate-200' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${[UserRole.ADMIN, UserRole.TECNOLOGIA, UserRole.DTE, UserRole.SEGURIDAD].includes(note.role) ? 'bg-amber-100 text-amber-900' : note.author === 'Sistema' ? 'bg-slate-200 text-slate-600' : 'bg-slate-800 text-white'}`}>
                        {note.author} {note.role !== UserRole.STUDENT && note.author !== 'Sistema' ? '(Soporte IT)' : note.author === 'Sistema' ? '' : '(Estudiante)'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-black">
                        {new Date(note.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed ${note.author === 'Sistema' ? 'text-slate-500 font-black italic' : 'text-slate-700 font-bold'}`}>{note.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-300 text-center">
                <p className="text-sm text-slate-400 font-black uppercase tracking-widest italic">Aún no hay respuestas registradas.</p>
              </div>
            )}
          </div>

          <div className="mt-8 pt-8 border-t-2 border-slate-200">
            {canManage ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Estado de la Solicitud</label>
                        <select 
                            value={ticket.status}
                            disabled={!isAssignedToMe && !isAdmin}
                            onChange={(e) => onUpdateStatus?.(ticket.id, e.target.value as TicketStatus)}
                            className="w-full text-sm bg-white border-2 border-slate-200 rounded-xl p-3.5 focus:ring-4 focus:ring-blue-100 outline-none font-bold text-slate-800 disabled:opacity-50"
                        >
                            {Object.values(TicketStatus).map(s => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>
                        {(!isAssignedToMe && !isAdmin) && (
                            <p className="mt-2 text-[9px] text-red-400 font-black uppercase tracking-widest">Debes asignar el ticket para cambiar el estado</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Añadir Nota de Seguimiento</label>
                        <form onSubmit={handleNoteSubmit} className="flex gap-3">
                            <input 
                                type="text"
                                value={newNote}
                                onChange={(e) => setNewNote(e.target.value)}
                                className="flex-1 text-sm border-2 border-slate-200 rounded-xl p-3.5 outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800"
                                placeholder="Escribe tu actualización..."
                            />
                            <button type="submit" className="bg-itla-accent text-[#003876] font-black px-6 py-2 rounded-xl text-xs hover:bg-yellow-500 transition-all shadow-md active:scale-95 uppercase tracking-widest">
                                Enviar
                            </button>
                        </form>
                    </div>
                </div>
              </div>
            ) : (
                <form onSubmit={handleNoteSubmit} className="flex flex-col gap-3">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-3">¿Tienes alguna duda adicional?</label>
                    <div className="flex gap-4">
                        <input 
                            type="text"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            className="flex-1 text-sm border-2 border-slate-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-100 font-bold text-slate-800"
                            placeholder="Mensaje para el soporte..."
                        />
                        <button type="submit" className="bg-[#003876] text-white font-black px-8 py-2 rounded-2xl text-xs hover:bg-slate-800 transition-all shadow-lg uppercase tracking-widest active:scale-95 border-b-4 border-slate-900">
                            AÑADIR NOTA
                        </button>
                    </div>
                </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketCard;
