'use client';

import { useAuth } from '@/contexts/auth-context';
import { useVisitLogic } from '@/hooks/useVisitLogic';
import { ScheduleVisitDialog } from '@/components/visits/ScheduleVisitDialog';
import { CompletedVisitDialog } from '@/components/visits/CompletedVisitDialog';
import { CancelVisitDialog } from '@/components/visits/CancelVisitDialog';
import { VisitList } from '@/components/visits/VisitList';
import { VisitGuide } from '@/components/visits/VisitGuide';

export default function VisitsPage() {
  const { user } = useAuth();
  const {
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
  } = useVisitLogic(user);

  return (
    <div className="space-y-6">
      {/* Header + botón nueva visita */}
      <ScheduleVisitDialog
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        onSubmit={handleSchedule}
        form={scheduleForm}
        setForm={setScheduleForm}
        user={user}
        properties={availableProperties}
        clients={clients}
        canSchedule={canSchedule}
      />

      <CompletedVisitDialog
        isOpen={isCompletedOpen}
        onClose={() => setIsCompletedOpen(false)}
        onSubmit={handleCompletedVisit}
        note={completedNote}
        setNote={setCompletedNote}
      />

      <CancelVisitDialog
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onSubmit={handleCancelVisit}
        reason={cancelReason}
        setReason={setCancelReason}
      />

      <VisitList
        visits={visits}
        user={user}
        canManageVisit={canManageVisit}
        handleUpdateStatus={handleUpdateStatus}
        openCompletedDialog={openCompletedDialog}
        openCancelDialog={openCancelDialog}
      />

      <VisitGuide user={user} />
    </div>
  );
}
