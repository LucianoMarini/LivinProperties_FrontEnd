"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockUsers } from "@/lib/mock-data"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function UsersPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.role !== "Administrator") {
      router.push("/dashboard")
    }
  }, [user, router])

  if (user?.role !== "Administrator") {
    return null
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "Administrator":
        return "destructive"
      case "Agent":
        return "default"
      case "Client":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">User Management</h1>
        <p className="text-muted-foreground mt-1">View and manage all registered users</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>Total of {mockUsers.length} registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockUsers.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-lg border p-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div>
                      <p className="font-medium">{u.name}</p>
                      <p className="text-sm text-muted-foreground">{u.email}</p>
                      {u.phone && <p className="text-xs text-muted-foreground mt-1">{u.phone}</p>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={getRoleBadgeVariant(u.role)}>{u.role}</Badge>
                  <p className="text-xs text-muted-foreground">Joined {new Date(u.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
