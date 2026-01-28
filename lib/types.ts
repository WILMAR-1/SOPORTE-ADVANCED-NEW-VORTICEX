export enum UserRole {
  STUDENT = "STUDENT",
  SUPREMO_DIGITAL = "SUPREMO_DIGITAL",
  GLOBALIZADOR = "GLOBALIZADOR",
  OPERACIONES_TICS = "OPERACIONES_TICS",
  TECNOLOGIA_IT = "TECNOLOGIA_IT",
  DTE = "DTE",
  CIBERSEGURIDAD = "CIBERSEGURIDAD",
  PASANTES = "PASANTES",
}

export enum TicketStatus {
  OPEN = "Abierto",
  IN_PROGRESS = "En Proceso",
  RESOLVED = "Resuelto",
  CLOSED = "Cerrado",
}

export enum TicketCategory {
  SIGEI_PASS = "Contraseña SIGEI",
  VIRTUAL_PASS = "Plataforma Virtual",
  EMAIL_PASS = "Correo Institucional",
  ACADEMIC_REQUEST = "Solicitud Académica",
  REDES = "Redes y Conectividad",
  EQUIPOS = "Equipos y Hardware",
  SOFTWARE = "Software y Aplicaciones",
  OTHER = "Otros",
}

export interface TicketNote {
  id: string
  text: string
  author: string
  authorId: string
  role: UserRole
  createdAt: string
  isSystem?: boolean
}

export interface User {
  id: string
  name: string
  lastName?: string
  email: string
  role: UserRole
  cedula?: string
  age?: number
  matricula?: string
  personalEmail?: string
  phone?: string
  career?: string
  createdAt?: string
  assignedCategories?: TicketCategory[]
}

export interface Ticket {
  id: string
  number: string
  userId: string
  userName: string
  userEmail?: string
  userMatricula?: string
  assignedTo?: string
  assignedName?: string
  title: string
  description: string
  category: TicketCategory
  status: TicketStatus
  priority: "Baja" | "Media" | "Alta"
  notes: TicketNote[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  resolvedBy?: string
  resolvedByName?: string
  problemType?: string
}

export interface TicketStats {
  total: number
  open: number
  inProgress: number
  resolved: number
  closed: number
  todayCreated: number
  todayResolved: number
  avgResponseTime?: string
}

export interface RoleCategoryAssignment {
  roleId: UserRole
  categories: TicketCategory[]
}

export const ROLE_CONFIG: Record<
  UserRole,
  {
    label: string
    level: number
    canManageUsers: boolean
    canAssignCategories: boolean
    canViewAllTickets: boolean
    canDeleteTickets: boolean
    color: string
    bgColor: string
  }
> = {
  [UserRole.SUPREMO_DIGITAL]: {
    label: "Supremo Digital",
    level: 100,
    canManageUsers: true,
    canAssignCategories: true,
    canViewAllTickets: true,
    canDeleteTickets: true,
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
  [UserRole.GLOBALIZADOR]: {
    label: "Globalizador",
    level: 90,
    canManageUsers: true,
    canAssignCategories: true,
    canViewAllTickets: true,
    canDeleteTickets: true,
    color: "text-purple-700",
    bgColor: "bg-purple-100",
  },
  [UserRole.OPERACIONES_TICS]: {
    label: "Operaciones TICs",
    level: 70,
    canManageUsers: false,
    canAssignCategories: false,
    canViewAllTickets: false,
    canDeleteTickets: false,
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
  [UserRole.TECNOLOGIA_IT]: {
    label: "Tecnología IT",
    level: 70,
    canManageUsers: false,
    canAssignCategories: false,
    canViewAllTickets: false,
    canDeleteTickets: false,
    color: "text-cyan-700",
    bgColor: "bg-cyan-100",
  },
  [UserRole.DTE]: {
    label: "DTE",
    level: 70,
    canManageUsers: false,
    canAssignCategories: false,
    canViewAllTickets: false,
    canDeleteTickets: false,
    color: "text-emerald-700",
    bgColor: "bg-emerald-100",
  },
  [UserRole.CIBERSEGURIDAD]: {
    label: "CiberSeguridad",
    level: 70,
    canManageUsers: false,
    canAssignCategories: false,
    canViewAllTickets: false,
    canDeleteTickets: false,
    color: "text-red-700",
    bgColor: "bg-red-100",
  },
  [UserRole.PASANTES]: {
    label: "Pasantes",
    level: 50,
    canManageUsers: false,
    canAssignCategories: false,
    canViewAllTickets: false,
    canDeleteTickets: false,
    color: "text-slate-700",
    bgColor: "bg-slate-100",
  },
  [UserRole.STUDENT]: {
    label: "Estudiante",
    level: 0,
    canManageUsers: false,
    canAssignCategories: false,
    canViewAllTickets: false,
    canDeleteTickets: false,
    color: "text-blue-700",
    bgColor: "bg-blue-100",
  },
}

// Helper para verificar si un rol puede gestionar usuarios
export function canManageUsers(role: UserRole): boolean {
  return ROLE_CONFIG[role]?.canManageUsers ?? false
}

export function canAssignCategories(role: UserRole): boolean {
  return ROLE_CONFIG[role]?.canAssignCategories ?? false
}

export function canViewAllTickets(role: UserRole): boolean {
  return ROLE_CONFIG[role]?.canViewAllTickets ?? false
}

export function canDeleteTickets(role: UserRole): boolean {
  return ROLE_CONFIG[role]?.canDeleteTickets ?? false
}

export function isAdmin(role: UserRole): boolean {
  return role !== UserRole.STUDENT
}
