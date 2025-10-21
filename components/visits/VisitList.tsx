'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, User, CheckCircle, XCircle } from 'lucide-react';
import { mockProperties, mockUsers } from '@/lib/mock-data';
import { getStatusBadgeVariant, getStatusIcon } from '@/lib/visit-ui';

export function VisitList({
  visits,
  user,
  canManageVisit,
  handleUpdateStatus,
  openCompletedDialog,
  openCancelDialog,
}) {
  if (visits.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No hay visitas programadas</p>
          <p className="text-sm text-muted-foreground">
            {user?.role === 'Agente'
              ? 'Programa tu primera visita a una propiedad para comenzar'
              : 'Las visitas aparecerán aquí cuando se programen'}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {visits.map((visit) => {
        const property = mockProperties.find((p) => p.id === visit.propertyId);
        const client = mockUsers.find((u) => u.id === visit.clientId);
        const agent = mockUsers.find((u) => u.id === visit.agentId);

        return (
          <Card key={visit.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="text-xl">{property?.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {property?.location}
                  </CardDescription>
                </div>
                <Badge
                  variant={getStatusBadgeVariant(visit.status)}
                  className="gap-1"
                >
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
                      {new Date(visit.scheduledDate).toLocaleDateString(
                        'es-ES'
                      )}{' '}
                      a las{' '}
                      {new Date(visit.scheduledDate).toLocaleTimeString(
                        'es-ES',
                        { hour: '2-digit', minute: '2-digit' }
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {user?.role === 'Cliente'
                        ? 'Agente'
                        : user?.role === 'Agente'
                        ? 'Cliente'
                        : 'Participantes'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.role === 'Cliente'
                        ? agent?.name
                        : user?.role === 'Agente'
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

              {canManageVisit(visit) && visit.status === 'Programada' && (
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                    onClick={() => openCompletedDialog(visit.id)}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Marcar Completada
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 text-destructive bg-transparent"
                    onClick={() => openCancelDialog(visit.id)}
                  >
                    <XCircle className="h-4 w-4" />
                    Cancelar Visita
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
