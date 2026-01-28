"use client"

import { useState } from "react"
import { type Ticket, type User, TicketStatus, TicketCategory } from "@/lib/types"
import { generateTicketPDF } from "@/lib/pdf-generator"
import { FileText, Download, Calendar, Filter, BarChart3, PieChart } from "lucide-react"

interface ReportsViewProps {
  tickets: Ticket[]
  users: User[]
}

export default function ReportsView({ tickets, users }: ReportsViewProps) {
  const [dateFilter, setDateFilter] = useState<"all" | "today" | "week" | "month">("all")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")

  const filterTickets = () => {
    let filtered = [...tickets]

    // Filtrar por estado
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter)
    }

    // Filtrar por fecha
    const now = new Date()
    if (dateFilter === "today") {
      filtered = filtered.filter((t) => new Date(t.createdAt).toDateString() === now.toDateString())
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((t) => new Date(t.createdAt) >= weekAgo)
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter((t) => new Date(t.createdAt) >= monthAgo)
    }

    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  const filteredTickets = filterTickets()

  // Estadísticas
  const resolvedTickets = tickets.filter((t) => t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED)
  const avgResolutionTime =
    resolvedTickets.length > 0
      ? Math.round(
          resolvedTickets.reduce((acc, t) => {
            if (t.resolvedAt) {
              return acc + (new Date(t.resolvedAt).getTime() - new Date(t.createdAt).getTime())
            }
            return acc
          }, 0) /
            resolvedTickets.length /
            (1000 * 60 * 60),
        )
      : 0

  // Tickets por categoría
  const ticketsByCategory = Object.values(TicketCategory)
    .map((cat) => ({
      category: cat,
      count: tickets.filter((t) => t.category === cat).length,
    }))
    .sort((a, b) => b.count - a.count)

  const handleDownloadPDF = (ticket: Ticket) => {
    const student = users.find((u) => u.id === ticket.userId)
    generateTicketPDF(ticket, student)
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Total Histórico</span>
          </div>
          <p className="text-3xl font-black text-slate-800">{tickets.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
              <PieChart className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Tasa de Resolución</span>
          </div>
          <p className="text-3xl font-black text-emerald-600">
            {tickets.length > 0 ? Math.round((resolvedTickets.length / tickets.length) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Tiempo Promedio</span>
          </div>
          <p className="text-3xl font-black text-amber-600">{avgResolutionTime}h</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-slate-500">Resueltos Total</span>
          </div>
          <p className="text-3xl font-black text-purple-600">{resolvedTickets.length}</p>
        </div>
      </div>

      {/* Tickets por categoría */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-bold text-slate-800 mb-4">Distribución por Categoría</h3>
        <div className="space-y-3">
          {ticketsByCategory.map(({ category, count }) => (
            <div key={category} className="flex items-center gap-4">
              <span className="text-sm text-slate-600 w-40 truncate">{category}</span>
              <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#003876] to-[#004a99] rounded-full transition-all"
                  style={{ width: `${tickets.length > 0 ? (count / tickets.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-sm font-bold text-slate-800 w-12 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">Filtros:</span>
        </div>
        <select
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value as "all" | "today" | "week" | "month")}
          className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-700"
        >
          <option value="all">Todo el tiempo</option>
          <option value="today">Hoy</option>
          <option value="week">Última semana</option>
          <option value="month">Último mes</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TicketStatus | "all")}
          className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-700"
        >
          <option value="all">Todos los estados</option>
          {Object.values(TicketStatus).map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-sm text-slate-400 ml-auto">
          {filteredTickets.length} ticket{filteredTickets.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Historial de Tickets */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50">
          <h3 className="font-bold text-slate-700">Historial de Tickets</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">#</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Estudiante</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Categoría</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Estado</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Atendido Por</th>
                <th className="text-left px-6 py-3 text-xs font-bold text-slate-500 uppercase">Fecha</th>
                <th className="text-right px-6 py-3 text-xs font-bold text-slate-500 uppercase">PDF</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-slate-600">#{ticket.number}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-800">{ticket.userName}</p>
                      <p className="text-xs text-slate-500">{ticket.userMatricula || ticket.userEmail}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-slate-100 text-slate-600">
                      {ticket.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        ticket.status === TicketStatus.RESOLVED
                          ? "bg-emerald-100 text-emerald-700"
                          : ticket.status === TicketStatus.OPEN
                            ? "bg-amber-100 text-amber-700"
                            : ticket.status === TicketStatus.IN_PROGRESS
                              ? "bg-blue-100 text-blue-700"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">
                      {ticket.resolvedByName || ticket.assignedName || "-"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500">
                      {new Date(ticket.createdAt).toLocaleDateString("es-DO")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDownloadPDF(ticket)}
                      className="p-2 text-slate-400 hover:text-[#003876] hover:bg-blue-50 rounded-lg transition-colors"
                      title="Descargar PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredTickets.length === 0 && (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No hay tickets con los filtros seleccionados.</p>
          </div>
        )}
      </div>
    </div>
  )
}
