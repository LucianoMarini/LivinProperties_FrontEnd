import { Clock, CheckCircle, XCircle } from 'lucide-react';

export const getStatusBadgeVariant = (status: string) => {
  switch (status) {
    case 'Programada':
      return 'default';
    case 'Completada':
      return 'success';
    case 'Cancelada':
      return 'cancelled';
    default:
      return 'outline';
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'Programada':
      return <Clock className="h-4 w-4" />;
    case 'Completada':
      return <CheckCircle className="h-4 w-4" />;
    case 'Cancelada':
      return <XCircle className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};
