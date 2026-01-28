"use client"

import type React from "react"
import { useState } from "react"
import { type User, UserRole } from "@/lib/types"
import { store } from "@/lib/store"
import { Eye, EyeOff, GraduationCap, AlertCircle } from "lucide-react"
import Link from "next/link"

const ITLA_CAREERS = [
  "Desarrollo de Software",
  "Redes de Información",
  "Ciberseguridad",
  "Multimedia",
  "Mecatrónica",
  "Manufactura Automatizada",
  "Inteligencia Artificial",
  "Energías Renovables",
  "Diseño Industrial",
  "Sonido",
]

interface StudentAuthProps {
  onLogin: (user: User) => void
}

export default function StudentAuth({ onLogin }: StudentAuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    matricula: "",
    personalEmail: "",
    phone: "",
    career: ITLA_CAREERS[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (isLogin) {
        const user = store.login(formData.email, formData.password)
        if (user) {
          if (user.role !== UserRole.STUDENT) {
            setError("Este portal es exclusivo para estudiantes. Use el portal administrativo.")
            setIsLoading(false)
            return
          }
          onLogin(user)
        } else {
          setError("Credenciales incorrectas. Verifique su correo y contraseña.")
        }
      } else {
        if (!formData.email.endsWith("@itla.edu.do")) {
          setError("Debe usar su correo institucional @itla.edu.do")
          setIsLoading(false)
          return
        }

        const newUser = store.registerStudent({
          name: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          matricula: formData.matricula,
          personalEmail: formData.personalEmail,
          phone: formData.phone,
          career: formData.career,
        })
        onLogin(newUser)
      }
    } catch {
      setError("Error al procesar su solicitud. Intente nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#002855] via-[#003876] to-[#004a99] flex flex-col">
      <header className="p-4">
        <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Volver al inicio</span>
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fadeIn">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-4">
              <GraduationCap className="w-10 h-10 text-[#003876]" />
            </div>
            <h1 className="text-3xl font-black text-white">Portal Estudiante</h1>
            <p className="text-blue-200 mt-2">Sistema de Soporte ITLA</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex border-b border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true)
                  setError(null)
                }}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${
                  isLogin ? "text-[#003876] border-b-2 border-[#003876]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false)
                  setError(null)
                }}
                className={`flex-1 py-4 text-sm font-bold transition-colors ${
                  !isLogin ? "text-[#003876] border-b-2 border-[#003876]" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                Registrarse
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-200 animate-fadeIn flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              {!isLogin && (
                <div className="grid grid-cols-2 gap-4 animate-fadeIn">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Juan"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Apellido
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Pérez"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Correo Institucional
                </label>
                <input
                  type="email"
                  required
                  placeholder="usuario@itla.edu.do"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {!isLogin && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Matrícula
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="2024-0000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all"
                      value={formData.matricula}
                      onChange={(e) => setFormData({ ...formData, matricula: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                      Correo Personal
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="correo@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all"
                      value={formData.personalEmail}
                      onChange={(e) => setFormData({ ...formData, personalEmail: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="809-000-0000"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                        Carrera
                      </label>
                      <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all"
                        value={formData.career}
                        onChange={(e) => setFormData({ ...formData, career: e.target.value })}
                      >
                        {ITLA_CAREERS.map((career) => (
                          <option key={career} value={career}>
                            {career}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 pr-12 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-[#003876] to-[#004a99] hover:from-[#002855] hover:to-[#003876] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Procesando..." : isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
              </button>
            </form>

            <div className="border-t border-slate-100 p-4 bg-slate-50">
              <p className="text-xs text-slate-500 text-center">
                Contraseña por defecto: <span className="font-mono bg-white px-2 py-1 rounded">Itla2024!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
