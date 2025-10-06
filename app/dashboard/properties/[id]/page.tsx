"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockProperties, mockUsers } from "@/lib/mock-data"
import { MapPin, Maximize, Bed, Bath, Calendar, Edit, Trash2, MessageSquare } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

export default function PropertyDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

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

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this property?")) {
      const index = mockProperties.findIndex((p) => p.id === propertyId)
      if (index > -1) {
        mockProperties.splice(index, 1)
        router.push("/dashboard/properties")
      }
    }
  }

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
