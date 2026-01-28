"use client"

import type { User } from "@/lib/types"
import Link from "next/link"
import { LogOut, GraduationCap } from "lucide-react"

interface StudentHeaderProps {
  user: User
  onLogout: () => void
}

export default function StudentHeader({ user, onLogout }: StudentHeaderProps) {
  const fullName = `${user.name} ${user.lastName || ""}`.trim()

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-[#003876] p-2 rounded-lg">
              <img
                src="https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png"
                alt="ITLA Logo"
                className="h-8 w-auto brightness-0 invert"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-slate-800">Soporte Estudiantil</h1>
              <p className="text-xs text-slate-500">Portal de Solicitudes</p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
              <div className="w-9 h-9 bg-gradient-to-br from-[#003876] to-[#004a99] rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md">
                {user.name.charAt(0)}
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-800">{fullName}</p>
                <div className="flex items-center gap-1 justify-end">
                  <GraduationCap className="w-3 h-3 text-slate-400" />
                  <p className="text-xs text-slate-500">{user.matricula}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline text-sm font-medium">Salir</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
