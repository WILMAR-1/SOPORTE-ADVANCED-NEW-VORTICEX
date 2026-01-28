"use client"

import { useState } from "react"
import {
  type Ticket,
  type User,
  TicketStatus,
  TicketCategory,
  UserRole,
  type TicketStats,
  canDeleteTickets,
  canViewAllTickets,
} from "@/lib/types"
import { generateTicketPDF } from "@/lib/pdf-generator"
import {
  Clock,
  AlertCircle,
  CheckCircle,
  Archive,
  ChevronDown,
  ChevronUp,
  Send,
  Trash2,
  ArrowRight,
  UserIcon,
  Filter,
  FileText,
  TrendingUp,
  Calendar,
  Zap,
} from "lucide-react"

interface TicketDashboardProps {
  tickets: Ticket[]
  users: User[]
  currentUser: User
  stats: TicketStats
  showDashboard: boolean
  onUpdateStatus: (ticketId: string, status: TicketStatus) => void
  onAssign: (ticketId: string) => void
  onTransfer: (ticketId: string, category: TicketCategory) => void
  onAddNote: (ticketId: string, text: string) => void
  onDelete: (ticketId: string) => void
}

const statusStyles: Record<TicketStatus, { bg: string; text: string; icon: typeof Clock }> = {
  [TicketStatus.OPEN]: { bg: "bg-amber-500", text: "text-amber-700", icon: AlertCircle },
  [TicketStatus.IN_PROGRESS]: { bg: "bg-blue-500", text: "text-blue-700", icon: Clock },
  [TicketStatus.RESOLVED]: { bg: "bg-emerald-500", text: "text-emerald-700", icon: CheckCircle },
  [TicketStatus.CLOSED]: { bg: "bg-slate-400", text: "text-slate-600", icon: Archive },
}

export default function TicketDashboard({
  tickets,
  users,
  currentUser,
  stats,
  showDashboard,
  onUpdateStatus,
  onAssign,
  onTransfer,
  onAddNote,
  onDelete,
}: TicketDashboardProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [newNote, setNewNote] = useState("")
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "all">("all")
  const [filterCategory, setFilterCategory] = useState<TicketCategory | "all">("all")

  const filteredTickets = tickets.filter((t) => {
    if (filterStatus !== "all" && t.status !== filterStatus) return false
    if (filterCategory !== "all" && t.category !== filterCategory) return false
    return true
  })

  const handleAddNote = (ticketId: string) => {
    if (newNote.trim()) {
      onAddNote(ticketId, newNote.trim())
      setNewNote("")
    }
  }

  const handleDownloadPDF = (ticket: Ticket) => {
    const student = users.find((u) => u.id === ticket.userId)
    generateTicketPDF(ticket, student)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {showDashboard && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-3xl font-black text-slate-800">{stats.open}</span>
            </div>
            <p className="text-slate-600 font-semibold text-sm">Abiertos</p>
            <p className="text-xs text-slate-400 mt-0.5">Requieren atención</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-3xl font-black text-slate-800">{stats.inProgress}</span>
            </div>
            <p className="text-slate-600 font-semibold text-sm">En Proceso</p>
            <p className="text-xs text-slate-400 mt-0.5">Siendo atendidos</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-3xl font-black text-emerald-600">{stats.resolved}</span>
            </div>
            <p className="text-slate-600 font-semibold text-sm">Resueltos</p>
            <p className="text-xs text-slate-400 mt-0.5">Solucionados</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center">
                <Zap className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-3xl font-black text-purple-600">{stats.todayResolved}</span>
            </div>
            <p className="text-slate-600 font-semibold text-sm">Finalizados Hoy</p>
            <p className="text-xs text-slate-400 mt-0.5">Resueltos hoy</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div className="w-11 h-11 bg-[#003876]/10 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#003876]" />
              </div>
              <span className="text-3xl font-black text-[#003876]">{stats.total}</span>
            </div>
            <p className="text-slate-600 font-semibold text-sm">Total Tickets</p>
            <p className="text-xs text-slate-400 mt-0.5">Histórico completo</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filtros:</span>
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as TicketStatus | "all")}
          className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none"
        >
          <option value="all">Todos los estados</option>
          {Object.values(TicketStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as TicketCategory | "all")}
          className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none"
        >
          <option value="all">Todas las categorías</option>
          {Object.values(TicketCategory).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-400 ml-auto">
          {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-600">No hay tickets</h3>
            <p className="text-slate-400 mt-1">No se encontraron tickets con los filtros seleccionados.</p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const isExpanded = expandedId === ticket.id
            const styles = statusStyles[ticket.status]
            const StatusIcon = styles.icon
            const canManage = ticket.assignedTo === currentUser.id || canViewAllTickets(currentUser.role)

            return (
              <div
                key={ticket.id}
                className={`bg-white rounded-2xl border transition-all ${
                  isExpanded ? "shadow-lg border-[#003876]/20" : "shadow-sm border-slate-100 hover:shadow-md"
                }`}
              >
                {/* Header */}
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 ${styles.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <StatusIcon className="w-5 h-5 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="text-xs font-bold text-slate-400">#{ticket.number}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${styles.text} bg-opacity-10`}
                          style={{ backgroundColor: `${styles.bg.replace("bg-", "")}20` }}
                        >
                          {ticket.status}
                        </span>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600">
                          {ticket.category}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-bold ${
                            ticket.priority === "Alta"
                              ? "bg-red-100 text-red-700"
                              : ticket.priority === "Baja"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {ticket.priority}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-800 mb-1">{ticket.title}</h3>
                      <p className="text-sm text-slate-500">
                        <span className="font-medium">{ticket.userName}</span>
                        {ticket.userMatricula && <span className="text-slate-400"> ({ticket.userMatricula})</span>}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {!ticket.assignedTo && (
                        <button
                          onClick={() => onAssign(ticket.id)}
                          className="px-4 py-2 bg-[#f9b233] hover:bg-[#e6a020] text-[#002855] text-xs font-bold rounded-lg transition-colors"
                        >
                          Tomar Ticket
                        </button>
                      )}
                      {ticket.assignedName && (
                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg">
                          <UserIcon className="w-4 h-4 text-[#003876]" />
                          <span className="text-xs font-medium text-slate-600">{ticket.assignedName}</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleDownloadPDF(ticket)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Descargar PDF"
                      >
                        <FileText className="w-5 h-5 text-slate-400 hover:text-[#003876]" />
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : ticket.id)}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-slate-400" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded */}
                {isExpanded && (
                  <div className="border-t border-slate-100 animate-fadeIn">
                    <div className="p-5 space-y-6">
                      {/* Description */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Descripción</h4>
                        <p className="text-slate-700 bg-slate-50 p-4 rounded-xl text-sm leading-relaxed">
                          {ticket.description}
                        </p>
                      </div>

                      {ticket.resolvedAt && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                          <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wide mb-2">
                            Información de Resolución
                          </h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-slate-500">Resuelto por:</span>
                              <span className="font-semibold text-emerald-700 ml-2">{ticket.resolvedByName}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Fecha:</span>
                              <span className="font-semibold text-emerald-700 ml-2">
                                {new Date(ticket.resolvedAt).toLocaleString("es-DO")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {canManage && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                              Cambiar Estado
                            </h4>
                            <select
                              value={ticket.status}
                              onChange={(e) => onUpdateStatus(ticket.id, e.target.value as TicketStatus)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none"
                            >
                              {Object.values(TicketStatus).map((s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                              Transferir a
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {Object.values(TicketCategory)
                                .filter((c) => c !== ticket.category)
                                .slice(0, 3)
                                .map((c) => (
                                  <button
                                    key={c}
                                    onClick={() => onTransfer(ticket.id, c)}
                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                    {c}
                                  </button>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      {ticket.notes.length > 0 && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">Historial</h4>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
                            {ticket.notes.map((note) => (
                              <div
                                key={note.id}
                                className={`p-3 rounded-xl text-sm ${
                                  note.isSystem
                                    ? "bg-blue-50 border border-blue-100"
                                    : note.role === UserRole.STUDENT
                                      ? "bg-slate-50 border border-slate-100"
                                      : "bg-amber-50 border border-amber-100"
                                }`}
                              >
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-bold text-xs">{note.author}</span>
                                  <span className="text-xs text-slate-400">
                                    {new Date(note.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-slate-700">{note.text}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Note */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Añadir Nota</h4>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Escribe una nota..."
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm text-slate-700 focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none"
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

                      {/* Delete - Solo roles con permiso */}
                      {canDeleteTickets(currentUser.role) && (
                        <div className="pt-4 border-t border-slate-100">
                          <button
                            onClick={() => onDelete(ticket.id)}
                            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                            Eliminar Ticket
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
