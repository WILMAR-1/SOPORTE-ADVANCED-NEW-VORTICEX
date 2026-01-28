"use client"

import type React from "react"
import { useState } from "react"
import { type User, UserRole } from "@/lib/types"
import { store } from "@/lib/store"
import { Eye, EyeOff, Shield, AlertTriangle, Lock } from "lucide-react"
import Link from "next/link"

interface AdminAuthProps {
  onLogin: (user: User) => void
}

export default function AdminAuth({ onLogin }: AdminAuthProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      const user = store.login(email, password)
      if (user) {
        if (user.role === UserRole.STUDENT) {
          setError("Acceso denegado. Este portal es exclusivo para personal administrativo.")
          setIsLoading(false)
          return
        }
        onLogin(user)
      } else {
        setError("Credenciales incorrectas. Verifique su correo y contraseña.")
      }
    } catch {
      setError("Error al procesar su solicitud. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Volver al inicio</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fadeIn">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#f9b233] to-[#e6a020] rounded-2xl shadow-xl mb-4">
              <Shield className="w-10 h-10 text-[#002855]" />
            </div>
            <h1 className="text-3xl font-black text-white">Portal Administrativo</h1>
            <p className="text-slate-400 mt-2">Sistema de Soporte ITLA</p>
          </div>

          {/* Security Notice */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-amber-400 text-sm font-medium">Acceso Restringido</p>
              <p className="text-amber-400/70 text-xs mt-1">
                Solo personal autorizado del ITLA. Todas las acciones son monitoreadas y registradas.
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="bg-red-500/10 text-red-400 p-4 rounded-xl text-sm font-medium border border-red-500/20 animate-fadeIn flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Correo Institucional
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@itla.edu.do"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 px-4 text-white font-medium focus:ring-2 focus:ring-[#f9b233]/20 focus:border-[#f9b233] outline-none transition-all placeholder:text-slate-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wide mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3.5 px-4 pr-12 text-white font-medium focus:ring-2 focus:ring-[#f9b233]/20 focus:border-[#f9b233] outline-none transition-all placeholder:text-slate-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#f9b233] to-[#e6a020] hover:from-[#e6a020] hover:to-[#d49010] text-[#002855] font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Lock className="w-5 h-5" />
                {isLoading ? "Verificando credenciales..." : "Iniciar Sesión Segura"}
              </button>
            </form>

            <div className="border-t border-slate-700 p-5 bg-slate-800/50">
              <p className="text-xs text-slate-500 text-center">
                Si no tiene credenciales de acceso, contacte al departamento de{" "}
                <span className="text-[#f9b233] font-semibold">Supremo Digital</span> o{" "}
                <span className="text-[#f9b233] font-semibold">Globalizador</span> para solicitar acceso.
              </p>
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-slate-500 text-xs mt-6">
            Instituto Tecnológico de Las Américas (ITLA) - Sistema de Soporte v2.0
          </p>
        </div>
      </div>
    </div>
  )
}
