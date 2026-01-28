export enum UserRole {
  STUDENT = 'STUDENT',
  ADMIN = 'ADMIN',
  TECNOLOGIA = 'TECNOLOGIA',
  DTE = 'DTE',
  SEGURIDAD = 'SEGURIDAD'
}

export enum TicketStatus {
  OPEN = 'Abierto',
  IN_PROGRESS = 'En Proceso',
  RESOLVED = 'Resuelto',
  CLOSED = 'Cerrado'
}

export enum TicketCategory {
  SIGEI_PASS = 'Incidente de contraseña SIGEI',
  VIRTUAL_PASS = 'Incidente de contraseña plataforma virtual',
  EMAIL_PASS = 'Incidente de contraseña correo',
  ACADEMIC_REQUEST = 'Solicitud Académica',
  OTHER = 'Otros'
}

export interface TicketNote {
  id: string;
  text: string;
  author: string;
  role: UserRole;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  matricula?: string;
  personalEmail?: string;
  phone?: string;
  career?: string;
  createdAt?: string;
}

export interface Ticket {
  id: string;
  userId: string;
  userName: string;
  assignedTo?: string; // ID del técnico asignado
  assignedName?: string; // Nombre del técnico asignado
  title: string;
  description: string;
  category: TicketCategory;
  status: TicketStatus;
  priority?: string;
  notes: TicketNote[];
  createdAt: string;
  updatedAt: string;
}
