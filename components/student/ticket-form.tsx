"use client"

import type React from "react"
import { useState } from "react"
import { TicketCategory } from "@/lib/types"
import { analyzeTicket, getWelcomeMessage } from "@/lib/smart-messages"
import { X, Send, Lightbulb, Mail, Key, Monitor, BookOpen, Wifi, HardDrive, Settings, HelpCircle } from "lucide-react"

interface TicketFormProps {
  onClose: () => void
  onSubmit: (data: { title: string; description: string; category: TicketCategory; problemType?: string }) => void
}

const categoryOptions = [
  {
    value: TicketCategory.EMAIL_PASS,
    label: "Correo Institucional",
    icon: Mail,
    desc: "Problemas con acceso al correo @itla.edu.do",
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
  },
  {
    value: TicketCategory.SIGEI_PASS,
    label: "Contraseña SIGEI",
    icon: Key,
    desc: "Problemas con acceso al sistema SIGEI",
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
  },
  {
    value: TicketCategory.VIRTUAL_PASS,
    label: "Plataforma Virtual",
    icon: Monitor,
    desc: "Problemas con acceso o cursos virtuales",
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
  },
  {
    value: TicketCategory.ACADEMIC_REQUEST,
    label: "Solicitud Académica",
    icon: BookOpen,
    desc: "Trámites y solicitudes académicas",
    color: "text-emerald-600",
    bg: "bg-emerald-50 border-emerald-200",
  },
  {
    value: TicketCategory.REDES,
    label: "Redes y Conectividad",
    icon: Wifi,
    desc: "Problemas con WiFi o red del campus",
    color: "text-cyan-600",
    bg: "bg-cyan-50 border-cyan-200",
  },
  {
    value: TicketCategory.EQUIPOS,
    label: "Equipos y Hardware",
    icon: HardDrive,
    desc: "Problemas con computadoras o equipos",
    color: "text-orange-600",
    bg: "bg-orange-50 border-orange-200",
  },
  {
    value: TicketCategory.SOFTWARE,
    label: "Software",
    icon: Settings,
    desc: "Solicitudes o problemas de software",
    color: "text-indigo-600",
    bg: "bg-indigo-50 border-indigo-200",
  },
  {
    value: TicketCategory.OTHER,
    label: "Otros",
    icon: HelpCircle,
    desc: "Otros tipos de solicitudes",
    color: "text-slate-600",
    bg: "bg-slate-50 border-slate-200",
  },
]

const problemTypes: Record<TicketCategory, string[]> = {
  [TicketCategory.EMAIL_PASS]: [
    "Olvidé mi contraseña",
    "Cuenta bloqueada",
    "No recibo correos",
    "Error al iniciar sesión",
    "Otro problema de correo",
  ],
  [TicketCategory.SIGEI_PASS]: [
    "Olvidé mi contraseña",
    "Usuario no encontrado",
    "Error al cargar página",
    "No puedo inscribir materias",
    "Otro problema de SIGEI",
  ],
  [TicketCategory.VIRTUAL_PASS]: [
    "Olvidé mi contraseña",
    "No aparecen mis cursos",
    "Error al acceder a contenido",
    "Problemas con tareas",
    "Otro problema de plataforma",
  ],
  [TicketCategory.ACADEMIC_REQUEST]: [
    "Solicitud de carta",
    "Cambio de carrera",
    "Retiro de materia",
    "Revisión de calificación",
    "Otra solicitud académica",
  ],
  [TicketCategory.REDES]: [
    "WiFi no conecta",
    "Conexión lenta",
    "No hay internet en aula",
    "Problema con red cableada",
    "Otro problema de red",
  ],
  [TicketCategory.EQUIPOS]: [
    "Computadora no enciende",
    "Pantalla dañada",
    "Teclado/Mouse no funciona",
    "Impresora no funciona",
    "Otro problema de equipo",
  ],
  [TicketCategory.SOFTWARE]: [
    "Instalación de software",
    "Licencia expirada",
    "Software no funciona",
    "Actualización necesaria",
    "Otro problema de software",
  ],
  [TicketCategory.OTHER]: ["Consulta general", "Sugerencia", "Queja", "Otro"],
}

export default function TicketForm({ onClose, onSubmit }: TicketFormProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState<TicketCategory>(TicketCategory.EMAIL_PASS)
  const [problemType, setProblemType] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [preview, setPreview] = useState<{ priority: string; estimatedTime: string; tips?: string[] } | null>(null)

  const handleDescriptionChange = (value: string) => {
    setDescription(value)
    if (value.length > 20) {
      const analysis = analyzeTicket(value, category)
      setPreview({ priority: analysis.priority, estimatedTime: analysis.estimatedTime, tips: analysis.tips })
    } else {
      setPreview(null)
    }
  }

  const handleCategoryChange = (newCategory: TicketCategory) => {
    setCategory(newCategory)
    setProblemType("")
    if (description.length > 20) {
      const analysis = analyzeTicket(description, newCategory)
      setPreview({ priority: analysis.priority, estimatedTime: analysis.estimatedTime, tips: analysis.tips })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    onSubmit({ title, description, category, problemType })
  }

  const selectedCategoryConfig = categoryOptions.find((c) => c.value === category)
  const CategoryIcon = selectedCategoryConfig?.icon || HelpCircle

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl animate-fadeIn overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#002855] to-[#004a99] p-6 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-black">Nueva Solicitud</h2>
                <p className="text-blue-200 text-sm mt-1">Completa el formulario y te ayudaremos lo antes posible</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Category Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-3">
                Tipo de Solicitud
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {categoryOptions.map((opt) => {
                  const Icon = opt.icon
                  const isSelected = category === opt.value
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleCategoryChange(opt.value)}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        isSelected ? `border-[#003876] ${opt.bg}` : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Icon className={`w-6 h-6 mb-2 ${isSelected ? opt.color : "text-slate-400"}`} />
                      <span className={`text-xs font-bold block ${isSelected ? "text-slate-800" : "text-slate-600"}`}>
                        {opt.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Welcome Message */}
              <div className={`mt-3 p-3 rounded-xl ${selectedCategoryConfig?.bg} border`}>
                <p className={`text-sm ${selectedCategoryConfig?.color}`}>{getWelcomeMessage(category)}</p>
              </div>
            </div>

            {/* Problem Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Tipo de Problema
              </label>
              <select
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none"
                value={problemType}
                onChange={(e) => setProblemType(e.target.value)}
              >
                <option value="">Selecciona el tipo de problema</option>
                {problemTypes[category].map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Asunto</label>
              <input
                type="text"
                required
                placeholder="Ej: No puedo acceder a mi correo institucional"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                Descripción del Problema
              </label>
              <textarea
                required
                rows={4}
                placeholder="Describe detalladamente tu problema o solicitud. Incluye información relevante como mensajes de error, fechas, etc."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 text-slate-800 font-medium focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none transition-all resize-none"
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
              />
            </div>

            {/* Preview */}
            {preview && (
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <Lightbulb className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          preview.priority === "Alta"
                            ? "bg-red-100 text-red-700"
                            : preview.priority === "Baja"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        Prioridad: {preview.priority}
                      </span>
                      <span className="text-xs text-slate-500">Tiempo estimado: {preview.estimatedTime}</span>
                    </div>
                    {preview.tips && preview.tips.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-bold text-slate-600 mb-1">Consejos:</p>
                        <ul className="text-xs text-slate-500 space-y-1">
                          {preview.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-blue-500">•</span>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-6 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !title || !description || !problemType}
                className="flex-1 py-3 px-6 bg-[#003876] hover:bg-[#002855] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Enviando..." : "Enviar Solicitud"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
