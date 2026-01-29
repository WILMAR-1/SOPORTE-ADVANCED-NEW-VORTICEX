"use client"

import type { User } from "@/lib/types"
import Link from "next/link"
import { LogOut, GraduationCap, PanelLeft, PanelRight } from "lucide-react"

interface StudentHeaderProps {
  user: User
  onLogout: () => void
  onToggleSidebar: () => void
  sidebarOpen: boolean
}

export default function StudentHeader({ user, onLogout, onToggleSidebar, sidebarOpen }: StudentHeaderProps) {
  const fullName = `${user.name} ${user.lastName || ""}`.trim()

  return (
    <header className="bg-card border-b border-border sticky top-0 z-20">
      <div className="flex justify-between items-center h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-md hover:bg-muted"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <PanelLeft className="w-5 h-5" /> : <PanelRight className="w-5 h-5" />}
          </button>
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-secondary p-2 rounded-lg">
              <img
                src="https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png"
                alt="ITLA Logo"
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-foreground">Soporte Estudiantil</h1>
              <p className="text-xs text-muted-foreground">Portal de Solicitudes</p>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-3 bg-muted/50 px-4 py-2 rounded-xl">
            <div className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center text-secondary-foreground font-bold text-sm shadow-md">
              {user.name.charAt(0)}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">{fullName}</p>
              <div className="flex items-center gap-1 justify-end">
                <GraduationCap className="w-3 h-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{user.matricula}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Salir</span>
          </button>
        </div>
      </div>
    </header>
  )
}
