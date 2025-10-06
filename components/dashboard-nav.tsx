"use client"

import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Building2, Home, MessageSquare, FileText, Calendar, Users, LogOut, BookmarkCheck } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function DashboardNav() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: Home,
      roles: ["Administrador", "Agente", "Cliente"],
    },
    {
      label: "Propiedades",
      href: "/dashboard/properties",
      icon: Building2,
      roles: ["Administrador", "Agente", "Cliente"],
    },
    {
      label: "Mensajes",
      href: "/dashboard/messages",
      icon: MessageSquare,
      roles: ["Agente", "Cliente"],
    },
    {
      label: "Documentos",
      href: "/dashboard/documents",
      icon: FileText,
      roles: ["Administrador", "Agente", "Cliente"],
    },
    {
      label: "Visitas",
      href: "/dashboard/visits",
      icon: Calendar,
      roles: ["Administrador", "Agente", "Cliente"],
    },
    {
      label: "Reservas",
      href: "/dashboard/reservations",
      icon: BookmarkCheck,
      roles: ["Administrador", "Agente", "Cliente"],
    },
    {
      label: "Usuarios",
      href: "/dashboard/users",
      icon: Users,
      roles: ["Administrador"],
    },
  ]

  const filteredNavItems = navItems.filter((item) => item.roles.includes(user?.role || ""))

  return (
    <div className="flex h-16 items-center justify-between border-b bg-card px-6">
      <div className="flex items-center gap-8">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">LivinProperties</span>
        </Link>
        <nav className="flex items-center gap-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  size="sm"
                  className={cn("gap-2", isActive && "bg-primary/10 text-primary hover:bg-primary/20")}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.role}</p>
        </div>
        <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent">
          <LogOut className="h-4 w-4" />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  )
}
