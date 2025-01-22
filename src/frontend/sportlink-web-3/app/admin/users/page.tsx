"use client"

import { useState, useEffect } from "react"
import UserList from "@/components/UserList"
import InviteDialog from "@/components/InviteDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { userService } from "@/lib/services/api"
import { UserDetailed } from "@/types"

// Define types based on C# entities
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
  lastLoginAt: string;
  isEmailVerified: boolean;
  externalUserSource?: string;
  createdAt: string;
  updatedAt: string;
  organizations: Organization[];
}

interface Organization {
  id: number;
  name: string;
  location: string;
  verificationStatus: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserDetailed[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await userService.getAllUsers();

      const data = await response.data;
      setUsers(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching users')
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    const searchString = searchTerm.toLowerCase()
    return (
      user.firstName.toLowerCase().includes(searchString) ||
      user.lastName.toLowerCase().includes(searchString) ||
      user.email.toLowerCase().includes(searchString)
    )
  })

  if (error) {
    return (
      <Alert variant="destructive" className="m-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin - Korisnici</h1>
        {/* <Button onClick={() => setIsInviteDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" /> Invite User
        </Button> */}
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search users..."
          className="pl-10 w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <UserList users={filteredUsers} />
      )}

      <InviteDialog 
        isOpen={isInviteDialogOpen} 
        onClose={() => setIsInviteDialogOpen(false)}
        // onInvite={fetchUsers} 
      />
    </div>
  )
}