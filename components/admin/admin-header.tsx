"use client"

import { type User, ROLE_CONFIG } from "@/lib/types"
import { Menu, LogOut, Bell, X } from "lucide-react"

interface AdminHeaderProps {
  user: User
  onLogout: () => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export default function AdminHeader({ user, onLogout, onToggleSidebar, sidebarOpen }: AdminHeaderProps) {
  const roleConfig = ROLE_CONFIG[user.role]

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 h-16">
        <div className="flex items-center gap-4">
          <button onClick={onToggleSidebar} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
          </button>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Centro de Soporte</h2>
            <p className="text-xs text-slate-500">Panel Administrativo ITLA</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user.name} {user.lastName || ""}
              </p>
              <span className={`text-xs font-bold px-2 py-0.5 rounded ${roleConfig.bgColor} ${roleConfig.color}`}>
                {roleConfig.label}
              </span>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#003876] to-[#004a99] rounded-xl flex items-center justify-center text-white font-bold shadow-md">
              {user.name.charAt(0)}
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Cerrar sesión"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
