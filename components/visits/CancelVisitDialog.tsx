'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function CancelVisitDialog({
  isOpen,
  onClose,
  onSubmit,
  reason,
  setReason,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Cancelar Visita</DialogTitle>
            <DialogDescription>
              Ingresa el motivo de la cancelación. El cliente será notificado
              automáticamente.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cancelReason">Motivo de Cancelación</Label>
              <Textarea
                id="cancelReason"
                placeholder="Ej: Solicitud del cliente, cambio de agenda..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
                required
              />
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <p>Al confirmar la cancelación:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>La visita cambiará a estado "Cancelada"</li>
                <li>El cliente recibirá una notificación por email</li>
                <li>El motivo quedará registrado en el sistema</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Volver
            </Button>
            <Button type="submit" variant="destructive">
              Confirmar Cancelación
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
