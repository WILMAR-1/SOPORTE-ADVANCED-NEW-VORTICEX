import {
  type User,
  type Ticket,
  TicketStatus,
  TicketCategory,
  UserRole,
  type TicketNote,
  type TicketStats,
  canViewAllTickets,
} from "./types"

const defaultUsers: User[] = [
  {
    id: "1",
    name: "Carlos",
    lastName: "Supremo",
    email: "supremo@itla.edu.do",
    role: UserRole.SUPREMO_DIGITAL,
    cedula: "001-0000001-1",
    age: 45,
    createdAt: "2024-01-01T00:00:00Z",
    assignedCategories: Object.values(TicketCategory),
  },
  {
    id: "2",
    name: "María",
    lastName: "Global",
    email: "globalizador@itla.edu.do",
    role: UserRole.GLOBALIZADOR,
    cedula: "001-0000002-2",
    age: 40,
    createdAt: "2024-01-01T00:00:00Z",
    assignedCategories: Object.values(TicketCategory),
  },
  {
    id: "3",
    name: "Pedro",
    lastName: "Operaciones",
    email: "operaciones@itla.edu.do",
    role: UserRole.OPERACIONES_TICS,
    cedula: "001-0000003-3",
    age: 35,
    createdAt: "2024-01-15T00:00:00Z",
    assignedCategories: [TicketCategory.REDES, TicketCategory.EQUIPOS],
  },
  {
    id: "4",
    name: "Ana",
    lastName: "Tecnología",
    email: "tecnologia@itla.edu.do",
    role: UserRole.TECNOLOGIA_IT,
    cedula: "001-0000004-4",
    age: 32,
    createdAt: "2024-01-15T00:00:00Z",
    assignedCategories: [TicketCategory.SIGEI_PASS, TicketCategory.SOFTWARE],
  },
  {
    id: "5",
    name: "Luis",
    lastName: "DTE",
    email: "dte@itla.edu.do",
    role: UserRole.DTE,
    cedula: "001-0000005-5",
    age: 30,
    createdAt: "2024-01-15T00:00:00Z",
    assignedCategories: [TicketCategory.VIRTUAL_PASS, TicketCategory.ACADEMIC_REQUEST],
  },
  {
    id: "6",
    name: "Rosa",
    lastName: "Cyber",
    email: "ciberseguridad@itla.edu.do",
    role: UserRole.CIBERSEGURIDAD,
    cedula: "001-0000006-6",
    age: 28,
    createdAt: "2024-01-15T00:00:00Z",
    assignedCategories: [TicketCategory.EMAIL_PASS],
  },
  {
    id: "7",
    name: "Miguel",
    lastName: "Pasante",
    email: "pasante@itla.edu.do",
    role: UserRole.PASANTES,
    cedula: "001-0000007-7",
    age: 22,
    createdAt: "2024-02-01T00:00:00Z",
    assignedCategories: [TicketCategory.OTHER],
  },
  {
    id: "8",
    name: "Juan",
    lastName: "Pérez",
    email: "juan.perez@itla.edu.do",
    role: UserRole.STUDENT,
    matricula: "2023-0123",
    personalEmail: "juan.perez@gmail.com",
    phone: "809-555-1234",
    career: "Desarrollo de Software",
    createdAt: "2024-02-01T00:00:00Z",
  },
]

// Tickets de ejemplo
const defaultTickets: Ticket[] = [
  {
    id: "1",
    number: "000001",
    userId: "8",
    userName: "Juan Pérez",
    userEmail: "juan.perez@itla.edu.do",
    userMatricula: "2023-0123",
    title: "No puedo acceder a mi correo institucional",
    description:
      "Desde hace 2 días no puedo entrar a mi correo @itla.edu.do. Dice que la contraseña es incorrecta pero estoy seguro que es la correcta. Necesito acceder urgente porque tengo entregas pendientes.",
    category: TicketCategory.EMAIL_PASS,
    status: TicketStatus.IN_PROGRESS,
    priority: "Alta",
    assignedTo: "6",
    assignedName: "Rosa Cyber",
    problemType: "Acceso denegado",
    notes: [
      {
        id: "n1",
        text: "Solicitud recibida. Verificando estado de la cuenta en el directorio.",
        author: "Rosa Cyber",
        authorId: "6",
        role: UserRole.CIBERSEGURIDAD,
        createdAt: "2024-01-20T10:30:00Z",
      },
    ],
    createdAt: "2024-01-20T09:00:00Z",
    updatedAt: "2024-01-20T10:30:00Z",
  },
  {
    id: "2",
    number: "000002",
    userId: "8",
    userName: "Juan Pérez",
    userEmail: "juan.perez@itla.edu.do",
    userMatricula: "2023-0123",
    title: "Problema con plataforma virtual",
    description:
      "No me aparecen las materias de este cuatrimestre en la plataforma virtual. Ya estoy inscrito según SIGEI.",
    category: TicketCategory.VIRTUAL_PASS,
    status: TicketStatus.OPEN,
    priority: "Media",
    problemType: "Sincronización de datos",
    notes: [],
    createdAt: "2024-01-21T14:00:00Z",
    updatedAt: "2024-01-21T14:00:00Z",
  },
  {
    id: "3",
    number: "000003",
    userId: "8",
    userName: "Juan Pérez",
    userEmail: "juan.perez@itla.edu.do",
    userMatricula: "2023-0123",
    title: "Solicitud de cambio de contraseña SIGEI",
    description: "Olvidé mi contraseña de SIGEI y necesito recuperarla para poder inscribir mis materias.",
    category: TicketCategory.SIGEI_PASS,
    status: TicketStatus.RESOLVED,
    priority: "Media",
    problemType: "Recuperación de contraseña",
    assignedTo: "4",
    assignedName: "Ana Tecnología",
    resolvedAt: "2024-01-19T16:00:00Z",
    resolvedBy: "4",
    resolvedByName: "Ana Tecnología",
    notes: [
      {
        id: "n2",
        text: "Se ha restablecido la contraseña. Se enviaron las instrucciones al correo personal.",
        author: "Ana Tecnología",
        authorId: "4",
        role: UserRole.TECNOLOGIA_IT,
        createdAt: "2024-01-19T16:00:00Z",
      },
    ],
    createdAt: "2024-01-19T10:00:00Z",
    updatedAt: "2024-01-19T16:00:00Z",
  },
]

// Almacenamiento en memoria
const users = [...defaultUsers]
const tickets = [...defaultTickets]
let ticketCounter = 4

// Event listeners para sincronización en tiempo real
type Listener = () => void
const ticketListeners: Set<Listener> = new Set()
const userListeners: Set<Listener> = new Set()

function notifyTicketListeners() {
  ticketListeners.forEach((listener) => listener())
}

function notifyUserListeners() {
  userListeners.forEach((listener) => listener())
}

export const store = {
  login: (email: string, password: string): User | null => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (user && password === "Itla2024!") {
      return user
    }
    return null
  },

  registerStudent: (userData: {
    name: string
    lastName: string
    email: string
    matricula: string
    personalEmail?: string
    phone?: string
    career?: string
  }): User => {
    const newUser: User = {
      ...userData,
      id: String(users.length + 1),
      role: UserRole.STUDENT,
      createdAt: new Date().toISOString(),
    }
    users.push(newUser)
    notifyUserListeners()
    return newUser
  },

  createAdmin: (adminData: {
    name: string
    lastName: string
    email: string
    cedula: string
    age: number
    role: UserRole
    assignedCategories?: TicketCategory[]
  }): User => {
    const newUser: User = {
      ...adminData,
      id: String(users.length + 1),
      createdAt: new Date().toISOString(),
      assignedCategories: adminData.assignedCategories || [],
    }
    users.push(newUser)
    notifyUserListeners()
    return newUser
  },

  updateUserCategories: (userId: string, categories: TicketCategory[]): User | null => {
    const index = users.findIndex((u) => u.id === userId)
    if (index > -1) {
      users[index] = { ...users[index], assignedCategories: categories }
      notifyUserListeners()
      return users[index]
    }
    return null
  },

  updateUser: (userId: string, updates: Partial<User>): User | null => {
    const index = users.findIndex((u) => u.id === userId)
    if (index > -1) {
      users[index] = { ...users[index], ...updates }
      notifyUserListeners()
      return users[index]
    }
    return null
  },

  getUsers: (): User[] => users,

  getUserById: (id: string): User | undefined => users.find((u) => u.id === id),

  getAdminUsers: (): User[] => users.filter((u) => u.role !== UserRole.STUDENT),

  getStudentUsers: (): User[] => users.filter((u) => u.role === UserRole.STUDENT),

  deleteUser: (id: string): boolean => {
    const index = users.findIndex((u) => u.id === id)
    if (index > -1) {
      users.splice(index, 1)
      notifyUserListeners()
      return true
    }
    return false
  },

  // Tickets
  getTickets: (): Ticket[] => tickets,

  getTicketsForUser: (user: User): Ticket[] => {
    if (canViewAllTickets(user.role)) {
      return tickets
    }
    // Filtrar por categorías asignadas al usuario
    const assignedCats = user.assignedCategories || []
    return tickets.filter((t) => assignedCats.includes(t.category))
  },

  getTicketById: (id: string): Ticket | undefined => tickets.find((t) => t.id === id),

  getTicketsByUser: (userId: string): Ticket[] => tickets.filter((t) => t.userId === userId),

  getTicketsByStatus: (status: TicketStatus): Ticket[] => tickets.filter((t) => t.status === status),

  getTicketsByCategory: (category: TicketCategory): Ticket[] => tickets.filter((t) => t.category === category),

  createTicket: (ticketData: Omit<Ticket, "id" | "number" | "createdAt" | "updatedAt" | "notes">): Ticket => {
    const newTicket: Ticket = {
      ...ticketData,
      id: String(ticketCounter),
      number: String(ticketCounter).padStart(6, "0"),
      notes: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    ticketCounter++
    tickets.unshift(newTicket)
    notifyTicketListeners()
    return newTicket
  },

  updateTicket: (id: string, updates: Partial<Ticket>): Ticket | null => {
    const index = tickets.findIndex((t) => t.id === id)
    if (index > -1) {
      tickets[index] = {
        ...tickets[index],
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      notifyTicketListeners()
      return tickets[index]
    }
    return null
  },

  resolveTicket: (id: string, resolvedBy: User): Ticket | null => {
    const index = tickets.findIndex((t) => t.id === id)
    if (index > -1) {
      tickets[index] = {
        ...tickets[index],
        status: TicketStatus.RESOLVED,
        resolvedAt: new Date().toISOString(),
        resolvedBy: resolvedBy.id,
        resolvedByName: `${resolvedBy.name} ${resolvedBy.lastName || ""}`.trim(),
        updatedAt: new Date().toISOString(),
      }
      notifyTicketListeners()
      return tickets[index]
    }
    return null
  },

  addNote: (ticketId: string, note: Omit<TicketNote, "id" | "createdAt">): TicketNote | null => {
    const ticket = tickets.find((t) => t.id === ticketId)
    if (ticket) {
      const newNote: TicketNote = {
        ...note,
        id: `note-${Date.now()}`,
        createdAt: new Date().toISOString(),
      }
      ticket.notes.push(newNote)
      ticket.updatedAt = new Date().toISOString()
      notifyTicketListeners()
      return newNote
    }
    return null
  },

  deleteTicket: (id: string): boolean => {
    const index = tickets.findIndex((t) => t.id === id)
    if (index > -1) {
      tickets.splice(index, 1)
      notifyTicketListeners()
      return true
    }
    return false
  },

  getStats: (): TicketStats => {
    const today = new Date().toDateString()
    return {
      total: tickets.length,
      open: tickets.filter((t) => t.status === TicketStatus.OPEN).length,
      inProgress: tickets.filter((t) => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: tickets.filter((t) => t.status === TicketStatus.RESOLVED).length,
      closed: tickets.filter((t) => t.status === TicketStatus.CLOSED).length,
      todayCreated: tickets.filter((t) => new Date(t.createdAt).toDateString() === today).length,
      todayResolved: tickets.filter((t) => t.resolvedAt && new Date(t.resolvedAt).toDateString() === today).length,
    }
  },

  getStatsForUser: (user: User): TicketStats => {
    const userTickets = store.getTicketsForUser(user)
    const today = new Date().toDateString()
    return {
      total: userTickets.length,
      open: userTickets.filter((t) => t.status === TicketStatus.OPEN).length,
      inProgress: userTickets.filter((t) => t.status === TicketStatus.IN_PROGRESS).length,
      resolved: userTickets.filter((t) => t.status === TicketStatus.RESOLVED).length,
      closed: userTickets.filter((t) => t.status === TicketStatus.CLOSED).length,
      todayCreated: userTickets.filter((t) => new Date(t.createdAt).toDateString() === today).length,
      todayResolved: userTickets.filter((t) => t.resolvedAt && new Date(t.resolvedAt).toDateString() === today).length,
    }
  },

  // Listeners para tiempo real
  subscribeToTickets: (listener: Listener) => {
    ticketListeners.add(listener)
    return () => ticketListeners.delete(listener)
  },

  subscribeToUsers: (listener: Listener) => {
    userListeners.add(listener)
    return () => userListeners.delete(listener)
  },
}
