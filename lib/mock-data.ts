import type { User, Property, ChatMessage, Document, Visit, Reservation } from "./types"

// Mock users
export const mockUsers: User[] = [
  {
    id: "admin-1",
    email: "admin@livinproperties.com",
    name: "Admin User",
    role: "Administrador",
    phone: "+1234567890",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "agent-1",
    email: "john.agent@livinproperties.com",
    name: "John Smith",
    role: "Agente",
    phone: "+1234567891",
    createdAt: "2024-01-02T00:00:00Z",
  },
  {
    id: "agent-2",
    email: "sarah.agent@livinproperties.com",
    name: "Sarah Johnson",
    role: "Agente",
    phone: "+1234567892",
    createdAt: "2024-01-03T00:00:00Z",
  },
  {
    id: "client-1",
    email: "client1@example.com",
    name: "Michael Brown",
    role: "Cliente",
    phone: "+1234567893",
    createdAt: "2024-01-04T00:00:00Z",
  },
  {
    id: "client-2",
    email: "client2@example.com",
    name: "Emily Davis",
    role: "Cliente",
    phone: "+1234567894",
    createdAt: "2024-01-05T00:00:00Z",
  },
]

// Mock properties
export const mockProperties: Property[] = [
  {
    id: "prop-1",
    title: "Villa Frente al Mar de Lujo",
    description:
      "Impresionante villa de 4 habitaciones con vistas panorámicas al océano, piscina privada y comodidades modernas.",
    type: "Villa",
    status: "Disponible",
    price: 1250000,
    location: "Miami Beach, FL",
    area: 350,
    bedrooms: 4,
    bathrooms: 3,
    images: ["/luxury-beachfront-villa.png"],
    agentId: "agent-1",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-02-01T00:00:00Z",
  },
  {
    id: "prop-2",
    title: "Apartamento Moderno en el Centro",
    description: "Espacioso apartamento de 2 habitaciones en el corazón del centro con vistas a la ciudad.",
    type: "Apartamento",
    status: "Disponible",
    price: 450000,
    location: "Centro, Nueva York",
    area: 120,
    bedrooms: 2,
    bathrooms: 2,
    images: ["/modern-downtown-apartment.png"],
    agentId: "agent-2",
    createdAt: "2024-02-05T00:00:00Z",
    updatedAt: "2024-02-05T00:00:00Z",
  },
  {
    id: "prop-3",
    title: "Casa Familiar con Jardín",
    description: "Hermosa casa de 3 habitaciones con amplio jardín, perfecta para familias.",
    type: "Casa",
    status: "Reservada",
    price: 680000,
    location: "Zona Residencial, CA",
    area: 220,
    bedrooms: 3,
    bathrooms: 2,
    images: ["/family-house-garden.png"],
    agentId: "agent-1",
    createdAt: "2024-02-10T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "prop-4",
    title: "Espacio de Oficina Comercial",
    description: "Espacio comercial premium en distrito de negocios, ideal para oficinas corporativas.",
    type: "Comercial",
    status: "Disponible",
    price: 2500000,
    location: "Distrito de Negocios, Chicago",
    area: 500,
    images: ["/commercial-office-space.png"],
    agentId: "agent-2",
    createdAt: "2024-02-12T00:00:00Z",
    updatedAt: "2024-02-12T00:00:00Z",
  },
]

// Mock chat messages
export const mockChatMessages: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "client-1",
    receiverId: "agent-1",
    propertyId: "prop-1",
    message: "Hola, estoy interesado en la villa frente al mar. ¿Podemos programar una visita?",
    createdAt: "2024-02-20T10:00:00Z",
    read: true,
  },
  {
    id: "msg-2",
    senderId: "agent-1",
    receiverId: "client-1",
    propertyId: "prop-1",
    message: "¡Hola! Por supuesto, estaré encantado de mostrarle la propiedad. ¿Está disponible este fin de semana?",
    createdAt: "2024-02-20T10:15:00Z",
    read: true,
  },
  {
    id: "msg-3",
    senderId: "client-1",
    receiverId: "agent-1",
    propertyId: "prop-1",
    message: "Sí, el sábado por la tarde me viene bien.",
    createdAt: "2024-02-20T10:30:00Z",
    read: false,
  },
]

// Mock documents
export const mockDocuments: Document[] = [
  {
    id: "doc-1",
    propertyId: "prop-3",
    type: "Contrato",
    fileName: "contrato_compra_prop3.pdf",
    fileUrl: "#",
    uploadedBy: "agent-1",
    uploadedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "doc-2",
    propertyId: "prop-3",
    type: "Escritura",
    fileName: "escritura_prop3.pdf",
    fileUrl: "#",
    uploadedBy: "admin-1",
    uploadedAt: "2024-02-16T00:00:00Z",
  },
]

// Mock visits
export const mockVisits: Visit[] = [
  {
    id: "visit-1",
    propertyId: "prop-1",
    clientId: "client-1",
    agentId: "agent-1",
    scheduledDate: "2024-02-24T14:00:00Z",
    status: "Programada",
    notes: "Cliente interesado en propiedades frente al mar",
    createdAt: "2024-02-20T10:30:00Z",
  },
  {
    id: "visit-2",
    propertyId: "prop-2",
    clientId: "client-2",
    agentId: "agent-2",
    scheduledDate: "2024-02-22T11:00:00Z",
    status: "Completada",
    notes: "Al cliente le encantó la ubicación céntrica",
    createdAt: "2024-02-18T00:00:00Z",
  },
]

// Mock reservations
export const mockReservations: Reservation[] = [
  {
    id: "res-1",
    propertyId: "prop-3",
    clientId: "client-1",
    agentId: "agent-1",
    reservationDate: "2024-02-15T00:00:00Z",
    expiryDate: "2024-03-15T00:00:00Z",
    status: "Activa",
    notes: "Cliente muy interesado, reserva de 30 días",
    createdAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "res-2",
    propertyId: "prop-2",
    clientId: "client-2",
    agentId: "agent-2",
    reservationDate: "2024-02-10T00:00:00Z",
    expiryDate: "2024-02-25T00:00:00Z",
    status: "Confirmada",
    notes: "Reserva confirmada, pendiente de firma de contrato",
    createdAt: "2024-02-10T00:00:00Z",
  },
  {
    id: "res-3",
    propertyId: "prop-1",
    clientId: "client-1",
    agentId: "agent-1",
    reservationDate: "2024-01-20T00:00:00Z",
    expiryDate: "2024-02-05T00:00:00Z",
    status: "Expirada",
    notes: "Cliente no pudo completar la compra a tiempo",
    createdAt: "2024-01-20T00:00:00Z",
  },
]
