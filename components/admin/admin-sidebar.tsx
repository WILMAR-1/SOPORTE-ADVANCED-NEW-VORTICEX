"use client"

import { type User, type TicketStats, ROLE_CONFIG, canManageUsers, canAssignCategories } from "@/lib/types"
import { LayoutDashboard, Ticket, Users, Settings, ClipboardList } from "lucide-react"
import Link from "next/link"

type View = "dashboard" | "tickets" | "users" | "categories" | "reports"

interface AdminSidebarProps {
  user: User
  currentView: View
  onViewChange: (view: View) => void
  isOpen: boolean
  stats: TicketStats
}

export default function AdminSidebar({ user, currentView, onViewChange, isOpen, stats }: AdminSidebarProps) {
  if (!isOpen) return null

  const roleConfig = ROLE_CONFIG[user.role]

  const navItems = [
    { id: "dashboard" as View, label: "Dashboard", icon: LayoutDashboard },
    { id: "tickets" as View, label: "Tickets", icon: Ticket, badge: stats.open + stats.inProgress },
    ...(canManageUsers(user.role) ? [{ id: "users" as View, label: "Usuarios", icon: Users }] : []),
    ...(canAssignCategories(user.role) ? [{ id: "categories" as View, label: "Asignaciones", icon: Settings }] : []),
    { id: "reports" as View, label: "Reportes", icon: ClipboardList },
  ]

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
            <h1 className="text-foreground font-bold text-sm">Panel Admin</h1>
            <p className="text-muted-foreground text-xs">Soporte ITLA</p>
          </div>
        </Link>
      </div>

      {/* User Info - Mostrar rol con badge de color */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 bg-secondary rounded-xl flex items-center justify-center text-secondary-foreground font-bold text-lg shadow-lg">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-foreground font-semibold text-sm truncate">
              {user.name} {user.lastName || ""}
            </p>
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${roleConfig.bgColor} ${roleConfig.color} mt-1`}
            >
              {roleConfig.label}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                isActive ? "bg-secondary text-secondary-foreground shadow-lg" : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    isActive ? "bg-card text-secondary" : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          )
        })}
      </nav>

      {/* Stats Preview - Nuevos contadores */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-foreground">{stats.open}</p>
            <p className="text-xs text-muted-foreground">Abiertos</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-primary">{stats.inProgress}</p>
            <p className="text-xs text-muted-foreground">En Proceso</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-green-500">{stats.resolved}</p>
            <p className="text-xs text-muted-foreground">Resueltos</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-3 text-center">
            <p className="text-2xl font-black text-slate-500">{stats.todayResolved}</p>
            <p className="text-xs text-muted-foreground">Hoy</p>
          </div>
        </div>
      </div>
    </aside>
  )
}
