"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockDocuments, mockProperties, mockUsers } from "@/lib/mock-data"
import { FileText, Download, Upload, Trash2, Building2 } from "lucide-react"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { DocumentType } from "@/lib/types"

export default function DocumentsPage() {
  const { user } = useAuth()
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [uploadForm, setUploadForm] = useState({
    propertyId: "",
    type: "Contract" as DocumentType,
    fileName: "",
  })

  // Filter documents based on role
  const getDocuments = () => {
    if (user?.role === "Administrator") {
      return mockDocuments
    } else if (user?.role === "Agent") {
      // Agents can see documents for their properties
      const agentPropertyIds = mockProperties.filter((p) => p.agentId === user.id).map((p) => p.id)
      return mockDocuments.filter((d) => agentPropertyIds.includes(d.propertyId))
    } else {
      // Clients can see documents for properties they have visits for
      return mockDocuments.filter((d) => {
        const property = mockProperties.find((p) => p.id === d.propertyId)
        return property?.status === "Reserved" || property?.status === "Sold"
      })
    }
  }

  const documents = getDocuments()

  const canUpload = user?.role === "Administrador"

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    const newDocument = {
      id: `doc-${Date.now()}`,
      propertyId: uploadForm.propertyId,
      type: uploadForm.type,
      fileName: uploadForm.fileName,
      fileUrl: "#",
      uploadedBy: user.id,
      uploadedAt: new Date().toISOString(),
    }

    mockDocuments.push(newDocument)
    setIsUploadOpen(false)
    setUploadForm({
      propertyId: "",
      type: "Contract",
      fileName: "",
    })
  }

  const handleDelete = (docId: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      const index = mockDocuments.findIndex((d) => d.id === docId)
      if (index > -1) {
        mockDocuments.splice(index, 1)
      }
    }
  }

  const getAvailableProperties = () => {
    if (user?.role === "Administrador") {
      return mockProperties
    } else if (user?.role === "Agente") {
      return mockProperties.filter((p) => p.agentId === user.id)
    }
    return []
  }

  const availableProperties = getAvailableProperties()

  const getDocumentIcon = (type: DocumentType) => {
    return <FileText className="h-5 w-5" />
  }

  const getDocumentBadgeVariant = (type: DocumentType) => {
    return type === "Contract" ? "default" : "secondary"
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-balance">Documents</h1>
          <p className="text-muted-foreground mt-1">
            {user?.role === "Administrator"
              ? "Manage all property documents"
              : user?.role === "Agent"
                ? "Manage documents for your properties"
                : "View documents for your properties"}
          </p>
        </div>
        {canUpload && (
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Upload className="h-4 w-4" />
                Upload Document
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleUpload}>
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                  <DialogDescription>Add a new document for a property</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="property">Property</Label>
                    <Select
                      value={uploadForm.propertyId}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, propertyId: value })}
                      required
                    >
                      <SelectTrigger id="property">
                        <SelectValue placeholder="Select a property" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableProperties.map((property) => (
                          <SelectItem key={property.id} value={property.id}>
                            {property.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Document Type</Label>
                    <Select
                      value={uploadForm.type}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, type: value as DocumentType })}
                    >
                      <SelectTrigger id="type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Title Deed">Title Deed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fileName">File Name</Label>
                    <Input
                      id="fileName"
                      placeholder="document.pdf"
                      value={uploadForm.fileName}
                      onChange={(e) => setUploadForm({ ...uploadForm, fileName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
                    Note: In a production environment, you would upload the actual file here. This demo simulates the
                    upload process.
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsUploadOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Upload</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No documents found</p>
            <p className="text-sm text-muted-foreground">
              {canUpload ? "Upload your first document to get started" : "Documents will appear here when available"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {documents.map((doc) => {
            const property = mockProperties.find((p) => p.id === doc.propertyId)
            const uploader = mockUsers.find((u) => u.id === doc.uploadedBy)
            const canDeleteDoc = user?.role === "Administrator" || doc.uploadedBy === user?.id

            return (
              <Card key={doc.id}>
                <CardContent className="flex items-center justify-between p-6">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="rounded-lg bg-primary/10 p-3">{getDocumentIcon(doc.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{doc.fileName}</h3>
                        <Badge variant={getDocumentBadgeVariant(doc.type)}>{doc.type}</Badge>
                      </div>
                      {property && (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <Building2 className="h-3 w-3" />
                          {property.title}
                        </div>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>Uploaded by {uploader?.name}</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                    {canDeleteDoc && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2 text-destructive bg-transparent"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Document Guidelines</CardTitle>
          <CardDescription>Important information about property documents</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3">
            <div className="rounded-full bg-primary/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">1</span>
            </div>
            <div>
              <p className="font-medium">Contracts</p>
              <p className="text-muted-foreground">
                Purchase agreements and legal contracts between buyers and sellers
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-primary/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">2</span>
            </div>
            <div>
              <p className="font-medium">Title Deeds</p>
              <p className="text-muted-foreground">Official documents proving property ownership and rights</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="rounded-full bg-primary/10 p-1 h-6 w-6 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary">3</span>
            </div>
            <div>
              <p className="font-medium">Access Control</p>
              <p className="text-muted-foreground">
                {user?.role === "Administrator"
                  ? "You can view and manage all documents"
                  : user?.role === "Agent"
                    ? "You can upload and manage documents for your properties"
                    : "You can view documents for properties you're interested in"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
