"use client"

import { useState, useEffect } from "react"
import { type User, type Ticket, TicketStatus, type TicketCategory, UserRole } from "@/lib/types"
import { store } from "@/lib/store"
import { analyzeTicket } from "@/lib/smart-messages"
import StudentAuth from "@/components/student/student-auth"
import StudentHeader from "@/components/student/student-header"
import StudentSidebar from "@/components/student/student-sidebar"
import TicketForm from "@/components/student/ticket-form"
import StudentTicketList from "@/components/student/student-ticket-list"

export default function StudentPortal() {
  const [user, setUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse-soft text-center">
          <div className="w-16 h-16 bg-secondary rounded-2xl mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Cargando...</p>
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
    <div className="min-h-screen bg-background flex">
      <StudentSidebar
        user={user}
        stats={stats}
        onNewTicket={() => setShowTicketForm(true)}
        isOpen={sidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <StudentHeader
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 p-6 overflow-auto">
          <StudentTicketList tickets={tickets} onAddNote={handleAddNote} userId={user.id} />
        </main>
      </div>

      {showTicketForm && <TicketForm onClose={() => setShowTicketForm(false)} onSubmit={handleCreateTicket} />}
    </div>
  )
}
