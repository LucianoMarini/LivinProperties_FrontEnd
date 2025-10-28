"use client"

import { useState } from "react"
import { Building2, Calendar, Clock, DollarSign, FileText, MapPin, User, X, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

type ReservationStatus = "Activa" | "Expirada" | "Cancelada" | "Confirmada"

interface Reservation {
  id: string
  propertyName: string
  location: string
  status: ReservationStatus
  client: string
  agent: string
  voucher: string
  propertyPrice: number
  reservationAmount: number
  percentage: number
  reservationDate: string
  expirationDate: string
  daysRemaining: number
  notes: string
}

export default function ReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: "1",
      propertyName: "Casa Familiar con Jardín",
      location: "Zona Residencial, CA",
      status: "Activa",
      client: "Michael Brown",
      agent: "John Smith",
      voucher: "REC-001",
      propertyPrice: 680000,
      reservationAmount: 68000,
      percentage: 10.0,
      reservationDate: "14 feb 2024",
      expirationDate: "14 mar 2024",
      daysRemaining: 0,
      notes: "Cliente muy interesado, reserva de 30 días",
    },
    {
      id: "2",
      propertyName: "Villa Frente al Mar de Lujo",
      location: "Miami Beach, FL",
      status: "Expirada",
      client: "Michael Brown",
      agent: "John Smith",
      voucher: "REC-003",
      propertyPrice: 1250000,
      reservationAmount: 125000,
      percentage: 10.0,
      reservationDate: "19 ene 2024",
      expirationDate: "04 feb 2024",
      daysRemaining: 0,
      notes: "",
    },
  ])

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null)
  const [cancellationReason, setCancellationReason] = useState("")

  const handleCancelClick = (reservationId: string) => {
    setSelectedReservation(reservationId)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    if (selectedReservation && cancellationReason.trim()) {
      setReservations((prev) =>
        prev.map((res) =>
          res.id === selectedReservation ? { ...res, status: "Cancelada" as ReservationStatus } : res,
        ),
      )
      setCancelDialogOpen(false)
      setCancellationReason("")
      setSelectedReservation(null)
    }
  }

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case "Activa":
        return "bg-blue-100 text-blue-700 hover:bg-blue-100"
      case "Expirada":
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
      case "Cancelada":
        return "bg-red-100 text-red-700 hover:bg-red-100"
      case "Confirmada":
        return "bg-green-100 text-green-700 hover:bg-green-100"
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const totalReservations = reservations.length
  const activeReservations = reservations.filter((r) => r.status === "Activa").length
  const confirmedReservations = reservations.filter((r) => r.status === "Confirmada").length
  const totalAmount = reservations.reduce((sum, r) => sum + r.reservationAmount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reservas</h1>
          <p className="text-gray-600">Gestiona las reservas de tus propiedades</p>
        </div>

        {/* Stats Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-600">Total Reservas</div>
              <div className="mt-2 text-3xl font-bold">{totalReservations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-600">Activas</div>
              <div className="mt-2 text-3xl font-bold text-blue-600">{activeReservations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-600">Confirmadas</div>
              <div className="mt-2 text-3xl font-bold text-green-600">{confirmedReservations}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-gray-600">Monto Total</div>
              <div className="mt-2 text-3xl font-bold">{formatCurrency(totalAmount)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations List */}
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">{reservation.propertyName}</h3>
                    <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="h-4 w-4" />
                      {reservation.location}
                    </div>
                  </div>
                  <Badge className={getStatusColor(reservation.status)}>{reservation.status}</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Cliente:</span>
                      <span className="font-medium">{reservation.client}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Agente:</span>
                      <span className="font-medium">{reservation.agent}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Comprobante:</span>
                      <span className="font-medium">{reservation.voucher}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Precio Propiedad:</span>
                      <span className="font-medium">{formatCurrency(reservation.propertyPrice)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Monto Reserva:</span>
                      <span className="font-medium text-blue-600">{formatCurrency(reservation.reservationAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Porcentaje:</span>
                      <span className="font-medium">{reservation.percentage}%</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Fecha Reserva:</span>
                      <span className="font-medium">{reservation.reservationDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Fecha Vencimiento:</span>
                      <span className="font-medium">{reservation.expirationDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Días restantes:</span>
                      <span className="font-medium">{reservation.daysRemaining} días</span>
                    </div>
                  </div>
                </div>

                {reservation.notes && (
                  <div className="mt-4 rounded-lg bg-gray-50 p-4">
                    <div className="text-sm font-medium text-gray-700">Notas:</div>
                    <div className="mt-1 text-sm text-gray-600">{reservation.notes}</div>
                  </div>
                )}

                <div className="mt-4 flex justify-start gap-2">
                  <Button
                    variant="outline"
                    className="gap-2 bg-transparent"
                    disabled={reservation.status === "Cancelada"}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Finalizar Venta
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCancelClick(reservation.id)}
                    className="gap-2 text-red-600 hover:bg-red-50 hover:text-red-700"
                    disabled={reservation.status === "Cancelada"}
                  >
                    <X className="h-4 w-4" />
                    Cancelar Reserva
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Cancelación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas cancelar esta reserva? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo de la cancelación</Label>
              <Textarea
                id="reason"
                placeholder="Ingresa el motivo de la cancelación..."
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
              Volver
            </Button>
            <Button variant="destructive" onClick={handleConfirmCancel} disabled={!cancellationReason.trim()}>
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
