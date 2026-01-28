"use client"

import { useState, useEffect } from "react"
import { type User, type Ticket, TicketStatus, type TicketCategory, UserRole } from "@/lib/types"
import { store } from "@/lib/store"
import { analyzeTicket } from "@/lib/smart-messages"
import StudentAuth from "@/components/student/student-auth"
import StudentHeader from "@/components/student/student-header"
import TicketForm from "@/components/student/ticket-form"
import StudentTicketList from "@/components/student/student-ticket-list"
import { Plus, TicketIcon, History, CheckCircle } from "lucide-react"

export default function StudentPortal() {
  const [user, setUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("student_user")
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      if (parsedUser.role === UserRole.STUDENT) {
        setUser(parsedUser)
      }
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (user) {
      const loadTickets = () => {
        setTickets(store.getTicketsByUser(user.id))
      }
      loadTickets()
      const unsubscribe = store.subscribeToTickets(loadTickets)
      return () => unsubscribe()
    }
  }, [user])

  const handleLogin = (loggedUser: User) => {
    localStorage.setItem("student_user", JSON.stringify(loggedUser))
    setUser(loggedUser)
  }

  const handleLogout = () => {
    localStorage.removeItem("student_user")
    setUser(null)
    setTickets([])
  }

  const handleCreateTicket = (data: {
    title: string
    description: string
    category: TicketCategory
    problemType?: string
  }) => {
    if (!user) return

    const analysis = analyzeTicket(data.description, data.category)

    const newTicket = store.createTicket({
      userId: user.id,
      userName: `${user.name} ${user.lastName || ""}`.trim(),
      userEmail: user.email,
      userMatricula: user.matricula,
      title: data.title,
      description: data.description,
      category: data.category,
      status: TicketStatus.OPEN,
      priority: analysis.priority,
      problemType: data.problemType,
    })

    store.addNote(newTicket.id, {
      text: analysis.message,
      author: "Sistema ITLA",
      authorId: "system",
      role: UserRole.STUDENT,
      isSystem: true,
    })

    setShowTicketForm(false)
  }

  const handleAddNote = (ticketId: string, text: string) => {
    if (!user) return
    store.addNote(ticketId, {
      text,
      author: `${user.name} ${user.lastName || ""}`.trim(),
      authorId: user.id,
      role: user.role,
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-pulse-soft text-center">
          <div className="w-16 h-16 bg-[#003876] rounded-2xl mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <StudentAuth onLogin={handleLogin} />
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === TicketStatus.OPEN).length,
    inProgress: tickets.filter((t) => t.status === TicketStatus.IN_PROGRESS).length,
    resolved: tickets.filter((t) => t.status === TicketStatus.RESOLVED || t.status === TicketStatus.CLOSED).length,
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentHeader user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-[#002855] to-[#004a99] rounded-3xl p-8 mb-8 text-white relative overflow-hidden animate-fadeIn">
          <div className="absolute right-0 top-0 opacity-5 pointer-events-none">
            <img src="https://itla.edu.do/wp-content/uploads/2021/05/Logo-ITLA.png" alt="" className="w-64" />
          </div>
          <div className="relative z-10">
            <h1 className="text-3xl font-black mb-2">
              Bienvenido, {user.name} {user.lastName || ""}
            </h1>
            <p className="text-blue-200 mb-6">
              {user.matricula && (
                <span className="bg-white/10 px-3 py-1 rounded-lg text-sm mr-2">Mat: {user.matricula}</span>
              )}
              {user.career && <span className="text-sm">{user.career}</span>}
            </p>
            <button
              onClick={() => setShowTicketForm(true)}
              className="inline-flex items-center gap-2 bg-[#f9b233] hover:bg-[#e6a020] text-[#002855] font-bold px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-xl active:scale-95"
            >
              <Plus className="w-5 h-5" />
              Nueva Solicitud
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <TicketIcon className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{stats.open}</p>
                <p className="text-xs text-slate-500 font-medium">Abiertas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-800">{stats.inProgress}</p>
                <p className="text-xs text-slate-500 font-medium">En Proceso</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-black text-emerald-600">{stats.resolved}</p>
                <p className="text-xs text-slate-500 font-medium">Resueltas</p>
              </div>
            </div>
          </div>
        </div>

        <StudentTicketList tickets={tickets} onAddNote={handleAddNote} userId={user.id} />
      </main>

      {showTicketForm && <TicketForm onClose={() => setShowTicketForm(false)} onSubmit={handleCreateTicket} />}
    </div>
  )
}
