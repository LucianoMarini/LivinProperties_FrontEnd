"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockVisits, mockProperties, mockUsers } from "@/lib/mock-data"
import { Calendar, Clock, MapPin, User, Plus, CheckCircle, XCircle } from "lucide-react"
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
import type { VisitStatus } from "@/lib/types"
import { useSearchParams } from "next/navigation"

export default function VisitsPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [scheduleForm, setScheduleForm] = useState({
    propertyId: searchParams.get("property") || "",
    clientId: "",
    agentId: "",
    scheduledDate: "",
    notes: "",
  })

  // Filter visits based on role
  const getVisits = () => {
    if (user?.role === "Administrador") {
      return mockVisits
    } else if (user?.role === "Agente") {
      return mockVisits.filter((v) => v.agentId === user.id)
    } else if (user?.role === "Cliente") {
      return mockVisits.filter((v) => v.clientId === user.id)
    }
    return []
  }

  const visits = getVisits().sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())

  const canSchedule = user?.role === "Agente"

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const property = mockProperties.find((p) => p.id === scheduleForm.propertyId)

    const clientId = user.role === "Agente" ? scheduleForm.clientId : user.id
    const agentId = user.role === "Agente" ? user.id : scheduleForm.agentId || property?.agentId || ""

    const newVisit = {
      id: `visit-${Date.now()}`,
      propertyId: scheduleForm.propertyId,
      clientId: clientId,
      agentId: agentId,
      scheduledDate: new Date(scheduleForm.scheduledDate).toISOString(),
      status: "Programada" as VisitStatus,
      notes: scheduleForm.notes,
      createdAt: new Date().toISOString(),
    }

    mockVisits.push(newVisit)
    setIsScheduleOpen(false)
    setScheduleForm({
      propertyId: "",
      clientId: "",
      agentId: "",
      scheduledDate: "",
      notes: "",
    })
  }

  const handleUpdateStatus = (visitId: string, status: VisitStatus) => {
    const visit = mockVisits.find((v) => v.id === visitId)
    if (visit) {
      visit.status = status
    }
  }

  const getAvailableProperties = () => {
    if (user?.role === "Agente") {
      return mockProperties.filter((p) => p.agentId === user.id)
    }
    return mockProperties.filter((p) => p.status === "Disponible")
  }

  const getClients = () => {
    return mockUsers.filter((u) => u.role === "Cliente")
  }

  const availableProperties = getAvailableProperties()
  const clients = getClients()

  const getStatusBadgeVariant = (status: VisitStatus) => {
    switch (status) {
      case "Programada":
        return "default"
      case "Completada":
        return "secondary"
      case "Cancelada":
        return "outline"
      default:
        return "outline"
    }
  }

  const getStatusIcon = (status: VisitStatus) => {
    switch (status) {
      case "Programada":
        return <Clock className="h-4 w-4" />
      case "Completada":
        return <CheckCircle className="h-4 w-4" />
      case "Cancelada":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const canManageVisit = (visit: (typeof mockVisits)[0]) => {
    return user?.role === "Administrador" || user?.role === "Agente"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Visitas a Propiedades</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "Administrador"
              ? "Ver y gestionar todas las visitas a propiedades"
              : user?.role === "Agente"
                ? "Gestionar visitas para tus propiedades"
                : "Programa y rastrea tus visitas a propiedades"}
          </p>
        </div>
        {canSchedule && (
          <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nueva Visita
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSchedule}>
                <DialogHeader>
                  <DialogTitle>Programar Visita a Propiedad</DialogTitle>
                  <DialogDescription>Reserva una cita para ver una propiedad</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="property">Propiedad</Label>
                    <Select
                      value={scheduleForm.propertyId}
                      onValueChange={(value) => setScheduleForm({ ...scheduleForm, propertyId: value })}
                      required
                    >
                      <SelectTrigger id="property">
                        <SelectValue placeholder="Selecciona una propiedad" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProperties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {user?.role === "Agente" && (
                    <div className="space-y-2">
                      <Label htmlFor="client">Cliente</Label>
                      <Select
                        value={scheduleForm.clientId}
                        onValueChange={(value) => setScheduleForm({ ...scheduleForm, clientId: value })}
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
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="scheduledDate">Fecha y Hora</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={scheduleForm.scheduledDate}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, scheduledDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Notas (Opcional)</Label>
                    <Textarea
                      id="notes"
                      placeholder="Requisitos específicos o preguntas..."
                      value={scheduleForm.notes}
                      onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsScheduleOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Programar Visita</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {visits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No hay visitas programadas</p>
            <p className="text-sm text-muted-foreground">
              {canSchedule
                ? "Programa tu primera visita a una propiedad para comenzar"
                : "Las visitas aparecerán aquí cuando se programen"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {visits.map((visit) => {
            const property = mockProperties.find((p) => p.id === visit.propertyId)
            const client = mockUsers.find((u) => u.id === visit.clientId)
            const agent = mockUsers.find((u) => u.id === visit.agentId)

            return (
              <Card key={visit.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-balance">{property?.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {property?.location}
                      </CardDescription>
                    </div>
                    <Badge variant={getStatusBadgeVariant(visit.status)} className="gap-1">
                      {getStatusIcon(visit.status)}
                      {visit.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Calendar className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Fecha Programada</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(visit.scheduledDate).toLocaleDateString("es-ES")} a las{" "}
                          {new Date(visit.scheduledDate).toLocaleTimeString("es-ES", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {user?.role === "Cliente" ? "Agente" : user?.role === "Agente" ? "Cliente" : "Participantes"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {user?.role === "Cliente"
                            ? agent?.name
                            : user?.role === "Agente"
                              ? client?.name
                              : `${client?.name} y ${agent?.name}`}
                        </p>
                      </div>
                    </div>
                  </div>

                  {visit.notes && (
                    <div className="rounded-lg bg-muted p-3">
                      <p className="text-sm font-medium mb-1">Notas</p>
                      <p className="text-sm text-muted-foreground">{visit.notes}</p>
                    </div>
                  )}

                  {canManageVisit(visit) && visit.status === "Programada" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-transparent"
                        onClick={() => handleUpdateStatus(visit.id, "Completada")}
                      >
                        <CheckCircle className="h-4 w-4" />
                        Marcar Completada
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive bg-transparent"
                        onClick={() => handleUpdateStatus(visit.id, "Cancelada")}
                      >
                        <XCircle className="h-4 w-4" />
                        Cancelar Visita
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Guía de Visitas</CardTitle>
          <CardDescription>Información importante sobre las visitas a propiedades</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="rounded-full bg-primary/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium">Programación</p>
              <p className="text-muted-foreground">
                {user?.role === "Cliente"
                  ? "Selecciona una propiedad y fecha/hora preferida para programar una visita con el agente"
                  : user?.role === "Agente"
                    ? "Revisa las propiedades y programa visitas para tus clientes"
                    : "Los clientes y agentes pueden programar visitas que aparecerán en tu panel"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-primary/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium">Confirmación</p>
              <p className="text-muted-foreground">
                {user?.role === "Cliente"
                  ? "El agente confirmará tu solicitud de visita y puede contactarte para detalles"
                  : user?.role === "Agente"
                    ? "Confirma las visitas con los clientes y reprograma según sea necesario"
                    : "Revisa las visitas programadas y confirma o reprograma según sea necesario"}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-primary/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium">Preparación</p>
              <p className="text-muted-foreground">
                {user?.role === "Cliente"
                  ? "Prepara preguntas sobre la propiedad y llega a tiempo para tu visita programada"
                  : user?.role === "Agente"
                    ? "Asegúrate de que la propiedad esté lista para la visita y todos los documentos necesarios estén disponibles"
                    : "Prepárate para las visitas revisando las notas y asegurando la puntualidad"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
