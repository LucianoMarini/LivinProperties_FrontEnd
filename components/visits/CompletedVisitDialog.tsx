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

export function CompletedVisitDialog({
  isOpen,
  onClose,
  onSubmit,
  note,
  setNote,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Marca Completada la Visita</DialogTitle>
            <DialogDescription>
              Puede agregar una nota respecto a la visita.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="completeNote">
                Nota sobre la visita - *No es obligatoria*
              </Label>
              <Textarea
                id="completeNote"
                placeholder="Ej: Cuestiones que surgieron con el cliente durante la visita..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
            </div>
            <div className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">
              <p>Al confirmar que la visita fue completada:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>La visita cambiará a estado "Completada"</li>
                <li>El cliente recibirá una notificación por email</li>
                <li>La nota quedará registrada en el sistema</li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Volver
            </Button>
            <Button type="submit" variant="success">
              Confirmar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
