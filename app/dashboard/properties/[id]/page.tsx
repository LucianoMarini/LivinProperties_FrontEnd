"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockProperties, mockUsers, mockReservations, mockVisits, createNotification } from "@/lib/mock-data"
import { MapPin, Maximize, Bed, Bath, Calendar, Edit, Trash2, MessageSquare, CheckCircle } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PropertyDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const [isReserveOpen, setIsReserveOpen] = useState(false)
  const [reserveForm, setReserveForm] = useState({
    clientId: "",
    amount: "",
    expiryDays: "30",
    notes: "",
  })

  const property = mockProperties.find((p) => p.id === propertyId)
  const agent = property ? mockUsers.find((u) => u.id === property.agentId) : null

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-lg font-medium">Propiedad no encontrada</p>
        <Link href="/dashboard/properties">
          <Button variant="link">Volver a propiedades</Button>
        </Link>
      </div>
    )
  }

  const canEdit = user?.role === "Administrador" || (user?.role === "Agente" && property.agentId === user.id)
  const canDelete = user?.role === "Administrador" || (user?.role === "Agente" && property.agentId === user.id)
  const canContact = user?.role === "Cliente"
  const canReserve = (user?.role === "Administrador" || user?.role === "Agente") && property.status === "Disponible"

  const handleDelete = () => {
    if (confirm("¿Estás seguro de eliminar esta propiedad?")) {
      const index = mockProperties.findIndex((p) => p.id === propertyId)
      if (index > -1) {
        mockProperties.splice(index, 1)
        router.push("/dashboard/properties")
      }
    }
  }

  const handleReserve = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const reservationDate = new Date()
    const expiryDate = new Date()
    expiryDate.setDate(expiryDate.getDate() + Number.parseInt(reserveForm.expiryDays))

    const receiptNumber = `REC-${Date.now().toString().slice(-6)}`

    const newReservation = {
      id: `res-${Date.now()}`,
      propertyId: propertyId,
      clientId: reserveForm.clientId,
      agentId: user.id,
      reservationDate: reservationDate.toISOString(),
      expiryDate: expiryDate.toISOString(),
      status: "Activa" as const,
      notes: reserveForm.notes,
      amount: Number(reserveForm.amount),
      receiptNumber: receiptNumber,
      createdAt: reservationDate.toISOString(),
    }

    // Agregar la reserva
    mockReservations.push(newReservation)

    // Cambiar estado de la propiedad a "Reservada"
    property.status = "Reservada"

// Cancelar todas las visitas programadas para esta propiedad
const propertyVisits = mockVisits.filter((v) => v.propertyId === propertyId && v.status === "Programada")
propertyVisits.forEach((visit) => {
  visit.status = "Cancelada"
  
  // Notificar al cliente que su visita fue cancelada
  createNotification(
    visit.clientId,
    "visit_cancelled",
    "Visita Cancelada - Propiedad Reservada",
    `Tu visita a "${property.title}" ha sido cancelada porque la propiedad fue reservada por otro cliente.`,
    visit.id
  )
})

// Notificar al cliente que realizó la reserva
createNotification(
  reserveForm.clientId,
  "reservation_created",
  "¡Reserva Confirmada!",
  `Tu reserva para "${property.title}" ha sido confirmada exitosamente. Comprobante: ${receiptNumber}. Monto: $${Number(reserveForm.amount).toLocaleString()}`,
  newReservation.id
)

    setIsReserveOpen(false)
    setReserveForm({
      clientId: "",
      amount: "",
      expiryDays: "30",
      notes: "",
    })

    // Mostrar confirmación
    alert(`¡Reserva creada exitosamente!\n\nNúmero de comprobante: ${receiptNumber}\n\n- Propiedad actualizada a "Reservada"\n- ${propertyVisits.length} visita(s) cancelada(s)\n- Clientes notificados`)
  }

  const getClients = () => {
    return mockUsers.filter((u) => u.role === "Cliente")
  }

  const clients = getClients()

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "Disponible":
        return "default"
      case "Reservada":
        return "secondary"
      case "Vendida":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/properties">
          <Button variant="ghost" size="sm">
            ← Volver a propiedades
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          {canReserve && (
            <Dialog open={isReserveOpen} onOpenChange={setIsReserveOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Reservar Propiedad
                </Button>
              </DialogTrigger>
              <DialogContent>
                <form onSubmit={handleReserve}>
                  <DialogHeader>
                    <DialogTitle>Reservar Propiedad</DialogTitle>
                    <DialogDescription>
                      Ingresa los datos del cliente y la reserva. El sistema actualizará el estado y cancelará las
                      visitas pendientes.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="client">Cliente *</Label>
                      <Select
                        value={reserveForm.clientId}
                        onValueChange={(value) => setReserveForm({ ...reserveForm, clientId: value })}
                        required
                      >
                        <SelectTrigger id="client">
                          <SelectValue placeholder="Selecciona un cliente" />
                        </SelectTrigger>
                        <SelectContent>
                          {clients.map((client) => (
                            <SelectItem key={client.id} value={client.id}>
                              {client.name} - {client.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Monto de Reserva ($) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Ej: 45000"
                        value={reserveForm.amount}
                        onChange={(e) => setReserveForm({ ...reserveForm, amount: e.target.value })}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Precio de la propiedad: ${property.price.toLocaleString()}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiryDays">Días de Vigencia *</Label>
                      <Select
                        value={reserveForm.expiryDays}
                        onValueChange={(value) => setReserveForm({ ...reserveForm, expiryDays: value })}
                      >
                        <SelectTrigger id="expiryDays">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 días</SelectItem>
                          <SelectItem value="30">30 días</SelectItem>
                          <SelectItem value="45">45 días</SelectItem>
                          <SelectItem value="60">60 días</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notas (Opcional)</Label>
                      <Textarea
                        id="notes"
                        placeholder="Observaciones adicionales..."
                        value={reserveForm.notes}
                        onChange={(e) => setReserveForm({ ...reserveForm, notes: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
                      <p className="font-medium mb-2">Al confirmar la reserva:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li>La propiedad cambiará a estado "Reservada"</li>
                        <li>Se cancelarán todas las visitas programadas</li>
                        <li>Se notificará al cliente y a los agentes</li>
                        <li>Se generará un comprobante de reserva</li>
                      </ul>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsReserveOpen(false)
                        setReserveForm({
                          clientId: "",
                          amount: "",
                          expiryDays: "30",
                          notes: "",
                        })
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit">Confirmar Reserva</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          )}
          {canEdit && (
            <Link href={`/dashboard/properties/${propertyId}/edit`}>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                <Edit className="h-4 w-4" />
                Editar
              </Button>
            </Link>
          )}
          {canDelete && (
            <Button
              variant="outline"
              size="sm"
              className="gap-2 text-destructive bg-transparent"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              Eliminar
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            <div className="relative h-96 w-full bg-muted">
              <Image
                src={property.images[0] || "/placeholder.svg"}
                alt={property.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 66vw"
              />
            </div>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-3xl text-balance">{property.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-2">
                    <MapPin className="h-4 w-4" />
                    {property.location}
                  </CardDescription>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant={getStatusBadgeVariant(property.status)}>{property.status}</Badge>
                  <Badge variant="outline">{property.type}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Maximize className="h-5 w-5 text-primary mb-2" />
                  <p className="text-2xl font-bold">{property.area}</p>
                  <p className="text-xs text-muted-foreground">Metros cuadrados</p>
                </div>
                {property.bedrooms && (
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <Bed className="h-5 w-5 text-primary mb-2" />
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Habitaciones</p>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                    <Bath className="h-5 w-5 text-primary mb-2" />
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Baños</p>
                  </div>
                )}
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Calendar className="h-5 w-5 text-primary mb-2" />
                  <p className="text-sm font-bold">{new Date(property.createdAt).getFullYear()}</p>
                  <p className="text-xs text-muted-foreground">Publicado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Precio</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-primary">${property.price.toLocaleString()}</p>
            </CardContent>
          </Card>

          {agent && (
            <Card>
              <CardHeader>
                <CardTitle>Información del Agente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">{agent.name}</p>
                  <p className="text-sm text-muted-foreground">{agent.email}</p>
                  {agent.phone && <p className="text-sm text-muted-foreground">{agent.phone}</p>}
                </div>
                {canContact && (
                  <Link href={`/dashboard/messages?agent=${agent.id}&property=${property.id}`}>
                    <Button className="w-full gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Contactar Agente
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}