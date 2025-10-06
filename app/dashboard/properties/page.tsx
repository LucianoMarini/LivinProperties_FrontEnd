"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockProperties, mockUsers } from "@/lib/mock-data"
import { Building2, MapPin, Maximize, Bed, Bath, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function PropertiesPage() {
  const { user } = useAuth()

  const getProperties = () => {
    if (user?.role === "Agente") {
      return mockProperties.filter((p) => p.agentId === user.id)
    }
    return mockProperties
  }

  const properties = getProperties()

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

  const canCreateProperty = user?.role === "Administrador" 

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">
            {user?.role === "Agente" ? "Mis Propiedades" : "Propiedades"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "Agente"
              ? "Gestiona tus listados de propiedades"
              : user?.role === "Administrador"
                ? "Ver y gestionar todas las propiedades"
                : "Explorar propiedades disponibles"}
          </p>
        </div>
        {canCreateProperty && (
          <Link href="/dashboard/properties/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva Propiedad
            </Button>
          </Link>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => {
          const agent = mockUsers.find((u) => u.id === property.agentId)
          return (
            <Card key={property.id} className="overflow-hidden">
              <div className="relative h-48 w-full bg-muted">
                <Image
                  src={property.images[0] || "/placeholder.svg"}
                  alt={property.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <Badge className="absolute top-3 right-3" variant={getStatusBadgeVariant(property.status)}>
                  {property.status}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-xl text-balance">{property.title}</CardTitle>
                  <Badge variant="outline">{property.type}</Badge>
                </div>
                <CardDescription className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {property.location}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{property.description}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    {property.area}m²
                  </div>
                  {property.bedrooms && (
                    <div className="flex items-center gap-1">
                      <Bed className="h-4 w-4" />
                      {property.bedrooms}
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="flex items-center gap-1">
                      <Bath className="h-4 w-4" />
                      {property.bathrooms}
                    </div>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-2xl font-bold text-primary">${property.price.toLocaleString()}</p>
                  {agent && <p className="text-xs text-muted-foreground mt-1">Agente: {agent.name}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Link href={`/dashboard/properties/${property.id}`} className="w-full">
                  <Button variant="outline" className="w-full bg-transparent">
                    Ver Detalles
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {properties.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No se encontraron propiedades</p>
            <p className="text-sm text-muted-foreground">
              {canCreateProperty ? "Comienza agregando tu primera propiedad" : "Vuelve más tarde para nuevos listados"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
