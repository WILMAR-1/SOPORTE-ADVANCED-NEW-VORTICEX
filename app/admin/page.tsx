"use client"

import { useState, useEffect } from "react"
import { type User, type Ticket, TicketStatus, type TicketCategory, UserRole, canViewAllTickets } from "@/lib/types"
import { store } from "@/lib/store"
import { getSystemNote } from "@/lib/smart-messages"
import AdminAuth from "@/components/admin/admin-auth"
import AdminSidebar from "@/components/admin/admin-sidebar"
import AdminHeader from "@/components/admin/admin-header"
import TicketDashboard from "@/components/admin/ticket-dashboard"
import UserManagement from "@/components/admin/user-management"
import CategoryAssignment from "@/components/admin/category-assignment"
import ReportsView from "@/components/admin/reports-view"

type View = "dashboard" | "tickets" | "users" | "categories" | "reports"

export default function AdminPortal() {
  const [user, setUser] = useState<User | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [currentView, setCurrentView] = useState<View>("dashboard")
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("admin_user")
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser)
      if (parsedUser.role !== UserRole.STUDENT) {
        setUser(parsedUser)
      }
    }
    setIsLoading(false)
  }, [])

  // Fetch data and subscribe to updates
  useEffect(() => {
    if (user) {
      const loadData = () => {
        if (canViewAllTickets(user.role)) {
          setTickets(store.getTickets())
        } else {
          setTickets(store.getTicketsForUser(user))
        }
        setUsers(store.getUsers())
      }
      loadData()

      // Subscribe to real-time updates
      const unsubTickets = store.subscribeToTickets(loadData)
      const unsubUsers = store.subscribeToUsers(loadData)

      return () => {
        unsubTickets()
        unsubUsers()
      }
    }
  }, [user])

  const handleLogin = (loggedUser: User) => {
    localStorage.setItem("admin_user", JSON.stringify(loggedUser))
    setUser(loggedUser)
  }

  const handleLogout = () => {
    localStorage.removeItem("admin_user")
    setUser(null)
    setTickets([])
    setUsers([])
  }

  const handleUpdateTicketStatus = (ticketId: string, status: TicketStatus) => {
    if (!user) return

    if (status === TicketStatus.RESOLVED) {
      store.resolveTicket(ticketId, user)
      store.addNote(ticketId, {
        text: getSystemNote("resolved", `${user.name} ${user.lastName || ""}`),
        author: "Sistema",
        authorId: "system",
        role: user.role,
        isSystem: true,
      })
    } else {
      const ticket = store.updateTicket(ticketId, { status })
      if (ticket) {
        store.addNote(ticketId, {
          text: getSystemNote("statusChange", `${user.name} ${user.lastName || ""}`, status),
          author: "Sistema",
          authorId: "system",
          role: user.role,
          isSystem: true,
        })
      }
    }
  }

  const handleAssignTicket = (ticketId: string) => {
    if (!user) return
    const fullName = `${user.name} ${user.lastName || ""}`.trim()
    const ticket = store.updateTicket(ticketId, {
      assignedTo: user.id,
      assignedName: fullName,
      status: TicketStatus.IN_PROGRESS,
    })
    if (ticket) {
      store.addNote(ticketId, {
        text: getSystemNote("assigned", fullName),
        author: "Sistema",
        authorId: "system",
        role: user.role,
        isSystem: true,
      })
    }
  }

  const handleTransferTicket = (ticketId: string, newCategory: TicketCategory) => {
    if (!user) return
    const fullName = `${user.name} ${user.lastName || ""}`.trim()
    const ticket = store.updateTicket(ticketId, {
      category: newCategory,
      assignedTo: undefined,
      assignedName: undefined,
      status: TicketStatus.OPEN,
    })
    if (ticket) {
      store.addNote(ticketId, {
        text: getSystemNote("transferred", fullName, newCategory),
        author: "Sistema",
        authorId: "system",
        role: user.role,
        isSystem: true,
      })
    }
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

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm("¿Estás seguro de eliminar este ticket? Esta acción no se puede deshacer.")) {
      store.deleteTicket(ticketId)
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (userId === user?.id) {
      alert("No puedes eliminar tu propia cuenta.")
      return
    }
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      store.deleteUser(userId)
    }
  }

  const handleRefresh = () => {
    if (user) {
      if (canViewAllTickets(user.role)) {
        setTickets(store.getTickets())
      } else {
        setTickets(store.getTicketsForUser(user))
      }
      setUsers(store.getUsers())
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-pulse-soft text-center">
          <div className="w-16 h-16 bg-[#f9b233] rounded-2xl mx-auto mb-4"></div>
          <p className="text-slate-400 font-medium">Cargando Sistema...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AdminAuth onLogin={handleLogin} />
  }

  const stats = canViewAllTickets(user.role) ? store.getStats() : store.getStatsForUser(user)

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar
        user={user}
        currentView={currentView}
        onViewChange={setCurrentView}
        isOpen={sidebarOpen}
        stats={stats}
      />

      <div className="flex-1 flex flex-col min-h-screen">
        <AdminHeader
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <main className="flex-1 p-6 overflow-auto">
          {currentView === "dashboard" || currentView === "tickets" ? (
            <TicketDashboard
              tickets={tickets}
              users={users}
              currentUser={user}
              stats={stats}
              showDashboard={currentView === "dashboard"}
              onUpdateStatus={handleUpdateTicketStatus}
              onAssign={handleAssignTicket}
              onTransfer={handleTransferTicket}
              onAddNote={handleAddNote}
              onDelete={handleDeleteTicket}
            />
          ) : currentView === "users" ? (
            <UserManagement
              users={users}
              currentUser={user}
              onDeleteUser={handleDeleteUser}
              onRefresh={handleRefresh}
            />
          ) : currentView === "categories" ? (
            <CategoryAssignment users={users} currentUser={user} onRefresh={handleRefresh} />
          ) : (
            <ReportsView tickets={tickets} users={users} />
          )}
        </main>
      </div>
    </div>
  )
}
