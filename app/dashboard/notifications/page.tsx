"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { mockNotifications } from "@/lib/mock-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, CheckCheck, Trash2, Calendar, Home, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function NotificationsPage() {
  const { user } = useAuth()
  const [filter, setFilter] = useState<"all" | "unread">("all")

  if (!user) return null

  const userNotifications = mockNotifications.filter((n) => n.userId === user.id)

  const filteredNotifications =
    filter === "unread" ? userNotifications.filter((n) => !n.read) : userNotifications

  const sortedNotifications = [...filteredNotifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const unreadCount = userNotifications.filter((n) => !n.read).length

  const handleMarkAsRead = (notificationId: string) => {
    const notification = mockNotifications.find((n) => n.id === notificationId)
    if (notification) {
      notification.read = true
    }
  }

  const handleMarkAllAsRead = () => {
    userNotifications.forEach((n) => {
      n.read = true
    })
  }

  const handleDelete = (notificationId: string) => {
    const index = mockNotifications.findIndex((n) => n.id === notificationId)
    if (index > -1) {
      mockNotifications.splice(index, 1)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "visit_cancelled":
        return <Calendar className="h-5 w-5" />
      case "reservation_created":
        return <Home className="h-5 w-5" />
      case "property_reserved":
        return <Home className="h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "visit_cancelled":
        return "bg-red-500/10 text-red-500"
      case "reservation_created":
        return "bg-green-500/10 text-green-500"
      case "property_reserved":
        return "bg-blue-500/10 text-blue-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  const formatDate = (date: string) => {
    const notifDate = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - notifDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMins < 1) return "Ahora mismo"
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins !== 1 ? "s" : ""}`
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours !== 1 ? "s" : ""}`
    if (diffDays === 1) return "Ayer"
    if (diffDays < 7) return `Hace ${diffDays} días`

    return notifDate.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: notifDate.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "visit_cancelled":
        return "Visita Cancelada"
      case "reservation_created":
        return "Reserva Creada"
      case "property_reserved":
        return "Propiedad Reservada"
      default:
        return "Notificación"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notificaciones</h1>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `Tienes ${unreadCount} notificación${unreadCount !== 1 ? "es" : ""} sin leer`
              : "No tienes notificaciones sin leer"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" className="gap-2 bg-transparent">
            <CheckCheck className="h-4 w-4" />
            Marcar todas como leídas
          </Button>
        )}
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")} className="w-full">
        <TabsList>
          <TabsTrigger value="all">
            Todas
            {userNotifications.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {userNotifications.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="unread">
            Sin leer
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="mt-6">
          {sortedNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">
                  {filter === "unread" ? "No hay notificaciones sin leer" : "No hay notificaciones"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {filter === "unread"
                    ? "Todas tus notificaciones están marcadas como leídas"
                    : "Las notificaciones aparecerán aquí cuando haya actividad"}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sortedNotifications.map((notification) => (
                <Card key={notification.id} className={!notification.read ? "border-primary/50" : ""}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-lg p-3 ${getNotificationColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-semibold text-base">{notification.title}</h3>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                            )}
                          </div>
                          <Badge variant="outline" className="flex-shrink-0">
                            {getTypeLabel(notification.type)}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed mb-2">{notification.message}</p>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">{formatDate(notification.createdAt)}</span>

                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleMarkAsRead(notification.id)}
                                className="h-8 text-xs gap-1"
                              >
                                <CheckCheck className="h-3 w-3" />
                                Marcar como leída
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(notification.id)}
                              className="h-8 text-xs gap-1 text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-3 w-3" />
                              Eliminar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Información sobre tipos de notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Tipos de Notificaciones</CardTitle>
          <CardDescription>Información sobre las notificaciones que puedes recibir</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="rounded-lg bg-red-500/10 p-2 h-fit">
              <Calendar className="h-4 w-4 text-red-500" />
            </div>
            <div>
              <p className="font-medium">Visita Cancelada</p>
              <p className="text-muted-foreground">
                Te notificaremos cuando una visita programada sea cancelada, ya sea por el agente o porque la propiedad
                fue reservada.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-lg bg-green-500/10 p-2 h-fit">
              <Home className="h-4 w-4 text-green-500" />
            </div>
            <div>
              <p className="font-medium">Reserva Creada</p>
              <p className="text-muted-foreground">
                Recibirás una confirmación cuando tu reserva de propiedad sea procesada exitosamente.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-lg bg-blue-500/10 p-2 h-fit">
              <Home className="h-4 w-4 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Propiedad Reservada</p>
              <p className="text-muted-foreground">
                Te avisaremos sobre cambios de estado en propiedades que te interesan.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}