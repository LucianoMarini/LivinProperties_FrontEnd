'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function Step({ number, title, description }) {
  return (
    <div className="flex gap-3">
      <div className="rounded-full bg-primary/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
        <span className="text-xs font-bold text-primary">{number}</span>
      </div>
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

export function VisitGuide({ user }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Guía de Visitas</CardTitle>
        <CardDescription>
          Información importante sobre las visitas a propiedades
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Step
          number={1}
          title="Programación"
          description={
            user?.role === 'Cliente'
              ? 'Selecciona una propiedad y fecha/hora preferida para programar una visita con el agente'
              : user?.role === 'Agente'
              ? 'Revisa las propiedades y programa visitas para tus clientes'
              : 'Los clientes y agentes pueden programar visitas que aparecerán en tu panel'
          }
        />
        <Step
          number={2}
          title="Cancelación"
          description={
            user?.role === 'Cliente'
              ? 'Si necesitas cancelar, contacta directamente con tu agente asignado'
              : user?.role === 'Agente'
              ? 'Puedes cancelar visitas ingresando un motivo. El sistema notificará automáticamente al cliente'
              : 'Los agentes registran las cancelaciones con motivo y el sistema notifica a los clientes'
          }
        />
        <Step
          number={3}
          title="Preparación"
          description={
            user?.role === 'Cliente'
              ? 'Prepara preguntas sobre la propiedad y llega a tiempo para tu visita programada'
              : user?.role === 'Agente'
              ? 'Asegúrate de que la propiedad esté lista para la visita y todos los documentos necesarios estén disponibles'
              : 'Prepárate para las visitas revisando las notas y asegurando la puntualidad'
          }
        />
      </CardContent>
    </Card>
  );
}
