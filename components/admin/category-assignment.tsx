"use client"

import { useState } from "react"
import { type User, UserRole, TicketCategory, ROLE_CONFIG, canAssignCategories } from "@/lib/types"
import { store } from "@/lib/store"
import { Settings, Check, Save, RefreshCw } from "lucide-react"

interface CategoryAssignmentProps {
  users: User[]
  currentUser: User
  onRefresh: () => void
}

export default function CategoryAssignment({ users, currentUser, onRefresh }: CategoryAssignmentProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedCategories, setSelectedCategories] = useState<TicketCategory[]>([])
  const [isSaving, setIsSaving] = useState(false)

  // Filtrar solo usuarios admin (no estudiantes)
  const adminUsers = users.filter((u) => u.role !== UserRole.STUDENT)

  const handleSelectUser = (user: User) => {
    setSelectedUser(user)
    setSelectedCategories(user.assignedCategories || [])
  }

  const toggleCategory = (category: TicketCategory) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category))
    } else {
      setSelectedCategories([...selectedCategories, category])
    }
  }

  const handleSave = async () => {
    if (!selectedUser) return
    setIsSaving(true)

    store.updateUserCategories(selectedUser.id, selectedCategories)

    setTimeout(() => {
      setIsSaving(false)
      onRefresh()
      setSelectedUser(null)
    }, 500)
  }

  if (!canAssignCategories(currentUser.role)) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
        <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-600">Acceso Restringido</h3>
        <p className="text-slate-400 mt-1">Solo Supremo Digital y Globalizador pueden asignar categorías.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#002855] to-[#004a99] rounded-2xl p-6 text-white">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Asignación de Categorías
        </h2>
        <p className="text-blue-200 text-sm mt-1">
          Asigna qué tipos de tickets puede ver y atender cada miembro del equipo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de usuarios */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-700">Seleccionar Usuario</h3>
          </div>
          <div className="divide-y divide-slate-100 max-h-[500px] overflow-y-auto">
            {adminUsers.map((user) => {
              const config = ROLE_CONFIG[user.role]
              const isSelected = selectedUser?.id === user.id
              const categoryCount = user.assignedCategories?.length || 0

              return (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className={`w-full p-4 text-left hover:bg-slate-50 transition-colors flex items-center gap-3 ${
                    isSelected ? "bg-blue-50 border-l-4 border-[#003876]" : ""
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      [UserRole.SUPREMO_DIGITAL, UserRole.GLOBALIZADOR].includes(user.role)
                        ? "bg-gradient-to-br from-[#f9b233] to-[#e6a020] text-[#002855]"
                        : "bg-[#003876] text-white"
                    }`}
                  >
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-800">
                      {user.name} {user.lastName || ""}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                      <span className="text-xs text-slate-400">
                        {categoryCount} categoría{categoryCount !== 1 ? "s" : ""} asignada
                        {categoryCount !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-[#003876]" />}
                </button>
              )
            })}
          </div>
        </div>

        {/* Categorías */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-700">
              {selectedUser ? `Categorías de ${selectedUser.name}` : "Selecciona un usuario"}
            </h3>
          </div>

          {selectedUser ? (
            <div className="p-4">
              <div className="space-y-2">
                {Object.values(TicketCategory).map((category) => {
                  const isAssigned = selectedCategories.includes(category)

                  return (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center justify-between ${
                        isAssigned ? "border-[#003876] bg-blue-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className={`font-medium ${isAssigned ? "text-[#003876]" : "text-slate-600"}`}>
                        {category}
                      </span>
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          isAssigned ? "bg-[#003876]" : "bg-slate-200"
                        }`}
                      >
                        {isAssigned && <Check className="w-4 h-4 text-white" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedUser(null)}
                  className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 py-3 bg-[#003876] hover:bg-[#002855] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center">
              <Settings className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">Selecciona un usuario de la lista para asignar categorías</p>
            </div>
          )}
        </div>
      </div>

      {/* Leyenda */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-amber-800 text-sm font-medium">
          <strong>Nota:</strong> Los usuarios solo verán y podrán atender tickets de las categorías que tengan
          asignadas. Los roles Supremo Digital y Globalizador pueden ver todos los tickets independientemente de las
          categorías asignadas.
        </p>
      </div>
    </div>
  )
}
