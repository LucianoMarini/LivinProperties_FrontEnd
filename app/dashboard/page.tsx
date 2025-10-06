"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, MessageSquare, Calendar, TrendingUp, FileText } from "lucide-react"
import { mockProperties, mockVisits, mockChatMessages, mockDocuments, mockUsers } from "@/lib/mock-data"

export default function DashboardPage() {
  const { user } = useAuth()

  // Calculate statistics based on role
  const getStats = () => {
    if (user?.role === "Administrador") {
      return [
        {
          title: "Total Propiedades",
          value: mockProperties.length,
          icon: Building2,
          description: "Todas las propiedades del sistema",
        },
        {
          title: "Total Usuarios",
          value: mockUsers.length,
          icon: Users,
          description: "Usuarios registrados",
        },
        {
          title: "Visitas Activas",
          value: mockVisits.filter((v) => v.status === "Programada").length,
          icon: Calendar,
          description: "Visitas programadas",
        },
        {
          title: "Documentos",
          value: mockDocuments.length,
          icon: FileText,
          description: "Total de documentos",
        },
      ]
    } else if (user?.role === "Agente") {
      const agentProperties = mockProperties.filter((p) => p.agentId === user.id)
      const agentVisits = mockVisits.filter((v) => v.agentId === user.id)
      const agentMessages = mockChatMessages.filter((m) => m.senderId === user.id || m.receiverId === user.id)
      return [
        {
          title: "Mis Propiedades",
          value: agentProperties.length,
          icon: Building2,
          description: "Propiedades que gestionas",
        },
        {
          title: "Disponibles",
          value: agentProperties.filter((p) => p.status === "Disponible").length,
          icon: TrendingUp,
          description: "Listas para venta",
        },
        {
          title: "Visitas Programadas",
          value: agentVisits.filter((v) => v.status === "Programada").length,
          icon: Calendar,
          description: "Citas próximas",
        },
        {
          title: "Mensajes",
          value: agentMessages.filter((m) => !m.read && m.receiverId === user.id).length,
          icon: MessageSquare,
          description: "Mensajes sin leer",
        },
      ]
    } else {
      // Cliente
      const clientVisits = mockVisits.filter((v) => v.clientId === user?.id)
      const clientMessages = mockChatMessages.filter((m) => m.senderId === user?.id || m.receiverId === user?.id)
      return [
        {
          title: "Propiedades Disponibles",
          value: mockProperties.filter((p) => p.status === "Disponible").length,
          icon: Building2,
          description: "Propiedades en venta",
        },
        {
          title: "Mis Visitas",
          value: clientVisits.length,
          icon: Calendar,
          description: "Visitas programadas",
        },
        {
          title: "Mensajes",
          value: clientMessages.filter((m) => !m.read && m.receiverId === user?.id).length,
          icon: MessageSquare,
          description: "Mensajes sin leer",
        },
        {
          title: "Reservadas",
          value: mockProperties.filter((p) => p.status === "Reservada").length,
          icon: TrendingUp,
          description: "Propiedades reservadas",
        },
      ]
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Bienvenido de nuevo, {user?.name}</h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === "Administrador" && "Gestiona tu plataforma inmobiliaria"}
          {user?.role === "Agente" && "Gestiona tus propiedades y relaciones con clientes"}
          {user?.role === "Cliente" && "Encuentra la propiedad de tus sueños"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Últimas actualizaciones del sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {user?.role === "Administrador" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nueva propiedad agregada</p>
                      <p className="text-xs text-muted-foreground">Oficina Comercial en Chicago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-accent/10 p-2">
                      <Users className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nuevo usuario registrado</p>
                      <p className="text-xs text-muted-foreground">Emily Davis se unió como Cliente</p>
                    </div>
                  </div>
                </>
              )}
              {user?.role === "Agente" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Visita programada</p>
                      <p className="text-xs text-muted-foreground">Michael Brown - Villa de Lujo Frente al Mar</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-accent/10 p-2">
                      <MessageSquare className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nuevo mensaje</p>
                      <p className="text-xs text-muted-foreground">Consulta de cliente sobre propiedad</p>
                    </div>
                  </div>
                </>
              )}
              {user?.role === "Cliente" && (
                <>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Building2 className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Nuevas propiedades disponibles</p>
                      <p className="text-xs text-muted-foreground">4 nuevos listados coinciden con tus preferencias</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-accent/10 p-2">
                      <Calendar className="h-4 w-4 text-accent" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Próxima visita</p>
                      <p className="text-xs text-muted-foreground">Sábado a las 2:00 PM - Villa Frente al Mar</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Tareas comunes y accesos directos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {user?.role === "Administrador" && (
                <>
                  <a
                    href="/dashboard/properties"
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/5 transition-colors"
                  >
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Gestionar Propiedades</p>
                      <p className="text-xs text-muted-foreground">Ver y editar todas las propiedades</p>
                    </div>
                  </a>
                  <a
                    href="/dashboard/users"
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/5 transition-colors"
                  >
                    <Users className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Gestionar Usuarios</p>
                      <p className="text-xs text-muted-foreground">Ver todos los usuarios y roles</p>
                    </div>
                  </a>
                </>
              )}
              {user?.role === "Agente" && (
                <>
                  <a
                    href="/dashboard/properties"
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/5 transition-colors"
                  >
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Mis Propiedades</p>
                      <p className="text-xs text-muted-foreground">Gestionar tus listados</p>
                    </div>
                  </a>
                  <a
                    href="/dashboard/visits"
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/5 transition-colors"
                  >
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Programar Visita</p>
                      <p className="text-xs text-muted-foreground">Crear nueva cita</p>
                    </div>
                  </a>
                </>
              )}
              {user?.role === "Cliente" && (
                <>
                  <a
                    href="/dashboard/properties"
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/5 transition-colors"
                  >
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Explorar Propiedades</p>
                      <p className="text-xs text-muted-foreground">Encuentra tu hogar ideal</p>
                    </div>
                  </a>
                  <a
                    href="/dashboard/messages"
                    className="flex items-center gap-3 rounded-lg border p-3 hover:bg-accent/5 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Contactar Agente</p>
                      <p className="text-xs text-muted-foreground">Hacer preguntas sobre propiedades</p>
                    </div>
                  </a>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
