'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Home,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  LogOut,
  BookmarkCheck,
  Bell,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { mockNotifications } from '@/lib/mock-data';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';

export function DashboardNav() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  // Estado para forzar re-render cuando cambian las notificaciones
  const [refreshKey, setRefreshKey] = useState(0);

  // Obtener notificaciones del usuario actual
  const userNotifications = mockNotifications.filter(
    (n) => n.userId === user?.id
  );
  const unreadCount = userNotifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notificationId: string) => {
    const notification = mockNotifications.find((n) => n.id === notificationId);
    if (notification) {
      notification.read = true;
      setRefreshKey((prev) => prev + 1); // Forzar re-render
    }
  };
  const handleViewAll = () => {
    router.push('/dashboard/notifications');
  };

  const navItems = [
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: Home,
      roles: ['Administrador', 'Agente', 'Cliente'],
    },
    {
      label: 'Propiedades',
      href: '/dashboard/properties',
      icon: Building2,
      roles: ['Administrador', 'Agente', 'Cliente'],
    },
    {
      label: 'Mensajes',
      href: '/dashboard/messages',
      icon: MessageSquare,
      roles: ['Agente', 'Cliente'],
    },
    {
      label: 'Documentos',
      href: '/dashboard/documents',
      icon: FileText,
      roles: ['Administrador', 'Agente', 'Cliente'],
    },
    {
      label: 'Visitas',
      href: '/dashboard/visits',
      icon: Calendar,
      roles: ['Administrador', 'Agente', 'Cliente'],
    },
    {
      label: 'Reservas',
      href: '/dashboard/reservations',
      icon: BookmarkCheck,
      roles: ['Administrador', 'Agente', 'Cliente'],
    },
    {
      label: 'Usuarios',
      href: '/dashboard/users',
      icon: Users,
      roles: ['Administrador'],
    },
  ];

  const filteredNavItems = navItems.filter((item) =>
    item.roles.includes(user?.role || '')
  );

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const notifDate = new Date(date);
    const diffMs = now.getTime() - notifDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Ahora';
    if (diffMins < 60) return `Hace ${diffMins}m`;
    if (diffHours < 24) return `Hace ${diffHours}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return notifDate.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">
            LivinProperties
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? 'secondary' : 'ghost'}
                  size="sm"
                  className={cn(
                    'gap-2',
                    isActive && 'bg-primary/10 text-primary hover:bg-primary/20'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        {/* Campana de notificaciones */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notificaciones</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {unreadCount} nueva{unreadCount !== 1 ? 's' : ''}
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <ScrollArea className="h-[400px]">
              {userNotifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No hay notificaciones
                  </p>
                </div>
              ) : (
                userNotifications.slice(0, 10).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                    onClick={() => handleNotificationClick(notification.id)}
                  >
                    <div className="flex items-start justify-between w-full gap-2">
                      <div className="flex-1">
                        <p
                          className={cn(
                            'text-sm font-medium',
                            !notification.read && 'text-primary'
                          )}
                        >
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {getTimeAgo(notification.createdAt)}
                    </span>
                  </DropdownMenuItem>
                ))
              )}
            </ScrollArea>
            {userNotifications.length > 0 && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-center justify-center text-primary cursor-pointer"
                  onClick={handleViewAll}
                >
                  Ver todas las notificaciones
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="text-sm">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="gap-2 bg-transparent"
        >
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
