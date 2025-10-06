"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { mockChatMessages, mockUsers, mockProperties } from "@/lib/mock-data"
import { Send, MessageSquare } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import type { ChatMessage } from "@/lib/types"

export default function MessagesPage() {
  const { user } = useAuth()
  const searchParams = useSearchParams()
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Get conversations grouped by user
  const getConversations = () => {
    if (!user) return []

    const conversationMap = new Map<string, ChatMessage[]>()

    mockChatMessages.forEach((msg) => {
      const otherUserId = msg.senderId === user.id ? msg.receiverId : msg.senderId
      if (msg.senderId === user.id || msg.receiverId === user.id) {
        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, [])
        }
        conversationMap.get(otherUserId)?.push(msg)
      }
    })

    return Array.from(conversationMap.entries())
      .map(([userId, messages]) => {
        const otherUser = mockUsers.find((u) => u.id === userId)
        const lastMessage = messages.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]
        const unreadCount = messages.filter((m) => !m.read && m.receiverId === user.id).length

        return {
          userId,
          user: otherUser,
          messages: messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
          lastMessage,
          unreadCount,
        }
      })
      .sort((a, b) => new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime())
  }

  const conversations = getConversations()

  // Auto-select conversation from URL params or first conversation
  useEffect(() => {
    const agentId = searchParams.get("agent")
    if (agentId) {
      setSelectedConversation(agentId)
    } else if (conversations.length > 0 && !selectedConversation) {
      setSelectedConversation(conversations[0].userId)
    }
  }, [searchParams, conversations.length, selectedConversation])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [selectedConversation, mockChatMessages.length])

  const selectedConv = conversations.find((c) => c.userId === selectedConversation)

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !selectedConversation || !user) return

    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      receiverId: selectedConversation,
      message: message.trim(),
      createdAt: new Date().toISOString(),
      read: false,
    }

    mockChatMessages.push(newMessage)
    setMessage("")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  if (user?.role === "Administrator") {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-lg font-medium">Messages not available</p>
        <p className="text-sm text-muted-foreground">Administrators cannot access the messaging system</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Messages</h1>
        <p className="text-muted-foreground mt-1">
          {user?.role === "Agent" ? "Chat with your clients" : "Contact agents about properties"}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Conversations</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 px-4">
                <MessageSquare className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground text-center">No conversations yet</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conv) => (
                  <button
                    key={conv.userId}
                    onClick={() => setSelectedConversation(conv.userId)}
                    className={`w-full flex items-start gap-3 p-4 hover:bg-accent/50 transition-colors ${
                      selectedConversation === conv.userId ? "bg-accent" : ""
                    }`}
                  >
                    <Avatar>
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(conv.user?.name || "?")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium truncate">{conv.user?.name}</p>
                        {conv.unreadCount > 0 && (
                          <Badge variant="default" className="h-5 min-w-5 px-1.5">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{conv.user?.role}</p>
                      <p className="text-sm text-muted-foreground truncate mt-1">{conv.lastMessage.message}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          {selectedConv ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {getInitials(selectedConv.user?.name || "?")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{selectedConv.user?.name}</CardTitle>
                    <p className="text-xs text-muted-foreground">{selectedConv.user?.role}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] flex flex-col">
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {selectedConv.messages.map((msg) => {
                      const isOwn = msg.senderId === user?.id
                      const sender = mockUsers.find((u) => u.id === msg.senderId)
                      const property = msg.propertyId ? mockProperties.find((p) => p.id === msg.propertyId) : null

                      return (
                        <div key={msg.id} className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className={isOwn ? "bg-primary text-primary-foreground" : "bg-secondary"}>
                              {getInitials(sender?.name || "?")}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? "items-end" : ""}`}>
                            {property && (
                              <div className="text-xs text-muted-foreground px-3 py-1 rounded-md bg-muted">
                                Re: {property.title}
                              </div>
                            )}
                            <div
                              className={`rounded-lg px-4 py-2 ${
                                isOwn ? "bg-primary text-primary-foreground" : "bg-secondary"
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{msg.message}</p>
                            </div>
                            <p className="text-xs text-muted-foreground px-1">
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSendMessage} className="border-t p-4">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={!message.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </form>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex flex-col items-center justify-center h-[600px]">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Select a conversation</p>
              <p className="text-sm text-muted-foreground">Choose a conversation from the list to start messaging</p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
