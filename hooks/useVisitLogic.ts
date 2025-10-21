import { useState } from 'react';
import {
  mockVisits,
  mockProperties,
  mockUsers,
  createNotification,
} from '@/lib/mock-data';

type VisitStatus = 'Programada' | 'Completada' | 'Cancelada';

export function useVisitLogic(user) {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState('');
  const [completedNote, setCompletedNote] = useState('');
  const [cancelReason, setCancelReason] = useState('');
  const [scheduleForm, setScheduleForm] = useState({
    propertyId: '',
    clientId: '',
    agentId: '',
    scheduledDate: '',
    notes: '',
  });

  const getVisits = () => {
    if (user?.role === 'Administrador') return mockVisits;
    if (user?.role === 'Agente')
      return mockVisits.filter((v) => v.agentId === user.id);
    if (user?.role === 'Cliente')
      return mockVisits.filter((v) => v.clientId === user.id);
    return [];
  };

  const visits = getVisits().sort(
    (a, b) =>
      new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime()
  );

  const canSchedule = user?.role === 'Agente';

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const property = mockProperties.find(
      (p) => p.id === scheduleForm.propertyId
    );

    const clientId = user.role === 'Agente' ? scheduleForm.clientId : user.id;
    const agentId =
      user.role === 'Agente'
        ? user.id
        : scheduleForm.agentId || property?.agentId || '';

    const newVisit = {
      id: `visit-${Date.now()}`,
      propertyId: scheduleForm.propertyId,
      clientId: clientId,
      agentId: agentId,
      scheduledDate: new Date(scheduleForm.scheduledDate).toISOString(),
      status: 'Programada' as VisitStatus,
      notes: scheduleForm.notes,
      createdAt: new Date().toISOString(),
    };

    mockVisits.push(newVisit);
    setIsScheduleOpen(false);
    setScheduleForm({
      propertyId: '',
      clientId: '',
      agentId: '',
      scheduledDate: '',
      notes: '',
    });
  };

  const handleCompletedVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const visit = mockVisits.find((v) => v.id === selectedVisitId);
    if (visit) {
      visit.status = 'Completada';

      // Obtener información de la propiedad para la notificación
      const property = mockProperties.find((p) => p.id === visit.propertyId);
      const fechaVisita = new Date(visit.scheduledDate).toLocaleDateString(
        'es-ES',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      );

      // Crear notificación para el cliente
      createNotification(
        visit.clientId,
        'visit_completed',
        'Visita Completada',
        `Tu visita a "${property?.title}" programada para el ${fechaVisita} ha sido completada. Nota registrada por el agente: ${completedNote}`,
        visit.id
      );
    }
    setIsCompletedOpen(false);
    setCompletedNote('');
    setSelectedVisitId('');
  };

  const handleCancelVisit = (e: React.FormEvent) => {
    e.preventDefault();
    const visit = mockVisits.find((v) => v.id === selectedVisitId);
    if (visit) {
      visit.status = 'Cancelada';

      // Obtener información de la propiedad para la notificación
      const property = mockProperties.find((p) => p.id === visit.propertyId);
      const fechaVisita = new Date(visit.scheduledDate).toLocaleDateString(
        'es-ES',
        {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }
      );

      // Crear notificación para el cliente
      createNotification(
        visit.clientId,
        'visit_cancelled',
        'Visita Cancelada',
        `Tu visita a "${property?.title}" programada para el ${fechaVisita} ha sido cancelada. Motivo: ${cancelReason}`,
        visit.id
      );
    }
    setIsCancelOpen(false);
    setCancelReason('');
    setSelectedVisitId('');
  };

  const handleUpdateStatus = (visitId: string, status: VisitStatus) => {
    const visit = mockVisits.find((v) => v.id === visitId);
    if (visit) {
      visit.status = status;
    }
  };

  const openCompletedDialog = (id: string) => {
    setSelectedVisitId(id);
    setIsCompletedOpen(true);
  };

  const openCancelDialog = (id: string) => {
    setSelectedVisitId(id);
    setIsCancelOpen(true);
  };

  const availableProperties =
    user?.role === 'Agente'
      ? mockProperties.filter((p) => p.agentId === user.id)
      : mockProperties.filter((p) => p.status === 'Disponible');

  const clients = mockUsers.filter((u) => u.role === 'Cliente');

  const canManageVisit = (visit: (typeof mockVisits)[0]) => {
    return user?.role === 'Administrador' || user?.role === 'Agente';
  };

  return {
    visits,
    canSchedule,
    isScheduleOpen,
    setIsScheduleOpen,
    isCompletedOpen,
    setIsCompletedOpen,
    isCancelOpen,
    setIsCancelOpen,
    scheduleForm,
    setScheduleForm,
    completedNote,
    setCompletedNote,
    cancelReason,
    setCancelReason,
    selectedVisitId,
    setSelectedVisitId,
    availableProperties,
    clients,
    handleSchedule,
    handleCompletedVisit,
    handleCancelVisit,
    handleUpdateStatus,
    openCompletedDialog,
    openCancelDialog,
    canManageVisit,
  };
}
