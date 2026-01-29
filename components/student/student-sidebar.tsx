"use client"

import { type User, type TicketStats } from "@/lib/types"
import { GraduationCap, Ticket, CheckCircle, History, Plus } from "lucide-react"
import Link from "next/link"

interface StudentSidebarProps {
  user: User
  stats: {
    total: number
    open: number
    inProgress: number
    resolved: number
  }
  onNewTicket: () => void
  isOpen: boolean
}

export default function StudentSidebar({ user, stats, onNewTicket, isOpen }: StudentSidebarProps) {
  if (!isOpen) return null

  return (
    <aside className="w-64 bg-card flex flex-col min-h-screen border-r border-border">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-card p-2 rounded-lg border">
            <img
              src="https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png"
              alt="ITLA Logo"
              className="h-8 w-auto"
            />
          </div>
          <div>
            <h1 className="text-foreground font-bold text-sm">Portal Estudiante</h1>
            <p className="text-muted-foreground text-xs">Soporte ITLA</p>
          </div>
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold text-sm truncate">
              {user.name} {user.lastName || ""}
            </p>
            <p className="text-muted-foreground text-xs">{user.matricula}</p>
          </div>
        </div>
      </div>

      {/* New Ticket Button */}
      <div className="p-4">
        <button
          onClick={onNewTicket}
          className="w-full inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-4 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nueva Solicitud
        </button>
      </div>

      {/* Stats Preview */}
      <div className="flex-1 p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Mis Tickets</h3>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Ticket className="w-4 h-4" />
              <span>Abiertos</span>
            </div>
            <span className="font-bold text-primary">{stats.open}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <History className="w-4 h-4" />
              <span>En Proceso</span>
            </div>
            <span className="font-bold text-secondary">{stats.inProgress}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CheckCircle className="w-4 h-4" />
              <span>Resueltos</span>
            </div>
            <span className="font-bold text-green-500">{stats.resolved}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
