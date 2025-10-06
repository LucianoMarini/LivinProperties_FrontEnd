"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { mockReservations, mockProperties, mockUsers } from "@/lib/mock-data"
import type { Reservation } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Building2, Calendar, User, Plus, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ReservationsPage() {
  const { user } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>(mockReservations)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newReservation, setNewReservation] = useState({
    propertyId: "",
    clientId: "",
    expiryDate: "",
    notes: "",
  })

  if (!user) return null

  // Filter reservations based on role
  const filteredReservations = reservations.filter((reservation) => {
    if (user.role === "Administrador") return true
    if (user.role === "Agente") return reservation.agentId === user.id
    if (user.role === "Cliente") return reservation.clientId === user.id
    return false
  })

  // Get agent's properties for the dropdown
  const agentProperties = mockProperties.filter((prop) => prop.agentId === user.id)

  // Get clients for the dropdown
  const clients = mockUsers.filter((u) => u.role === "Cliente")

  const handleCreateReservation = () => {
    if (!newReservation.propertyId || !newReservation.clientId || !newReservation.expiryDate) {
      alert("Por favor complete todos los campos requeridos")
      return
    }

    const reservation: Reservation = {
      id: `res-${Date.now()}`,
      propertyId: newReservation.propertyId,
      clientId: newReservation.clientId,
      agentId: user.id,
      reservationDate: new Date().toISOString(),
      expiryDate: new Date(newReservation.expiryDate).toISOString(),
      status: "Activa",
      notes: newReservation.notes,
      createdAt: new Date().toISOString(),
    }

    setReservations([reservation, ...reservations])
    setIsCreateDialogOpen(false)
    setNewReservation({
      propertyId: "",
      clientId: "",
      expiryDate: "",
      notes: "",
    })
  }

  const getStatusIcon = (status: Reservation["status"]) => {
    switch (status) {
      case "Activa":
        return <Clock className="h-4 w-4" />
      case "Confirmada":
        return <CheckCircle className="h-4 w-4" />
      case "Expirada":
        return <XCircle className="h-4 w-4" />
      case "Cancelada":
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Reservation["status"]) => {
    switch (status) {
      case "Activa":
        return "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
      case "Confirmada":
        return "bg-green-500/10 text-green-500 hover:bg-green-500/20"
      case "Expirada":
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20"
      case "Cancelada":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reservas</h1>
          <p className="text-muted-foreground">
            {user.role === "Agente" && "Gestiona las reservas de propiedades"}
            {user.role === "Cliente" && "Visualiza tus reservas de propiedades"}
            {user.role === "Administrador" && "Visualiza todas las reservas del sistema"}
          </p>
        </div>
        {user.role === "Agente" && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Reserva
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Crear Nueva Reserva</DialogTitle>
                <DialogDescription>Reserva una propiedad para un cliente</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="property">Propiedad *</Label>
                  <Select
                    value={newReservation.propertyId}
                    onValueChange={(value) => setNewReservation({ ...newReservation, propertyId: value })}
                  >
                    <SelectTrigger id="property">
                      <SelectValue placeholder="Seleccionar propiedad" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentProperties.map((property) => (
                        <SelectItem key={property.id} value={property.id}>
                          {property.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="client">Cliente *</Label>
                  <Select
                    value={newReservation.clientId}
                    onValueChange={(value) => setNewReservation({ ...newReservation, clientId: value })}
                  >
                    <SelectTrigger id="client">
                      <SelectValue placeholder="Seleccionar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Fecha de Expiración *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={newReservation.expiryDate}
                    onChange={(e) => setNewReservation({ ...newReservation, expiryDate: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notas</Label>
                  <Textarea
                    id="notes"
                    placeholder="Información adicional sobre la reserva..."
                    value={newReservation.notes}
                    onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateReservation} className="w-full">
                  Crear Reserva
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {filteredReservations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No hay reservas disponibles</p>
            {user.role === "Agente" && (
              <p className="text-sm text-muted-foreground mt-2">Crea una nueva reserva para comenzar</p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredReservations.map((reservation) => {
            const property = mockProperties.find((p) => p.id === reservation.propertyId)
            const client = mockUsers.find((u) => u.id === reservation.clientId)
            const agent = mockUsers.find((u) => u.id === reservation.agentId)

            if (!property || !client || !agent) return null

            return (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{property.title}</CardTitle>
                      <CardDescription>{property.location}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(reservation.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(reservation.status)}
                        {reservation.status}
                      </span>
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Cliente:</span>
                        <span className="font-medium">{client.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Agente:</span>
                        <span className="font-medium">{agent.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Precio:</span>
                        <span className="font-medium">${property.price.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Fecha de Reserva:</span>
                        <span className="font-medium">
                          {format(new Date(reservation.reservationDate), "dd MMM yyyy", { locale: es })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Expira:</span>
                        <span className="font-medium">
                          {format(new Date(reservation.expiryDate), "dd MMM yyyy", { locale: es })}
                        </span>
                      </div>
                    </div>
                  </div>
                  {reservation.notes && (
                    <div className="mt-4 rounded-lg bg-muted p-3">
                      <p className="text-sm text-muted-foreground">{reservation.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
