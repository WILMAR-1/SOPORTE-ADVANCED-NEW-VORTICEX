"use client"

import type React from "react"
import { useState } from "react"
import { type User, UserRole, ROLE_CONFIG, canManageUsers } from "@/lib/types"
import { store } from "@/lib/store"
import { Search, Trash2, Shield, UserPlus, X, Crown, Globe, Cpu, Monitor, BookOpen, Lock, Users } from "lucide-react"

interface UserManagementProps {
  users: User[]
  currentUser: User
  onDeleteUser: (userId: string) => void
  onRefresh: () => void
}

const roleIcons: Record<UserRole, typeof Shield> = {
  [UserRole.SUPREMO_DIGITAL]: Crown,
  [UserRole.GLOBALIZADOR]: Globe,
  [UserRole.OPERACIONES_TICS]: Cpu,
  [UserRole.TECNOLOGIA_IT]: Monitor,
  [UserRole.DTE]: BookOpen,
  [UserRole.CIBERSEGURIDAD]: Lock,
  [UserRole.PASANTES]: Users,
  [UserRole.STUDENT]: Users,
}

export default function UserManagement({ users, currentUser, onDeleteUser, onRefresh }: UserManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterRole, setFilterRole] = useState<UserRole | "all">("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [newAdmin, setNewAdmin] = useState({
    name: "",
    lastName: "",
    email: "",
    cedula: "",
    age: "",
    role: UserRole.PASANTES as UserRole,
  })
  const [createError, setCreateError] = useState<string | null>(null)

  const filteredUsers = users.filter((u) => {
    if (u.role === UserRole.STUDENT) return false // No mostrar estudiantes aquí
    if (filterRole !== "all" && u.role !== filterRole) return false
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.cedula?.toLowerCase().includes(search)
      )
    }
    return true
  })

  const adminCount = users.filter((u) => u.role !== UserRole.STUDENT).length

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    setCreateError(null)

    // Validaciones
    if (!newAdmin.name || !newAdmin.lastName || !newAdmin.email || !newAdmin.cedula || !newAdmin.age) {
      setCreateError("Todos los campos son obligatorios")
      return
    }

    if (!newAdmin.email.endsWith("@itla.edu.do")) {
      setCreateError("El correo debe ser institucional (@itla.edu.do)")
      return
    }

    const existingUser = users.find((u) => u.email === newAdmin.email || u.cedula === newAdmin.cedula)
    if (existingUser) {
      setCreateError("Ya existe un usuario con ese correo o cédula")
      return
    }

    store.createAdmin({
      name: newAdmin.name,
      lastName: newAdmin.lastName,
      email: newAdmin.email,
      cedula: newAdmin.cedula,
      age: Number.parseInt(newAdmin.age),
      role: newAdmin.role,
      assignedCategories: [],
    })

    setShowCreateModal(false)
    setNewAdmin({ name: "", lastName: "", email: "", cedula: "", age: "", role: UserRole.PASANTES })
    onRefresh()
  }

  // Solo Supremo Digital y Globalizador pueden crear usuarios
  const canCreate = canManageUsers(currentUser.role)

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Total Administrativos</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{adminCount}</p>
            </div>
            <div className="w-12 h-12 bg-[#003876] rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Supremo Digital</p>
              <p className="text-3xl font-black text-amber-600 mt-1">
                {users.filter((u) => u.role === UserRole.SUPREMO_DIGITAL).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Globalizador</p>
              <p className="text-3xl font-black text-purple-600 mt-1">
                {users.filter((u) => u.role === UserRole.GLOBALIZADOR).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-500 text-sm font-medium">Soporte Activo</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">
                {
                  users.filter(
                    (u) => ![UserRole.STUDENT, UserRole.SUPREMO_DIGITAL, UserRole.GLOBALIZADOR].includes(u.role),
                  ).length
                }
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre, correo o cédula..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg py-2 pl-10 pr-4 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as UserRole | "all")}
          className="bg-slate-50 border border-slate-200 rounded-lg py-2 px-3 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-[#003876]/20 focus:border-[#003876] outline-none"
        >
          <option value="all">Todos los roles</option>
          {Object.entries(ROLE_CONFIG)
            .filter(([role]) => role !== UserRole.STUDENT)
            .map(([role, config]) => (
              <option key={role} value={role}>
                {config.label}
              </option>
            ))}
        </select>

        {canCreate && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-[#003876] hover:bg-[#002855] text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Crear Administrador
          </button>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Usuario
                </th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Rol</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Cédula</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">Edad</th>
                <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Registro
                </th>
                <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => {
                const config = ROLE_CONFIG[user.role]
                const RoleIcon = roleIcons[user.role]
                const isCurrentUser = user.id === currentUser.id
                // No permitir eliminar a Supremo Digital o Globalizador si no eres uno de ellos
                const canDelete =
                  canCreate &&
                  user.id !== currentUser.id &&
                  (currentUser.role === UserRole.SUPREMO_DIGITAL ||
                    (currentUser.role === UserRole.GLOBALIZADOR && user.role !== UserRole.SUPREMO_DIGITAL))

                return (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                            [UserRole.SUPREMO_DIGITAL, UserRole.GLOBALIZADOR].includes(user.role)
                              ? "bg-gradient-to-br from-[#f9b233] to-[#e6a020] text-[#002855]"
                              : "bg-[#003876] text-white"
                          }`}
                        >
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">
                            {user.name} {user.lastName || ""}
                          </p>
                          <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold ${config.bgColor} ${config.color}`}
                      >
                        <RoleIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600 font-mono bg-slate-100 px-2 py-1 rounded">
                        {user.cedula || "N/A"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-600">{user.age ? `${user.age} años` : "-"}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-slate-500">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {canDelete && (
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar usuario"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {isCurrentUser && <span className="text-xs text-slate-400 italic">Tu cuenta</span>}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="p-12 text-center">
            <p className="text-slate-500">No se encontraron usuarios con los filtros seleccionados.</p>
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fadeIn">
              <div className="bg-gradient-to-r from-[#002855] to-[#004a99] p-6 text-white rounded-t-2xl">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-bold">Crear Nuevo Administrador</h2>
                    <p className="text-blue-200 text-sm mt-1">Complete todos los campos requeridos</p>
                  </div>
                  <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white/10 rounded-xl">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
                {createError && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium border border-red-200">
                    {createError}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nombre</label>
                    <input
                      type="text"
                      required
                      placeholder="Juan"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm"
                      value={newAdmin.name}
                      onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Apellido</label>
                    <input
                      type="text"
                      required
                      placeholder="Pérez"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm"
                      value={newAdmin.lastName}
                      onChange={(e) => setNewAdmin({ ...newAdmin, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Correo Institucional</label>
                  <input
                    type="email"
                    required
                    placeholder="usuario@itla.edu.do"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Cédula</label>
                    <input
                      type="text"
                      required
                      placeholder="001-0000000-0"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm"
                      value={newAdmin.cedula}
                      onChange={(e) => setNewAdmin({ ...newAdmin, cedula: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Edad</label>
                    <input
                      type="number"
                      required
                      min="18"
                      max="70"
                      placeholder="25"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm"
                      value={newAdmin.age}
                      onChange={(e) => setNewAdmin({ ...newAdmin, age: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Rol</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-4 text-sm"
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value as UserRole })}
                  >
                    {Object.entries(ROLE_CONFIG)
                      .filter(([role]) => {
                        // Supremo Digital puede crear cualquier rol
                        // Globalizador puede crear todos menos Supremo Digital
                        if (currentUser.role === UserRole.SUPREMO_DIGITAL) return role !== UserRole.STUDENT
                        if (currentUser.role === UserRole.GLOBALIZADOR)
                          return role !== UserRole.STUDENT && role !== UserRole.SUPREMO_DIGITAL
                        return false
                      })
                      .map(([role, config]) => (
                        <option key={role} value={role}>
                          {config.label}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#003876] hover:bg-[#002855] text-white font-bold rounded-xl flex items-center justify-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    Crear Administrador
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
