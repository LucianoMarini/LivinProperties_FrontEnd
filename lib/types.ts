// User roles
export type UserRole = "Administrador" | "Agente" | "Cliente"

// User type
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  createdAt: string
}

// Property types
export type PropertyType = "Apartamento" | "Casa" | "Villa" | "Terreno" | "Comercial"
export type PropertyStatus = "Disponible" | "Reservada" | "Vendida"

export interface Property {
  id: string
  title: string
  description: string
  type: PropertyType
  status: PropertyStatus
  price: number
  location: string
  area: number // in square meters
  bedrooms?: number
  bathrooms?: number
  images: string[]
  agentId: string
  createdAt: string
  updatedAt: string
}

// Chat message
export interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  propertyId?: string
  message: string
  createdAt: string
  read: boolean
}

// Document types
export type DocumentType = "Contrato" | "Escritura"

export interface Document {
  id: string
  propertyId: string
  type: DocumentType
  fileName: string
  fileUrl: string
  uploadedBy: string
  uploadedAt: string
}

// Visit/Reservation
export interface Visit {
  id: string
  propertyId: string
  clientId: string
  agentId: string
  scheduledDate: string
  status: "Programada" | "Completada" | "Cancelada"
  notes?: string
  createdAt: string
}

// Reservation type for property reservations
export interface Reservation {
  id: string
  propertyId: string
  clientId: string
  agentId: string
  reservationDate: string
  expiryDate: string
  status: "Activa" | "Expirada" | "Cancelada" | "Confirmada"
  notes?: string
  createdAt: string
}
