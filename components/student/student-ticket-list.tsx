"use client"

import { useState } from "react"
import { type Ticket, TicketStatus, UserRole } from "@/lib/types"
import { ChevronDown, ChevronUp, Clock, MessageCircle, Send, User, FileText } from "lucide-react"

interface StudentTicketListProps {
  tickets: Ticket[]
  onAddNote: (ticketId: string, text: string) => void
  userId: string
}

const statusStyles: Record<TicketStatus, { bg: string; text: string; border: string }> = {
  [TicketStatus.OPEN]: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  [TicketStatus.IN_PROGRESS]: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  [TicketStatus.RESOLVED]: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  [TicketStatus.CLOSED]: { bg: "bg-slate-50", text: "text-slate-600", border: "border-slate-200" },
}

export default function StudentTicketList({ tickets, onAddNote, userId }: StudentTicketListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState("")

  const handleAddNote = (ticketId: string) => {
    if (newNote.trim()) {
      onAddNote(ticketId, newNote.trim())
      setNewNote("")
    }
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-200">
        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-2">No tienes solicitudes</h3>
        <p className="text-slate-500">Crea una nueva solicitud para recibir ayuda del equipo de soporte.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-[#003876]" />
        Mis Solicitudes
      </h2>

      {tickets.map((ticket) => {
        const isExpanded = expandedId === ticket.id
        const styles = statusStyles[ticket.status]

        return (
          <div
            key={ticket.id}
            className={`bg-white rounded-2xl border transition-all ${
              isExpanded ? "shadow-lg border-[#003876]/20" : "shadow-sm border-slate-200 hover:shadow-md"
            }`}
          >
            <button onClick={() => setExpandedId(isExpanded ? null : ticket.id)} className="w-full p-5 text-left">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-3 py-1 rounded-lg text-xs font-bold border ${styles.bg} ${styles.text} ${styles.border}`}
                    >
                      {ticket.status}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">#{ticket.number}</span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      {ticket.category}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 truncate">{ticket.title}</h3>
                  <p className="text-sm text-slate-500 line-clamp-1">{ticket.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    {new Date(ticket.createdAt).toLocaleDateString("es-DO")}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-slate-100 animate-fadeIn">
                <div className="p-5 space-y-4">
                  {/* Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 block text-xs uppercase font-bold mb-1">Categoría</span>
                      <span className="text-slate-800 font-medium">{ticket.category}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-xs uppercase font-bold mb-1">Prioridad</span>
                      <span
                        className={`font-bold ${
                          ticket.priority === "Alta"
                            ? "text-red-600"
                            : ticket.priority === "Baja"
                              ? "text-green-600"
                              : "text-amber-600"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    {ticket.problemType && (
                      <div>
                        <span className="text-slate-500 block text-xs uppercase font-bold mb-1">Tipo de Problema</span>
                        <span className="text-slate-800 font-medium">{ticket.problemType}</span>
                      </div>
                    )}
                    {ticket.assignedName && (
                      <div>
                        <span className="text-slate-500 block text-xs uppercase font-bold mb-1">Técnico Asignado</span>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-[#003876] rounded-md flex items-center justify-center">
                            <User className="w-3.5 h-3.5 text-white" />
                          </div>
                          <span className="text-slate-800 font-medium">{ticket.assignedName}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Información de resolución */}
                  {ticket.resolvedAt && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-emerald-700 uppercase">Ticket Resuelto</span>
                      </div>
                      <p className="text-sm text-emerald-700">
                        Resuelto por <strong>{ticket.resolvedByName}</strong> el{" "}
                        {new Date(ticket.resolvedAt).toLocaleString("es-DO")}
                      </p>
                    </div>
                  )}

                  {/* Description */}
                  <div>
                    <span className="text-slate-500 block text-xs uppercase font-bold mb-2">Descripción</span>
                    <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed">
                      {ticket.description}
                    </p>
                  </div>

                  {/* Notes */}
                  {ticket.notes.length > 0 && (
                    <div>
                      <span className="text-slate-500 block text-xs uppercase font-bold mb-3">Seguimiento</span>
                      <div className="space-y-3">
                        {ticket.notes.map((note) => (
                          <div
                            key={note.id}
                            className={`p-4 rounded-xl ${
                              note.isSystem
                                ? "bg-blue-50 border border-blue-100"
                                : note.authorId === userId
                                  ? "bg-slate-50 border border-slate-100 ml-8"
                                  : "bg-amber-50 border border-amber-100"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span
                                className={`text-xs font-bold ${
                                  note.isSystem
                                    ? "text-blue-600"
                                    : note.role !== UserRole.STUDENT
                                      ? "text-amber-700"
                                      : "text-slate-600"
                                }`}
                              >
                                {note.author}
                                {note.role !== UserRole.STUDENT && !note.isSystem && " (Soporte)"}
                              </span>
                              <span className="text-xs text-slate-400">
                                {new Date(note.createdAt).toLocaleString("es-DO")}
                              </span>
                            </div>
                            <p className="text-sm text-slate-700">{note.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add Note - Solo si el ticket no está cerrado */}
                  {ticket.status !== TicketStatus.CLOSED && (
                    <div className="pt-4 border-t border-slate-100">
                      <label className="text-slate-500 block text-xs uppercase font-bold mb-2">Añadir Comentario</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Escribe un mensaje..."
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-800 focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none"
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddNote(ticket.id)}
                        />
                        <button
                          onClick={() => handleAddNote(ticket.id)}
                          disabled={!newNote.trim()}
                          className="px-4 py-2.5 bg-[#003876] hover:bg-[#002855] text-white rounded-xl transition-colors disabled:opacity-50"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
