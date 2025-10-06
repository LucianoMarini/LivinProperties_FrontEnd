"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserRole } from "@/lib/types"
import { mockUsers } from "@/lib/mock-data"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (email: string, password: string, name: string, role: UserRole, phone?: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<Pick<User, "name" | "email" | "phone">>) => Promise<boolean>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find user in mock data
    const foundUser = mockUsers.find((u) => u.email === email)

    if (foundUser) {
      setUser(foundUser)
      setIsAuthenticated(true)
      localStorage.setItem("currentUser", JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
    phone?: string,
  ): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return false
    }

    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      name,
      role,
      phone,
      createdAt: new Date().toISOString(),
    }

    // Add to mock data
    mockUsers.push(newUser)

    // Auto-login after registration
    setUser(newUser)
    setIsAuthenticated(true)
    localStorage.setItem("currentUser", JSON.stringify(newUser))

    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("currentUser")
  }

  const updateProfile = async (updates: Partial<Pick<User, "name" | "email" | "phone">>): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!user) {
      return false
    }

    // Check if email is being changed and if it already exists
    if (updates.email && updates.email !== user.email) {
      const existingUser = mockUsers.find((u) => u.email === updates.email && u.id !== user.id)
      if (existingUser) {
        return false // Email already taken
      }
    }

    // Update user in mock data
    const userIndex = mockUsers.findIndex((u) => u.id === user.id)
    if (userIndex !== -1) {
      mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates }
    }

    // Update current user state
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("currentUser", JSON.stringify(updatedUser))

    return true
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
