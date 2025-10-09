"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { mockReservations, mockProperties, mockUsers } from "@/lib/mock-data"
import type { Reservation } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Calendar, User, Clock, CheckCircle, XCircle, AlertCircle, DollarSign, FileText } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

export default function ReservationsPage() {
  const { user } = useAuth()
  const [reservations] = useState<Reservation[]>(mockReservations)

  if (!user) return null

  // Filter reservations based on role
  const filteredReservations = reservations.filter((reservation) => {
    if (user.role === "Administrador") return true
    if (user.role === "Agente") return reservation.agentId === user.id
    if (user.role === "Cliente") return reservation.clientId === user.id
    return false
  })

  // Sort by date (most recent first)
  const sortedReservations = [...filteredReservations].sort(
    (a, b) => new Date(b.reservationDate).getTime() - new Date(a.reservationDate).getTime()
  )

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

  const handlePrintReceipt = (reservation: Reservation) => {
    const property = mockProperties.find((p) => p.id === reservation.propertyId)
    const client = mockUsers.find((u) => u.id === reservation.clientId)
    const agent = mockUsers.find((u) => u.id === reservation.agentId)

    // En producción, esto abriría un PDF o imprimiría
    alert(
      `COMPROBANTE DE RESERVA\n\n` +
        `Número: ${reservation.receiptNumber || "N/A"}\n` +
        `Propiedad: ${property?.title}\n` +
        `Cliente: ${client?.name}\n` +
        `Agente: ${agent?.name}\n` +
        `Monto: $${reservation.amount?.toLocaleString() || "N/A"}\n` +
        `Fecha: ${format(new Date(reservation.reservationDate), "dd/MM/yyyy")}\n` +
        `Vence: ${format(new Date(reservation.expiryDate), "dd/MM/yyyy")}`
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reservas</h1>
          <p className="text-muted-foreground">
            {user.role === "Agente" && "Gestiona las reservas de tus propiedades"}
            {user.role === "Cliente" && "Visualiza tus reservas de propiedades"}
            {user.role === "Administrador" && "Visualiza todas las reservas del sistema"}
          </p>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Reservas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sortedReservations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">
              {sortedReservations.filter((r) => r.status === "Activa").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Confirmadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {sortedReservations.filter((r) => r.status === "Confirmada").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Monto Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${sortedReservations.reduce((sum, r) => sum + (r.amount || 0), 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {sortedReservations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No hay reservas disponibles</p>
            {user.role === "Agente" && (
              <p className="text-sm text-muted-foreground mt-2">
                Las reservas aparecerán aquí cuando reserves una propiedad
              </p>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedReservations.map((reservation) => {
            const property = mockProperties.find((p) => p.id === reservation.propertyId)
            const client = mockUsers.find((u) => u.id === reservation.clientId)
            const agent = mockUsers.find((u) => u.id === reservation.agentId)

            if (!property || !client || !agent) return null

            return (
              <Card key={reservation.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-xl">{property.title}</CardTitle>
                        <Badge className={getStatusColor(reservation.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(reservation.status)}
                            {reservation.status}
                          </span>
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-1">
                        <Building2 className="h-3 w-3" />
                        {property.location}
                      </CardDescription>
                    </div>
                    {reservation.receiptNumber && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => handlePrintReceipt(reservation)}
                      >
                        <FileText className="h-4 w-4" />
                        Ver Comprobante
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {/* Columna 1: Información de personas */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Cliente:</span>
                        <span className="font-medium truncate">{client.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Agente:</span>
                        <span className="font-medium truncate">{agent.name}</span>
                      </div>
                      {reservation.receiptNumber && (
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">Comprobante:</span>
                          <span className="font-mono font-medium">{reservation.receiptNumber}</span>
                        </div>
                      )}
                    </div>

                    {/* Columna 2: Información financiera */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Precio Propiedad:</span>
                        <span className="font-medium">${property.price.toLocaleString()}</span>
                      </div>
                      {reservation.amount && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="text-muted-foreground">Monto Reserva:</span>
                          <span className="font-bold text-primary">${reservation.amount.toLocaleString()}</span>
                        </div>
                      )}
                      {reservation.amount && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground ml-6">Porcentaje:</span>
                          <span className="font-medium">
                            {((reservation.amount / property.price) * 100).toFixed(1)}%
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Columna 3: Información de fechas */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Fecha Reserva:</span>
                        <span className="font-medium">
                          {format(new Date(reservation.reservationDate), "dd MMM yyyy", { locale: es })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Fecha Vencimiento:</span>
                        <span className="font-medium">
                          {format(new Date(reservation.expiryDate), "dd MMM yyyy", { locale: es })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-muted-foreground">Días restantes:</span>
                        <span className="font-medium">
                          {Math.max(
                            0,
                            Math.ceil(
                              (new Date(reservation.expiryDate).getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            )
                          )}{" "}
                          días
                        </span>
                      </div>
                    </div>
                  </div>

                  {reservation.notes && (
                    <div className="mt-4 rounded-lg bg-muted p-3">
                      <p className="text-sm font-medium mb-1">Notas:</p>
                      <p className="text-sm text-muted-foreground">{reservation.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Guía informativa */}
      <Card>
        <CardHeader>
          <CardTitle>Información sobre Reservas</CardTitle>
          <CardDescription>Gestión del ciclo de vida de las reservas</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="rounded-full bg-blue-500/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <Clock className="h-3 w-3 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Activa</p>
              <p className="text-muted-foreground">
                Reserva vigente dentro del período establecido. El cliente tiene prioridad sobre la propiedad.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-green-500/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="h-3 w-3 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Confirmada</p>
              <p className="text-muted-foreground">
                El cliente ha confirmado la compra. Pendiente de firma de contrato y pago completo.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-gray-500/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <XCircle className="h-3 w-3 text-gray-500" />
            </div>
            <div>
              <p className="font-medium">Expirada</p>
              <p className="text-muted-foreground">
                La reserva venció sin confirmación. La propiedad vuelve a estar disponible.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-red-500/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="h-3 w-3 text-red-500" />
            </div>
            <div>
              <p className="font-medium">Cancelada</p>
              <p className="text-muted-foreground">
                Reserva cancelada por el agente o cliente. La propiedad vuelve a estar disponible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}